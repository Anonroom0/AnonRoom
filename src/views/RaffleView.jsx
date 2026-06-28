import React, { useState, useEffect } from 'react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';
import { Layers, Clock, ShieldAlert, CheckCircle2, ChevronLeft, Filter, Search } from 'lucide-react';

export default function RaffleView() {
  const [raffles, setRaffles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDetailRaffle, setActiveDetailRaffle] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadRaffleData() {
      try {
        const data = await MockAPI.getRaffles();
        setRaffles(data);
      } catch (err) {
        console.error("Failed to load raffle records: ", err);
      }
    }
    loadRaffleData();
  }, []);

  const handleCategoryChange = (category) => {
    AudioEngine.playClick();
    setSelectedCategory(category);
  };

  const handlePurchaseSubmit = async (raffleId) => {
    try {
      AudioEngine.playClick();
      setPurchaseStatus('processing');
      await new Promise(resolve => setTimeout(resolve, 1200)); // Standard simulation latency
      await MockAPI.purchaseTickets(raffleId, ticketQuantity);
      
      setPurchaseStatus('success');
      const updatedList = await MockAPI.getRaffles();
      setRaffles(updatedList);
      setActiveDetailRaffle(updatedList.find(r => r.id === raffleId));
    } catch (err) {
      setPurchaseStatus('error');
    }
  };

  const filteredItems = raffles.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full h-full relative pb-32">
      
      {/* FILTER & SEARCH UTILITY MODULE */}
      <div className="sticky top-0 z-20 w-full bg-white pb-4 space-y-3">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F7F5] border-2 border-black rounded-none px-4 py-2 text-xs font-bold text-black focus:outline-none"
          />
          <Search className="absolute right-4 w-4 h-4 text-slate-400" strokeWidth={2.5} />
        </div>

        <div className="w-full flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {['all', 'goodies', 'AR', 'NFTs', 'crypto'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-all shrink-0 rounded-none ${
                selectedCategory === cat 
                  ? 'bg-black border-black text-white' 
                  : 'bg-white border-black text-black hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* STRANGE JELLYFISH 63 IMPLEMENTATION: PROFESSIONAL 2-COLUMN SQUARE GRID */}
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((raffle) => {
          const filledPercentage = Math.round((raffle.tickets_sold / raffle.total_tickets) * 100);
          return (
            <div 
              key={raffle.id} 
              className="border-2 border-black bg-white p-3 flex flex-col justify-between aspect-square overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Product campaign photo container */}
              <div className="w-full h-[50%] bg-slate-100 border border-slate-200 relative overflow-hidden shrink-0">
                <img src={raffle.image} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 text-[7px] font-black bg-black text-white px-1.5 py-0.5 tracking-wide">
                  {filledPercentage}% SOLD
                </span>
              </div>
              
              <div className="h-[46%] flex flex-col justify-between pt-1 space-y-1 min-w-0">
                <div>
                  <h3 className="text-[11px] font-black tracking-wide text-black uppercase truncate leading-tight">
                    {raffle.title}
                  </h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Price: 1 AR
                  </p>
                </div>
                
                {/* Clean inline tracking line progress metric */}
                <div className="w-full h-1 bg-slate-100 border border-black overflow-hidden shrink-0">
                  <div className="h-full bg-black" style={{ width: `${filledPercentage}%` }} />
                </div>

                <button 
                  onClick={() => {
                    AudioEngine.playClick();
                    setActiveDetailRaffle(raffle);
                    setTicketQuantity(1);
                    setPurchaseStatus(null);
                  }}
                  className="w-full btn-pro-black py-1 text-[9px] font-black tracking-widest uppercase"
                >
                  Join Pool
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL-SCREEN DETAIL CHECKOUT DRAWER OVERLAY */}
      {activeDetailRaffle && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col justify-between border-t-2 border-black animate-tab-switch">
          
          <div className="w-full h-16 border-b-2 border-black px-4 flex items-center justify-between bg-white sticky top-0 z-30">
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Campaign Checkout Options
            </span>
            <button 
              onClick={() => { AudioEngine.playClick(); setActiveDetailRaffle(null); }}
              className="btn-pro-outline py-1 px-3 text-[10px]"
            >
              Back
            </button>
          </div>

          <div className="p-5 flex-1 space-y-6 overflow-y-auto custom-scrollbar pb-32">
            <div className="w-full h-44 bg-slate-100 border-2 border-black relative overflow-hidden">
              <img src={activeDetailRaffle.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-black uppercase text-black leading-tight">
                {activeDetailRaffle.title}
              </h2>
              <div className="border-t border-black/10 pt-3 flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Registration Price</span>
                <span className="font-mono text-black font-black">1.00 AR / Ticket</span>
              </div>
            </div>

            {/* CHECKOUT BOX */}
            <div className="border-2 border-black p-4 space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">Select Quantity</span>
                <div className="flex items-center gap-2 bg-[#F4F7F5] border border-black p-1">
                  <button 
                    onClick={() => setTicketQuantity(p => Math.max(1, p - 1))}
                    className="w-6 h-6 bg-white border border-black text-xs font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-black font-mono">{ticketQuantity}</span>
                  <button 
                    onClick={() => setTicketQuantity(p => p + 1)}
                    className="w-6 h-6 bg-white border border-black text-xs font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => handlePurchaseSubmit(activeDetailRaffle.id)}
                disabled={purchaseStatus === 'processing'}
                className="w-full btn-pro-emerald py-2.5 text-xs font-black uppercase tracking-widest"
              >
                {purchaseStatus === 'processing' ? 'Processing Transaction...' : 'Confirm Ticket Purchase'}
              </button>
            </div>

            {/* STATUS NOTIFICATION METRICS */}
            {purchaseStatus === 'success' && (
              <div className="p-4 bg-[#10B981]/10 border-2 border-[#10B981] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" strokeWidth={3} />
                <span>Ticket Order Processed Cleanly</span>
              </div>
            )}
            {purchaseStatus === 'error' && (
              <div className="p-4 bg-red-50 border-2 border-red-500 text-red-500 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" strokeWidth={2.5} />
                <span>Transaction Limits Exception Mismatch Encountered</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
