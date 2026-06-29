import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  LayoutGrid,
  TrendingUp,
  Hash,
  ShoppingBag,
  AlertCircle,
  X
} from 'lucide-react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';

export default function MyTicketsView({ onTabChange, onSelectRaffle }) {
  // ---------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  
  const [tickets, setTickets] = useState([]);
  const [raffles, setRaffles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [expandedTicketId, setExpandedTicketId] = useState(null); 
  const [activeTab, setActiveTab] = useState('active'); 
  const [searchQuery, setSearchQuery] = useState('');

  // ---------------------------------------------------------------------------
  // 2. INITIALIZATION & DATA FETCHING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function fetchTicketData() {
      try {
        setIsLoading(true);
        const [ticketData, raffleData] = await Promise.all([
          MockAPI.getUserTickets(),
          MockAPI.getRaffles()
        ]);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (isMounted) {
          setTickets(ticketData);
          setRaffles(raffleData);
        }
      } catch (err) {
        console.error("Critical Failure: Unable to load ticket datasets:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTicketData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 3. BUG-PROOF EVENT HANDLERS
  // ---------------------------------------------------------------------------
  
  const handleRowExpansionToggle = (e, rawTicketId) => {
    e.preventDefault();
    e.stopPropagation();
    AudioEngine.playClick();
    setExpandedTicketId(prevId => prevId === rawTicketId ? null : rawTicketId);
  };

  const handleTabSwitch = (tab) => {
    AudioEngine.playClick();
    setActiveTab(tab);
    setExpandedTicketId(null); 
  };

  const handleDeepLinkToRaffle = (e, raffleId) => {
    e.preventDefault();
    e.stopPropagation();
    AudioEngine.playClick();
    
    // Aggressively attempt deep-link first
    if (onSelectRaffle && typeof onSelectRaffle === 'function') {
      onSelectRaffle(raffleId);
    } else if (onTabChange && typeof onTabChange === 'function') {
      onTabChange('raffle');
    } else {
      console.warn("Navigation props missing in MyTicketsView!");
    }
  };

  const handleClearSearch = () => {
    AudioEngine.playClick();
    setSearchQuery('');
  };

  // ---------------------------------------------------------------------------
  // 4. DATA PROCESSING & FILTERING PIPELINE
  // ---------------------------------------------------------------------------
  
  const processTicketsPipeline = () => {
    return tickets.map(batch => {
      const associatedPool = raffles.find((r) => r.id === batch.raffle_id);
      const horizontalEPID = `EPID-2026-${String(batch.id).substring(0, 4).toUpperCase()}`;
      
      let winProbabilityRatio = '0.00';
      if (associatedPool && associatedPool.tickets_sold > 0) {
        const ratio = (batch.quantity_bought / associatedPool.tickets_sold) * 100;
        winProbabilityRatio = ratio.toFixed(2);
      }

      const statusLabel = activeTab === 'active' ? 'Drawing Soon' : 'Draw Completed';

      return {
        ...batch,
        associatedPool,
        horizontalEPID,
        winProbabilityRatio,
        statusLabel,
        isPast: activeTab === 'past'
      };
    }).filter(ticket => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = ticket.associatedPool?.title?.toLowerCase().includes(query);
        const epidMatch = ticket.horizontalEPID.toLowerCase().includes(query);
        return titleMatch || epidMatch;
      }
      return true;
    });
  };

  const displayedTickets = processTicketsPipeline();
  const totalActiveTickets = tickets.reduce((acc, curr) => acc + curr.quantity_bought, 0);
  const uniqueDrawsEntered = new Set(tickets.map(t => t.raffle_id)).size;

  // ---------------------------------------------------------------------------
  // 5. RENDER: LOADING SKELETON
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full h-full p-4 sm:p-6 space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-24 bg-slate-200 rounded-[1.25rem]"></div>
          <div className="h-24 bg-slate-200 rounded-[1.25rem]"></div>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="h-12 flex-1 bg-slate-200 rounded-xl"></div>
          <div className="h-12 flex-1 bg-slate-200 rounded-xl hidden sm:block"></div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-[1.25rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. RENDER: MAIN DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Tickets</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your active entries and review past draw results securely.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card-standard p-5 sm:p-6 bg-white border border-slate-100 flex items-center gap-4 sm:gap-5 transition-shadow hover:shadow-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Ticket className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Total Entries</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{totalActiveTickets}</p>
          </div>
        </div>
        
        <div className="card-standard p-5 sm:p-6 bg-white border border-slate-100 flex items-center gap-4 sm:gap-5 transition-shadow hover:shadow-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">Active Draws</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">{uniqueDrawsEntered}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center w-full sm:w-auto bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <button
            onClick={() => handleTabSwitch('active')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'active' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60 scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            Active Draws
          </button>
          <button
            onClick={() => handleTabSwitch('past')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'past' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60 scale-[1.02]' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            Past Draws
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <input 
            type="text"
            placeholder="Search by Ticket ID or Prize Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-inner"
          />
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="absolute right-3 top-3.5 p-0.5 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {displayedTickets.length === 0 ? (
        
        <div className="card-standard p-12 sm:p-16 flex flex-col items-center justify-center text-center space-y-5 bg-white mt-4 shadow-sm border border-slate-100">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner">
            <Ticket className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">No Tickets Found</h3>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              {searchQuery 
                ? `We couldn't find any tickets matching your search query "${searchQuery}". Please try adjusting your filters.` 
                : `You don't have any ${activeTab} tickets right now. Head over to the Raffles page to join a draw and test your luck!`}
            </p>
          </div>
          
          {!searchQuery && activeTab === 'active' && (
            <button 
              onClick={() => { AudioEngine.playClick(); onTabChange('raffle'); }}
              className="btn-primary mt-6 px-8 py-3.5 shadow-blue-500/25"
            >
              Browse Live Raffles
            </button>
          )}
        </div>

      ) : (
        
        <div className="space-y-5">
          {displayedTickets.map((ticketData) => {
            const isRowOpen = expandedTicketId === ticketData.id;
            const pool = ticketData.associatedPool;

            return (
              <div 
                key={ticketData.id} 
                className="card-standard flex flex-col bg-white overflow-visible transition-all shadow-sm hover:shadow-md border border-slate-100"
              >
                
                <div 
                  onClick={(e) => handleRowExpansionToggle(e, ticketData.id)}
                  className="flex h-[110px] sm:h-[130px] cursor-pointer group relative bg-white hover:bg-slate-50/50 transition-colors"
                >
                  
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0 rounded-l-[1.25rem]">
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                          {ticketData.horizontalEPID}
                        </span>
                        <span className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm ${
                          activeTab === 'active' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {ticketData.statusLabel}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-lg font-bold text-slate-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                        {pool?.title || 'System Reward Raffle Allocation'}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 pr-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Draw Target: Processing</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-0 border-l-2 border-dashed border-slate-200 my-4 flex flex-col items-center justify-center shrink-0 z-10">
                    <div className="absolute -top-4 w-5 h-5 bg-slate-50 rounded-full border border-slate-100 shadow-inner -translate-x-[1.5px]" />
                    <div className="absolute -bottom-4 w-5 h-5 bg-slate-50 rounded-full border border-slate-100 shadow-inner -translate-x-[1.5px]" />
                    <div className="absolute bg-white border border-slate-200 rounded-full p-1.5 shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors -translate-x-[1px]">
                      {isRowOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="w-[100px] sm:w-[150px] relative shrink-0 rounded-r-[1.25rem] overflow-hidden bg-slate-100 p-2 sm:p-3 flex flex-col items-center justify-center border-l border-transparent">
                    <div className="absolute inset-0">
                      {pool?.image ? (
                        <img 
                          src={pool.image} 
                          alt="Prize Preview" 
                          className="w-full h-full object-cover opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center pt-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 leading-none drop-shadow-sm tracking-tighter">
                        {ticketData.quantity_bought}
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mt-1.5 bg-white/90 px-2.5 py-0.5 rounded-lg backdrop-blur-md shadow-sm border border-white/50">
                        Entries
                      </span>
                    </div>
                  </div>

                </div>

                {/* ==============================================================
                    EXPANDED DROPDOWN: TICKET DETAILS SUB-PANEL
                    ============================================================== */}
                {isRowOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6 animate-fade-in origin-top">
                    
                    <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-blue-500" /> 
                      Detailed Entry Verification
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      
                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 transition-shadow hover:shadow-md">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5" /> Participation ID
                        </span>
                        <span className="text-sm font-bold text-slate-900 block select-all font-mono">
                          {ticketData.horizontalEPID}
                        </span>
                      </div>

                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 transition-shadow hover:shadow-md">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" /> Win Probability
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl font-black text-emerald-600 leading-none">
                            {ticketData.winProbabilityRatio}%
                          </span>
                          <span className="text-xs font-bold text-slate-500 leading-none mt-1">Chance</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5 transition-shadow hover:shadow-md">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" /> Total Value Spent
                        </span>
                        <span className="text-sm font-bold text-slate-900 block font-mono">
                          {(ticketData.quantity_bought * 1.00).toFixed(2)} AR
                        </span>
                      </div>

                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-200/80">
                      
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Entries successfully cryptographically recorded.</span>
                      </div>

                      <button
                        onClick={(e) => handleDeepLinkToRaffle(e, ticketData.raffle_id)}
                        className="w-full sm:w-auto btn-secondary py-2.5 px-6 border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md active:scale-95 transition-all text-sm"
                      >
                        View Raffle <ArrowUpRight className="w-4 h-4" />
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
