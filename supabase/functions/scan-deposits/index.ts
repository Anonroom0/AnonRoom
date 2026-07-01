import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const USDT_CONTRACT = "0x55d398326f99059fF775485246999027B3197955";
const AR_CONVERSION_RATE = 100;

serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const bscScanApiKey = Deno.env.get('BSCSCAN_API_KEY');
    if (!bscScanApiKey) throw new Error("Missing BscScan API Key");

    const { data: activeWallets, error: fetchError } = await supabaseAdmin
      .from('deposit_addresses')
      .select('*')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString());

    if (fetchError || !activeWallets) throw fetchError;
    if (activeWallets.length === 0) return new Response("No active wallets to scan.", { status: 200 });

    let processedCount = 0;

    for (const wallet of activeWallets) {
      const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${USDT_CONTRACT}&address=${wallet.wallet_address}&page=1&offset=5&sort=desc&apikey=${bscScanApiKey}`;
      
      const bscResponse = await fetch(url);
      const bscData = await bscResponse.json();

      if (bscData.status === "1" && bscData.result.length > 0) {
        const validTx = bscData.result.find((tx: any) => 
          tx.to.toLowerCase() === wallet.wallet_address.toLowerCase()
        );

        if (validTx) {
          const rawValue = parseFloat(validTx.value);
          const usdtAmount = rawValue / 1e18; 
          const arCoins = Math.floor(usdtAmount * AR_CONVERSION_RATE);

          const { error: rpcError } = await supabaseAdmin.rpc('process_crypto_deposit', {
            p_user_id: wallet.user_id,
            p_wallet_address: wallet.wallet_address,
            p_usdt_amount: usdtAmount,
            p_ar_coins: arCoins
          });

          if (!rpcError) processedCount++;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, processed: processedCount }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
