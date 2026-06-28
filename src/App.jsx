import React, { useState, useEffect } from 'react';
import { Home, Ticket, Layers, User, Wallet, Sparkles, X, Activity } from 'lucide-react';
import { MockAPI } from './services/MockApi.js';
import { AudioEngine } from './services/AudioEngine.js';

// Import our views directly to link up with the active tab matrix
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
  const [globalNotification, setGlobalNotification] = useState(null);

  // Synchronize internal system balance states across child views
  const reloadProfileContext = async () => {
    try {
      const profile = await MockAPI.getProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to re-fetch runtime profile variables: ", err);
    }
  };

  useEffect(() => {
    async function loadInitialContext() {
      try {
        // Enforce a deliberate 2.5-second buffer to display our Uiverse pulse dots animation
        await new Promise((resolve) => setTimeout(resolve, 2500));
        const profile = await MockAPI.getProfile();
        setUserProfile(profile);
        
        // Trigger a welcome pop-up state notification badge
        setGlobalNotification({
          id: 'notif-welcome',
          title: 'System Node Initialized!',
          message: 'Welcome back to the cartoon canvas sandbox environment.'
        });
      } catch (err) {
        console.error("Initial block load fault exception: ", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialContext();
  }, []);

  const handleTabTransition = (tabId) => {
    AudioEngine.playClick();
    setActiveTab(tabId);
  };

  const clearNotification = () => {
    AudioEngine.playClick();
    setGlobalNotification(null);
  };

  // Uiverse: Adamgiebl Pulse Loading Overhaul configured with 5 large bouncing dots
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F7F5] select-none">
        <div className="space-y-6 text-center">
          <section className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </section>
          <h2 className="text-xl font-black text-[#1A1D20] uppercase tracking-wider mt-4">
            Compiling Canvas Nodes...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F4F7F5] text-[#1A1D20] relative overflow-hidden select-none border-[6px] border-[#1A1D20]">
      
      {/* 1. MASTER HEADER CONSOLE (CHUNKY CARTOON DESIGN) */}
      <header className="w-full h-20 px-6 flex items-center justify-between bg-[#FFFFFF] border-b-4 border-[#1A1D20] relative z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF275] border-4 border-[#1A1D20] flex items-center justify-center shadow-[3px_3px_0px_#1A1D20]">
            <Sparkles className="w-5 h-5 text-[#1A1D20]" strokeWidth={2.5} />
          </div>
          <span className="text-xl tracking-[0.15em] font-black uppercase text-[#1A1D20]">
            ANONROOM
          </span>
        </div>

        {/* 3D Wallet Interactive Trigger Node Block */}
        <button 
          onClick={() => { AudioEngine.playClick(); setIsWalletOpen(true); }}
          className="btn-cartoon-green py-2 px-4 text-xs font-black flex items-center gap-2 transform active:scale-95 transition-transform"
        >
          <Wallet className="w-4 h-4" strokeWidth={2.5} />
          <span>{userProfile?.ar_balance?.toFixed(2)} AR</span>
        </button>
      </header>

      {/* 2. DYNAMIC BROADCAST NOTIFICATION DRAWER CHIP */}
      {globalNotification && (
        <div className="w-full px-4 pt-4 absolute top-20 left-0 right-0 z-50 animate-bounce">
          <div className="w-full bg-[#FF6B6B] border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[5px_5px_0px_#1A1D20] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border-2 border-[#1A1D20] flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-[#FF6B6B]" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black uppercase tracking-wide text-white truncate">
                  {globalNotification.title}
                </h4>
                <p className="text-[11px] font-bold text-[#1A1D20] truncate">
                  {globalNotification.message}
                </p>
              </div>
            </div>
            <button 
              onClick={clearNotification}
              className="w-7 h-7 rounded-full bg-white border-2 border-[#1A1D20] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A1D20] active:translate-y-0.5 active:shadow-[0px_0px_#1A1D20]"
            >
              <X className="w-4 h-4 text-[#1A1D20]" strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* 3. CORE DISPLAY MATRIX SLIDER PANEL */}
      <main className="w-full h-full flex-1 overflow-hidden relative bg-[#F4F7F5]">
        <div 
          key={activeTab} 
          className="w-full h-full overflow-y-auto custom-scrollbar p-5 pb-32 animate-view-jump"
        >
          {activeTab === 'home' && (
            <HomeView onTabChange={handleTabTransition} />
          )}
          {activeTab === 'raffle' && (
            <RaffleView />
          )}
          {activeTab === 'tickets' && (
            <MyTicketsView onTabChange={handleTabTransition} />
          )}
          {activeTab === 'profile' && (
            <ProfileView 
              userProfile={userProfile} 
              onOpenWallet={() => { AudioEngine.playClick(); setIsWalletOpen(true); }} 
            />
          )}
        </div>
      </main>

            {/* 4. FLOATING TAB DECK SYSTEM PANEL (UIVERSE: YELLOW RATTLESNAKE 26) */}
      <div className="w-full absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-transparent pointer-events-none z-40">
        <nav className="nav-container pointer-events-auto bg-white border-4 border-[#1A1D20] shadow-[6px_6px_0px_#1A1D20] h-20 rounded-3xl w-[92%] max-w-md flex items-center justify-between px-6">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'raffle', label: 'Pools', icon: Layers },
            { id: 'tickets', label: 'Stakes', icon: Ticket },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
  key={tab.id}
  onClick={() => handleTabTransition(tab.id)}
  className={`nav-btn flex flex-col items-center justify-center gap-1 transition-all ${
    isSelected 
      ? 'text-[#9D4EDD] scale-110 -translate-y-2' 
      : 'text-[#1A1D20]/50 hover:text-[#1A1D20]'
  }`}
>

                <div className={`p-1.5 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'bg-[#FFF275] border-[#1A1D20] shadow-[3px_3px_0px_#1A1D20]' 
                    : 'bg-transparent border-transparent'
                }`}>
                  <IconComponent className="w-5 h-5" strokeWidth={3} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 5. MODAL SYSTEM TERMINAL DRAWER OVERLAY */}
      <WalletModal 
        isOpen={isWalletOpen} 
        onClose={() => {
          setIsWalletOpen(false);
          reloadProfileContext();
        }}
        userProfile={userProfile}
        onBalanceUpdate={reloadProfileContext}
      />

    </div>
  );
}
