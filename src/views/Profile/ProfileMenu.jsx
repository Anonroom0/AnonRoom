import React from 'react';
import { 
  Award, Users, Trophy, Gift, Bell, ChevronRight, Mail, Phone, 
  Package, FileText, FileCheck, HelpCircle, ShieldCheck, LogOut,
  Shield, Activity, TrendingUp, Hexagon
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

/**
 * ProfileMenu Component
 * -----------------------------------------------------------------------------
 * The primary dashboard and routing hub for the user profile.
 * Features a dynamic overlapping header, beautifully aligned flex-avatar layout,
 * and high-fidelity hover interactions for all menu items.
 */
export default function ProfileMenu({ navigateTo, userProfile, onSignOut }) {
  
  const handleSignOut = async () => {
    AudioEngine.playClick();
    const confirmLogout = window.confirm("Are you sure you want to securely sign out of your AnonRoom account?");
    if (!confirmLogout) return;

    if (typeof onSignOut === 'function') {
      await onSignOut();
    }
  };

  // Safe fallback identity mapping
  const displayName = userProfile?.username || 'Vaibhav K. Singhal';
  const displayId = userProfile?.user_id || 'AR-9864201';
  const displayEmail = userProfile?.email || 'vaibhav.s@anonroom.com';
  const displayPhone = userProfile?.mobile || '+91 98765 43210';
  const avatarInitial = displayName.substring(0, 2).toUpperCase();

  // Mock Notification count for the red badge
  const unreadNotifications = 2; 

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* ====================================================================
          HEADER: BANNER DRAPE & PROFILE CARD
          ==================================================================== */}
      <div className="relative">
        
        {/* Background Gradient Banner (Drapes down behind the card) */}
        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-b-[3rem] sm:rounded-b-[4rem] overflow-hidden shadow-lg -z-10">
          {/* Subtle texture overlay for premium feel */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>
        
        {/* Foreground Profile Card */}
        <div className="relative z-10 pt-16 px-4 sm:px-6">
          <div className="card-standard bg-white/95 backdrop-blur-xl border border-white shadow-[0_12px_40px_rgb(0,0,0,0.12)] rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            
            {/* Avatar Profile Picture (Perfectly centered vertically inside flex) */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-full shadow-lg border border-slate-50 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-black shadow-inner border border-blue-200/50">
                  {avatarInitial}
                </div>
              </div>
              {/* Online Status Dot */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>

            {/* Profile Identity Text */}
            <div className="flex-1 text-center sm:text-left space-y-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {displayName}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg shadow-inner">
                  UID: {displayId}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg shadow-sm border border-emerald-200">
                  <Shield className="w-4 h-4" /> Secure Vault Active
                </span>
              </div>
              
              {/* Contact Pills */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium shadow-sm transition-colors hover:bg-slate-100 cursor-default">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>{displayEmail}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium shadow-sm transition-colors hover:bg-slate-100 cursor-default">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <span>{displayPhone}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ====================================================================
          MENU SECTION 1: ACTIVITIES & REWARDS
          ==================================================================== */}
      <div className="space-y-3 px-4 sm:px-0 mt-4 sm:mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Activities & Rewards
        </h3>
        <div className="card-standard divide-y divide-slate-100 bg-white shadow-sm border border-slate-100 overflow-hidden rounded-[1.5rem]">
          {[
            { id: 'tasks', label: 'Tasks & Offers', icon: Award, desc: 'Complete daily tasks to earn instant points', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
            { id: 'rewards', label: 'Reward Center', icon: Gift, desc: 'Manage your active coupons and multipliers', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
            { id: 'referrals', label: 'Refer a Friend', icon: Users, desc: 'Invite friends, earn points, and climb ranks', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-slate-50 active:bg-slate-100"
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${item.bg} ${item.color}`}>
                  <item.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.label}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      {/* ====================================================================
          MENU SECTION 2: ASSETS & TRACKING
          ==================================================================== */}
      <div className="space-y-3 px-4 sm:px-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Assets & Tracking
        </h3>
        <div className="card-standard divide-y divide-slate-100 bg-white shadow-sm border border-slate-100 overflow-hidden rounded-[1.5rem]">
          {[
            { id: 'winnings', label: 'My Winnings', icon: Trophy, desc: 'Claim your physical and digital prize draws', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
            { id: 'shipments', label: 'My Shipments', icon: Package, desc: 'Track your physical prize delivery routes', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
            { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'System updates, alerts, and inbox messages', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-slate-50 active:bg-slate-100"
            >
              <div className="flex items-center gap-4 sm:gap-5">
                <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${item.bg} ${item.color}`}>
                  <item.icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.label}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              
              {/* Notification Badge Logic */}
              <div className="flex items-center gap-3">
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <div className="flex items-center justify-center bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full shadow-sm animate-pulse">
                    {unreadNotifications}
                  </div>
                )}
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ====================================================================
          MENU SECTION 3: SUPPORT & INFORMATION
          ==================================================================== */}
      <div className="space-y-3 px-4 sm:px-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4 flex items-center gap-2">
          <Hexagon className="w-4 h-4" /> Support & Settings
        </h3>
        <div className="card-standard divide-y divide-slate-100 bg-white shadow-sm border border-slate-100 overflow-hidden rounded-[1.5rem]">
          
          <button onClick={() => navigateTo('doc_reader', 'whitepaper')} className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-slate-50">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md bg-slate-50 border-slate-200 text-slate-700">
                <FileText className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Platform Whitepaper</h3>
                <p className="text-sm font-medium text-slate-500 mt-0.5">Read our official mechanics documentation</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button onClick={() => navigateTo('doc_reader', 'tnc')} className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-slate-50">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md bg-slate-50 border-slate-200 text-slate-700">
                <FileCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Terms & Conditions</h3>
                <p className="text-sm font-medium text-slate-500 mt-0.5">Legal agreements and user policies</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button onClick={() => navigateTo('faqs')} className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-slate-50">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md bg-slate-50 border-slate-200 text-slate-700">
                <HelpCircle className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Help Center & FAQs</h3>
                <p className="text-sm font-medium text-slate-500 mt-0.5">Find answers to common questions quickly</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button onClick={() => navigateTo('kyc')} className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-slate-50">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md bg-slate-50 border-slate-200 text-slate-700">
                <ShieldCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">Identity Verification (KYC)</h3>
                <p className="text-sm font-medium text-slate-500 mt-0.5">Manage your security and tier limits</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button onClick={handleSignOut} className="w-full p-4 sm:p-5 flex items-center justify-between transition-all duration-200 text-left group hover:bg-red-50">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:shadow-md bg-red-50 border-red-200 text-red-600">
                <LogOut className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="transition-transform duration-300 group-hover:translate-x-1.5">
                <h3 className="text-base font-bold text-red-600 transition-colors">Sign Out</h3>
                <p className="text-sm font-medium text-red-400 mt-0.5">Securely log out of this device</p>
              </div>
            </div>
          </button>
          
        </div>
      </div>

    </div>
  );
}
