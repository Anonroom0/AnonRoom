import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine.js';
import { SupabaseService } from '../services/SupabaseService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  X, 
  Wallet, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  ArrowDownToLine, 
  ShieldCheck, 
  Ticket, 
  Gift, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  History,
  Check,
  Info
} from 'lucide-react';

export default function WalletModal({ isOpen, onClose, userProfile, onBalanceUpdate }) {
  const { userProfile: authUser } = useAuth();
  const activeProfile = authUser || userProfile;

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'history'
  
  // Deposit States
  const [depositAddress, setDepositAddress] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [isLocked, setIsLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [depositData, setDepositData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // History & Filter States
  const [transactions, setTransactions] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'deposits' | 'spending'
  
  // UI States
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // ---------------------------------------------------------------------------
  // STATIC DATA & MOCKS
  // ---------------------------------------------------------------------------
  
  // 10 Static operational sequential routing paths (Standardized naming)
  const staticDepositAddresses = [
    'WALLET_ADDRESS_SLOT_01_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_02_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_03_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_04_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_05_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_06_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_07_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_08_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_09_SECURE_VAULT',
    'WALLET_ADDRESS_SLOT_10_SECURE_VAULT'
  ];

  const faqItems = [
    { id: 1, question: "How long do deposits take?", answer: "Deposits are usually credited to your account within 1-3 minutes after the transaction is confirmed on the network. Please ensure you send the exact supported token." },
    { id: 2, question: "Why does the address expire?", answer: "For security and privacy reasons, we generate a unique, temporary address for every deposit session. Do not save or reuse expired addresses." },
    { id: 3, question: "Are there any deposit fees?", answer: "We do not charge any fees for adding funds to your wallet. However, standard network transaction fees from your sending wallet will apply." }
  ];

  // ---------------------------------------------------------------------------
  // LIFECYCLE & EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || !activeProfile?.id) return;

    const fetchTransactions = async () => {
      try {
        const data = await SupabaseService.getTransactions(activeProfile.id);
        setTransactions(data.map((tx) => {
          const amount = typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount) || 0;
          const amountIsPositive = amount >= 0;
          return {
            id: tx.id,
            type: tx.type || tx.description || 'Transaction',
            stamp: tx.created_at
              ? new Date(tx.created_at).toLocaleString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : tx.date || '',
            amount,
            status: tx.status || 'Pending',
            category: tx.category || (amountIsPositive ? 'deposit' : 'spending'),
            label: amountIsPositive ? 'Deposit' : 'Spending',
          };
        }));
      } catch (error) {
        console.error('Failed to load transactions', error);
      }
    };

    fetchTransactions();
  }, [isOpen, activeProfile?.id]);

  useEffect(() => {
    if (!depositData) {
      setTimeLeft(0);
      setTimeRemaining(600);
      setDepositAddress('');
      setIsLocked(false);
      return;
    }

    setDepositAddress(depositData.wallet_address);
    setIsLocked(true);

    const updateCountdown = () => {
      const expiresAt = new Date(depositData.expires_at).getTime();
      const secondsLeft = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setTimeLeft(secondsLeft);
      setTimeRemaining(secondsLeft > 0 ? secondsLeft : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [depositData]);

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  if (!isOpen) return null;

  const handleGenerateAddress = async () => {
    AudioEngine.playClick();
    if (!activeProfile?.id) return;

    try {
      const data = await SupabaseService.generateDepositAddress(activeProfile.id);
      setDepositData(data);
    } catch (error) {
      console.error('Unable to generate deposit address', error);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    AudioEngine.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualRefresh = async () => {
    AudioEngine.playClick();
    setIsRefreshing(true);
    // Simulate network sync delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    onBalanceUpdate();
    setIsRefreshing(false);
  };

  const toggleFaq = (id) => {
    AudioEngine.playClick();
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getFilteredHistory = () => {
    if (historyFilter === 'all') return transactions;
    return transactions.filter(log => log.category === historyFilter);
  };

  const getTransactionIcon = (type, category) => {
    if (type === 'Ticket Purchase') return <Ticket className="w-5 h-5 text-rose-500" />;
    if (type === 'Reward Credit') return <Gift className="w-5 h-5 text-purple-500" />;
    if (category === 'deposit') return <ArrowDownToLine className="w-5 h-5 text-emerald-500" />;
    return <History className="w-5 h-5 text-slate-500" />;
  };

  const getStatusClasses = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (['completed', 'confirmed', 'success', 'settled', 'paid'].includes(normalized)) {
      return 'text-emerald-600 bg-emerald-50';
    }
    if (['pending', 'processing', 'review', 'in progress'].includes(normalized)) {
      return 'text-amber-600 bg-amber-50';
    }
    if (['failed', 'cancelled', 'rejected', 'expired'].includes(normalized)) {
      return 'text-rose-600 bg-rose-50';
    }
    return 'text-slate-600 bg-slate-100';
  };

  // Calculate percentage for the progress bar (600 seconds = 100%)
  const timerPercentage = (timeRemaining / 600) * 100;

  // ---------------------------------------------------------------------------
  // RENDER MODAL
  // ---------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      
      {/* Backdrop (Click to close) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={() => { AudioEngine.playClick(); onClose(); }}
      />

      {/* Main Modal Container */}
      <div className="w-full sm:max-w-md bg-white sm:rounded-[2rem] rounded-t-[2rem] rounded-b-none max-h-[90vh] sm:max-h-[85vh] flex flex-col relative z-10 animate-slide-up shadow-2xl overflow-hidden">
        
        {/* --------------------------------------------------------------------
            HEADER SECTION
            -------------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">My Wallet</h2>
              <p className="text-xs font-medium text-slate-500">Manage your AR balance</p>
            </div>
          </div>
          <button 
            onClick={() => { AudioEngine.playClick(); onClose(); }}
            className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --------------------------------------------------------------------
            BALANCE DISPLAY SECTION
            -------------------------------------------------------------------- */}
        <div className="bg-slate-50 p-6 sm:p-8 flex items-center justify-between shrink-0 border-b border-slate-100 relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1.5">
              Available Balance <Info className="w-3.5 h-3.5" />
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
                {Number(activeProfile?.ar_balance ?? 0).toFixed(2)}
              </span>
              <span className="text-lg font-bold text-blue-600">AR</span>
            </div>
          </div>
          
          {/* Only the arrow spins */}
<button 
  onClick={handleManualRefresh}
  className={`w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm relative z-10 ${
    isRefreshing ? 'border-blue-500 text-blue-600' : ''
  }`}
>
  <RefreshCw className={`w-5 h-5 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
</button>

        </div>

        {/* --------------------------------------------------------------------
            TAB NAVIGATION (PILL STYLE)
            -------------------------------------------------------------------- */}
        <div className="p-4 sm:px-6 shrink-0 bg-white border-b border-slate-100">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => { AudioEngine.playClick(); setActiveTab('deposit'); }} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'deposit' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" /> Add Funds
            </button>
            <button 
              onClick={() => { AudioEngine.playClick(); setActiveTab('history'); }} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'history' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="w-4 h-4" /> Transactions
            </button>
          </div>
        </div>

        {/* --------------------------------------------------------------------
            SCROLLABLE CONTENT AREA
            -------------------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white relative">
          
          {/* ================================================================
              TAB: ADD FUNDS (DEPOSIT)
              ================================================================ */}
          {activeTab === 'deposit' && (
            <div className="p-5 sm:p-6 space-y-6 animate-fade-in pb-8">
              
              {!isLocked ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-5">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Secure Deposit</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2 max-w-[280px] mx-auto">
                      Generate a temporary, secure address to add AR tokens to your balance. The address will be valid for 10 minutes.
                    </p>
                  </div>
                  <button 
                    onClick={handleGenerateAddress} 
                    className="w-full btn-primary py-3.5 shadow-blue-600/20"
                  >
                    Generate Deposit Address
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-slide-up">
                  
                  {/* Address Display Box */}
                  <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-[0_4px_20px_rgba(37,99,235,0.05)] relative overflow-hidden">
                    
                    {/* Timer Progress Bar Background */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
                      <div 
                        className={`h-full transition-all duration-1000 ease-linear ${
                          timeRemaining < 60 ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${timerPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4 mt-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deposit Address</span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                        timeRemaining < 60 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono">{formatTime(timeRemaining)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <span className="text-sm font-mono font-bold text-slate-900 break-all select-all">
                        {depositData?.wallet_address || depositAddress}
                      </span>
                      <button 
                        onClick={handleCopyAddress} 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          copied ? 'bg-green-100 text-green-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm'
                        }`}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="flex items-start gap-2 mt-4 text-xs font-medium text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>Send only AR tokens to this address. Ensure the transaction is initiated before the timer expires.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 py-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock className="w-4 h-4 text-blue-500" /> Fast Sync
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Verified
                </div>
              </div>

              {/* FAQ Accordion Section */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                <div className="p-4 bg-white border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-400" /> How it works
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 bg-white">
                  {faqItems.map((item) => {
                    const isExpanded = expandedFaq === item.id;
                    return (
                      <div key={item.id} className="transition-colors hover:bg-slate-50/50">
                        <button 
                          onClick={() => toggleFaq(item.id)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="text-sm font-bold text-slate-700">{item.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 text-sm text-slate-500 font-medium leading-relaxed animate-fade-in">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ================================================================
              TAB: TRANSACTIONS (HISTORY)
              ================================================================ */}
          {activeTab === 'history' && (
            <div className="animate-fade-in h-full flex flex-col">
              
              {/* Filters */}
              <div className="p-4 sm:px-6 border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10 flex gap-2 overflow-x-auto hide-scrollbar">
                {[
                  { id: 'all', label: 'All Activity' },
                  { id: 'deposit', label: 'Deposits' },
                  { id: 'spending', label: 'Spending' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => { AudioEngine.playClick(); setHistoryFilter(filter.id); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                      historyFilter === filter.id 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Transaction List */}
              <div className="flex-1 p-4 sm:p-6 space-y-3 pb-8">
                {getFilteredHistory().length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <History className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">No transactions found</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Your activity will appear here.</p>
                  </div>
                ) : (
                  getFilteredHistory().map((log) => {
                    const isPositive = log.amount >= 0;
                    return (
                      <div 
                        key={log.id} 
                        className="p-4 border border-slate-100 bg-white rounded-2xl hover:border-slate-200 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all flex items-center gap-4 group"
                      >
                        {/* Icon Badge */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          log.category === 'deposit' ? 'bg-emerald-50' : 'bg-slate-50'
                        }`}>
                          {getTransactionIcon(log.type, log.category)}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {log.type}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {log.label}
                            </span>
                            <p className="text-xs font-medium text-slate-500 truncate">
                              {log.stamp}
                            </p>
                          </div>
                        </div>

                        {/* Amount & Status */}
                        <div className="text-right shrink-0">
                          <p className={`text-base font-black tracking-tight ${
                            isPositive ? 'text-emerald-600' : 'text-slate-900'
                          }`}>
                            {isPositive ? '+' : ''}{Number(log.amount).toFixed(2)}
                          </p>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full inline-block ${getStatusClasses(log.status)}`}>
                            {log.status}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
