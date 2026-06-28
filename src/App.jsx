import React, { useState, useEffect } from 'react';
import { Home, Ticket, Layers, User, Bell, LogOut, Shield, ChevronRight, Menu, X, ArrowLeft } from 'lucide-react';
import { MockAPI } from './services/MockApi.js';
import { AudioEngine } from './services/AudioEngine.js';

import HomeView from './views/HomeView.jsx';
import RaffleView from './views/RaffleView.jsx';
import MyTicketsView from './views/MyTicketView.jsx';
import ProfileView from './views/ProfileView.jsx';
import WalletModal from './components/WalletModal.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const reloadProfileContext = async () => {
    try {
      const profile = await MockAPI.getProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error("Critical Profile Context Desynchronization error: ", err);
    }
  };

  useEffect(() => {
    async function initSystemContext() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Standard structural load delay
        const profile = await MockAPI.getProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error("System configuration initiation fault: ", err);
      } finally {
        setIsLoading(false);
      }
    }
    initSystemContext();
  }, []);

  const handleTabTransition = (tabId) => {
    AudioEngine.playClick();
    setActiveTab(tabId);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFFFFF] select-none">
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-black mt-4">
          Loading System Schema
        </span>
      </div>
    );
  }

  const menuItemsList = [
    { id: 'home', label: 'Pools Overview', icon: Home },
    { id: 'raffle', label: 'Raffle Active Arena', icon: Layers },
    { id: 'tickets', label: 'My Participation Stakes', icon: Ticket },
    { id: 'profile', label: 'Account Profile Nodes', icon: User }
  ];

  return (
    <div className="w-full h-full flex bg-[#FFFFFF] text-[#000000] relative overflow-hidden select-none">
      
      {/* 💻 DESKTOP LAYOUT INTEGRAL NAVIGATION SIDEBAR (HIDDEN ON MOBILE THROUGH WINDOW BREAKS) */}
      <aside className={`hidden md:flex flex-col justify-between border-r-2 border-[#000000] h-full bg-[#FFFFFF] transition-all duration-300 z-30 shrink-0 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        <div className="w-full flex flex-col">
          {/* Brand Panel header identity title block area */}
          <div className="h-20 border-b-2 border-[#000000] px-6 flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-sm font-black tracking-[0.3em] uppercase text-black">
                ANONROOM
              </span>
            )}
            <button 
              onClick={() => { AudioEngine.playClick(); setSidebarCollapsed(!sidebarCollapsed); }}
              className="p-1 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors ml-auto"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" strokeWidth={2.5} /> : <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />}
            </button>
          </div>

          {/* Nav Row Map Navigation Iteration */}
          <nav className="p-4 space-y-2 flex flex-col w-full">
            {menuItemsList.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabTransition(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 border-2 transition-all text-left text-xs font-black uppercase tracking-wider ${
                    isSelected 
                      ? 'bg-[#000000] border-[#000000] text-[#FFFFFF]' 
                      : 'bg-transparent border-transparent text-[#000000] hover:border-black'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Profile Node summary identity footer parameters card */}
        {!sidebarCollapsed && userProfile && (
          <div className="p-4 border-t-2 border-[#000000] bg-[#F9F9F9] m-4 border-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border-2 border-black bg-black text-white text-xs font-black flex items-center justify-center">
                VS
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-black truncate">{userProfile.username}</div>
                <div className="text-[9px] font-bold text-slate-400 truncate">ID: {userProfile.user_id}</div>
              </div>
            </div>
            <button 
              onClick={() => { AudioEngine.playClick(); setIsWalletOpen(true); }}
              className="w-full btn-pro-emerald py-2 text-[10px]"
            >
              Wallet Terminal
            </button>
          </div>
        )}
      </aside>

      {/* VIEWPORT CONTROLLER SURFACE RIG FRAME CHASSIS AREA */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative">
        
        {/* UNIVERSAL APPLICATION HEADER CONTENT CONTROL BAR */}
        <header className="w-full h-20 border-b-2 border-[#000000] px-6 flex items-center justify-between bg-white z-20 shrink-0">
          <div className="flex items-center gap-4">
            <span className="md:hidden text-xs font-black tracking-widest uppercase text-black">
              ANONROOM
            </span>
            <div className="hidden md:flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                Verified Cryptographic Client Application Interface Matrix
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Wallet Context State trigger node */}
            <button
              onClick={() => { AudioEngine.playClick(); setIsWalletOpen(true); }}
              className="px-4 py-2 border-2 border-black text-xs font-black bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              {userProfile?.ar_balance?.toFixed(2)} AR
            </button>

            {/* Notification bell anchor frame wrapper */}
            <button 
              onClick={() => handleTabTransition('profile')}
              className="p-2 border-2 border-black bg-white relative hover:bg-slate-50 transition-colors"
            >
              <Bell className="w-4 h-4 text-black" strokeWidth={2.5} />
              {notificationCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#10B981] border-2 border-black text-[8px] font-black flex items-center justify-center rounded-none">
                  {notificationCount}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* SCREEN MODULE INJECTION CHASSIS AREA VIEWPORT */}
        <main className="w-full h-full flex-1 overflow-hidden relative bg-[#FFFFFF]">
          <div 
            key={activeTab}
            className="w-full h-full overflow-y-auto custom-scrollbar p-6 pb-32 animate-tab-switch"
          >
            {activeTab === 'home' && <HomeView onTabChange={handleTabTransition} />}
            {activeTab === 'raffle' && <RaffleView />}
            {activeTab === 'tickets' && <MyTicketsView onTabChange={handleTabTransition} />}
            {activeTab === 'profile' && <ProfileView userProfile={userProfile} onOpenWallet={() => setIsWalletOpen(true)} />}
          </div>
        </main>

        {/* 📱 MOBILE NAVIGATION BOTTOM BANNER RAIL (AUTO-COLLAPSES ON PC DISPLAYS VIA IN-LINE CSS QUERIES) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-black flex items-center justify-around z-30 pb-safe">
          {menuItemsList.map((item) => {
            const IconComponent = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabTransition(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full text-center transition-all ${
                  isCurrent ? 'text-[#10B981] font-black scale-105' : 'text-slate-400 font-bold'
                }`}
              >
                <IconComponent className="w-5 h-5" strokeWidth={isCurrent ? 3 : 2} />
                <span className="text-[8px] uppercase tracking-wider font-mono">{item.id}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* CORE SECURE BALANCES INJECTION BOX MODAL DRAWER OVERLAY */}
      <WalletModal 
        isOpen={isWalletOpen}
        onClose={() => { setIsWalletOpen(false); reloadProfileContext(); }}
        userProfile={userProfile}
        onBalanceUpdate={reloadProfileContext}
      />

    </div>
  );
}
