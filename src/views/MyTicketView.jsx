import React, { useState, useEffect } from 'react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';
import { 
  Ticket, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Clock, 
  Percent, 
  Search, 
  AlertCircle, 
  Award, 
  CornerDownRight, 
  HelpCircle,
  TrendingUp,
  Fingerprint,
  Calendar
} from 'lucide-react';

export default function MyTicketsView({ onTabChange }) {
  const [tickets, setTickets] = useState([]);
  const [raffles, setRaffles] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTicketContext() {
      try {
        setIsLoading(false);
        const [ticketData, raffleData] = await Promise.all([
          MockAPI.getUserTickets(),
          MockAPI.getRaffles()
        ]);
        setTickets(ticketData);
        setRaffles(raffleData);
      } catch (err) {
        console.error("Failed to compile ticket catalog models: ", err);
      }
    }
    loadTicketContext();
  }, []);

  const toggleAccordionRow = (rowId) => {
    AudioEngine.playClick();
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const filteredTickets = tickets.filter(batch => {
    const parentPool = raffles.find(r => r.id === batch.raffle_id);
    const poolTitle = parentPool?.title || 'Unknown Raffle Pool';
    const matchesSearch = poolTitle.toLowerCase().includes(ticketSearch.toLowerCase()) || 
                          batch.ticket_numbers.some(n => n.toString().includes(ticketSearch));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'bulk') return matchesSearch && batch.quantity_bought >= 5;
    if (filterType === 'single') return matchesSearch && batch.quantity_bought < 5;
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="w-full h-44 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-[#9D4EDD] border-[#1A1D20] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-32">
      
      {/* 1. SELECTION TOOLBAR CONTROL BOX */}
      <div className="w-full bg-white border-4 border-[#1A1D20] rounded-3xl p-4 shadow-[4px_4px_0px_#1A1D20] space-y-3">
        <div className="flex items-center gap-2 border-b-2 border-slate-100 pb-2">
          <Ticket className="w-4 h-4 text-[#9D4EDD]" strokeWidth={2.5} />
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
            Stakes Inventory Filters
          </h3>
        </div>

        {/* Dynamic Search Parameters Line Input */}
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Filter vouchers by pool name or number..."
            value={ticketSearch}
            onChange={(e) => setTicketSearch(e.target.value)}
            className="w-full bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl px-3 py-2 text-xs font-bold text-[#1A1D20] focus:outline-none"
          />
          <Search className="absolute right-3 w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
        </div>

        {/* Filter Type Segment Control Rails */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: 'all', label: 'All Stakes' },
            { id: 'bulk', label: 'Bulk Only (≥5)' },
            { id: 'single', label: 'Small Slices' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => { AudioEngine.playClick(); setFilterType(btn.id); }}
              className={`py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border-2 transition-all ${
                filterType === btn.id 
                  ? 'bg-[#FFF275] border-[#1A1D20] text-[#1A1D20] shadow-[2px_2px_0px_#1A1D20]' 
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. INVENTORY FLOW LISTING LAYOUT SHELLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#38B000]" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">
              Verified Ownership Stakes Ledger
            </span>
          </div>
          <span className="text-[10px] font-mono font-black text-slate-500 bg-white border-2 border-[#1A1D20] px-2 py-0.5 rounded-md shadow-[2px_2px_0px_#1A1D20]">
            Total Entries: {filteredTickets.length}
          </span>
        </div>

        {filteredTickets.length === 0 ? (
          /* Empty Inventory Feedback Widget Frame Structure Override */
          <div className="w-full bg-white border-4 border-[#1A1D20] rounded-3xl p-8 text-center border-dashed space-y-4 shadow-[4px_4px_0px_#1A1D20]">
            <div className="w-12 h-12 rounded-full bg-[#FFF275] border-2 border-[#1A1D20] flex items-center justify-center mx-auto shadow-[2px_2px_0px_#1A1D20]">
              <AlertCircle className="w-6 h-6 text-[#1A1D20]" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#1A1D20] uppercase">No Ticket Records Matches</h4>
              <p className="text-[11px] font-bold text-slate-400 max-w-[220px] mx-auto leading-normal">
                No verified cryptographic token configurations align with your current search query parameters.
              </p>
            </div>
            <button
              onClick={() => onTabChange('raffle')}
              className="btn-cartoon-purple py-2 px-5 text-xs font-black"
            >
              Explore Active Pools
            </button>
          </div>
        ) : (
          /* Inventory Items Array Module Map */
          <div className="space-y-4">
            {filteredTickets.map((batch) => {
              const linkedPool = raffles.find(r => r.id === batch.raffle_id);
              const isCurrentExpanded = expandedRow === batch.id;
              
              // Calculate exact live winning probability weights
              const calculatedProbability = linkedPool 
                ? ((batch.quantity_bought / linkedPool.tickets_sold) * 100).toFixed(2)
                : '0.00';

              return (
                <div
                  key={batch.id}
                  className="w-full bg-transparent transition-all"
                >
                  {/* 🎟️ DYNAMIC SHY RATTLESNAKE MASK OVERHAUL CONTAINER */}
                  <div
                    onClick={() => toggleAccordionRow(batch.id)}
                    className="cartoon-ticket rounded-2xl p-4 flex items-center justify-between cursor-pointer group border-4 relative"
                  >
                    {/* Retro Drawing Ticket Side Punch Holes Cutouts */}
                    <div className="absolute top-1/2 left-[-10px] -translate-y-1/2 w-5 h-5 rounded-full bg-[#F4F7F5] border-4 border-[#1A1D20]" />
                    <div className="absolute top-1/2 right-[-10px] -translate-y-1/2 w-5 h-5 rounded-full bg-[#F4F7F5] border-4 border-[#1A1D20]" />

                    <div className="pl-3 space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[8px] font-black bg-white border border-black px-1 rounded uppercase tracking-wider text-slate-500">
                          {linkedPool?.category || 'General'}
                        </span>
                        <h4 className="text-xs font-black text-[#1A1D20] tracking-wide truncate max-w-[160px]">
                          {linkedPool?.title || 'System Allocation Pool'}
                        </h4>
                      </div>
                      
                      {/* Horizontal Codes Row Ribbon */}
                      <div className="w-full flex gap-1.5 overflow-x-auto custom-scrollbar pointer-events-none pb-0.5">
                        {batch.ticket_numbers.map((num, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-[#1A1D20] text-[9px] font-mono font-black tracking-tight text-[#00F5D4] shrink-0"
                          >
                            #{num}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Value Block Stamp */}
                    <div className="flex items-center gap-3 shrink-0 pr-2 pl-3 border-l-2 border-dashed border-[#1A1D20]/20">
                      <div className="text-center min-w-[36px]">
                        <div className="text-sm font-black text-[#5A189A] leading-none">
                          {batch.quantity_bought}
                        </div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                          Tickets
                        </div>
                      </div>
                      <div className="w-7 h-7 bg-white border-2 border-[#1A1D20] rounded-full flex items-center justify-center shadow-[1px_1px_0px_#1A1D20]">
                        {isCurrentExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#1A1D20]" strokeWidth={3} />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#1A1D20]" strokeWidth={3} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 📂 ACCORDION DISCLOSURE WORKSPACE SPECIFICATIONS BLOCK */}
                  {isCurrentExpanded && (
                    <div className="px-5 pb-5 pt-4 bg-white border-x-4 border-b-4 border-[#1A1D20] rounded-b-2xl -mt-2 shadow-[4px_4px_0px_#1A1D20] space-y-4 animate-view-jump position relative z-10">
                      
                      {/* Metric Properties Grid Row Cluster */}
                      <div className="grid grid-cols-2 gap-3">
                        
                        {/* Clock Timestamp Detail Item */}
                        <div className="p-2.5 bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl flex items-center gap-2.5 shadow-[2px_2px_0px_#1A1D20]">
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#1A1D20] flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-[#9D4EDD]" strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block leading-none">
                              Sync Stamp
                            </span>
                            <span className="text-[10px] font-black text-[#1A1D20] font-mono block mt-1">
                              {new Date(batch.purchased_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Weighted Percentage Probability Box Item */}
                        <div className="p-2.5 bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl flex items-center gap-2.5 shadow-[2px_2px_0px_#1A1D20]">
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#1A1D20] flex items-center justify-center shrink-0">
                            <Percent className="w-4 h-4 text-[#38B000]" strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block leading-none">
                              Draw Weight
                            </span>
                            <span className="text-[10px] font-black text-[#38B000] font-mono block mt-1">
                              {calculatedProbability}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Explicit Sandbox Security Ledger Verification Row */}
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-2">
                        <Fingerprint className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <p className="text-[10px] font-bold text-slate-400 leading-normal">
                          Verification credentials verified on localized storage index pools. Node signature hash sequence is active.
                        </p>
                      </div>

                      {/* View Routing Action CTA Link Trigger */}
                      <button
                        onClick={() => onTabChange('raffle')}
                        className="w-full btn-cartoon-secondary py-2 text-[10px] font-black flex items-center justify-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" strokeWidth={2.5} /> 
                        Inspect Running Allocation Parameters
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. PLATFORM LITERATURE ACCORDION DOCUMENT SEGMENT FAQ BLOCK */}
      <div className="cartoon-plate-purple p-5 space-y-3" style={{ boxShadow: '5px 5px 0px #FF9F1C' }}>
        <div className="flex items-center gap-2 border-b-2 border-[#1A1D20] pb-2">
          <HelpCircle className="w-4 h-4 text-[#1A1D20]" strokeWidth={2.5} />
          <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
            Ownership Allocation Handbooks
          </h4>
        </div>
        
        <div className="space-y-2">
          {[
            { q: "Where can I find my full cryptographic ticket hashes?", a: "Each active ticket slice generates a signature linked to your profile model logs. Expand any running row item above to display timestamp properties directly." },
            { q: "Can ticket stakes be pulled back or recycled?", a: "To ensure full baseline security parameters for all live participants, assets allocated into operational pools are locked inside active schemas until countdown draws complete." }
          ].map((item, index) => {
            const isFaqOpen = activeFaq === index;
            return (
              <div key={index} className="bg-white border-2 border-[#1A1D20] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => { AudioEngine.playClick(); setActiveFaq(isFaqOpen ? null : index); }}
                  className="w-full p-3 flex items-center justify-between text-left text-[11px] font-black text-[#1A1D20] active:bg-slate-50"
                >
                  <span>{item.q}</span>
                  <CornerDownRight className={`w-3.5 h-3.5 text-slate-400 ${isFaqOpen ? 'text-[#9D4EDD]' : ''}`} strokeWidth={2.5} />
                </button>
                {isFaqOpen && (
                  <div className="px-3 pb-3 pt-1 text-[10px] font-bold leading-relaxed text-slate-500 bg-[#F4F7F5]/50 border-t border-slate-100">
                    {item.a}
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
