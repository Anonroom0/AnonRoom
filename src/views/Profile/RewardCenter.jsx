import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Gift, 
  Clock, 
  CalendarDays, 
  Check, 
  Info,
  Search,
  Filter
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';
import { SupabaseService } from '../../services/SupabaseService.js';

/**
 * RewardCenter Component
 * -----------------------------------------------------------------------------
 * A premium voucher management system styled after top-tier exchange layouts.
 * Features structural ticket cutouts, dashed dividers, and seamless activation states.
 */
export default function RewardCenter({ navigateTo, userProfile, onRefresh }) {
  // ---------------------------------------------------------------------------
  // 1. COMPONENT STATE
  // ---------------------------------------------------------------------------
  const [rewardTab, setRewardTab] = useState('Ongoing'); // 'Ongoing' | 'Past'
  const [rewardPopup, setRewardPopup] = useState({ show: false, title: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [myRewards, setMyRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVouchers = async () => {
      if (!userProfile?.id) return;
      try {
        setLoading(true);
        const { ongoing, past } = await SupabaseService.getVouchers(userProfile.id);
        const normalized = [...ongoing, ...past].map((voucher) => ({
          id: voucher.id,
          title: voucher.title || voucher.name || 'Voucher',
          value: String(voucher.amount || voucher.value || 0),
          unit: voucher.unit || 'AR',
          desc: voucher.description || voucher.source || 'Reward voucher',
          expiry: voucher.expires_at ? new Date(voucher.expires_at).toLocaleString() : 'No expiry',
          tag: voucher.type || 'Reward',
          isUsed: voucher.status === 'used' || voucher.status === 'expired'
        }));
        setMyRewards(normalized);
      } catch (err) {
        console.error('Failed to load vouchers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVouchers();
  }, [userProfile?.id]);

  // High-fidelity mock data mimicking the Binance voucher types
  const [myRewardsSeed, setMyRewardsSeed] = useState([
    { 
      id: 'rew-1', 
      title: 'Trading Fee Rebate Voucher', 
      value: '50', 
      unit: 'USDT', 
      desc: 'From Global deposit task', 
      expiry: '2026-12-31 19:10', 
      tag: 'Spot', 
      isUsed: false 
    },
    { 
      id: 'rew-3', 
      title: 'Trading Fee Rebate Voucher', 
      value: '75', 
      unit: 'USDT', 
      desc: 'From Futures Click Task', 
      expiry: '2026-08-08 18:50', 
      tag: 'USD-M Futures', 
      isUsed: false 
    },
    { 
      id: 'rew-4', 
      title: 'Platform Fee Rebate', 
      value: '20', 
      unit: 'USDT', 
      desc: 'From App Registration', 
      expiry: '2026-07-28 18:48', 
      tag: 'Spot', 
      isUsed: false 
    },
    { 
      id: 'rew-6', 
      title: 'Premium Task Multiplier', 
      value: '2x', 
      unit: 'BOOST', 
      desc: 'Doubles points for the next 3 tasks', 
      expiry: '2026-06-30 23:59', 
      tag: 'Global', 
      isUsed: false 
    },
    { 
      id: 'rew-2', 
      title: 'Welcome Cashback Bonus', 
      value: '10', 
      unit: 'USDC', 
      desc: 'Direct account credit', 
      expiry: '2026-06-01 12:00', 
      tag: 'Spot', 
      isUsed: true 
    },
    { 
      id: 'rew-5', 
      title: 'Shipping Fee Waiver Pass', 
      value: '1', 
      unit: 'PASS', 
      desc: 'Waives international physical delivery fee', 
      expiry: '2026-05-15 10:00', 
      tag: 'Physical', 
      isUsed: true 
    }
  ]);

  // ---------------------------------------------------------------------------
  // 2. INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  
  const handleActivateReward = async (rewardId, rewardTitle) => {
    AudioEngine.playClick();
    if (!userProfile?.id) return;

    try {
      await SupabaseService.useVoucher(rewardId, userProfile.id);
      setMyRewards(prev => prev.map(r => r.id === rewardId ? { ...r, isUsed: true } : r));
      setRewardPopup({ show: true, title: rewardTitle });
      onRefresh?.();
      setTimeout(() => {
        setRewardPopup({ show: false, title: '' });
      }, 3500);
    } catch (err) {
      console.error('Failed to use voucher:', err);
    }
  };

  const handleTabSwitch = (tab) => {
    AudioEngine.playClick();
    setRewardTab(tab);
    setSearchQuery(''); // Reset search when switching tabs
  };

  // ---------------------------------------------------------------------------
  // 3. DATA PROCESSING PIPELINE
  // ---------------------------------------------------------------------------
  
  // 1. Filter by Tab (Ongoing vs Past)
  let displayedRewards = rewardTab === 'Ongoing' 
    ? myRewards.filter(r => !r.isUsed)
    : myRewards.filter(r => r.isUsed);

  // 2. Filter by Search Query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    displayedRewards = displayedRewards.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.desc.toLowerCase().includes(q) ||
      r.tag.toLowerCase().includes(q)
    );
  }

  // ---------------------------------------------------------------------------
  // 4. RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 relative min-h-screen">
      
      {/* ====================================================================
          GLOBAL FLOATING POPUP (ACTIVATION SUCCESS)
          ==================================================================== */}
      {rewardPopup.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down w-[90%] max-w-sm">
          <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700/50 backdrop-blur-md">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-white tracking-wide">Voucher Activated</p>
              <p className="text-xs font-medium text-slate-300 mt-0.5 truncate">{rewardPopup.title} applied.</p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PAGE HEADER
          ==================================================================== */}
      <div className="flex items-center gap-4 mb-6 px-2 sm:px-0 pt-4">
        <button 
          onClick={() => { AudioEngine.playClick(); navigateTo('menu'); }} 
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Vouchers</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Manage and activate your rewards.</p>
        </div>
      </div>

      {/* ====================================================================
          MAIN REWARD DASHBOARD AREA
          ==================================================================== */}
      <div className="bg-white sm:rounded-[2rem] rounded-3xl p-5 sm:p-8 min-h-[600px] shadow-sm border border-slate-100">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-8 px-2">
            <button 
              onClick={() => handleTabSwitch('Ongoing')}
              className={`pb-3 text-[15px] font-bold transition-all relative outline-none ${
                rewardTab === 'Ongoing' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Ongoing ({myRewards.filter(r => !r.isUsed).length})
              {rewardTab === 'Ongoing' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-fade-in" />
              )}
            </button>
            <button 
              onClick={() => handleTabSwitch('Past')}
              className={`pb-3 text-[15px] font-bold transition-all relative outline-none ${
                rewardTab === 'Past' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Past ({myRewards.filter(r => r.isUsed).length})
              {rewardTab === 'Past' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-fade-in" />
              )}
            </button>
          </div>

          {/* Optional Search/Filter input aligned right on desktop */}
          <div className="relative w-full sm:w-64 pb-3 sm:pb-3">
            <input 
              type="text" 
              placeholder="Search vouchers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-inner"
            />
            <Search className="absolute left-3.5 top-5 sm:top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-5 pl-1">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">
            {rewardTab === 'Ongoing' ? 'Can Use' : 'History'}
          </h3>
          <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-slate-600 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* ====================================================================
            VOUCHERS GRID (THE BINANCE LAYOUT)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <Gift className="w-10 h-10 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-700 mt-4">Loading vouchers…</h3>
            </div>
          ) : displayedRewards.length === 0 ? (
            
            /* Empty State */
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Gift className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">No Vouchers Found</h3>
              <p className="text-sm text-slate-500 font-medium mt-1 max-w-sm">
                {searchQuery 
                  ? `No vouchers match the search "${searchQuery}".`
                  : `You don't have any ${rewardTab.toLowerCase()} vouchers at the moment.`}
              </p>
            </div>
            
          ) : (
            
            /* Render Vouchers */
            displayedRewards.map((reward) => (
              <div 
                key={reward.id} 
                className={`flex w-full h-[150px] rounded-[1.25rem] overflow-visible bg-white relative border border-slate-200 shadow-sm transition-all hover:shadow-md ${
                  reward.isUsed ? 'opacity-60 grayscale hover:grayscale-0' : ''
                }`}
              >
                
                {/* --------------------------------------------------
                    LEFT SIDE: Detailed Information Area
                    -------------------------------------------------- */}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0 rounded-l-[1.25rem]">
                  <div className="space-y-1.5">
                    {/* Title with Info Tooltip */}
                    <div className="flex items-center gap-2 pr-2">
                      <span className="font-bold text-slate-900 text-[15px] sm:text-base leading-tight truncate">
                        {reward.title}
                      </span>
                      <Info className="w-4 h-4 text-slate-400 shrink-0 cursor-help" />
                    </div>
                    
                    {/* Expiry Details */}
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Use before {reward.expiry}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-2 space-y-2">
                    {/* Category Tag */}
                    <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md inline-block shadow-sm">
                      {reward.tag}
                    </span>
                    
                    {/* Context/Description string */}
                    <div className="text-[11px] font-bold text-slate-400 tracking-wide truncate pr-2">
                      {reward.desc}
                    </div>
                  </div>
                </div>

                {/* --------------------------------------------------
                    MIDDLE: Structural Divider with Ticket Cutouts
                    -------------------------------------------------- */}
                <div className="w-0 relative border-l-[2.5px] border-dashed border-slate-200 flex flex-col justify-between items-center z-10 my-3">
                  
                  {/* Top Semi-Circle Cutout */}
                  <div className="w-6 h-6 bg-white rounded-full absolute -top-[1.1rem] -left-[13px] border-b border-slate-200 shadow-inner" />
                  
                  {/* Bottom Semi-Circle Cutout */}
                  <div className="w-6 h-6 bg-white rounded-full absolute -bottom-[1.1rem] -left-[13px] border-t border-slate-200 shadow-inner" />
                  
                </div>

                {/* --------------------------------------------------
                    RIGHT SIDE: Value & Action Button Area
                    -------------------------------------------------- */}
                <div className="w-28 sm:w-[140px] bg-slate-50/50 flex flex-col items-center justify-center p-4 z-0 rounded-r-[1.25rem] border-l border-transparent">
                  
                  {/* Massive Value Display */}
                  <div className="text-4xl font-black text-amber-500 leading-none mb-1 tracking-tighter drop-shadow-sm">
                    {reward.value}
                  </div>
                  
                  {/* Unit Label */}
                  <div className="text-[11px] text-amber-600/80 font-black mb-4 tracking-widest uppercase">
                    {reward.unit}
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    disabled={reward.isUsed}
                    onClick={() => handleActivateReward(reward.id, reward.title)}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${
                      reward.isUsed 
                        ? 'bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed' 
                        : 'bg-amber-400 text-amber-950 border-amber-400 hover:bg-amber-300 hover:shadow-md active:scale-95'
                    }`}
                  >
                    {reward.isUsed ? 'Used' : 'Use'}
                  </button>
                  
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
