import React, { useState, useEffect, useRef } from 'react';
// Add this to your imports at the top:
import BrandLogo from './components/BrandLogo.jsx';

import { 
  Home, 
  Ticket, 
  User, 
  Bell, 
  Wallet, 
  LayoutGrid, 
  LogOut,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Gift,
  Users
} from 'lucide-react';
import { MockAPI } from './services/MockApi.js';
import { AudioEngine } from './services/AudioEngine.js';
import { SupabaseService } from './services/SupabaseService.js';

// Import Views
import HomeView from './views/HomeView.jsx';
import RaffleView from './views/RaffleView.jsx';
import MyTicketsView from './views/MyTicketView.jsx';
import RedeemView from './views/ReedemView.jsx';
import ProfileView from './views/ProfileView.jsx';
import LandingView from './views/LandingView.jsx';
import WalletModal from './components/WalletModal.jsx';

export default function App() {
  // ---------------------------------------------------------
  // GLOBAL STATE MANAGEMENT
  // ---------------------------------------------------------
  const [activeTab, setActiveTab] = useState('home');
  const [profileSubPage, setProfileSubPage] = useState('menu');
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Modals & Trays
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isNotificationTrayOpen, setIsNotificationTrayOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Router specific states (Deep linking into specific raffles)
  const [selectedRaffleId, setSelectedRaffleId] = useState(null);

  // Notification State
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'success',
      title: "Task Approved", 
      message: "Your screenshot proof for the Partner App task was verified successfully. 50 points have been added to your account.", 
      time: "10 mins ago",
      isExpanded: false,
      isRead: false
    },
    { 
      id: 2, 
      type: 'info',
      title: "New Raffle Live", 
      message: "The iPhone 15 Pro Max raffle is now live! Tickets are available for 1 AR each. Don't miss your chance.", 
      time: "2 hours ago",
      isExpanded: false,
      isRead: false
    },
    {
      id: 3,
      type: 'alert',
      title: "KYC Verification Reminder",
      message: "Please complete your identity verification to unlock higher withdrawal limits and premium tasks.",
      time: "1 day ago",
      isExpanded: false,
      isRead: false
    }
  ]);

  const notificationRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastMsg('');
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // ---------------------------------------------------------
  // INITIALIZATION & DATA FETCHING
  // ---------------------------------------------------------
  const reloadUserData = async () => {
    try {
      const data = await MockAPI.getProfile();
      setUserProfile(data);
    } catch (err) {
      console.error("Failed to load user profile:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await SupabaseService.getSession();

        if (session?.user?.id) {
          const profile = await SupabaseService.getUserProfile(session.user.id);
          setUserProfile(profile);
          setIsAuthenticated(true);
        } else {
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session initialization failed:', err);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    const { data: authListener } = SupabaseService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserProfile(null);
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' && session?.user?.id) {
        try {
          const profile = await SupabaseService.getUserProfile(session.user.id);
          setUserProfile(profile);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to load profile after sign in:', err);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      }
    });

    // Close notification tray when clicking outside
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationTrayOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------
  // NAVIGATION & ROUTING HANDLERS
  // ---------------------------------------------------------
  const navigateToSpecificRaffle = (raffleId) => {
    AudioEngine.playClick();
    setSelectedRaffleId(raffleId);
    setActiveTab('raffle');
    setIsMobileMenuOpen(false);
    setIsNotificationTrayOpen(false);
  };

  const handleOpenWallet = () => {
    // Add your logic to open the wallet modal or page here
    console.log("Opening Wallet...");
    // Example: setActiveTab('wallet');
  };

  const handleLogout = async () => {
    AudioEngine.playClick();

    try {
      await SupabaseService.signOut();
      showToast('Successfully signed out');
      setUserProfile(null);
      setIsAuthenticated(false);
      setActiveTab('home');
      setProfileSubPage('menu');
      setSelectedRaffleId(null);
      setIsMobileMenuOpen(false);
      setIsNotificationTrayOpen(false);
      setIsWalletOpen(false);
    } catch (error) {
      console.error('Sign out failed:', error);
      showToast('Unable to sign out right now. Please try again.');
    }
  };

  const navigateTo = (tabId) => {
    AudioEngine.playClick();
    setSelectedRaffleId(null);

    const profileSubPages = ['menu', 'tasks', 'rewards', 'winnings', 'shipments', 'referrals', 'notifications', 'faqs', 'kyc'];
    if (profileSubPages.includes(tabId)) {
      setActiveTab('profile');
      setProfileSubPage(tabId === 'menu' ? 'menu' : tabId);
    } else {
      setActiveTab(tabId);
    }

    setIsMobileMenuOpen(false);
    setIsNotificationTrayOpen(false);
  };

  const handleProfileDeepLink = (targetPage) => {
    setProfileSubPage(targetPage);
    setActiveTab('profile'); // NOTE: If your app uses a different word to change tabs (like setCurrentTab), change this word to match!
  };

  const handleMobileProfileRoute = (targetPage = 'menu') => {
    handleProfileDeepLink(targetPage);
    setIsMobileMenuOpen(false);
    setIsNotificationTrayOpen(false);
  };

  const handleRaffleClick = (raffleId = null) => {
    AudioEngine.playClick();
    setSelectedRaffleId(raffleId);
    setActiveTab('raffle');
    setIsMobileMenuOpen(false);
    setIsNotificationTrayOpen(false);
  };

  // ---------------------------------------------------------
  // NOTIFICATION HANDLERS
  // ---------------------------------------------------------
  const toggleNotification = (id) => {
    AudioEngine.playClick();
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) {
        // Mark as read when expanded
        if (!notif.isRead && !notif.isExpanded) {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
        return { ...notif, isExpanded: !notif.isExpanded, isRead: true };
      }
      return notif;
    }));
  };

  const markAllAsRead = () => {
    AudioEngine.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, isExpanded: false })));
    setUnreadCount(0);
  };

  const safeActiveTab = activeTab || 'home';
  const safeUserProfile = userProfile || {};
  const safeInitialPage = profileSubPage || 'menu';

  // Define Core Navigation Links
  const navigationLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'raffle', label: 'Raffles', icon: LayoutGrid },
    { id: 'tickets', label: 'My Tickets', icon: Ticket },
    { id: 'redeem', label: 'Redeem', icon: Gift },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl animate-fade-in font-medium">
          {toastMsg}
        </div>
      )}

      {isAuthenticated ? (
        <div className="w-full h-full flex bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* =========================================================
          DESKTOP SIDEBAR
          ========================================================= */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r border-slate-200 h-full z-20 shrink-0">
        
        {/* Logo & Brand */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            
            {/* Beautiful SVG Logo on Sidebar */}
            <BrandLogo className="w-10 h-10 shadow-md shadow-blue-600/20 rounded-2xl" />
            
            <span className="text-xl font-bold tracking-tight text-slate-900">AnonRoom</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-8">
          <nav className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Main Menu</p>
            {navigationLinks.map((nav) => {
              const Icon = nav.icon;
              const isActive = safeActiveTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => navigateTo(nav.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {nav.label}
                </button>
              );
            })}
          </nav>

              

          {/* Secondary Links */}
          <nav className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Quick Links</p>
            <button onClick={() => navigateTo('profile')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Settings className="w-4 h-4" /> Account Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
              <HelpCircle className="w-4 h-4" /> Help & Support
            </button>
          </nav>
        </div>

        {/* User Mini Profile Footer */}
        <div className="p-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all" onClick={() => navigateTo('profile')}>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold shrink-0">
              VS
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{userProfile?.username || 'User'}</p>
              <p className="text-xs text-slate-500 font-medium truncate">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN APPLICATION VIEWPORT
          ========================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* -----------------------------------------------------
            TOP HEADER NAVIGATION BAR
            ----------------------------------------------------- */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between z-30 shrink-0 shadow-sm relative">
          
              {/* Mobile Left Side: Menu + Logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          {/* Added shrink-0 and drop-shadow here instead of inside the SVG */}
          <BrandLogo className="w-8 h-8 rounded-xl shrink-0 drop-shadow-md" />
          <span className="text-lg font-bold tracking-tight text-slate-900 truncate">AnonRoom</span>
        </div>
      </div>




          {/* Desktop Left Side: Page Title / Breadcrumbs */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-semibold">
            <span className="text-slate-400">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900 capitalize">
              {safeActiveTab === 'raffle' ? 'Raffles' : safeActiveTab === 'redeem' ? 'Redeem' : String(safeActiveTab).replace('mytickets', 'My Tickets')}
            </span>
          </div>

          {/* Right Side: Wallet & Notifications */}
          <div className="flex items-center gap-2 lg:gap-4">
            
            {/* Standard Wallet Button */}
            <button
              onClick={() => { AudioEngine.playClick(); setIsWalletOpen(true); }}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            >
              <Wallet className="w-4 h-4 text-slate-500" />
              <span className="font-mono">{userProfile?.ar_balance?.toFixed(2) || '0.00'} AR</span>
            </button>

            {/* Notification Bell Wrapper */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => { AudioEngine.playClick(); setIsNotificationTrayOpen(!isNotificationTrayOpen); }}
                className={`p-2.5 rounded-xl transition-all border relative ${
                  isNotificationTrayOpen 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>

              {/* -----------------------------------------------------
                  NOTIFICATION TRAY (Click to Expand logic built-in)
                  ----------------------------------------------------- */}
              {isNotificationTrayOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden animate-slide-up z-50">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm font-medium">
                        You have no new notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`border-b border-slate-100 last:border-0 transition-colors ${notif.isRead ? 'bg-white' : 'bg-blue-50/30'}`}
                        >
                          <div 
                            onClick={() => toggleNotification(notif.id)}
                            className="p-4 flex gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <div className="shrink-0 mt-0.5">
                              {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              {notif.type === 'info' && <Bell className="w-5 h-5 text-blue-500" />}
                              {notif.type === 'alert' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-sm font-bold truncate ${notif.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                  {notif.title}
                                </h4>
                                <span className="text-[10px] font-medium text-slate-400 shrink-0 ml-2">{notif.time}</span>
                              </div>
                              
                              {/* Standard text preview if closed */}
                              {!notif.isExpanded && (
                                <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                              )}

                              {/* Expanded full message */}
                              {notif.isExpanded && (
                                <div className="mt-2 text-xs text-slate-600 leading-relaxed animate-fade-in bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  {notif.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* -----------------------------------------------------
            MAIN CONTENT AREA INJECTION (SCROLLABLE)
            ----------------------------------------------------- */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-slate-50">
          <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 lg:pb-12 animate-fade-in min-h-full">
            {safeActiveTab === 'home' && (
  <HomeView 
    userProfile={safeUserProfile}
    onDeepLink={(target) => {
      if (typeof handleProfileDeepLink === 'function') {
        handleProfileDeepLink(target);
      } else {
        setProfileSubPage(target || 'menu');
        setActiveTab('profile');
      }
    }}
    onTabChange={(tab) => {
      if (typeof setActiveTab === 'function') {
        setActiveTab(tab || 'home');
      }
    }}
    onSelectRaffle={(raffleId) => {
      if (typeof handleRaffleClick === 'function') {
        handleRaffleClick(raffleId);
      } else if (typeof navigateToSpecificRaffle === 'function') {
        navigateToSpecificRaffle(raffleId);
      }
    }}
  />
)}


            {safeActiveTab === 'raffle' && (
              <RaffleView 
                targetRaffleId={selectedRaffleId} 
                clearTarget={() => setSelectedRaffleId(null)} 
              />
            )}
           {safeActiveTab === 'tickets' && (
  <MyTicketsView 
    onTabChange={(tab) => {
      if (typeof navigateTo === 'function') {
        navigateTo(tab);
      }
    }}
    onSelectRaffle={(raffleId) => {
      if (typeof navigateToSpecificRaffle === 'function') {
        navigateToSpecificRaffle(raffleId);
      }
    }}
  />
)}

           {safeActiveTab === 'redeem' && (
  <RedeemView 
    userProfile={safeUserProfile}
    navigateTo={(target) => navigateTo(target)}
  />
)}

           {safeActiveTab === 'profile' && (
  <ProfileView 
    userProfile={safeUserProfile} 
    onOpenWallet={() => {
      if (typeof handleOpenWallet === 'function') {
        handleOpenWallet();
      }
    }}
    onSignOut={handleLogout}
    initialPage={safeInitialPage} 
  />
)}

            
          </div>
        </main>

        {/* -----------------------------------------------------
            MOBILE BOTTOM NAVIGATION BAR (Hidden on Desktop)
            ----------------------------------------------------- */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-xl border-t border-slate-200 flex items-center justify-around pb-safe z-40 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {navigationLinks.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = safeActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className="flex flex-col items-center justify-center w-full h-full relative group"
              >
                <div className={`flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive ? '-translate-y-1' : ''
                }`}>
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-blue-100 text-blue-600' : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                  }`}>
                    <IconComponent className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${
                    isActive ? 'text-blue-600 opacity-100' : 'text-slate-500 opacity-80 group-hover:opacity-100'
                  }`}>
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* -----------------------------------------------------
            MOBILE FULL-SCREEN SLIDE MENU (Drawer)
            ----------------------------------------------------- */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Panel */}
            <div className="relative w-[280px] max-w-[80%] h-full bg-white shadow-2xl animate-slide-in-left flex flex-col">
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                <span className="text-lg font-bold text-slate-900">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 text-slate-600 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    VS
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{userProfile?.username}</h3>
                    <p className="text-xs font-medium text-slate-500">ID: {userProfile?.user_id}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <button onClick={() => handleMobileProfileRoute('menu')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <User className="w-5 h-5 text-slate-400" /> Profile Home
                  </button>
                  <button onClick={() => handleMobileProfileRoute('tasks')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-slate-400" /> Complete Tasks
                  </button>
                  <button onClick={() => handleMobileProfileRoute('rewards')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <Gift className="w-5 h-5 text-slate-400" /> Rewards Center
                  </button>
                  <button onClick={() => handleMobileProfileRoute('referrals')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <Users className="w-5 h-5 text-slate-400" /> Referral Hub
                  </button>
                  <button onClick={() => handleMobileProfileRoute('notifications')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <Bell className="w-5 h-5 text-slate-400" /> Notifications
                  </button>
                  <button onClick={() => handleMobileProfileRoute('faqs')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <HelpCircle className="w-5 h-5 text-slate-400" /> Help & FAQ
                  </button>
                  <button onClick={() => handleMobileProfileRoute('kyc')} className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-700 transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" /> KYC & Verification
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl font-semibold text-red-600 transition-colors mt-8"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =========================================================
          GLOBAL MODALS INJECTION
          ========================================================= */}
      <WalletModal 
        isOpen={isWalletOpen}
        onClose={() => { setIsWalletOpen(false); reloadUserData(); }}
        userProfile={userProfile}
        onBalanceUpdate={reloadUserData}
      />

        </div>
      ) : (
        <LandingView
          onAuthenticate={(userData) => {
            setUserProfile(userData);
            setIsAuthenticated(true);
            setActiveTab('home');
          }}
        />
      )}
    </>
  );
}
