import React, { useState, useEffect } from 'react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';
import { 
  Layers, 
  Clock, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronLeft, 
  Sparkles, 
  Filter, 
  TrendingUp, 
  ShoppingBag, 
  Flame, 
  DollarSign, 
  Gauge, 
  Activity,
  Award,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function RaffleView() {
  const [raffles, setRaffles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDetailRaffle, setActiveDetailRaffle] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [detailSubTab, setDetailSubTab] = useState('info');
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [estimatedGas, setEstimatedGas] = useState(0.0024);
  const [livePoolTicker, setLivePoolTicker] = useState([]);

  useEffect(() => {
    async function loadRaffles() {
      try {
        const data = await MockAPI.getRaffles();
        setRaffles(data);
      } catch (err) {
        console.error("Failed to fetch raffle arrays: ", err);
      }
    }
    loadRaffles();

    // Streaming feed simulation for live raffle stakes tracking inside the deep-dive module
    const interactionStreams = setInterval(() => {
      const generatedLog = {
        id: Math.random().toString(),
        user: `anon_node_${Math.floor(Math.random() * 900 + 100)}`,
        count: Math.floor(Math.random() * 15) + 1,
        stamp: 'Just now'
      };
      setLivePoolTicker(prev => [generatedLog, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interactionStreams);
  }, []);

  const handleCategorySelection = (category) => {
    AudioEngine.playClick();
    setSelectedCategory(category);
  };

  const handlePurchase = async (raffleId) => {
    try {
      AudioEngine.playClick();
      setPurchaseStatus('processing');
      // Execute simulated latency lock check step
      await new Promise(resolve => setTimeout(resolve, 1400));
      await MockAPI.purchaseTickets(raffleId, ticketQuantity);
      
      setPurchaseStatus('success');
      const updatedList = await MockAPI.getRaffles();
      setRaffles(updatedList);
      
      const refreshedRaffle = updatedList.find(r => r.id === raffleId);
      setActiveDetailRaffle(refreshedRaffle);
    } catch (err) {
      setPurchaseStatus('error');
    }
  };

  const filteredRaffles = raffles.filter(raffle => {
    const matchesCategory = selectedCategory === 'all' || raffle.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = raffle.title.toLowerCase().includes(quickSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full h-full relative pb-32">
      
      {/* 1. COMPONENT CONTENT STICKY HEADER NAVIGATION FILTER */}
      <div className="sticky top-0 z-20 w-full bg-[#F4F7F5] pb-4 pt-1 space-y-3">
        
        {/* Search Parameter Inputs Bar */}
        <div className="w-full relative flex items-center">
          <input 
            type="text" 
            placeholder="Search active raffle pools..." 
            value={quickSearchQuery}
            onChange={(e) => setQuickSearchQuery(e.target.value)}
            className="w-full bg-white border-4 border-[#1A1D20] rounded-2xl px-4 py-2.5 text-xs font-black text-[#1A1D20] placeholder-slate-400 shadow-[3px_3px_0px_#1A1D20] focus:outline-none"
          />
          <Filter className="absolute right-4 w-4 h-4 text-slate-500" strokeWidth={2.5} />
        </div>

        {/* Ticker Selector Category Sliders Row */}
        <div className="w-full flex gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
          {['all', 'goodies', 'AR', 'NFTs', 'crypto'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelection(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border-4 transition-all shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-[#9D4EDD] border-[#1A1D20] text-white shadow-[3px_3px_0px_#1A1D20]' 
                  : 'bg-white border-[#1A1D20] text-[#1A1D20] shadow-[2px_2px_0px_#1A1D20] active:translate-y-0.5 active:shadow-[0px_0px_#1A1D20]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STRANGE JELLYFISH 63: OVERHAULED 2-COLUMN SQUARE GRID ARCHITECTURE */}
      {filteredRaffles.length === 0 ? (
        <div className="w-full cartoon-plate-purple p-8 text-center border-dashed border-4 border-slate-300">
          <AlertCircle className="w-8 h-8 text-[#FF6B6B] mx-auto mb-2" strokeWidth={2.5} />
          <h4 className="text-sm font-black text-[#1A1D20] uppercase">No Dynamic Drawing Matches</h4>
          <p className="text-[11px] font-bold text-slate-400 max-w-[200px] mx-auto mt-1">
            Refine your query filters or explore standard active structural pools.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredRaffles.map((raffle) => {
            const soldPercentage = Math.round((raffle.tickets_sold / raffle.total_tickets) * 100);
            return (
              <div 
                key={raffle.id}
                className="jellyfish-card border-4 border-[#1A1D20] bg-white shadow-[5px_5px_0px_#1A1D20] aspect-square flex flex-col justify-between overflow-hidden"
              >
                {/* Image replacement structural layout frame */}
                <div className="w-full h-[52%] rounded-xl overflow-hidden bg-[#1A1D20] relative border-2 border-[#1A1D20] shrink-0">
                  <img src={raffle.image} alt="" className="w-full h-full object-cover opacity-85" />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[7px] font-black bg-[#FFF275] border-2 border-[#1A1D20] text-[#1A1D20] uppercase tracking-wide">
                    {soldPercentage}% FILLED
                  </div>
                </div>

                {/* Info and action terminal parameters footer */}
                <div className="h-[44%] flex flex-col justify-between pt-1 space-y-1">
                  <div className="px-0.5 min-w-0">
                    <h3 className="text-[11px] font-black tracking-wide text-[#1A1D20] truncate leading-tight">
                      {raffle.title}
                    </h3>
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                      <span>Rate</span>
                      <span className="text-[#38B000]">1 AR / TKT</span>
                    </div>
                  </div>

                  {/* Progressive indicator strip line */}
                  <div className="w-full h-2 bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-[#00F5D4]" style={{ width: `${soldPercentage}%` }} />
                  </div>

                  {/* Explicit execution join action button */}
                  <button 
                    onClick={() => {
                      AudioEngine.playClick();
                      setActiveDetailRaffle(raffle);
                      setTicketQuantity(1);
                      setPurchaseStatus(null);
                      setDetailSubTab('info');
                    }}
                    className="w-full btn-cartoon-purple py-1 text-[10px] uppercase font-black tracking-wider scale-[0.9] origin-center shrink-0"
                  >
                    Participate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. EXPERT LAYER FULL-SCREEN POOL DEEP-DIVE EXPANSION INTERFACE */}
      {activeDetailRaffle && (
        <div className="absolute inset-0 z-50 bg-[#F4F7F5] flex flex-col justify-between border-t-4 border-[#1A1D20] animate-view-jump">
          
          {/* Navigation layout banner heading */}
          <div className="w-full h-16 border-b-4 border-[#1A1D20] px-4 flex items-center justify-between bg-white sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#38B000] border-2 border-[#1A1D20] animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">
                Active Pool Deep-Dive View
              </span>
            </div>
            <button 
              onClick={() => { AudioEngine.playClick(); setActiveDetailRaffle(null); }}
              className="btn-cartoon-secondary py-1 px-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={3} /> Exit View
            </button>
          </div>

          {/* Internal content scrolling array box */}
          <div className="p-5 flex-1 space-y-6 overflow-y-auto custom-scrollbar pb-32">
            
            {/* Main Image Banner Frame Layout */}
            <div className="w-full h-48 bg-[#1A1D20] border-4 border-[#1A1D20] rounded-3xl relative overflow-hidden shadow-[4px_4px_0px_#1A1D20]">
              <img src={activeDetailRaffle.image} alt="" className="w-full h-full object-cover opacity-80" />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md text-[9px] font-black bg-white border-2 border-[#1A1D20] tracking-wider uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#1A1D20]">
                <Clock className="w-3 h-3 text-[#9D4EDD]" strokeWidth={3} /> Verification Timer Active
              </div>
            </div>

            {/* Sub-Tab Control Buttons Header Rail */}
            <div className="w-full border-b-4 border-[#1A1D20] flex gap-4 text-xs font-black uppercase tracking-widest bg-white/40 p-1 rounded-xl">
              {['info', 'allocate tickets', 'live metrics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { AudioEngine.playClick(); setDetailSubTab(tab); }}
                  className={`pb-2 pt-1 px-2 relative font-black transition-colors ${
                    detailSubTab === tab ? 'text-[#9D4EDD]' : 'text-slate-400'
                  }`}
                >
                  {tab}
                  {detailSubTab === tab && (
                    <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-[#9D4EDD] rounded-full border-b border-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Conditional Sub-Panel Content Port Injection Chassis */}
            <div className="text-xs leading-relaxed text-[#1A1D20] font-bold min-h-[160px]">
              
              {/* Context Module A: Basic Specifications */}
              {detailSubTab === 'info' && (
                <div className="space-y-4 animate-view-jump">
                  <div className="cartoon-plate-amber p-4 space-y-2">
                    <h4 className="text-xs font-black uppercase text-[#1A1D20]">Protocol Allocation Formula</h4>
                    <p className="text-[11px] font-bold text-slate-500 leading-normal">
                      Every registration voucher token ticket assigned to this sandbox matrix maps directly onto our decentralized storage layers. Winning ratios adapt linearly matching real-time volume conditions.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border-2 border-[#1A1D20] rounded-xl text-center shadow-[2px_2px_0px_#1A1D20]">
                      <span className="text-[8px] font-black uppercase text-slate-400 block">Total Pool Cap</span>
                      <span className="text-xs font-black font-mono text-[#9D4EDD]">{activeDetailRaffle.total_tickets} AR</span>
                    </div>
                    <div className="p-3 bg-white border-2 border-[#1A1D20] rounded-xl text-center shadow-[2px_2px_0px_#1A1D20]">
                      <span className="text-[8px] font-black uppercase text-slate-400 block">Ticket Step Price</span>
                      <span className="text-xs font-black font-mono text-[#38B000]">1.00 AR</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Context Module B: Allocation Checkout Desk Console */}
              {detailSubTab === 'allocate tickets' && (
                <div className="space-y-4 animate-view-jump pt-1">
                  <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#1A1D20]">Set Ticket Limit:</span>
                      <div className="flex items-center gap-3 bg-[#F4F7F5] border-2 border-[#1A1D20] rounded-xl px-2 py-1">
                        <button 
                          onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border-2 border-[#1A1D20] text-xs font-black shadow-[1px_1px_0px_#1A1D20] active:translate-y-0.5"
                        >
                          -
                        </button>
                        <span className="text-sm font-black font-mono w-6 text-center text-[#1A1D20]">{ticketQuantity}</span>
                        <button 
                          onClick={() => setTicketQuantity(prev => prev + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg border-2 border-[#1A1D20] text-xs font-black shadow-[1px_1px_0px_#1A1D20] active:translate-y-0.5"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-slate-200 pt-3 flex justify-between text-[11px] font-black text-slate-500">
                      <span>Simulated Pipeline Gas Layer Fee:</span>
                      <span className="font-mono text-[#1A1D20]">{estimatedGas} AR</span>
                    </div>

                    <button 
                      onClick={() => handlePurchase(activeDetailRaffle.id)}
                      disabled={purchaseStatus === 'processing'}
                      className="w-full btn-cartoon-purple py-3 text-xs tracking-widest font-black uppercase"
                    >
                      {purchaseStatus === 'processing' ? 'Encrypting Order Package...' : `Commit Stake [ ${ticketQuantity * 1}.00 AR ]`}
                    </button>
                  </div>

                  {/* Interactive Status Validation Message Box Overhaul */}
                  {purchaseStatus === 'success' && (
                    <div className="p-3.5 bg-[#00F5D4] border-4 border-[#1A1D20] text-[#1A1D20] font-black rounded-xl flex items-center gap-2.5 shadow-[3px_3px_0px_#1A1D20] animate-bounce">
                      <CheckCircle2 className="w-5 h-5 text-[#1A1D20]" strokeWidth={3} /> 
                      <span>Ticket Order Successful</span>
                    </div>
                  )}
                  {purchaseStatus === 'error' && (
                    <div className="p-3.5 bg-[#FF6B6B] border-4 border-[#1A1D20] text-white font-black rounded-xl flex items-center gap-2.5 shadow-[3px_3px_0px_#1A1D20]">
                      <ShieldAlert className="w-5 h-5 text-white" strokeWidth={3} /> 
                      <span>Allocation limits error block occurred.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Context Module C: Real-Time Stream Logs Tracker Network */}
              {detailSubTab === 'live metrics' && (
                <div className="space-y-3 animate-view-jump">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 px-1">
                    <Activity className="w-3.5 h-3.5 text-[#9D4EDD]" strokeWidth={2.5} />
                    <span>Live Local Drawing Entry Stream Feed</span>
                  </div>
                  
                  {livePoolTicker.length === 0 ? (
                    <div className="text-center py-6 font-bold text-slate-300 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                      Listening to pool sequence socket ticks...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {livePoolTicker.map((log) => (
                        <div 
                          key={log.id} 
                          className="p-2.5 rounded-xl bg-white border-2 border-[#1A1D20] flex items-center justify-between text-[11px] font-bold shadow-[2px_2px_0px_#1A1D20]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#1A1D20] font-black">{log.user}</span>
                            <span className="text-slate-400">allocated</span>
                            <span className="text-[#9D4EDD] font-black px-1.5 py-0.2 bg-[#F4F7F5] border border-black rounded">
                              {log.count} tkts
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono font-medium">{log.stamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
