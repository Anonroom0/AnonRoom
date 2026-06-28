import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine.js';
import { MockAPI } from '../services/MockApi.js';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Clock, Copy, Check, AlertTriangle, RefreshCw, Fingerprint } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, userProfile, onBalanceUpdate }) {
  const [activeSubTab, setActiveSubTab] = useState('deposit'); // 'deposit' | 'withdraw' | 'history'
  const [depositAddress, setDepositAddress] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600); 
  const [isAddressLocked, setIsAddressLocked] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState(null); // 'processing' | 'success' | 'error'
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 10 Static operational sequential routing paths framework
  const staticDestinationPaths = [
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_01_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_02_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_03_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_04_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_05_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_06_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_07_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_08_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_09_SECURE_VAULT',
    'ROUTE_PATH_INBOUND_STATIC_SERIAL_KEY_10_SECURE_VAULT'
  ];

  useEffect(() => {
    if (!isOpen) return;

    const mockHistories = [
      { id: 'tx-8801', type: 'Account Deposit', amount: 30.00, status: 'Completed', date: '2026-06-20 11:15' },
      { id: 'tx-8802', type: 'Ticket Purchase', amount: -5.00, status: 'Settled', date: '2026-06-22 14:45' },
      { id: 'tx-8803', type: 'Voucher Credit', amount: 20.00, status: 'Completed', date: '2026-06-25 19:02' }
    ];
    setHistoryLogs(mockHistories);

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

  const generateLockPath = () => {
    AudioEngine.playClick();
    // Grab a static destination key slot deterministically matching current time clock variables
    const selectedIndex = new Date().getMinutes() % 10;
    setDepositAddress(staticDestinationPaths[selectedIndex]);
    setTimeRemaining(600);
    setIsAddressLocked(true);
  };

  const handleCopyAction = () => {
    navigator.clipboard.writeText(depositAddress);
    AudioEngine.playClick();
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleWithdrawalSubmission = async (e) => {
    e.preventDefault();
    AudioEngine.playClick();
    
    const parsedVal = parseFloat(withdrawAmount);
    if (isNaN(parsedVal) || parsedVal <= 0 || parsedVal > userProfile?.ar_balance) {
      setWithdrawStatus('error');
      return;
    }

    setWithdrawStatus('processing');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      userProfile.ar_balance -= parsedVal;
      setWithdrawStatus('success');
      
      const generatedTxReceipt = {
        id: `tx-${Math.floor(Math.random() * 8000 + 2000)}`,
        type: 'Outbound Remit',
        amount: -parsedVal,
        status: 'Completed',
        date: 'Just Now'
      };
      setHistoryLogs((prev) => [generatedTxReceipt, ...prev]);
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
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex flex-col justify-end p-4 animate-tab-switch">
      <div className="w-full bg-white border-2 border-black rounded-none max-h-[92%] flex flex-col overflow-hidden shadow-[0px_-4px_20px_rgba(0,0,0,0.15)]">
        
        {/* Terminal Header */}
        <div className="w-full h-16 border-b-2 border-black px-5 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-black bg-black text-white text-[10px] font-black flex items-center justify-center">
              W
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Account Fund Management Terminal
            </span>
          </div>
          <button
            onClick={() => { AudioEngine.playClick(); onClose(); }}
            className="w-8 h-8 rounded-none border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>

        {/* Balance Panel Status Section */}
        <div className="w-full bg-black text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
              Available Spendable Balance
            </span>
            <span className="text-xl font-black font-mono text-[#10B981]">
              {userProfile?.ar_balance?.toFixed(2)} AR
            </span>
          </div>
          <button
            onClick={triggerBalanceSyncRefresh}
            disabled={isRefreshing}
            className={`w-8 h-8 border border-white/20 flex items-center justify-center text-white bg-white/5 transition-all ${
              isRefreshing ? 'animate-spin border-[#10B981]' : 'hover:bg-white/10'
            }`}
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

                {/* Tab Selection Row */}
        <div className="w-full border-b-2 border-black bg-white px-4 py-2 flex gap-3 shrink-0">
          {[
            { id: 'deposit', label: 'Receive Route', icon: ArrowDownRight },
            { id: 'withdraw', label: 'Send Out', icon: ArrowUpRight },
            { id: 'history', label: 'Ledger Audit', icon: Clock }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { AudioEngine.playClick(); setActiveSubTab(tab.id); }}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wide border-2 transition-all flex items-center justify-center gap-1.5 ${
                  isSelected 
                    ? 'bg-black border-black text-white' 
                    : 'bg-transparent border-transparent text-slate-400 hover:text-black'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>


        {/* Scrollable Context Box Workspace Area Viewport */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5 bg-[#FFFFFF]">
          
          {/* TAB OPTION A: ROUTE GENERATOR RECEIVE MECHANIC */}
          {activeSubTab === 'deposit' && (
            <div className="space-y-4 animate-tab-switch text-xs text-black">
              {!isAddressLocked ? (
                <div className="border-2 border-black p-5 text-center space-y-4 bg-slate-50">
                  <p className="text-[11px] font-bold text-slate-400 max-w-[240px] mx-auto leading-normal">
                    Secure operational balances inbound pathways. Lock your unique network pipeline session key index frame for exactly 10 minutes.
                  </p>
                  <button
                    onClick={generateLockPath}
                    className="w-full btn-pro-black py-2 text-xs font-black"
                  >
                    Generate Payment Key Route
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Countdown Ribbon */}
                  <div className="w-full bg-black border-2 border-black p-3 flex items-center justify-between text-white font-black">
                    <span className="uppercase text-[9px] tracking-wide flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#10B981] animate-pulse" strokeWidth={3} />
                      Route expiration clock running:
                    </span>
                    <span className="font-mono text-xs tracking-wider bg-white/10 px-2 py-0.5 border border-white/20">
                      {formatClockString(timeRemaining)}
                    </span>
                  </div>

                  {/* Hash Core */}
                  <div className="border-2 border-black p-4 space-y-2.5 bg-white">
                    <label className="text-[9px] font-black uppercase text-slate-400 block px-0.5">
                      Target Destination Inbound Account Route Key Hash:
                    </label>
                    <div className="w-full p-2.5 bg-[#F4F7F5] border border-black flex items-center justify-between gap-3 font-mono text-[10px] font-bold text-slate-700 break-all select-all">
                      <span>{depositAddress}</span>
                      <button
                        onClick={handleCopyAction}
                        className="w-7 h-7 bg-white border border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                      >
                        {copiedAddress ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={3} />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 flex items-start gap-2 text-slate-400 text-[10px] leading-normal">
                    <AlertTriangle className="w-4 h-4 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="font-bold">
                      Do not transmit tokens past expiration limits. Balance entries write to your internal storage account array variables upon detection.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB OPTION B: DISPATCH BALANCES OUT VIA VALIDATED FIELDS */}
          {activeSubTab === 'withdraw' && (
            <div className="animate-tab-switch text-xs text-black">
              <form onSubmit={handleWithdrawalSubmission} className="space-y-4">
                <div className="border-2 border-black p-4 space-y-2 bg-white">
                  <label className="text-[9px] font-black uppercase text-slate-400 block px-0.5">
                    Allocation Volume Amount (AR):
                  </label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-[#F4F7F5] border border-black px-3 py-2 font-mono text-xs font-bold text-black focus:outline-none"
                  />
                </div>

                <div className="border-2 border-black p-4 space-y-2 bg-white">
                  <label className="text-[9px] font-black uppercase text-slate-400 block px-0.5">
                    Target Remit Destination Account Routing Address:
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter valid target account unique identification string..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    className="w-full bg-[#F4F7F5] border border-black px-3 py-2 font-mono text-xs font-bold text-black focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={withdrawStatus === 'processing'}
                  className="w-full btn-pro-black py-2.5 text-xs font-black uppercase tracking-wider"
                >
                  {withdrawStatus === 'processing' ? 'Broadcasting Remit Instructions...' : 'Verify Balance Settlement Outbound'}
                </button>
              </form>

              {withdrawStatus === 'success' && (
                <div className="p-3.5 bg-[#10B981]/10 border-2 border-[#10B981] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 mt-4 animate-pulse">
                  <span>Withdrawal Request Executed Cleanly</span>
                </div>
              )}
              {withdrawStatus === 'error' && (
                <div className="p-3.5 bg-red-50 border-2 border-red-500 text-red-500 font-black text-xs uppercase tracking-wider flex items-center gap-2 mt-4">
                  <span>Invalid allocation parameters value limits exception</span>
                </div>
              )}
            </div>
          )}

          {/* TAB OPTION C: LEDGER LOG HISTORIES EVENT TRACKING REVIEWS */}
          {activeSubTab === 'history' && (
            <div className="space-y-3 animate-tab-switch text-xs text-black">
              <div className="space-y-2">
                {historyLogs.map((log) => {
                  const isNegativeVal = log.amount < 0;
                  return (
                    <div 
                      key={log.id}
                      className="p-3 border-2 border-black bg-white flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[7px] font-black uppercase border px-1 ${
                            isNegativeVal ? 'bg-red-50 text-red-500 border-red-200' : 'bg-emerald-50 text-emerald-500 border-emerald-200'
                          }`}>
                            {log.type}
                          </span>
                          <h4 className="text-xs font-black text-black truncate font-mono">
                            {log.id}
                          </h4>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 font-mono block">
                          {log.date}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`font-mono text-xs font-black ${
                          isNegativeVal ? 'text-black' : 'text-[#10B981]'
                        }`}>
                          {isNegativeVal ? '' : '+'}{log.amount.toFixed(2)} AR
                        </span>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                          {log.status}
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
