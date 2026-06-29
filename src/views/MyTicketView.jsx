import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Percent, 
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  LayoutGrid,
  TrendingUp,
  Hash,
  ShoppingBag
} from 'lucide-react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';

export default function MyTicketsView({ onTabChange }) {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [tickets, setTickets] = useState([]);
  const [raffles, setRaffles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI Interaction States
  const [expandedEpid, setExpandedEpid] = useState(null); 
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'past'
  const [searchQuery, setSearchQuery] = useState('');

  // ---------------------------------------------------------------------------
  // INITIALIZATION & DATA FETCHING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchTicketData() {
      try {
        const [ticketData, raffleData] = await Promise.all([
          MockAPI.getUserTickets(),
          MockAPI.getRaffles()
        ]);
        
        // Simulating network delay for smooth UI transition
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setTickets(ticketData);
        setRaffles(raffleData);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTicketData();
  }, []);

  // ---------------------------------------------------------------------------
  // INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleRowExpansionToggle = (epid) => {
    AudioEngine.playClick();
    // Enforce isolated tracking rule - close if open, or open the new target independently
    setExpandedEpid(expandedEpid === epid ? null : epid);
  };

  const handleTabSwitch = (tab) => {
    AudioEngine.playClick();
    setActiveTab(tab);
    setExpandedEpid(null); // Close any expanded tickets when switching tabs
  };

  // ---------------------------------------------------------------------------
  // DATA PROCESSING & FILTERING
  // ---------------------------------------------------------------------------
  
  // In a real app, 'past' draws would be determined by a date or status flag.
  // For this rich UI demonstration, we will split them artificially if needed, 
  // or just show empty state for 'past' to demonstrate the UI thoroughly.
  
  const processTickets = () => {
    return tickets.map(batch => {
      const associatedPool = raffles.find((r) => r.id === batch.raffle_id);
      
      // Clean, standard Event Participation ID (EPID) 
      const horizontalEPID = `EPID-2026-${batch.id.substring(0, 4).toUpperCase()}`;
      
      // Calculate Win Probability (Safe math)
      let winProbabilityRatio = '0.00';
      if (associatedPool && associatedPool.tickets_sold > 0) {
        winProbabilityRatio = ((batch.quantity_bought / associatedPool.tickets_sold) * 100).toFixed(2);
      }

      // Determine mock status based on active tab concept
      // We assume all fetched from MockAPI are 'active'. Past ones are mocked.
      const status = activeTab === 'active' ? 'Drawing Soon' : 'Draw Completed';

      return {
        ...batch,
        associatedPool,
        horizontalEPID,
        winProbabilityRatio,
        status,
        isPast: activeTab === 'past'
      };
    }).filter(ticket => {
      // Apply Search Filter
      if (searchQuery) {
        const titleMatch = ticket.associatedPool?.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const epidMatch = ticket.horizontalEPID.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || epidMatch;
      }
      return true;
    });
  };

  const displayedTickets = processTickets();
  const totalActiveTickets = tickets.reduce((acc, curr) => acc + curr.quantity_bought, 0);
  const uniqueDrawsEntered = new Set(tickets.map(t => t.raffle_id)).size;

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full h-full p-4 sm:p-6 space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-24 w-full bg-slate-200 rounded-2xl"></div>
        <div className="flex gap-4 mb-6">
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-200 rounded-[1.25rem]"></div>
        ))}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN TICKET HUB
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* 1. PAGE HEADER & STATS SUMMARY */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Tickets</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your entries and view draw details.</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-standard p-5 bg-white border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Entries</p>
            <p className="text-2xl font-black text-slate-900">{totalActiveTickets}</p>
          </div>
        </div>
        <div className="card-standard p-5 bg-white border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Active Draws</p>
            <p className="text-2xl font-black text-slate-900">{uniqueDrawsEntered}</p>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Tab Switcher */}
        <div className="flex items-center w-full sm:w-auto bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            onClick={() => handleTabSwitch('active')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'active' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Active Draws
          </button>
          <button
            onClick={() => handleTabSwitch('past')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'past' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Past Draws
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <input 
            type="text"
            placeholder="Search by ID or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* 3. TICKET LISTING (STANDARD APP UI) */}
      {displayedTickets.length === 0 ? (
        <div className="card-standard p-12 flex flex-col items-center justify-center text-center space-y-4 bg-white mt-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            <Ticket className="w-10 h-10 text-slate-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No Tickets Found</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm mt-1 mx-auto">
              {searchQuery 
                ? `We couldn't find any tickets matching "${searchQuery}".` 
                : `You don't have any ${activeTab} tickets right now. Head over to the Raffles page to join a draw!`}
            </p>
          </div>
          {!searchQuery && activeTab === 'active' && (
            <button 
              onClick={() => { AudioEngine.playClick(); onTabChange('raffle'); }}
              className="btn-primary mt-4"
            >
              Browse Live Raffles
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedTickets.map((ticketData) => {
            const isRowOpen = expandedEpid === ticketData.horizontalEPID;
            const pool = ticketData.associatedPool;

            return (
              <div key={ticketData.id} className="card-standard flex flex-col bg-white overflow-visible">
                
                {/* 🎟️ MODERN TICKET CARD DESIGN (HORIZONTAL) */}
                <div 
                  onClick={() => handleRowExpansionToggle(ticketData.horizontalEPID)}
                  className="flex h-[110px] sm:h-[130px] cursor-pointer group relative"
                >
                  
                  {/* Left Section: Details */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0 bg-white rounded-l-[1.25rem]">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {ticketData.horizontalEPID}
                        </span>
                        <span className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          activeTab === 'active' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {ticketData.status}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                        {pool?.title || 'System Reward Raffle'}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 pr-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Draw Date: TBA</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Soft Perforated Divider */}
                  <div className="relative w-0 border-l-2 border-dashed border-slate-200 my-4 flex flex-col items-center justify-center shrink-0 z-10">
                    {/* Semi-circle cutouts top and bottom for realistic modern ticket look */}
                    <div className="absolute -top-4 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner -translate-x-[1px]" />
                    <div className="absolute -bottom-4 w-4 h-4 bg-slate-50 rounded-full border border-slate-100 shadow-inner -translate-x-[1px]" />
                    
                    {/* Floating Expansion Indicator */}
                    <div className="absolute bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors -translate-x-[1px]">
                      {isRowOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Right Section: Prize Image & Counter */}
                  <div className="w-[100px] sm:w-[140px] relative shrink-0 rounded-r-[1.25rem] overflow-hidden bg-slate-100 p-2 sm:p-3 flex flex-col items-center justify-center border-l border-transparent">
                    {/* Image Backdrop Layer */}
                    <div className="absolute inset-0">
                      {pool?.image ? (
                        <img 
                          src={pool.image} 
                          alt="Prize" 
                          className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90" />
                    </div>

                    {/* Quantity Display Front */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 leading-none drop-shadow-sm">
                        {ticketData.quantity_bought}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1 bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-sm shadow-sm">
                        Entries
                      </span>
                    </div>
                  </div>

                </div>

                {/* 📂 EXPANDED TICKET DETAILS SUB-PANEL */}
                {isRowOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 animate-slide-up origin-top">
                    
                    <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" /> Entry Details Breakdown
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      
                      {/* Detail Card 1: ID */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Participation ID
                        </span>
                        <span className="text-sm font-bold text-slate-900 block select-all">
                          {ticketData.horizontalEPID}
                        </span>
                      </div>

                      {/* Detail Card 2: Probability */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Win Probability
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-black text-emerald-600 leading-none">
                            {ticketData.winProbabilityRatio}%
                          </span>
                          <span className="text-xs font-medium text-slate-500 leading-none mt-1">Chance</span>
                        </div>
                      </div>

                      {/* Detail Card 3: Value */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" /> Total Value
                        </span>
                        <span className="text-sm font-bold text-slate-900 block">
                          {(ticketData.quantity_bought * 1.00).toFixed(2)} AR
                        </span>
                      </div>

                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Your entries are verified and secured in the system.</span>
                      </div>

                      {/* Navigation Trigger to original Raffle Pool */}
                      <button
                        onClick={() => { AudioEngine.playClick(); onTabChange('raffle'); }} // In reality, we'd pass the ID to open the specific raffle
                        className="w-full sm:w-auto btn-secondary py-2 border-slate-200"
                      >
                        View Draw Page <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
