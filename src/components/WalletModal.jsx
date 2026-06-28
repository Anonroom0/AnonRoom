import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine.js';
import { MockAPI } from '../services/MockApi.js';
import { 
  X, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Clock, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';

export default function WalletModal({ isOpen, onClose, userProfile, onBalanceUpdate }) {
  const [activeSubTab, setActiveSubTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'history'
  const [depositAddress, setDepositAddress] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isAddressLocked, setIsAddressLocked] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState(null); // 'processing' | 'success' | 'error'
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 10 Static destination routing keys logic framework
  const staticDestinationPaths = [
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_01_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_02_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_03_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_04_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_05_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_06_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_07_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_08_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_09_SECURE_NODE',
    '0xANON_ROOM_ROUTING_KEY_BASE_VAL_10_SECURE_NODE'
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Compile dynamic pseudo-transaction records histories
    const mockHistories = [
      { id: 'tx-9901', type: 'Deposit', amount: 25.00, status: 'Confirmed', date: '2026-02-14 14:22' },
      { id: 'tx-9902', type: 'Pool Entry Stake', amount: -1.00, status: 'Settled', date: '2026-02-15 09:11' },
      { id: 'tx-9903', type: 'Voucher Activation', amount: 50.00, status: 'Confirmed', date: '2026-02-18 18:45' }
    ];
    setHistoryLogs(mockHistories);

    // Initialize 10-minute countdown clock sequencer loop logic if address path is generated
    let timerInterval = null;
    if (isAddressLocked && timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsAddressLocked(false);
            setDepositAddress('');
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isOpen, isAddressLocked, timeRemaining]);

  if (!isOpen) return null;

  const generateSequentialLockPath = () => {
    AudioEngine.playClick();
    // Deterministically grab a key slot based on the current minute array filtering indices
    const selectedSlotIndex = new Date().getMinutes() % 10;
    setDepositAddress(staticDestinationPaths[selectedSlotIndex]);
    setTimeRemaining(600); // Reset timer tracking pool clock to 10m full
    setIsAddressLocked(true);
  };

  const handleCopyAddressAction = () => {
    navigator.clipboard.writeText(depositAddress);
    AudioEngine.playClick();
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleWithdrawalSubmission = async (e) => {
    e.preventDefault();
    AudioEngine.playClick();
    
    const numericalAmount = parseFloat(withdrawAmount);
    if (isNaN(numericalAmount) || numericalAmount <= 0 || numericalAmount > userProfile?.ar_balance) {
      setWithdrawStatus('error');
      return;
    }

    setWithdrawStatus('processing');
    // Enforce intentional pipeline synchronization simulation delay parameters
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Direct deduction pipeline mock execution wrapper
      userProfile.ar_balance -= numericalAmount;
      setWithdrawStatus('success');
      
      const newTxLog = {
        id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
        type: 'Withdrawal Order',
        amount: -numericalAmount,
        status: 'Confirmed',
        date: 'Just Now'
      };
      setHistoryLogs((prev) => [newTxLog, ...prev]);
      onBalanceUpdate();
    } catch (err) {
      setWithdrawStatus('error');
    }
  };

  const triggerBalanceSyncRefresh = async () => {
    AudioEngine.playClick();
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onBalanceUpdate();
    setIsRefreshing(false);
  };

  const formatClockString = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#1A1D20]/40 backdrop-blur-md flex flex-col justify-end p-4 animate-view-jump">
      
      {/* 🛠️ MASTER BACKDROP MODAL DRAWER BOX CHASSIS */}
      <div className="w-full bg-[#F4F7F5] border-4 border-[#1A1D20] rounded-t-[36px] rounded-b-[24px] max-h-[92%] flex flex-col overflow-hidden shadow-[0px_-10px_30px_rgba(0,0,0,0.2)]">
        
        {/* Terminal Header Row Frame */}
        <div className="w-full h-16 border-b-4 border-[#1A1D20] px-5 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFF275] border-2 border-[#1A1D20] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1A1D20]">
              <Wallet className="w-4 h-4 text-[#1A1D20]" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
              Secure Wallet Node Console
            </span>
          </div>
          <button
            onClick={() => { AudioEngine.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#1A1D20] flex items-center justify-center shadow-[2px_2px_0px_#1A1D20] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <X className="w-4 h-4 text-[#1A1D20]" strokeWidth={3} />
          </button>
        </div>

        {/* Dynamic Static Balance Status Bar Panel Section */}
        <div className="w-full bg-[#1A1D20] text-white px-5 py-4 flex items-center justify-between shrink-0 border-b-4 border-[#1A1D20]">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
              Spendable Profile Balance Logs
            </span>
            <span className="text-xl font-black font-mono tracking-wide text-[#00F5D4]">
              {userProfile?.ar_balance?.toFixed(2)} AR Tokens
            </span>
          </div>
          <button
            onClick={triggerBalanceSyncRefresh}
            disabled={isRefreshing}
            className={`w-9 h-9 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white transition-all active:scale-95 ${
              isRefreshing ? 'animate-spin border-emerald-400' : ''
            }`}
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Inner Tab Multi-Option Navigation Selection Row */}
        <div className="w-full border-b-4 border-[#1A1D20] bg-white px-4 py-2 flex gap-3 shrink-0">
          {[
            { id: 'deposit', label: 'Receive Path', icon: ArrowDownCircle },
            { id: 'withdraw', label: 'Withdrawal', icon: ArrowUpCircle },
            { id: 'history', label: 'Ledger Logs', icon: Clock }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { AudioEngine.playClick(); setActiveSubTab(tab.id); }}
                className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border-2 transition-all flex items-center justify-center gap-1.5 ${
                  isSelected 
                    ? 'bg-[#9D4EDD] border-[#1A1D20] text-white shadow-[2px_2px_0px_#1A1D20]' 
                    : 'bg-transparent border-transparent text-slate-400'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================
            SCROLLABLE CONTENT INTERACTION VIEWPORT WORKSPACE
            ============================================================ */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5 bg-[#F4F7F5]">
          
          {/* TAB OPTION A: SEQUENTIAL GENERATOR DEPOSIT MECHANIC PLATFORM */}
          {activeSubTab === 'deposit' && (
            <div className="space-y-4 animate-view-jump text-xs">
              
              {!isAddressLocked ? (
                /* Primary Stage Initial Lock Button Callout */
                <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-5 text-center space-y-4 shadow-[4px_4px_0px_#1A1D20]">
                  <div className="w-12 h-12 rounded-full bg-[#FFF275] border-2 border-[#1A1D20] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1A1D20]">
                    <Info className="w-6 h-6 text-[#1A1D20]" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase text-[#1A1D20]">Lock Destination Allocation Routing Path</h4>
                    <p className="text-[11px] font-bold text-slate-400 max-w-[240px] mx-auto leading-normal">
                      ANONROOM enforces sequential static paths. Tap below to dynamically claim and lock your unique session index pipeline key for exactly 10 minutes.
                    </p>
                  </div>
                  <button
                    onClick={generateSequentialLockPath}
                    className="w-full btn-cartoon-purple py-2.5 text-xs font-black"
                  >
                    Expose Secure Route Key
                  </button>
                </div>
              ) : (
                /* Secondary Stage Running Countdown Key Box Display Display */
                <div className="space-y-4">
                  
                  {/* Countdown Timer Strip Ribbon */}
                  <div className="w-full bg-[#FF6B6B] border-4 border-[#1A1D20] rounded-xl p-3 flex items-center justify-between shadow-[3px_3px_0px_#1A1D20] text-white font-black">
                    <div className="flex items-center gap-1.5 uppercase text-[10px] tracking-wide">
                      <Clock className="w-4 h-4 animate-spin" strokeWidth={3} />
                      <span>Temporary Session Lock Sequence Time:</span>
                    </div>
                    <span className="font-mono text-sm tracking-widest bg-white text-[#1A1D20] px-2 py-0.5 rounded border border-black">
                      {formatClockString(timeRemaining)}
                    </span>
                  </div>

                  {/* Hash Value Box Card Holder Container */}
                  <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] space-y-2.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-0.5">
                      Target Destination Inbound Wallet Route Key Hash:
                    </label>
                    <div className="w-full p-3 bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl flex items-center justify-between gap-3 font-mono text-[11px] font-black text-slate-700 break-all select-all">
                      <span>{depositAddress}</span>
                      <button
                        onClick={handleCopyAddressAction}
                        className="w-8 h-8 rounded-lg bg-white border-2 border-[#1A1D20] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#1A1D20] active:translate-y-0.5 active:shadow-none"
                      >
                        {copiedAddress ? (
                          <Check className="w-4 h-4 text-[#38B000]" strokeWidth={3} />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" strokeWidth={2.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Operational Security Compliance Warning Reminder Memo Block */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2 text-slate-400 text-[10px] leading-normal">
                    <AlertTriangle className="w-4 h-4 text-[#FF9F1C] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="font-bold">
                      Assets dispatched onto this target route key write instantly to your system profile storage index. Do not transmit tokens past expiration limits.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB OPTION B: DISPATCH FUNDS OUT WITH IN-LINE FORM FIELD VALIDATIONS */}
          {activeSubTab === 'withdraw' && (
            <div className="animate-view-jump text-xs">
              <form onSubmit={handleWithdrawalSubmission} className="space-y-4">
                
                {/* Form Input Item A: Amount Parameter */}
                <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1D20] space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-0.5">
                    Allocation Volume Amount to Withdraw (AR):
                  </label>
                  <div className="w-full relative flex items-center">
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl px-3 py-2.5 font-mono text-xs font-black text-[#1A1D20] focus:outline-none"
                    />
                    <span className="absolute right-3 font-black text-[10px] uppercase text-slate-400 tracking-wider">
                      Max Asset
                    </span>
                  </div>
                </div>

                {/* Form Input Item B: Target Address Input */}
                <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1D20] space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-0.5">
                    Target External Path Node Signature Address:
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter valid destination account identity string..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="w-full bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl px-3 py-2.5 font-mono text-xs font-black text-[#1A1D20] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawStatus === 'processing'}
                  className="w-full btn-cartoon-purple py-3 text-xs tracking-wider font-black uppercase"
                >
                  {withdrawStatus === 'processing' ? 'Broadcasting Ledger Instructions...' : 'Verify Outbound Order Dispatch'}
                </button>
              </form>

              {/* Sequential Processing Message Boxes Status Feedback Blocks */}
              {withdrawStatus === 'success' && (
                <div className="p-3.5 bg-[#00F5D4] border-4 border-[#1A1D20] text-[#1A1D20] font-black rounded-xl flex items-center gap-2 shadow-[3px_3px_0px_#1A1D20] mt-4 animate-bounce">
                  <ShieldCheck className="w-5 h-5 text-[#1A1D20]" strokeWidth={3} />
                  <span>Withdrawal Order Executed Cleanly!</span>
                </div>
              )}
              {withdrawStatus === 'error' && (
                <div className="p-3.5 bg-[#FF6B6B] border-4 border-[#1A1D20] text-white font-black rounded-xl flex items-center gap-2 shadow-[3px_3px_0px_#1A1D20] mt-4">
                  <AlertTriangle className="w-5 h-5 text-white" strokeWidth={3} />
                  <span>Invalid allocation metrics value limits mismatch parameters.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB OPTION C: LEDGER LOG HISTORIES CHIPS STREAMING LIST */}
          {activeSubTab === 'history' && (
            <div className="space-y-3 animate-view-jump text-xs">
              <div className="flex items-center gap-1.5 px-1 text-[10px] font-black uppercase text-slate-400">
                <span>Account Pipeline Transaction Event Records</span>
              </div>
              
              <div className="space-y-2">
                {historyLogs.map((tx) => {
                  const isNegative = tx.amount < 0;
                  return (
                    <div 
                      key={tx.id}
                      className="p-3 bg-white border-2 border-[#1A1D20] rounded-xl flex items-center justify-between gap-4 shadow-[2px_2px_0px_#1A1D20]"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[7px] font-black uppercase border px-1 rounded ${
                            isNegative ? 'bg-red-50 text-red-500 border-red-200' : 'bg-emerald-50 text-emerald-500 border-emerald-200'
                          }`}>
                            {tx.type}
                          </span>
                          <h4 className="text-xs font-black text-[#1A1D20] truncate font-mono">
                            ID: {tx.id}
                          </h4>
                        </div>
                        <span className="text-[9px] font-medium text-slate-400 font-mono block">
                          {tx.date}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`font-mono text-xs font-black ${
                          isNegative ? 'text-[#FF6B6B]' : 'text-[#38B000]'
                        }`}>
                          {isNegative ? '' : '+'}{tx.amount.toFixed(2)} AR
                        </span>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
