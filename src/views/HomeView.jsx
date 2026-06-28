import React, { useState, useEffect } from 'react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';
import { 
  Zap, 
  Ticket, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  Gift, 
  TrendingUp, 
  Users, 
  Trophy, 
  Activity, 
  Star, 
  Layers,
  Check
} from 'lucide-react';

export default function HomeView({ onTabChange }) {
  const [raffles, setRaffles] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [liveVolume, setLiveVolume] = useState(298450);
  const [tickerTimer, setTickerTimer] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [quickStakeAmount, setQuickStakeAmount] = useState('10');

  // Hardcoded structure modeling 5 ultra-appealing hero slider banners with custom cartoon styles
  const mockBanners = [
    { 
      id: 1, 
      tag: 'EPIC DROP', 
      title: 'Iron Man & Avengers Legendary Drops Pool Open!', 
      desc: 'Secure entries for exclusive premium physical custom thematic models and digital collections.', 
      hasLink: true,
      color: '#9D4EDD',
      textColor: '#FFFFFF',
      badgeColor: '#FFF275'
    },
    { 
      id: 2, 
      tag: 'FLAT PRICING', 
      title: 'Luxury Tech Drop Pool Matrix Active', 
      desc: 'Every single entry across the sandbox terminal costs exactly 1 AR token.', 
      hasLink: false,
      color: '#00F5D4',
      textColor: '#1A1D20',
      badgeColor: '#FFFFFF'
    },
    { 
      id: 3, 
      tag: 'WHITELIST', 
      title: 'NFT Fractional Vault Architecture Verified', 
      desc: 'Join the on-chain verification event to track live pool probability changes.', 
      hasLink: true,
      color: '#FF6B6B',
      textColor: '#FFFFFF',
      badgeColor: '#1A1D20'
    },
    { 
      id: 4, 
      tag: 'DAILY BOUNTY', 
      title: 'Bonus Task Board Multipliers Running', 
      desc: 'Complete high-contrast social tasks to gather free AR multiplier points immediately.', 
      hasLink: false,
      color: '#FF9F1C',
      textColor: '#1A1D20',
      badgeColor: '#FFFFFF'
    },
    { 
      id: 5, 
      tag: 'AUDIT PASS', 
      title: '100% On-Chain Structural Ledger Verification', 
      desc: 'No middleman tracking layer. Open access cryptographic execution loops.', 
      hasLink: true,
      color: '#4EA8DE',
      textColor: '#FFFFFF',
      badgeColor: '#FFF275'
    }
  ];

  const recentActivities = [
    { id: 1, user: 'node_user_882', action: 'allocated 45 tickets', time: '2m ago', pool: 'Cyberpunk Setup Drop' },
    { id: 2, user: 'alpha_vaibhav', action: 'claimed voucher activation', time: '5m ago', pool: 'Spot Reward Vault' },
    { id: 3, user: 'matrix_whale', action: 'joined premium drawing', time: '12m ago', pool: 'Fractional BTC Vault' },
    { id: 4, user: 'crypto_class11', action: 'allocated 12 tickets', time: '14m ago', pool: 'Avengers Battlefield Special' },
    { id: 5, user: 'anon_node_09', action: 'completed layer 2 verification', time: '18m ago', pool: 'Ecosystem Partner Task' }
  ];

  const coreMilestones = [
    { title: 'Bronze Node Alpha', requirement: 'Join 1 Active Draw Pool', prize: '10 Points', complete: true },
    { title: 'Silver Tier Collector', requirement: 'Stakes equivalent to 50 AR', prize: 'Voucher Access', complete: false },
    { title: 'Gold Canvas Whale', requirement: 'Refer 5 Secondary Accounts', prize: '0% Claim Fees', complete: false }
  ];

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const [raffleData, ticketData] = await Promise.all([
          MockAPI.getRaffles(),
          MockAPI.getUserTickets()
        ]);
        setRaffles(raffleData);
        setTickets(ticketData);
      } catch (err) {
        console.error("Home view initial context aggregation failure: ", err);
      }
    }
    loadHomeContent();

    // Infinite automated carousel scrolling loop interval set to 4 seconds
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockBanners.length);
    }, 4000);

    // Live randomized ticker volume configuration to mimic active network trading layers
    const tickerInterval = setInterval(() => {
      setLiveVolume((prev) => prev + Math.floor(Math.random() * 8) - 3);
      setTickerTimer((prev) => prev + 1);
    }, 2000);

    return () => {
      clearInterval(slideInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    AudioEngine.playClick();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
  };

  const handleQuickStakeSubmit = (e) => {
    e.preventDefault();
    AudioEngine.playClick();
    onTabChange('raffle');
  };

  const toggleFaqRow = (index) => {
    AudioEngine.playClick();
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="space-y-8 w-full">
      
      {/* SECTION 1: BLUE WOMBAT 46 CARTOON SLIDER ORIENTATION FRAME OVERHAUL */}
      <div className="w-full cartoon-plate-purple p-1 bg-[#1A1D20] relative overflow-hidden h-64 group">
        <div 
          className="w-full h-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {mockBanners.map((slide) => (
            <div 
              key={slide.id} 
              className="min-w-full h-full p-6 flex flex-col justify-between shrink-0 relative"
              style={{ backgroundColor: slide.color }}
            >
              {/* Massive Flat Background Geometry for Cartoon Depth */}
              <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 rounded-full bg-white/10 pointer-events-none transform rotate-45 border-4 border-black/10" />
              
              <div className="space-y-2 relative z-10">
                <span 
                  className="inline-block px-3 py-1 rounded-md text-[10px] font-black border-2 border-[#1A1D20] uppercase tracking-widest shadow-[2px_2px_0px_#1A1D20]"
                  style={{ backgroundColor: slide.badgeColor, color: '#1A1D20' }}
                >
                  {slide.tag}
                </span>
                <h1 
                  className="text-xl md:text-2xl font-black leading-tight tracking-wide border-b-2 border-black/10 pb-2"
                  style={{ color: slide.textColor }}
                >
                  {slide.title}
                </h1>
                <p className="text-xs font-bold leading-relaxed max-w-[90%] opacity-90" style={{ color: slide.textColor }}>
                  {slide.desc}
                </p>
              </div>

              {/* Conditional 3D Action Push Trigger Hook */}
              <div className="relative z-10 flex items-center justify-between">
                {slide.hasLink ? (
                  <button 
                    onClick={() => onTabChange('raffle')}
                    className="btn-cartoon-secondary scale-110 origin-left"
                  >
                    Enter Drawing Arena
                  </button>
                ) : (
                  <div className="text-[10px] uppercase font-black tracking-widest text-black/40">
                    Continuous Automation Verified
                  </div>
                )}
                
                {/* Embedded Inline Slide Indexes Numbers Indicator */}
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-black/20 text-white">
                  0{slide.id} / 0{mockBanners.length}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Manual Navigation Dot Tracks */}
        <div className="absolute bottom-4 right-6 flex items-center gap-2 z-30">
          {mockBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { AudioEngine.playClick(); setCurrentSlide(idx); }}
              className={`h-4 border-2 border-[#1A1D20] transition-all rounded-full ${
                currentSlide === idx ? 'w-8 bg-[#FFF275]' : 'w-4 bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* SECTION 2: QUICK BABOON 29 TOAST MESSAGES & LIVE NETWORK METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Quick Baboon Variant A: Protocol Verification Guard */}
        <div className="baboon-card border-4 border-[#1A1D20] bg-white shadow-[4px_4px_0px_#1A1D20] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00F5D4] border-3 border-[#1A1D20] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A1D20]">
            <ShieldCheck className="w-6 h-6 text-[#1A1D20]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">Node Integrity Level Check</h3>
            <p className="text-[11px] font-bold text-slate-500 truncate leading-snug">
              Cryptographic sequential signature paths bound successfully to sandbox arrays.
            </p>
          </div>
        </div>

        {/* Quick Baboon Variant B: Live Transaction Volume Tracker */}
        <div className="baboon-card border-4 border-[#1A1D20] bg-[#FFF275] shadow-[4px_4px_0px_#1A1D20] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border-3 border-[#1A1D20] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A1D20]">
            <TrendingUp className="w-6 h-6 text-[#9D4EDD]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">Live Pipeline Volume</h3>
            <span className="text-sm font-black font-mono text-[#5A189A]">
              {liveVolume.toLocaleString()} AR POOLED ITEMS
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: RE-CONSTRUCTED ACTIVITY POOLS CONTAINER ROW */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6B6B] border-2 border-[#1A1D20] rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1D20]">
              Active Entry Activity Pools
            </h3>
          </div>
          <button 
            onClick={() => onTabChange('raffle')}
            className="text-xs font-black text-[#9D4EDD] flex items-center gap-1 group bg-white border-2 border-[#1A1D20] px-3 py-1 rounded-full shadow-[2px_2px_0px_#1A1D20] active:translate-y-0.5 active:shadow-[0px_0px_#1A1D20]"
          >
            See All Pools <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
          </button>
        </div>

        {/* Horizontal Massive Card Scroll Grid Row Subframe */}
        <div className="w-full flex gap-4 overflow-x-auto custom-scrollbar pb-3 snap-x scroll-smooth">
          {raffles.map((raffle) => {
            const progress = Math.round((raffle.tickets_sold / raffle.total_tickets) * 100);
            return (
              <div 
                key={raffle.id}
                className="min-w-[190px] w-[190px] bg-white border-4 border-[#1A1D20] rounded-3xl p-3 shrink-0 snap-start shadow-[5px_5px_0px_#1A1D20] flex flex-col justify-between space-y-3"
              >
                <div className="w-full h-24 rounded-2xl overflow-hidden bg-[#1A1D20] relative border-2 border-[#1A1D20]">
                  <img src={raffle.image} alt="" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[8px] font-black bg-[#FFF275] border-2 border-[#1A1D20] text-[#1A1D20]">
                    {raffle.category.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black text-[#1A1D20] tracking-wide truncate px-0.5">
                    {raffle.title}
                  </h4>
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 px-0.5">
                    <span>Pool Goal</span>
                    <span className="font-mono text-[#9D4EDD]">{raffle.total_tickets} AR</span>
                  </div>
                  
                  {/* Heavy Pop-Art Progressive Bar Indicators */}
                  <div className="w-full h-3 bg-[#F4F7F5] rounded-full border-2 border-[#1A1D20] overflow-hidden mt-1">
                    <div 
                      className="h-full bg-[#00F5D4] border-r-2 border-[#1A1D20] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onTabChange('raffle')}
                  className="w-full btn-cartoon-purple py-1.5 text-[10px] tracking-wider"
                >
                  Stake Pool
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: INTEGRATED AVAILABLE COMPLIANCE SOCIAL JOBS MATRIX */}
      <div className="cartoon-plate-green p-5 space-y-4">
        <div className="flex items-center justify-between border-b-4 border-[#1A1D20] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FFF275] border-2 border-[#1A1D20] rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-[#1A1D20]" strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1D20]">
              Available Verification Jobs Deck
            </h3>
          </div>
          <span className="text-[10px] font-black bg-white border-2 border-[#1A1D20] px-2 py-0.5 rounded-md shadow-[2px_2px_0px_#1A1D20]">
            Earn AR Vouchers
          </span>
        </div>

        <div className="space-y-3">
          {[
            { title: 'Link Discord Identity Node', prize: '+25 AR Voucher', desc: 'Sync signature tokens inside alpha room chat servers.', type: 'Social' },
            { title: 'Follow Developer IG Profile', prize: '+15 AR Voucher', desc: 'Provide account screenshot matrix confirmation proof.', type: 'Social' },
            { title: 'Complete Initial Wallet Stake', prize: '+50 AR Voucher', desc: 'First time sequential address deposit trigger benchmark.', type: 'Core' }
          ].map((task, i) => (
            <div 
              key={i}
              className="p-3 bg-white border-2 border-[#1A1D20] rounded-xl flex items-center justify-between gap-3 shadow-[3px_3px_0px_#1A1D20]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-[#4EA8DE] text-white px-1.5 py-0.5 rounded border border-[#1A1D20]">
                    {task.type}
                  </span>
                  <h4 className="text-xs font-black text-[#1A1D20] truncate">{task.title}</h4>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{task.desc}</p>
              </div>
              <button 
                onClick={() => onTabChange('profile')}
                className="btn-cartoon-green py-1 px-3 text-[10px] tracking-wide shrink-0 font-black"
              >
                {task.prize}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: CARTOON-SHAPED RADIAL STAKES CHIPS INVENTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#9D4EDD] border-2 border-[#1A1D20] rounded-md flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1D20]">
              My Active Running Stakes (Ticket Shape Overhaul)
            </h3>
          </div>
          <button 
            onClick={() => onTabChange('tickets')}
            className="text-xs font-black text-slate-500 underline"
          >
            Expand Ledger
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="w-full bg-white border-4 border-[#1A1D20] border-dashed rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
            No stake credentials verified inside local sandbox layers yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tickets.slice(0, 3).map((item, idx) => (
              <div 
                key={idx}
                className="cartoon-ticket rounded-xl p-4 flex items-center justify-between relative overflow-hidden"
              >
                {/* Visual Flat Stylized Ticket Notches Left and Right */}
                <div className="absolute top-1/2 left-[-8px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#F4F7F5] border-2 border-[#1A1D20]" />
                <div className="absolute top-1/2 right-[-8px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#F4F7F5] border-2 border-[#1A1D20]" />
                
                <div className="pl-2">
                  <h4 className="text-xs font-black text-[#1A1D20] uppercase tracking-wide">
                    Allocated Entry Token Ticket
                  </h4>
                  <p className="text-[9px] font-bold text-[#1A1D20]/60 font-mono mt-0.5">
                    Batch UUID Hash: ...{item.id.slice(-8)}
                  </p>
                </div>

                <div className="text-right pr-2">
                  <span className="text-sm font-black text-[#5A189A] block leading-none">
                    {item.quantity_bought}
                  </span>
                  <span className="text-[8px] font-black uppercase text-[#1A1D20] tracking-widest">
                    Units
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 6: TACTILE CONSOLE INTERACTIVE FORMS & SYSTEM FEED METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Widget A: Direct Quick Stake Allocator Terminal */}
        <div className="cartoon-plate-amber p-5 space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#1A1D20] pb-2">
            <Flame className="w-4 h-4 text-[#FF9F1C]" strokeWidth={3} />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
              Direct Quick-Stake Terminal Console
            </h4>
          </div>
          <form onSubmit={handleQuickStakeSubmit} className="space-y-3">
            <p className="text-[10px] font-bold text-slate-500 leading-normal">
              Skip subviews to instantly browse high-yield drawing nodes matching your default allocation profiles.
            </p>
            <div className="flex gap-2">
              <input 
                type="number"
                value={quickStakeAmount}
                onChange={(e) => setQuickStakeAmount(e.target.value)}
                placeholder="Amount (AR)"
                className="flex-1 bg-white border-2 border-[#1A1D20] rounded-xl px-3 text-xs font-black text-[#1A1D20] focus:outline-none"
              />
              <button 
                type="submit"
                className="btn-cartoon-purple py-2 px-4 text-xs font-black shrink-0"
              >
                Scan Pools
              </button>
            </div>
          </form>
        </div>

        {/* Widget B: Sandbox Dynamic Broadcast Newsletter Box */}
        <div className="cartoon-plate-purple p-5 space-y-3" style={{ boxShadow: '6px 6px 0px #4EA8DE' }}>
          <div className="flex items-center gap-2 border-b-2 border-[#1A1D20] pb-2">
            <Star className="w-4 h-4 text-[#4EA8DE]" strokeWidth={3} />
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
              Ecosystem Literature Ticker
            </h4>
          </div>
          {!newsletterSubmitted ? (
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 leading-normal">
                Drop your communication handle identifier to secure instant priority audit notifications.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="name@node.com"
                  className="flex-1 bg-white border-2 border-[#1A1D20] rounded-xl px-3 text-xs font-black text-[#1A1D20] focus:outline-none"
                />
                <button 
                  type="submit"
                  className="btn-cartoon-green py-2 px-4 text-xs font-black shrink-0"
                >
                  Join
                </button>
              </div>
            </form>
          ) : (
            <div className="h-16 flex items-center gap-2 text-xs font-black text-[#38B000]">
              <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
              <span>Identity handle successfully added to pipeline logs!</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 7: STREAMING TRANSACTION ACTIVITY MONITOR FEED */}
      <div className="w-full bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <Activity className="w-4 h-4 text-[#9D4EDD]" strokeWidth={2.5} />
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
            Live Network System Stream Logs
          </h4>
          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping ml-auto" />
        </div>

        <div className="space-y-2">
          {recentActivities.map((log) => (
            <div 
              key={log.id}
              className="flex items-center justify-between text-[10px] font-bold text-slate-500 bg-[#F4F7F5] p-2 rounded-lg border border-slate-200"
            >
              <div className="flex items-center gap-1.5 truncate max-w-[75%]">
                <span className="font-mono text-[#1A1D20] font-black">{log.user}</span>
                <span className="text-[#9D4EDD] font-black uppercase text-[8px] px-1 bg-white border border-[#1A1D20] rounded">
                  {log.action}
                </span>
                <span className="truncate opacity-70">inside {log.pool}</span>
              </div>
              <span className="font-mono text-slate-400 text-[9px] shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 8: ACCORDION DOCUMENT LITIGATION EXPANSE SEGMENT */}
      <div className="space-y-3 pb-8">
        <div className="flex items-center gap-1.5 px-1">
          <HelpCircle className="w-4 h-4 text-[#1A1D20]" strokeWidth={2.5} />
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">
            Frequently Understood Literatures FAQs
          </span>
        </div>
        
        <div className="space-y-2">
          {[
            { q: "How is the 1 AR ticket execution cost guaranteed?", a: "The architecture relies entirely on mathematical scale limits embedded directly within localized data variables. Every single entry ticket maps directly as 1 AR with zero hidden commissions." },
            { q: "What defines individual token pool winning probabilities?", a: "Your exact winning calculation is computed as: (Your Allocated Tickets / Grand Total Pool Tickets Filled) * 100. Purchasing more batch units increases chance parameters linearly." },
            { q: "How do I trigger reward centre point voucher withdrawals?", a: "Navigate into your personal user node panel subview, click the reward activation terminal, and toggle use on any unlocked Binance-style voucher asset coupon." }
          ].map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="bg-white border-2 border-[#1A1D20] rounded-xl overflow-hidden shadow-[2px_2px_0px_#1A1D20]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaqRow(index)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-black text-[#1A1D20] active:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight 
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-90 text-[#9D4EDD]' : ''
                    }`} 
                    strokeWidth={3}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[11px] font-bold leading-relaxed text-slate-500 border-t border-slate-100 bg-[#F4F7F5]/50 animate-view-jump">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
