import React, { useState, useEffect, useRef } from 'react';
import { 
  Ticket, 
  Gift, 
  ChevronRight, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  Sparkles,
  Users,
  Star,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AudioEngine } from '../services/AudioEngine.js';
import { SupabaseService } from '../services/SupabaseService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function HomeView({ onTabChange, onSelectRaffle, onDeepLink, userProfile }) {

// ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [ticketCount, setTicketCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [liveRaffles, setLiveRaffles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile: authUserProfile } = useAuth();
  const activeUserProfile = userProfile || authUserProfile;

  // Carousel & Touch States
  const [activeBanner, setActiveBanner] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchOffset, setTouchOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const carouselRef = useRef(null);

  // ---------------------------------------------------------------------------
  // RICH MOCK DATA CONTENT
  // ---------------------------------------------------------------------------
  
  // Clean, modern promotional banners
  const promoBanners = [
    { 
      id: 1,
      tag: "NEW RAFFLE LIVE",
      title: "Win the new iPhone 15 Pro Max", 
      subtitle: "Tickets are just 1 AR each. Only 500 tickets total!",
      actionText: "Join Now",
      bgGradient: "from-blue-600 to-indigo-700",
      icon: <Sparkles className="w-12 h-12 text-white/20 absolute -right-2 -bottom-2" />
    },
    { 
      id: 2,
      tag: "EARN FREE POINTS",
      title: "Complete Tasks for Free Tickets", 
      subtitle: "Download our partner apps or invite friends to earn free AR points.",
      actionText: "Go to Tasks",
      bgGradient: "from-emerald-500 to-teal-600",
      icon: <Star className="w-12 h-12 text-white/20 absolute -right-2 -bottom-2" />
    },
    { 
      id: 3,
      tag: "REWARD CENTER",
      title: "Claim your 50 USDT Rebate", 
      subtitle: "Check your rewards center for newly unlocked trading fee coupons.",
      actionText: "View Rewards",
      bgGradient: "from-purple-500 to-fuchsia-600",
      icon: <Gift className="w-12 h-12 text-white/20 absolute -right-2 -bottom-2" />
    }
  ];

  // Friendly community activity feed
  const recentActivity = [
    { id: 1, user: "Rahul K.", action: "bought 5 tickets", target: "iPhone 15 Pro", time: "Just now", color: "bg-blue-100 text-blue-600" },
    { id: 2, user: "Priya S.", action: "won the raffle", target: "Amazon Gift Card", time: "5 mins ago", color: "bg-emerald-100 text-emerald-600" },
    { id: 3, user: "Aman G.", action: "completed a task", target: "+50 Points", time: "12 mins ago", color: "bg-amber-100 text-amber-600" },
    { id: 4, user: "Vaibhav S.", action: "bought 1 ticket", target: "Iron Man Figure", time: "1 hour ago", color: "bg-blue-100 text-blue-600" },
    { id: 5, user: "Neha M.", action: "invited a friend", target: "+20 Points", time: "2 hours ago", color: "bg-purple-100 text-purple-600" }
  ];

  // ---------------------------------------------------------------------------
  // INITIALIZATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function fetchHomeData() {
      try {
        if (!activeUserProfile?.id) {
          if (isMounted) {
            setTicketCount(0);
            setLiveRaffles([]);
            setIsLoading(false);
          }
          return;
        }

        const { ticketCount: fetchedTicketCount, couponCount: fetchedCouponCount, liveRaffles: fetchedLiveRaffles } =
          await SupabaseService.getHomeStats(activeUserProfile.id);

        if (isMounted) {
          setTicketCount(fetchedTicketCount || 0);
          setCouponCount(fetchedCouponCount || 0);
          setLiveRaffles(
            (fetchedLiveRaffles || []).map((raffle) => ({
              ...raffle,
              title: raffle.name || raffle.title || 'Untitled raffle',
              image: raffle.image_url || raffle.image || '',
              image_url: raffle.image_url || raffle.image || '',
              tickets_sold: raffle.sold_tickets ?? raffle.tickets_sold ?? 0,
              total_tickets: raffle.total_tickets ?? raffle.max_tickets ?? 0,
              ticket_price: raffle.ticket_price ?? raffle.price_per_ticket ?? 1,
            }))
          );
        }
      } catch (err) {
        console.error('Error loading home dashboard:', err);
        if (isMounted) {
          setTicketCount(0);
          setLiveRaffles([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHomeData();

    // Auto-advance banner every 5 seconds
    const interval = setInterval(() => {
      setActiveBanner((current) => (current + 1) % promoBanners.length);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeUserProfile?.id, promoBanners.length]);

  // ---------------------------------------------------------------------------
  // TOUCH GESTURE LOGIC FOR CAROUSEL
  // ---------------------------------------------------------------------------
  const onTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setTouchOffset(0);
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - touchStart;
    setTouchOffset(Math.min(Math.max(diff, -100), 100)); // Cap the drag visual
  };

  const onTouchEnd = () => {
    if (!isSwiping) return;
    if (touchOffset < -40) {
      // Swiped Left
      AudioEngine.playClick();
      setActiveBanner((prev) => (prev + 1) % promoBanners.length);
    } else if (touchOffset > 40) {
      // Swiped Right
      AudioEngine.playClick();
      setActiveBanner((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
    }
    setTouchStart(0);
    setTouchOffset(0);
    setIsSwiping(false);
  };

  const handleBannerClick = (bannerId) => {
    AudioEngine.playClick();
    if (bannerId === 1) onTabChange('raffle');
    if (bannerId === 2) onDeepLink('tasks');
    if (bannerId === 3) onDeepLink('rewards');
  };

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="w-full h-48 bg-slate-200 rounded-[1.5rem]"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
          <div className="h-28 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
          <div className="flex gap-4 overflow-hidden">
            <div className="min-w-[220px] h-48 bg-slate-200 rounded-2xl"></div>
            <div className="min-w-[220px] h-48 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-8">
      
      {/* 1. INTERACTIVE PROMOTIONAL CAROUSEL */}
      <div className="relative w-full rounded-[1.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(calc(-${activeBanner * 100}% + ${touchOffset}px))`,
            cursor: isSwiping ? 'grabbing' : 'grab'
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={(e) => {
            setTouchStart(e.clientX);
            setIsSwiping(true);
          }}
          onMouseMove={(e) => {
            if (isSwiping) {
              const diff = e.clientX - touchStart;
              setTouchOffset(Math.min(Math.max(diff, -100), 100));
            }
          }}
          onMouseUp={onTouchEnd}
          onMouseLeave={() => {
            if (isSwiping) onTouchEnd();
          }}
        >
          {promoBanners.map((banner) => (
            <div 
              key={banner.id}
              className={`w-full shrink-0 h-48 sm:h-56 bg-gradient-to-br ${banner.bgGradient} p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white`}
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
              {banner.icon}

              <div className="relative z-10 space-y-1.5 max-w-[80%]">
                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider mb-1">
                  {banner.tag}
                </span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">
                  {banner.title}
                </h2>
                <p className="text-sm font-medium text-white/90 drop-shadow-sm">
                  {banner.subtitle}
                </p>
              </div>

              <div className="relative z-10 mt-auto">
                <button 
                  onClick={() => handleBannerClick(banner.id)}
                  className="bg-white text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  {banner.actionText} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {promoBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { AudioEngine.playClick(); setActiveBanner(idx); }}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeBanner === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. QUICK STATS SUMMARY WIDGETS */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Stat Card 1: My Tickets */}
        <div 
          onClick={() => { AudioEngine.playClick(); onTabChange('tickets'); }}
          className="card-hoverable p-5 flex flex-col justify-between h-[120px] group"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{ticketCount}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Tickets</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Active in draws</p>
          </div>
        </div>

        {/* Stat Card 2: Reward Points */}
        <div 
          onClick={() => { AudioEngine.playClick(); onDeepLink('rewards'); }}
          className="card-hoverable p-5 flex flex-col justify-between h-[120px] group"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-slate-900">{couponCount}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reward Points</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Available to spend</p>
          </div>
        </div>

      </div>

      {/* 3. LIVE RAFFLES HORIZONTAL SCROLLER */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Live Raffles</h2>
          </div>
          <button 
            onClick={() => { AudioEngine.playClick(); onTabChange('raffle'); }}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="w-full flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
          {liveRaffles.map((raffle) => {
            const soldTickets = raffle.sold_tickets ?? raffle.tickets_sold ?? 0;
            const totalTickets = raffle.total_tickets ?? 1;
            const percentSold = Math.round((soldTickets / totalTickets) * 100);
            const ticketPrice = raffle.ticket_price ?? 1;
            
            return (
              <div 
                key={raffle.id}
                className="min-w-[240px] w-[240px] bg-white border border-slate-100 rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] snap-start shrink-0 flex flex-col group cursor-pointer transition-all hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)]"
                onClick={() => onSelectRaffle(raffle.id)}
              >
                {/* Image Header Area */}
                <div className="w-full h-32 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={raffle.image_url || raffle.image || ''} 
                    alt={raffle.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {ticketPrice} AR / Ticket
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight mb-3 line-clamp-2">
                    {raffle.title}
                  </h3>
                  
                  <div className="mt-auto space-y-2.5">
                    {/* Standard Modern Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>{soldTickets} Sold</span>
                        <span>{totalTickets} Total</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentSold}%` }} 
                        />
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectRaffle(raffle.id); }}
                      className="w-full btn-secondary py-2 text-xs"
                    >
                      Join Raffle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* ====================================================================
    GOLDEN REFERRAL BANNER (HOME SCREEN)
    ==================================================================== */}
<div 
  onClick={() => {
    if (window.AudioEngine) window.AudioEngine.playClick();
    
    // THIS IS THE FIX: Use the deep link function
    if (onDeepLink) {
        onDeepLink('referrals');
    } else {
        // Fallback in case onDeepLink is missing
        console.error("onDeepLink prop is missing!");
    }
  }}
  className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 cursor-pointer group shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all duration-300 mt-6 border border-yellow-300" 
>

  {/* Premium Texture Overlay */}
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
  
  {/* Subtle Shimmer Effect on Hover */}
  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"></div>
  
  <div className="p-4 sm:p-5 flex items-center justify-between relative z-10">
    <div className="flex items-center gap-4">
      {/* Icon Block */}
      <div className="w-12 h-12 bg-amber-900/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-900/10 shrink-0">
        <Users className="w-6 h-6 text-amber-950" />
      </div>
      
      {/* Text Info */}
      <div>
        <h3 className="text-lg font-black text-amber-950 leading-tight">
          Refer & Earn 10%
        </h3>
        <p className="text-xs sm:text-sm font-bold text-amber-900/80 mt-0.5">
          Get a 10% commission on your friends' deposits.
        </p>
      </div>
    </div>
    
    {/* Action Arrow */}
    <div className="w-10 h-10 bg-amber-950 text-yellow-400 rounded-full flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
      <ArrowRight className="w-5 h-5" />
    </div>
  </div>
</div>

      {/* 4. "WAYS TO EARN" QUICK LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => { AudioEngine.playClick(); onDeepLink('tasks'); }} 
          className="card-hoverable p-5 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Complete Tasks</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Earn points daily</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-400" />
        </div>

        
      </div>
     

      {/* 5. RECENT COMMUNITY ACTIVITY FEED */}
      <div className="card-standard bg-white">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <Activity className="w-5 h-5 text-slate-400" />
          <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-auto" />
        </div>
        
        <div className="p-2">
          {recentActivity.map((activity, index) => (
            <div 
              key={activity.id}
              className={`p-3 flex items-center gap-4 hover:bg-slate-50 rounded-xl transition-colors ${
                index !== recentActivity.length - 1 ? 'border-b border-slate-50/50' : ''
              }`}
            >
              {/* User Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${activity.color}`}>
                {activity.user.charAt(0)}
              </div>
              
              {/* Activity Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium truncate">
                  <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-bold text-slate-700">{activity.target}</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer Link */}
        <button className="w-full p-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100">
          View All Activity
        </button>
      </div>

    </div>
  );
}
