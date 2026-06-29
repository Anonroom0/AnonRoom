import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  Trophy, 
  Info, 
  Ticket, 
  ShoppingBag,
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck,
  Minus,
  Plus,
  Users,
  Star,
  ArrowRight,
  Filter
} from 'lucide-react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';

export default function RaffleView({ targetRaffleId, clearTarget }) {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [raffles, setRaffles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Detail View State
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('buy'); // 'buy' | 'mytickets' | 'info' | 'leaderboard'
  
  // Checkout State
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseStatus, setPurchaseStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ---------------------------------------------------------------------------
  // RICH MOCK DATA (For Sub-Tabs)
  // ---------------------------------------------------------------------------
  const categories = ['All', 'Electronics', 'Gift Cards', 'Collectibles', 'Apparel'];

  const mockLeaderboard = [
    { rank: 1, name: "Rahul Kumar", tickets: 150, avatar: "RK", color: "bg-amber-100 text-amber-700" },
    { rank: 2, name: "Priya Sharma", tickets: 85, avatar: "PS", color: "bg-slate-200 text-slate-700" },
    { rank: 3, name: "Aman Gupta", tickets: 42, avatar: "AG", color: "bg-orange-100 text-orange-700" },
    { rank: 4, name: "Neha Mishra", tickets: 20, avatar: "NM", color: "bg-blue-100 text-blue-700" },
    { rank: 5, name: "Vaibhav S.", tickets: 12, avatar: "VS", color: "bg-purple-100 text-purple-700" }
  ];

  const mockUserTicketsForRaffle = [
    { id: "TKT-9901-A", date: "June 25, 2026", status: "Active" },
    { id: "TKT-9902-B", date: "June 25, 2026", status: "Active" },
    { id: "TKT-9903-C", date: "June 26, 2026", status: "Active" }
  ];

  const recentBuyers = [
    "Rahul bought 5 tickets",
    "Aman bought 2 tickets",
    "Sneha bought 10 tickets"
  ];

  // ---------------------------------------------------------------------------
  // INITIALIZATION & EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchRaffles() {
      try {
        const data = await MockAPI.getRaffles();
        setRaffles(data);
        
        // Handle deep-linking from Home page
        if (targetRaffleId) {
          const matched = data.find(r => r.id === targetRaffleId);
          if (matched) {
            setSelectedRaffle(matched);
            setActiveSubTab('buy');
          }
        }
      } catch (err) {
        console.error("Failed to load raffles:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRaffles();
  }, [targetRaffleId]);

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleBackToDirectory = () => {
    AudioEngine.playClick();
    setSelectedRaffle(null);
    if (clearTarget) clearTarget();
    setPurchaseStatus('idle');
    setTicketQuantity(1);
  };

  const handleTicketCheckout = async () => {
    if (!selectedRaffle) return;
    try {
      AudioEngine.playClick();
      setPurchaseStatus('processing');
      
      // Simulate network request delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      await MockAPI.purchaseTickets(selectedRaffle.id, ticketQuantity);
      
      setPurchaseStatus('success');
      
      // Refresh the specific raffle data to update progress bar
      const refreshedList = await MockAPI.getRaffles();
      setRaffles(refreshedList);
      setSelectedRaffle(refreshedList.find(r => r.id === selectedRaffle.id));
    } catch (err) {
      setPurchaseStatus('error');
    }
  };

  const handleQuantityChange = (type) => {
    AudioEngine.playClick();
    if (type === 'increase') {
      setTicketQuantity(prev => Math.min(prev + 1, 100)); // Max 100 per click
    } else {
      setTicketQuantity(prev => Math.max(prev - 1, 1)); // Min 1
    }
  };

  // ---------------------------------------------------------------------------
  // FILTERING LOGIC
  // ---------------------------------------------------------------------------
  const filteredRaffles = raffles.filter(item => {
    // Map internal categories to our clean UI categories for demonstration
    const isCategoryMatch = selectedCategory === 'All' || 
                            (selectedCategory === 'Collectibles' && item.category === 'goodies') ||
                            (selectedCategory === 'Electronics' && item.category === 'crypto') ||
                            selectedCategory === item.category;
                            
    const isSearchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full h-full p-6 space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-12 w-full bg-slate-200 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-slate-200 rounded-[1.25rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: DEEP-DIVE RAFFLE DETAIL VIEW
  // ---------------------------------------------------------------------------
  if (selectedRaffle) {
    return (
      <div className="w-full max-w-3xl mx-auto animate-fade-in pb-12">
        
        {/* Detail Header & Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleBackToDirectory}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">Raffle Details</h2>
            <p className="text-sm font-medium text-slate-500">ID: {selectedRaffle.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Hero Image Card */}
        <div className="card-standard overflow-hidden bg-white mb-6">
          <div className="w-full h-48 sm:h-64 bg-slate-100 relative group">
            <img 
              src={selectedRaffle.image} 
              alt={selectedRaffle.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white uppercase tracking-wider mb-2">
                Featured Draw
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                {selectedRaffle.title}
              </h2>
            </div>
          </div>
          
          {/* Sub-Tab Navigation Bar */}
          <div className="flex border-b border-slate-100 bg-white overflow-x-auto hide-scrollbar">
            {[
              { id: 'buy', label: 'Buy Tickets', icon: ShoppingBag },
              { id: 'mytickets', label: 'My Tickets', icon: Ticket },
              { id: 'info', label: 'About', icon: Info },
              { id: 'leaderboard', label: 'Top Buyers', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { AudioEngine.playClick(); setActiveSubTab(tab.id); setPurchaseStatus('idle'); }}
                  className={`flex-1 min-w-[100px] py-4 flex flex-col items-center gap-1.5 transition-colors relative ${
                    isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-bold">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* -------------------------------------------------
            SUB-TAB 1: BUY TICKETS (CHECKOUT)
            ------------------------------------------------- */}
        <div className="animate-fade-in min-h-[300px]">
          {activeSubTab === 'buy' && (
            <div className="space-y-6">
              
              {/* Checkout Stepper Card */}
              <div className="card-standard p-6 bg-white space-y-6">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Select Quantity</h3>
                    <p className="text-sm text-slate-500 font-medium">1 Ticket = 1.00 AR</p>
                  </div>
                  
                  {/* Plus/Minus Stepper */}
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                    <button 
                      onClick={() => handleQuantityChange('decrease')}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all shadow-sm"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-14 text-center">
                      <span className="text-lg font-black text-slate-900">{ticketQuantity}</span>
                    </div>
                    <button 
                      onClick={() => handleQuantityChange('increase')}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Tickets ({ticketQuantity}x)</span>
                    <span>{(ticketQuantity * 1.00).toFixed(2)} AR</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500 pb-2 border-b border-slate-200">
                    <span>Platform Fee</span>
                    <span>0.00 AR</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-1">
                    <span>Total Cost</span>
                    <span className="text-blue-600">{(ticketQuantity * 1.00).toFixed(2)} AR</span>
                  </div>
                </div>

                {/* Main Action Button */}
                <button
                  onClick={handleTicketCheckout}
                  disabled={purchaseStatus === 'processing'}
                  className="btn-primary w-full py-4 text-base shadow-blue-600/30"
                >
                  {purchaseStatus === 'processing' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    `Confirm Purchase • ${(ticketQuantity * 1.00).toFixed(2)} AR`
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {purchaseStatus === 'success' && (
                <div className="card-standard bg-green-50 border-green-200 p-5 flex items-start gap-4 animate-slide-up">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Purchase Successful!</h4>
                    <p className="text-sm text-slate-600 font-medium mt-1">
                      You have successfully bought {ticketQuantity} ticket(s). You can view them in the 'My Tickets' tab. Good luck!
                    </p>
                  </div>
                </div>
              )}

              {purchaseStatus === 'error' && (
                <div className="card-standard bg-red-50 border-red-200 p-5 flex items-start gap-4 animate-slide-up">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Transaction Failed</h4>
                    <p className="text-sm text-slate-600 font-medium mt-1">
                      We couldn't process your purchase. Please check your balance and try again.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Trust & Safety Mini-banner */}
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4" /> Secure, transparent draw system
              </div>
            </div>
          )}

          {/* -------------------------------------------------
              SUB-TAB 2: MY TICKETS (FOR THIS RAFFLE)
              ------------------------------------------------- */}
          {activeSubTab === 'mytickets' && (
            <div className="space-y-4 animate-fade-in">
              <div className="card-standard p-6 bg-white">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-500" /> Your Tickets for this Draw
                </h3>
                
                <div className="space-y-3">
                  {mockUserTicketsForRaffle.map((ticket, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-100 transition-colors group">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {ticket.id}
                        </span>
                        <span className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Bought on {ticket.date}
                        </span>
                      </div>
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg">
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">Total Tickets Owned:</span>
                  <span className="text-lg font-black text-slate-900">3</span>
                </div>
                
                <button 
                  onClick={() => setActiveSubTab('buy')}
                  className="btn-secondary w-full mt-4"
                >
                  Buy More Tickets
                </button>
              </div>
            </div>
          )}

          {/* -------------------------------------------------
              SUB-TAB 3: ABOUT / INFO
              ------------------------------------------------- */}
          {activeSubTab === 'info' && (
            <div className="space-y-4 animate-fade-in">
              <div className="card-standard p-6 bg-white space-y-6">
                
                {/* Progress & Stats */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Draw Progress</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                      <span>{selectedRaffle.tickets_sold} Sold</span>
                      <span>{selectedRaffle.total_tickets} Total</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(selectedRaffle.tickets_sold / selectedRaffle.total_tickets) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100" />

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">How this works</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    This raffle offers a chance to win the featured item. Every ticket purchased increases your probability of winning. The draw will automatically trigger once the total ticket capacity is reached. 
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Winners are selected transparently, and physical items will be shipped globally for free.
                  </p>
                </div>

                <div className="h-px w-full bg-slate-100" />

                {/* Rules */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Rules & Eligibility</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      Must be 18 years or older to participate.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      Tickets are non-refundable once purchased.
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      No maximum limit on tickets per user.
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* -------------------------------------------------
              SUB-TAB 4: LEADERBOARD (TOP BUYERS)
              ------------------------------------------------- */}
          {activeSubTab === 'leaderboard' && (
            <div className="space-y-4 animate-fade-in">
              <div className="card-standard bg-white overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Top Buyers</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Users with the highest chance to win.</p>
                  </div>
                  <Trophy className="w-8 h-8 text-amber-500 opacity-20" />
                </div>
                
                <div className="divide-y divide-slate-100">
                  {mockLeaderboard.map((user) => (
                    <div key={user.rank} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      {/* Rank Indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                        user.rank === 1 ? 'bg-amber-100 text-amber-600 shadow-sm' :
                        user.rank === 2 ? 'bg-slate-200 text-slate-600' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                        #{user.rank}
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${user.color}`}>
                        {user.avatar}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${user.name === 'Vaibhav S.' ? 'text-blue-600' : 'text-slate-900'}`}>
                          {user.name} {user.name === 'Vaibhav S.' && '(You)'}
                        </p>
                      </div>

                      {/* Ticket Count */}
                      <div className="text-right shrink-0">
                        <p className="font-black text-sm text-slate-900">{user.tickets}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tickets</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN GRID VIEW (DIRECTORY)
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-[1.25rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Explore Raffles</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Discover and join exciting new draws.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 lg:w-96">
          <input 
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        <div className="flex items-center justify-center p-2 bg-slate-100 rounded-lg text-slate-500 mr-1 shrink-0">
          <Filter className="w-4 h-4" />
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { AudioEngine.playClick(); setSelectedCategory(cat); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Raffles */}
      {filteredRaffles.length === 0 ? (
        <div className="card-standard p-12 flex flex-col items-center justify-center text-center space-y-4 bg-white mt-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Raffles Found</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm mt-1">
              We couldn't find any raffles matching "{searchQuery}" in the {selectedCategory} category.
            </p>
          </div>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="btn-secondary mt-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {filteredRaffles.map((raffle) => {
            const percentSold = Math.round((raffle.tickets_sold / raffle.total_tickets) * 100);
            
            return (
              <div 
                key={raffle.id}
                className="card-hoverable flex flex-col h-full bg-white group"
                onClick={() => { AudioEngine.playClick(); setSelectedRaffle(raffle); setActiveSubTab('buy'); }}
              >
                {/* Image Section */}
                <div className="w-full h-40 sm:h-48 bg-slate-100 relative overflow-hidden shrink-0">
                  <img 
                    src={raffle.image} 
                    alt={raffle.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
                  
                  {/* Floating Price Tag */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-blue-600" /> 1 AR
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-slate-900 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {raffle.title}
                  </h3>
                  
                  <div className="mt-auto space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>{raffle.tickets_sold} Sold</span>
                        <span>{raffle.total_tickets} Limit</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentSold}%` }} 
                        />
                      </div>
                    </div>

                    <button className="w-full btn-secondary py-2.5 bg-white group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100">
                      View Details <ArrowRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
