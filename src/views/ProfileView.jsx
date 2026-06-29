import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  Trophy, 
  Gift, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  Mail, 
  Phone, 
  AlertCircle, 
  Image as ImageIcon,
  CheckCircle2,
  MapPin,
  Truck,
  ArrowLeft,
  ExternalLink,
  Send,
  UserCircle,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Package,
  Clock
} from 'lucide-react';
import { AudioEngine } from '../services/AudioEngine.js';

export default function ProfileView({ userProfile, onOpenWallet }) {
  // ---------------------------------------------------------------------------
  // GLOBAL STATE ROUTING
  // ---------------------------------------------------------------------------
  // 'menu' | 'tasks' | 'offer_detail' | 'submit_proof' | 'rewards' | 'referrals' | 'notifications' | 'winnings' | 'claim_winning' | 'kyc'
  const [activePage, setActivePage] = useState('menu'); 

  // ---------------------------------------------------------------------------
  // TASK CENTER STATES
  // ---------------------------------------------------------------------------
  const [copiedTaskLink, setCopiedTaskLink] = useState(false);
  const [taskProofText, setTaskProofText] = useState('');
  const [taskProofImage, setTaskProofImage] = useState(false);
  const [taskSubmitted, setTaskSubmitted] = useState(false);

  // ---------------------------------------------------------------------------
  // WINNINGS & CLAIM STATES
  // ---------------------------------------------------------------------------
  const [selectedWinning, setSelectedWinning] = useState(null);
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingSubmitted, setShippingSubmitted] = useState(false);

  // ---------------------------------------------------------------------------
  // NOTIFICATION & REFERRAL STATES
  // ---------------------------------------------------------------------------
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // ---------------------------------------------------------------------------
  // MOCK DATA FACTORIES (Rich Content)
  // ---------------------------------------------------------------------------
  const mockRewards = [
    { id: 'rew-1', title: 'TRADING FEE REBATE', value: '50', unit: 'USDT', desc: 'Valid for 30 days. Applies to spot market fees.' },
    { id: 'rew-2', title: 'CASHBACK VOUCHER', value: '10', unit: 'USDC', desc: 'Direct credit to your main wallet balance.' }
  ];

  const mockReferralFriends = [
    { name: "Rahul Kumar", status: "Active", date: "Joined 2 days ago" },
    { name: "Aman Gupta", status: "Pending", date: "Invited today" },
    { name: "Priya Sharma", status: "Active", date: "Joined 1 week ago" }
  ];

  const mockLeaderboard = [
    { rank: 1, username: "CryptoKing99", invites: 1420, points: 45000 },
    { rank: 2, username: "Alpha_Trader", invites: 985, points: 31000 },
    { rank: 3, username: "Vaibhav_S", invites: 840, points: 28500 },
    { rank: 4, username: "MoonWalker", invites: 620, points: 19000 },
    { rank: 5, username: "InvestPro", invites: 415, points: 12400 }
  ];

  const mockNotifications = [
    { 
      id: 1, 
      title: "Task Approved Successfully", 
      message: "Great job! Your screenshot proof for the Partner App download task has been verified by our team. 50 Reward Points have been instantly credited to your balance. Keep completing tasks to earn more!",
      time: "2 hours ago",
      isRead: false
    },
    { 
      id: 2, 
      title: "Raffle Tickets Confirmed", 
      message: "Your purchase of 5 tickets for the 'Iron Man Action Figure' raffle was successful. Your ticket numbers are securely recorded. The draw will happen this Sunday. Good luck!",
      time: "1 day ago",
      isRead: true
    },
    { 
      id: 3, 
      title: "Welcome to AnonRoom!", 
      message: "We are thrilled to have you here. Explore live raffles, complete simple tasks for points, and invite your friends to build your network. Make sure to complete your profile for the best experience.",
      time: "3 days ago",
      isRead: true
    }
  ];

  const mockWinnings = [
    { 
      id: 'win-1', 
      title: 'Iron Man Custom Action Figure', 
      type: 'physical', 
      ticketId: 'EPID-2026-A8F2',
      wonOn: 'June 25, 2026',
      image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500&auto=format&fit=crop',
      status: 'pending' // pending | claimed
    },
    { 
      id: 'win-2', 
      title: '100 AR Token Bonus Credit', 
      type: 'digital', 
      ticketId: 'EPID-2026-B99X',
      wonOn: 'June 10, 2026',
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=500&auto=format&fit=crop',
      status: 'claimed'
    }
  ];

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  const navigateTo = (page) => {
    AudioEngine.playClick();
    setActivePage(page);
    // Reset specific sub-states when navigating away
    if (page === 'tasks') {
      setTaskProofText('');
      setTaskProofImage(false);
      setTaskSubmitted(false);
    }
    if (page === 'winnings') {
      setSelectedWinning(null);
      setShippingSubmitted(false);
    }
  };

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text);
    AudioEngine.playClick();
    if (type === 'task') {
      setCopiedTaskLink(true);
      setTimeout(() => setCopiedTaskLink(false), 2000);
    } else {
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskProofText || !taskProofImage) return;
    AudioEngine.playClick();
    setTaskSubmitted(true);
  };

  const handleClaimWinningClick = (winning) => {
    AudioEngine.playClick();
    setSelectedWinning(winning);
    setActivePage('claim_winning');
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingName || !shippingAddress || !shippingPhone) return;
    AudioEngine.playClick();
    setShippingSubmitted(true);
  };

  const toggleNotification = (id) => {
    AudioEngine.playClick();
    setExpandedNotificationId(expandedNotificationId === id ? null : id);
  };

  // ---------------------------------------------------------------------------
  // RENDER: MAIN MENU HUB
  // ---------------------------------------------------------------------------
  if (activePage === 'menu') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* Profile Identity Card */}
        <div className="card-standard p-6 flex flex-col md:flex-row items-center md:items-start gap-6 bg-white border border-slate-100">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-inner shrink-0">
            {userProfile?.username ? userProfile.username.substring(0, 2).toUpperCase() : 'VS'}
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {userProfile?.username || 'Vaibhav Singhal'}
            </h2>
            <p className="text-sm font-medium text-slate-500">User ID: {userProfile?.user_id || '9864201'}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{userProfile?.email || 'vaibhav@singhal.com'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{userProfile?.mobile || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="card-standard divide-y divide-slate-100 bg-white">
          {[
            { id: 'tasks', label: 'Tasks & Offers', icon: Award, desc: 'Earn AR points by completing simple steps', color: 'text-blue-500', bg: 'bg-blue-50' },
            { id: 'rewards', label: 'My Rewards', icon: Gift, desc: 'View and manage your active coupons', color: 'text-purple-500', bg: 'bg-purple-50' },
            { id: 'referrals', label: 'Refer a Friend', icon: Users, desc: 'Invite friends and climb the leaderboard', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Updates, alerts, and system messages', color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'winnings', label: 'My Winnings', icon: Trophy, desc: 'Track and claim your physical and digital prizes', color: 'text-rose-500', bg: 'bg-rose-50' },
            { id: 'kyc', label: 'Identity Verification (KYC)', icon: ShieldCheck, desc: 'Secure your account limits', color: 'text-slate-500', bg: 'bg-slate-100' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${item.bg} ${item.color}`}>
                  <item.icon className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.label}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: TASK CENTER (LIST)
  // ---------------------------------------------------------------------------
  if (activePage === 'tasks') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Task Center</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Complete tasks to earn points instantly.</p>
          </div>
        </div>

        {/* Task 1: Simple Social Task */}
        <div className="card-standard p-4 sm:p-5 flex items-center gap-4 sm:gap-5 bg-white">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center shrink-0">
            <Send className="w-6 h-6 text-sky-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900 truncate">Join Telegram Community</h4>
            <p className="text-sm font-medium text-slate-500 mt-0.5 truncate">Stay updated with news</p>
          </div>
          <button onClick={() => AudioEngine.playClick()} className="bg-sky-50 text-sky-600 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-100 transition-colors shrink-0">
            Follow
          </button>
        </div>

        {/* Task 2: Simple Social Task */}
        <div className="card-standard p-4 sm:p-5 flex items-center gap-4 sm:gap-5 bg-white">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900 truncate">Retweet Latest Campaign</h4>
            <p className="text-sm font-medium text-slate-500 mt-0.5 truncate">Share our post on X</p>
          </div>
          <button onClick={() => AudioEngine.playClick()} className="bg-blue-50 text-blue-600 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors shrink-0">
            Retweet
          </button>
        </div>

        {/* Task 3: Partner Offer Task (Navigates to detail page) */}
        <div className="card-standard p-4 sm:p-5 flex items-center gap-4 sm:gap-5 bg-white border-2 border-indigo-100 shadow-[0_4px_20px_rgba(79,70,229,0.08)]">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="text-base font-bold text-slate-900 truncate">Partner App Registration</h4>
              <span className="hidden sm:inline-block bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">High Reward</span>
            </div>
            <p className="text-sm font-medium text-slate-500 truncate">Download & verify account</p>
          </div>
          <button 
            onClick={() => navigateTo('offer_detail')} 
            className="bg-indigo-600 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/20 shrink-0"
          >
            Do It
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: SPECIFIC OFFER DETAIL (TASK 3)
  // ---------------------------------------------------------------------------
  if (activePage === 'offer_detail') {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard overflow-hidden bg-white">
          
          {/* Header Image Area with Back Button */}
          <div className="w-full h-48 sm:h-64 bg-slate-200 relative">
            <img 
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
              alt="Offer Preview" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            <button 
              onClick={() => navigateTo('tasks')} 
              className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-sm hover:bg-white transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Title & Reward */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Partner App Install & Verify</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Follow all steps carefully to receive your reward.</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center shrink-0 min-w-[80px]">
                <span className="block text-xl font-black text-indigo-600 leading-none">50</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1 block">Points</span>
              </div>
            </div>

            {/* Instructions Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" /> What to do:
              </h3>
              <ol className="list-decimal list-outside ml-4 text-sm text-slate-600 space-y-2 font-medium leading-relaxed">
                <li>Click the link provided below to visit our partner's website.</li>
                <li>Download the app and create a new account using your email.</li>
                <li>Complete the basic profile setup.</li>
                <li>Take a screenshot of your new profile dashboard.</li>
                <li>Return here to submit your registered email and screenshot proof.</li>
              </ol>
            </div>

            {/* Copyable Link Box */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Offer Link:</label>
              <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
                <span className="text-sm font-medium text-slate-600 ml-2 truncate select-all">
                  https://partner-app.com/register/vaibhav
                </span>
                <button 
                  onClick={() => handleCopyText("https://partner-app.com/register/vaibhav", 'task')} 
                  className="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-1.5 text-xs font-bold transition-colors shrink-0"
                >
                  {copiedTaskLink ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedTaskLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a 
                href="#" 
                className="btn-secondary flex-1"
                onClick={(e) => { e.preventDefault(); AudioEngine.playClick(); }}
              >
                <ExternalLink className="w-5 h-5 text-slate-400" /> Open Link in Browser
              </a>
              <button 
                onClick={() => navigateTo('submit_proof')} 
                className="btn-primary flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
              >
                <Send className="w-5 h-5" /> Submit Proof
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: SUBMIT PROOF FORM (TASK 3 Continued)
  // ---------------------------------------------------------------------------
  if (activePage === 'submit_proof') {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard p-6 sm:p-8 bg-white space-y-8">
          
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('offer_detail')} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Submit Your Proof</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Provide the required details to claim your reward.</p>
            </div>
          </div>

          {taskSubmitted ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-slide-up">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-100/50 mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Proof Submitted!</h3>
              <p className="text-base text-slate-500 font-medium max-w-sm">
                Our team will review your submission shortly. Points will be credited upon successful verification.
              </p>
              <button onClick={() => navigateTo('tasks')} className="btn-secondary mt-6 border-slate-200">
                Return to Tasks
              </button>
            </div>
          ) : (
            <form onSubmit={handleTaskSubmit} className="space-y-6">
              
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Registered Email or Username</label>
                <input 
                  type="text" 
                  required
                  value={taskProofText}
                  onChange={(e) => setTaskProofText(e.target.value)}
                  placeholder="e.g. vaibhav@example.com"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">Upload Dashboard Screenshot</label>
                <button 
                  type="button"
                  onClick={() => { AudioEngine.playClick(); setTaskProofImage(true); }}
                  className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                    taskProofImage 
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                      : 'border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  {taskProofImage ? (
                    <>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-base font-bold">Screenshot Attached.png</span>
                      <span className="text-xs font-medium opacity-80">Click to change file</span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-500" />
                      </div>
                      <span className="text-base font-bold text-slate-700">Tap to select image</span>
                      <span className="text-xs font-medium">JPEG, PNG or JPG (Max 5MB)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4">
                <button type="submit" className="btn-primary w-full py-4 text-base shadow-blue-600/25">
                  <Send className="w-5 h-5" /> Submit for Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: REWARDS CENTER (BIG BOLD TEXT)
  // ---------------------------------------------------------------------------
  if (activePage === 'rewards') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reward Center</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">View and manage your active coupons.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {mockRewards.map((reward) => (
            <div key={reward.id} className="card-standard flex flex-col sm:flex-row overflow-hidden bg-white shadow-sm border-slate-200 group">
              
              {/* Left Side: Big Text Value */}
              <div className="w-full sm:w-2/5 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 text-center">
                  <span className="text-5xl sm:text-6xl font-black tracking-tighter drop-shadow-md">
                    {reward.value}
                  </span>
                  <span className="text-lg font-bold tracking-widest uppercase ml-1 opacity-90">
                    {reward.unit}
                  </span>
                </div>
              </div>

              {/* Right Side: Details & Action */}
              <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between bg-white relative">
                {/* Fake ticket notch effect for desktop */}
                <div className="hidden sm:block absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-purple-600 rounded-full border-r border-white/20" />
                
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {reward.desc}
                  </p>
                </div>
                
                <button 
                  onClick={() => AudioEngine.playClick()}
                  className="w-full bg-slate-900 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-indigo-600 transition-colors shadow-md"
                >
                  Use Coupon Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: REFER A FRIEND & LEADERBOARD
  // ---------------------------------------------------------------------------
  if (activePage === 'referrals') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Refer & Earn</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Invite friends to earn bonus points.</p>
          </div>
        </div>

        {/* Share Link Card */}
        <div className="card-standard p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Users className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-5">
            <div>
              <h3 className="text-xl font-bold">Your Unique Invite Link</h3>
              <p className="text-emerald-50 font-medium mt-1 max-w-md">Share this code with your friends. You both get 50 points when they complete their first task.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-black/20 border border-white/20 rounded-xl px-4 py-3 font-mono font-bold text-lg select-all">
                ANON_VAIBHAV_2026
              </div>
              <button 
                onClick={() => handleCopyText("ANON_VAIBHAV_2026", 'referral')}
                className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold shadow-lg shadow-black/10 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {copiedReferral ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedReferral ? 'Copied' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid for Friends and Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* My Friends Section */}
          <div className="card-standard bg-white flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <UserCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900">My Friends</h3>
              <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                {mockReferralFriends.length} Total
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {mockReferralFriends.map((friend, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{friend.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{friend.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    friend.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {friend.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="card-standard bg-white flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Top Referrers</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {mockLeaderboard.map((user) => (
                <div key={user.rank} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                    user.rank === 1 ? 'bg-amber-100 text-amber-600' :
                    user.rank === 2 ? 'bg-slate-200 text-slate-600' :
                    user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-50 text-slate-400 border border-slate-200'
                  }`}>
                    #{user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${user.username === 'Vaibhav_S' ? 'text-blue-600' : 'text-slate-900'}`}>
                      {user.username} {user.username === 'Vaibhav_S' && '(You)'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{user.invites} Friends Invited</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-sm text-slate-900">{user.points}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: NOTIFICATIONS (EXPANDABLE)
  // ---------------------------------------------------------------------------
  if (activePage === 'notifications') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Stay updated with your account activity.</p>
          </div>
        </div>

        <div className="card-standard bg-white overflow-hidden">
          <div className="divide-y divide-slate-100">
            {mockNotifications.map((notif) => {
              const isExpanded = expandedNotificationId === notif.id;
              return (
                <div key={notif.id} className={`transition-colors ${notif.isRead ? 'bg-white' : 'bg-blue-50/40'}`}>
                  <div 
                    onClick={() => toggleNotification(notif.id)}
                    className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.isRead ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                        <Bell className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className={`text-base font-bold truncate ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-xs font-medium text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      
                      {!isExpanded && (
                        <p className="text-sm text-slate-500 truncate">{notif.message}</p>
                      )}
                      
                      {isExpanded && (
                        <div className="animate-fade-in mt-3 text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {notif.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MY WINNINGS (LIST)
  // ---------------------------------------------------------------------------
  if (activePage === 'winnings') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">My Winnings</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Track and claim your prizes.</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockWinnings.map((prize) => (
            <div key={prize.id} className="card-standard bg-white p-4 flex flex-col sm:flex-row items-center gap-5 sm:h-32">
              
              {/* Prize Image (Horizontal Rectangular Box Style) */}
              <div className="w-full sm:w-32 h-32 sm:h-full bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                <img src={prize.image} alt="Prize" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {prize.type}
                </div>
              </div>

              {/* Info & Action */}
              <div className="flex-1 min-w-0 w-full flex flex-col justify-between py-1 h-full gap-3 sm:gap-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 truncate">{prize.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {prize.wonOn}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                    prize.status === 'claimed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {prize.status === 'claimed' ? '✓ Claimed' : 'Action Required'}
                  </span>
                  
                  <button 
                    onClick={() => handleClaimWinningClick(prize)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      prize.status === 'claimed' 
                        ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20'
                    }`}
                  >
                    {prize.status === 'claimed' ? 'View Details' : 'Claim Prize'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: CLAIM WINNING DETAIL & SHIPPING FORM
  // ---------------------------------------------------------------------------
  if (activePage === 'claim_winning' && selectedWinning) {
    const isPhysical = selectedWinning.type === 'physical';
    const isClaimed = selectedWinning.status === 'claimed';

    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard bg-white overflow-hidden">
          
          <div className="h-48 sm:h-56 relative bg-slate-900">
            <img src={selectedWinning.image} alt="Prize" className="w-full h-full object-cover opacity-60" />
            <button 
              onClick={() => navigateTo('winnings')} 
              className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-sm hover:bg-white transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedWinning.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wider">
                  {selectedWinning.type} Item
                </span>
                <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" /> Ticket: {selectedWinning.ticketId}
                </span>
              </div>
            </div>

            {/* Digital Item Flow */}
            {!isPhysical && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Digital Reward Ready</h3>
                <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto">
                  This digital prize is ready to be credited to your account. Click below to send it directly to your Reward Center.
                </p>
                <button 
                  disabled={isClaimed}
                  className="btn-primary w-full max-w-xs mx-auto mt-4"
                  onClick={() => { AudioEngine.playClick(); navigateTo('rewards'); }}
                >
                  {isClaimed ? 'Already Sent to Reward Center' : 'Send to Reward Center'}
                </button>
              </div>
            )}

            {/* Physical Item Flow (Shipping Form) */}
            {isPhysical && !isClaimed && !shippingSubmitted && (
              <div className="space-y-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-slate-800">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Shipping Details Required</h3>
                </div>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Full Name</label>
                    <input 
                      type="text" required value={shippingName} onChange={e => setShippingName(e.target.value)}
                      placeholder="Name to appear on package"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Contact Phone Number</label>
                    <input 
                      type="tel" required value={shippingPhone} onChange={e => setShippingPhone(e.target.value)}
                      placeholder="For delivery updates"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 block">Complete Delivery Address</label>
                    <textarea 
                      required value={shippingAddress} onChange={e => setShippingAddress(e.target.value)}
                      placeholder="Street, City, State, ZIP code" rows={3}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-600">Shipping & Handling Fee:</span>
                    <span className="font-black text-green-600">Free / Waived</span>
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-base">
                    Confirm Shipping Details
                  </button>
                </form>
              </div>
            )}

            {/* Physical Item - Post Submit State */}
            {isPhysical && (isClaimed || shippingSubmitted) && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3 mt-6 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Order Processed!</h3>
                <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto">
                  Your shipping details have been securely saved. Our logistics team will process dispatch within 48 hours.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: KYC IDENTITY VERIFICATION (PLACEHOLDER)
  // ---------------------------------------------------------------------------
  if (activePage === 'kyc') {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Identity Verification</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Secure your account limits.</p>
          </div>
        </div>

        <div className="card-standard bg-white p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">KYC Coming Soon</h3>
          <p className="text-sm text-slate-500 font-medium max-w-md">
            Our fully integrated identity verification system is currently rolling out. It will be available in your region in an upcoming app update.
          </p>
          <button onClick={() => navigateTo('menu')} className="btn-secondary mt-4">
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return null;
}
