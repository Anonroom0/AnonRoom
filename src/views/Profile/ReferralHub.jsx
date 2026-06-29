import React, { useState } from 'react';
import { 
  ArrowLeft, Users, Link as LinkIcon, Copy, CheckCircle2, 
  UserCircle, Trophy, Wallet, Activity, Gift, ChevronDown, 
  ChevronUp, AlertCircle, Target, TrendingUp, Clock, Info,
  Check
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

/**
 * ReferralHub Component
 * -----------------------------------------------------------------------------
 * A comprehensive affiliate and referral dashboard.
 * Includes cumulative financial metrics, milestone rewards, network expansion,
 * and competitive leaderboards with strict 30-day commission rule tracking.
 */
export default function ReferralHub({ navigateTo }) {
  // ---------------------------------------------------------------------------
  // 1. COMPONENT STATE
  // ---------------------------------------------------------------------------
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [expandedFriendId, setExpandedFriendId] = useState(null);
  
  // Milestone Claim Popup
  const [claimPopup, setClaimPopup] = useState({ show: false, reward: '' });

  // ---------------------------------------------------------------------------
  // 2. MOCK DATA FACTORIES (AFFILIATE METRICS)
  // ---------------------------------------------------------------------------
  
  // Dashboard Aggregated Metrics
  const dashboardStats = {
    totalFriends: 12,
    activeCommissionFriends: 4,
    cumulativeDeposits: 4500, // in USDT
    totalCommission: 450,     // in USDT
  };

  // Milestone Track Data
  const [milestones, setMilestones] = useState([
    { 
      id: 'ms-1', 
      title: 'Invite 5 Friends', 
      target: 5, 
      progress: 5, 
      reward: '50 AR Points', 
      status: 'claimable' // 'locked' | 'claimable' | 'claimed'
    },
    { 
      id: 'ms-2', 
      title: '5,000 USDT Network Volume', 
      target: 5000, 
      progress: 4500, 
      reward: '100 USDT Voucher', 
      status: 'locked' 
    },
    { 
      id: 'ms-3', 
      title: '10 Active Depositors', 
      target: 10, 
      progress: 4, 
      reward: 'Exclusive NFT', 
      status: 'locked' 
    }
  ]);

  // Network Friends Data (Detailed)
  const mockFriends = [
    { 
      id: 'f-1', 
      name: "Rahul Kumar", 
      status: "Active", 
      date: "Joined 2 days ago", 
      deposit: 1200, 
      commission: 120, 
      daysLeft: 28 
    },
    { 
      id: 'f-2', 
      name: "Aman Gupta", 
      status: "Pending", 
      date: "Invited today", 
      deposit: 0, 
      commission: 0, 
      daysLeft: 30 
    },
    { 
      id: 'f-3', 
      name: "Priya Sharma", 
      status: "Active", 
      date: "Joined 15 days ago", 
      deposit: 3400, 
      commission: 340, 
      daysLeft: 15 
    },
    { 
      id: 'f-4', 
      name: "Vikram Singh", 
      status: "Expired", 
      date: "Joined 2 months ago", 
      deposit: 5000, 
      commission: 500, 
      daysLeft: 0 // Past the 30-day mark
    }
  ];

  // Leaderboard Data
  const mockLeaderboard = [
    { rank: 1, username: "CryptoKing99", invites: 1420, points: 45000 },
    { rank: 2, username: "Alpha_Trader", invites: 985, points: 31000 },
    { rank: 3, username: "Vaibhav_S", invites: 840, points: 28500 },
    { rank: 4, username: "MoonWalker", invites: 620, points: 19000 },
    { rank: 5, username: "InvestPro", invites: 415, points: 12400 }
  ];

  // ---------------------------------------------------------------------------
  // 3. INTERACTION HANDLERS
  // ---------------------------------------------------------------------------

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    AudioEngine.playClick();
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const toggleFriendExpand = (id) => {
    AudioEngine.playClick();
    setExpandedFriendId(expandedFriendId === id ? null : id);
  };

  const handleClaimMilestone = (id, rewardText) => {
    AudioEngine.playClick();
    
    // Update local state
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: 'claimed' } : m));
    
    // Show success popup
    setClaimPopup({ show: true, reward: rewardText });
    setTimeout(() => setClaimPopup({ show: false, reward: '' }), 3000);
  };

  // ---------------------------------------------------------------------------
  // 4. RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 relative">
      
      {/* Milestone Claim Popup */}
      {claimPopup.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Milestone Unlocked!</p>
              <p className="text-xs text-slate-300 font-medium">{claimPopup.reward} has been credited.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => { AudioEngine.playClick(); navigateTo('menu'); }} 
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Referral & Affiliate Hub</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Build your network, earn massive commissions.</p>
        </div>
      </div>

      {/* ====================================================================
          SECTION 1: HERO & SHARE LINKS
          ==================================================================== */}
      <div className="card-standard p-6 sm:p-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 text-white relative overflow-hidden shadow-xl rounded-[2rem]">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Users className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h3 className="text-3xl font-black tracking-tight">Earn 10% on Every Deposit</h3>
            <p className="text-emerald-50 font-medium mt-2 max-w-lg leading-relaxed text-sm sm:text-base">
              Share your code or direct link. When they register and deposit, you instantly receive 10% of their deposit value directly to your wallet.
            </p>
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Your Tracking Link</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-black/20 border border-white/20 rounded-xl px-5 py-4 font-medium text-sm sm:text-base flex items-center gap-3 overflow-hidden shadow-inner backdrop-blur-sm">
                <LinkIcon className="w-5 h-5 text-emerald-200 shrink-0" />
                <span className="truncate w-full select-all">https://anonroom.com/ref/VAIBHAV26</span>
              </div>
              <button 
                onClick={() => handleCopy("https://anonroom.com/ref/VAIBHAV26", 'link')} 
                className="bg-white text-teal-800 px-8 py-4 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {copiedLink ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Manual Affiliate Code</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-black/20 border border-white/20 rounded-xl px-5 py-4 font-mono font-bold text-xl tracking-widest select-all flex items-center shadow-inner backdrop-blur-sm">
                VAIBHAV26
              </div>
              <button 
                onClick={() => handleCopy("VAIBHAV26", 'code')} 
                className="bg-teal-800/80 backdrop-blur-md text-white border border-teal-400 px-8 py-4 rounded-xl font-bold hover:bg-teal-900 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
              >
                {copiedCode ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Rule Notice */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-800 text-sm">30-Day Commission Window</h4>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
            Commissions are only generated on deposits made by your referrals within their <strong className="text-slate-800">first 30 days</strong> of registration. Monitor their time remaining in the "My Network" tab.
          </p>
        </div>
      </div>

      {/* ====================================================================
          SECTION 2: AFFILIATE DASHBOARD
          ==================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Network</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{dashboardStats.totalFriends}</div>
            <div className="text-xs font-bold text-slate-500 mt-1">Invited Friends</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Comm.</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{dashboardStats.activeCommissionFriends}</div>
            <div className="text-xs font-bold text-emerald-600 mt-1">Under 30 Days</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cum. Deposit</span>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">
              ${dashboardStats.cumulativeDeposits.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">Network Volume</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Trophy className="w-20 h-20" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Total Earned</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="relative z-10">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tighter">
              ${dashboardStats.totalCommission.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-slate-300 mt-1">Generated Comm.</div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 3: MILESTONE REWARDS
          ==================================================================== */}
      <div className="card-standard bg-white p-6 sm:p-8 rounded-[1.5rem] shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-indigo-600" /> Milestone Rewards
        </h3>
        
        <div className="space-y-6">
          {milestones.map((ms) => {
            const percent = Math.min((ms.progress / ms.target) * 100, 100);
            
            return (
              <div key={ms.id} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{ms.title}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">Reward: <span className="text-indigo-600">{ms.reward}</span></p>
                  </div>
                  
                  <div className="shrink-0">
                    {ms.status === 'claimed' ? (
                      <button disabled className="bg-slate-100 text-slate-400 font-bold px-5 py-2 rounded-xl text-xs border border-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                      </button>
                    ) : ms.status === 'claimable' ? (
                      <button 
                        onClick={() => handleClaimMilestone(ms.id, ms.reward)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-5 py-2 rounded-xl text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all animate-pulse"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        {ms.progress.toLocaleString()} / {ms.target.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${ms.status === 'claimable' || ms.status === 'claimed' ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          SECTION 4: MY NETWORK & LEADERBOARD
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Detailed Network Accordion */}
        <div className="card-standard bg-white flex flex-col h-[500px] shadow-sm border border-slate-100 rounded-[1.5rem] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <UserCircle className="w-6 h-6 text-emerald-500" />
              <h3 className="font-bold text-slate-900 text-lg">My Network</h3>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md shadow-sm border border-slate-200">
              {mockFriends.length} Referrals
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="divide-y divide-slate-100">
              {mockFriends.map((friend) => {
                const isExpanded = expandedFriendId === friend.id;
                
                return (
                  <div key={friend.id} className="transition-colors hover:bg-slate-50/50 rounded-xl overflow-hidden">
                    
                    {/* Header Row (Click to Expand) */}
                    <button 
                      onClick={() => toggleFriendExpand(friend.id)}
                      className="w-full flex items-center justify-between p-4 outline-none text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-600 shadow-inner text-base shrink-0">
                          {friend.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{friend.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {friend.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm border uppercase tracking-wider hidden sm:block ${
                          friend.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                          friend.status === 'Expired' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {friend.status}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="px-4 pb-4 animate-fade-in">
                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4 shadow-inner">
                          
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <span className="text-xs font-bold text-slate-500">Total Deposit Made</span>
                            <span className="text-sm font-black text-slate-900">${friend.deposit.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <span className="text-xs font-bold text-slate-500">Commission Earned (10%)</span>
                            <span className="text-sm font-black text-emerald-600">+${friend.commission.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500">Commission Status</span>
                            {friend.daysLeft > 0 ? (
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {friend.daysLeft} Days Remaining
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> 30-Day Limit Expired
                              </span>
                            )}
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Leaderboard */}
        <div className="card-standard bg-white flex flex-col h-[500px] shadow-sm border border-slate-100 rounded-[1.5rem] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-lg">Top Referrers</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {mockLeaderboard.map((user) => (
              <div key={user.rank} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm border ${
                  user.rank === 1 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                  user.rank === 2 ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                  user.rank === 3 ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                  'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  #{user.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-base truncate ${user.username === 'Vaibhav_S' ? 'text-blue-600' : 'text-slate-900'}`}>
                    {user.username} {user.username === 'Vaibhav_S' && '(You)'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{user.invites} Friends Invited</p>
                </div>
                <div className="text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-inner">
                  <p className="font-black text-sm text-slate-900 tracking-tighter">{user.points}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
