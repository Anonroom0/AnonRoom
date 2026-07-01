import { supabase } from './supabase'; // The client you created in Phase 1

export const SupabaseService = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
    async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } } 
    });
    
    if (error) throw error;
    
    // SUPABASE TRICK: If the user already exists, Supabase returns a fake 
    // user object with an empty identities array. We catch it here.
    if (data?.user?.identities?.length === 0) {
      throw new Error("This email is already registered. Please sign in instead.");
    }
    
    return data;
  },


  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
    async verifyEmailOtp(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    if (error) throw error;
    return data;
  },
      async resendOtp(email) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) throw error;
    return true;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
  // 1. Send the OTP to the user's email
  async sendPasswordResetOtp(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return true;
  },

  // 2. Verify the 6-digit code (Notice the type is 'recovery', not 'signup')
  async verifyPasswordResetOtp(email, token) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });
    if (error) throw error;
    return data;
  },

  // 3. Save the new password
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
    return data;
  },

  // ==========================================
  // DATABASE QUERIES
  // ==========================================
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    if (!data) return data;
    return {
      ...data,
      id: data.id || data.user_id,
      user_id: data.user_id || data.id
    };
  },
    // --- HOME VIEW API ---
  async getHomeStats(userId) {
    const [{ count: ticketCount }, { count: couponCount }, { data: liveRaffles }] = await Promise.all([
      supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('vouchers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'ongoing'),
      supabase
        .from('raffles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    return {
      ticketCount: ticketCount || 0,
      couponCount: couponCount || 0,
      liveRaffles: liveRaffles || []
    };
  },

  // --- WALLET API ---
  async getTransactions(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async generateDepositAddress(userId) {
    // 1. Check if an active address already exists for this user
    const { data: existing } = await supabase
      .from('deposit_addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (existing) return existing;

    // 2. Generate a new temporary address (In production, call your crypto node here)
    const mockBep20Address = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins from now

    const { data, error } = await supabase
      .from('deposit_addresses')
      .insert([{ user_id: userId, wallet_address: mockBep20Address, expires_at: expiresAt }])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async getActiveRaffles() {
    const { data, error } = await supabase
      .from('raffles')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
,

  // --- RAFFLES / ENTRIES / TICKETS ---
  async getRaffles(categoryFilter) {
    try {
      let q = supabase.from('raffles').select('*').order('created_at', { ascending: false });
      if (categoryFilter) q = q.eq('category', categoryFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw err;
    }
  },

  async getRaffleDetails(raffleId) {
    try {
      const { data: raffle, error: raffleErr } = await supabase
        .from('raffles')
        .select('*')
        .eq('id', raffleId)
        .single();
      if (raffleErr) throw raffleErr;

      const { data: entries, error: entriesErr } = await supabase
        .from('entries')
        .select('*')
        .eq('raffle_id', raffleId);
      if (entriesErr) throw entriesErr;

      // Build leaderboard (Top Buyers) by user_id
      const leaderboardMap = new Map();
      (entries || []).forEach((e) => {
        const uid = e.user_id;
        const prev = leaderboardMap.get(uid) || { user_id: uid, tickets: 0 };
        prev.tickets += Number(e.qty || 0);
        leaderboardMap.set(uid, prev);
      });

      const leaderboard = Array.from(leaderboardMap.values())
        .sort((a, b) => b.tickets - a.tickets)
        .slice(0, 20);

      // Fetch profile info for leaderboard users (best-effort)
      const userIds = leaderboard.map((l) => l.user_id).filter(Boolean);
      let profiles = [];
      if (userIds.length) {
        const { data: p, error: pErr } = await supabase
          .from('profiles')
          .select('id, name, avatar')
          .in('id', userIds);
        if (!pErr && p) profiles = p;
      }

      const leaderboardWithProfiles = leaderboard.map((l, index) => ({
        rank: index + 1,
        ...l,
        profile: profiles.find((p) => p.id === l.user_id) || null
      }));

      return { raffle, entries: entries || [], leaderboard: leaderboardWithProfiles };
    } catch (err) {
      throw err;
    }
  },

    async buyRaffleTickets(userId, raffleId, qty, price, fee = 0) {
    try {
      // 1. Calculate the exact total spent (so it is never null)
      const totalSpent = (qty * price) + fee;

      // 2. Insert the ticket entry
      const { error: entryError } = await supabase
        .from('entries')
        .insert({
          user_id: userId,
          raffle_id: raffleId,
          qty: qty,
          total_spent: totalSpent // <-- This fixes your error!
        });

      if (entryError) throw entryError;

      // 3. Log the transaction in the wallet
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'ticket_purchase',
          amount: -totalSpent, // Negative because AR is being spent
          status: 'completed'
        });

      if (txError) throw txError;

      // 4. Fetch the user's current balance to deduct it safely
      const { data: profile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('ar_balance')
        .eq('id', userId)
        .single();
        
      if (profileFetchError) throw profileFetchError;

      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ ar_balance: profile.ar_balance - totalSpent })
        .eq('id', userId);

      if (profileUpdateError) throw profileUpdateError;

      // 5. Update the tickets_sold count on the raffle
      const { data: raffle, error: raffleFetchError } = await supabase
        .from('raffles')
        .select('tickets_sold')
        .eq('id', raffleId)
        .single();

      if (!raffleFetchError && raffle) {
        await supabase
          .from('raffles')
          .update({ tickets_sold: raffle.tickets_sold + qty })
          .eq('id', raffleId);
      }

      return true;
    }      catch (error) {
      // 1. Check if the error is our specific balance constraint
      if (
        error.message.includes('prevent_negative_balance') || 
        error.message.includes('Insufficient AR balance')
      ) {
        // 2. Throw a clean, friendly error for the UI to display
        throw new Error("You don't have enough AR to buy this ticket. Please add funds.");
      }

      // If it's a different error, let it pass through
      console.error("Purchase Error:", error.message);
      throw error;
    }
    },


  async getMyTickets(userId) {
    try {
      const { data: entries, error: entriesErr } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (entriesErr) throw entriesErr;

      const raffleIds = Array.from(new Set((entries || []).map((e) => e.raffle_id).filter(Boolean)));
      let raffles = [];
      if (raffleIds.length) {
        const { data: r, error: rErr } = await supabase.from('raffles').select('*').in('id', raffleIds);
        if (rErr) throw rErr;
        raffles = r || [];
      }

      const merged = (entries || []).map((e) => ({
        ...e,
        raffle: raffles.find((r) => r.id === e.raffle_id) || null
      }));

      const active = merged.filter((m) => m.raffle && m.raffle.status === 'active');
      const past = merged.filter((m) => !m.raffle || m.raffle.status !== 'active');

      return { active, past };
    } catch (err) {
      throw err;
    }
  },

  // --- REDEEM / PRODUCTS ---
  async getProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw err;
    }
  },

  async redeemProduct(userId, productId, price, type = 'physical') {
    try {
      price = Number(price || 0);
      const { data: profile, error: pErr } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (pErr) throw pErr;
      if (Number(profile.ar_balance || 0) < price) throw new Error('Insufficient AR balance');

      // Deduct balance
      const { error: deductErr } = await supabase.from('profiles').update({ ar_balance: Number(profile.ar_balance || 0) - price }).eq('id', userId);
      if (deductErr) throw deductErr;

      if (type === 'physical') {
        const { data, error } = await supabase.from('winnings').insert([{
          user_id: userId,
          product_id: productId,
          price,
          status: 'pending',
          created_at: new Date().toISOString()
        }]).select();
        if (error) {
          // rollback balance
          await supabase.from('profiles').update({ ar_balance: Number(profile.ar_balance || 0) }).eq('id', userId);
          throw error;
        }
        return data && data[0];
      } else {
        // digital -> create voucher
        const code = `VCHR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
        const { data, error } = await supabase.from('vouchers').insert([{
          user_id: userId,
          product_id: productId,
          code,
          amount: price,
          created_at: new Date().toISOString()
        }]).select();
        if (error) {
          await supabase.from('profiles').update({ ar_balance: Number(profile.ar_balance || 0) }).eq('id', userId);
          throw error;
        }
        return data && data[0];
      }
    } catch (err) {
      throw err;
    }
  },

  // --- TASKS ---
  async getTasks(userId) {
    try {
      const { data: tasks, error: tasksErr } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (tasksErr) throw tasksErr;

      const taskIds = (tasks || []).map((t) => t.id).filter(Boolean);
      let completions = [];
      if (taskIds.length) {
        const { data: c, error: cErr } = await supabase
          .from('task_completions')
          .select('*')
          .in('task_id', taskIds)
          .eq('user_id', userId);
        if (cErr) throw cErr;
        completions = c || [];
      }

      const mapped = (tasks || []).map((t) => {
        const comp = completions.find((c) => c.task_id === t.id) || null;
        return {
          ...t,
          completion: comp,
          locked: !!(comp && comp.status === 'locked'),
          completed: !!(comp && comp.status === 'completed')
        };
      });

      return mapped;
    } catch (err) {
      throw err;
    }
  },

  async submitPartnerTask(userId, taskId, text = '', image = null) {
    try {
      const payload = {
        user_id: userId,
        task_id: taskId,
        text,
        image,
        status: 'submitted',
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('task_completions').insert([payload]).select();
      if (error) throw error;
      return data && data[0];
    } catch (err) {
      throw err;
    }
  },

  // --- VOUCHERS / REFERRALS / WINNINGS / SHIPMENTS ---
  async getVouchers(userId) {
    try {
      const { data: vouchers, error } = await supabase.from('vouchers').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      const now = new Date();
      const ongoing = [];
      const past = [];
      (vouchers || []).forEach((v) => {
        if (v.expires_at) {
          if (new Date(v.expires_at) > now) ongoing.push(v); else past.push(v);
        } else if (v.status) {
          if (v.status === 'used' || v.status === 'expired') past.push(v); else ongoing.push(v);
        } else {
          ongoing.push(v);
        }
      });
      return { ongoing, past };
    } catch (err) {
      throw err;
    }
  },

  async getReferrals(userId) {
    try {
      const { data: referrals, error } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .eq('referred_by', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      const referralIds = (referrals || []).map((r) => r.id).filter(Boolean);
      let txs = [];
      if (referralIds.length) {
        const { data, error: txErr } = await supabase
          .from('transactions')
          .select('user_id, amount, type')
          .in('user_id', referralIds)
          .eq('type', 'deposit');
        if (txErr) throw txErr;
        txs = data || [];
      }

      return (referrals || []).map((ref) => {
        const referralTxs = (txs || []).filter((t) => t.user_id === ref.id);
        const deposit = referralTxs.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
        const commission = deposit * 0.1;
        const createdAt = new Date(ref.created_at);
        const now = new Date();
        const daysSinceJoin = Math.max(0, Math.floor((now - createdAt) / (1000 * 60 * 60 * 24)));
        const daysLeft = Math.max(0, 30 - daysSinceJoin);
        const status = daysLeft > 0 ? (deposit > 0 ? 'Active' : 'Pending') : 'Expired';

        return {
          ...ref,
          deposit,
          commission,
          status,
          daysLeft,
          dateLabel: daysSinceJoin === 0 ? 'Joined today' : `Joined ${daysSinceJoin} day${daysSinceJoin === 1 ? '' : 's'} ago`
        };
      });
    } catch (err) {
      throw err;
    }
  },

  async getReferralStats(userId) {
    try {
      const { data: referrals, error: rErr } = await supabase.from('profiles').select('id, created_at').eq('referred_by', userId);
      if (rErr) throw rErr;
      const referredIds = (referrals || []).map((r) => r.id).filter(Boolean);

      let friendDeposits = 0;
      if (referredIds.length) {
        const { data: txs, error: txErr } = await supabase
          .from('transactions')
          .select('amount, type')
          .in('user_id', referredIds)
          .eq('type', 'deposit');
        if (txErr) throw txErr;
        friendDeposits = (txs || []).reduce((s, t) => s + Number(t.amount || 0), 0);
      }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const activeCommunity = (referrals || []).filter((r) => new Date(r.created_at) >= thirtyDaysAgo).length;

      return { networkCount: (referredIds || []).length, friendDeposits, activeCommunity };
    } catch (err) {
      throw err;
    }
  },

  async getWinnings(userId) {
    try {
      const { data, error } = await supabase.from('winnings').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw err;
    }
  },

  async createShipment(winningId, addressData = {}) {
    try {
      const shipmentPayload = {
        winning_id: winningId,
        address: addressData,
        status: 'created',
        created_at: new Date().toISOString()
      };
      const { data: shipmentData, error: shipErr } = await supabase.from('shipments').insert([shipmentPayload]).select();
      if (shipErr) throw shipErr;

      const { error: winErr } = await supabase.from('winnings').update({ status: 'claim processed' }).eq('id', winningId);
      if (winErr) {
        if (shipmentData && shipmentData[0] && shipmentData[0].id) {
          await supabase.from('shipments').delete().eq('id', shipmentData[0].id);
        }
        throw winErr;
      }

      return shipmentData && shipmentData[0];
    } catch (err) {
      throw err;
    }
  },

  async claimDigitalWinning(winningId) {
    try {
      const { data, error } = await supabase
        .from('winnings')
        .update({ status: 'claimed' })
        .eq('id', winningId)
        .select();
      if (error) throw error;
      return data && data[0];
    } catch (err) {
      throw err;
    }
  },

  async useVoucher(voucherId, userId) {
    try {
      const { data: voucher, error: voucherErr } = await supabase.from('vouchers').select('*').eq('id', voucherId).single();
      if (voucherErr) throw voucherErr;
      if (voucher.status === 'used') return voucher;

      const { data: profile, error: profileErr } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profileErr) throw profileErr;

      const creditAmount = Number(voucher.amount || voucher.value || 0);
      const { data: updatedVoucher, error: updateVoucherErr } = await supabase
        .from('vouchers')
        .update({ status: 'used', used_at: new Date().toISOString() })
        .eq('id', voucherId)
        .select();
      if (updateVoucherErr) throw updateVoucherErr;

      const { error: updateProfileErr } = await supabase
        .from('profiles')
        .update({ ar_balance: Number(profile.ar_balance || 0) + creditAmount })
        .eq('id', userId);
      if (updateProfileErr) throw updateProfileErr;

      return updatedVoucher && updatedVoucher[0];
    } catch (err) {
      throw err;
    }
  },

  async getShipments(userId) {
    try {
      const { data: winnings, error: winningErr } = await supabase
        .from('winnings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (winningErr) throw winningErr;

      const winningIds = (winnings || []).map((w) => w.id).filter(Boolean);
      let shipments = [];
      if (winningIds.length) {
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .in('winning_id', winningIds)
          .order('created_at', { ascending: false });
        if (error) throw error;
        shipments = data || [];
      }

      return shipments.map((shipment) => {
        const winning = (winnings || []).find((w) => w.id === shipment.winning_id) || null;
        const status = String(shipment.status || '').toLowerCase();
        const progress = status === 'delivered' ? 100 : status === 'in transit' ? 60 : status === 'created' ? 20 : 40;
        const address = shipment.address && typeof shipment.address === 'object' ? shipment.address : {};
        const destination = shipment.destination || [address.street, address.city, address.state, address.zip].filter(Boolean).join(', ') || 'Pending confirmation';
        const updates = Array.isArray(shipment.updates) && shipment.updates.length
          ? shipment.updates
          : [
              { date: new Date(shipment.created_at || Date.now()).toLocaleDateString(), time: 'Pending', event: 'Shipment request received and is being prepared.' },
              { date: new Date(shipment.created_at || Date.now()).toLocaleDateString(), time: 'Processing', event: 'Dispatch team is validating the delivery details.' }
            ];

        return {
          ...shipment,
          item: winning?.title || winning?.name || 'Prize delivery',
          status: status === 'delivered' ? 'Delivered' : status === 'in transit' ? 'In Transit' : 'Processing',
          courier: shipment.courier || 'Courier Partner',
          estimatedArrival: shipment.estimated_arrival || shipment.estimatedArrival || 'Pending update',
          progress,
          destination,
          updates
        };
      });
    } catch (err) {
      throw err;
    }
  },

  async markNotificationsAsRead(userId, notificationIds = []) {
    try {
      const ids = (notificationIds || []).filter(Boolean);
      const payload = { is_read: true, read_at: new Date().toISOString() };

      if (ids.length) {
        const { error } = await supabase.from('notifications').update(payload).in('id', ids).eq('user_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notifications').update(payload).eq('user_id', userId).eq('is_read', false);
        if (error) throw error;
      }

      return true;
    } catch (err) {
      throw err;
    }
  },

  async getNotifications(userId) {
    try {
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      const read = [], unread = [];
      (data || []).forEach((n) => {
        if (n.is_read || n.read_at) read.push(n); else unread.push(n);
      });
      return { read, unread };
    } catch (err) {
      throw err;
    }
  }
};
