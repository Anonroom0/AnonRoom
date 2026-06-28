import React, { useState, useEffect } from 'react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';
import { ShoppingBag, Ticket, Award, ArrowRight, Star, Percent, ShieldCheck } from 'lucide-react';

export default function HomeView({ onTabChange }) {
  const [ticketCount, setTicketCount] = useState(0);
  const [activeRaffles, setActiveRaffles] = useState([]);
  const [touchState, setTouchState] = useState({ startX: 0, currentOffset: 0, isSwiping: false });
  const [voucherAvailable, setVoucherAvailable] = useState(true);

  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const [ticketData, raffleData] = await Promise.all([
          MockAPI.getUserTickets(),
          MockAPI.getRaffles()
        ]);
        
        // Sum total tickets bought across all verified batch arrays
        const totalOwned = ticketData.reduce((acc, curr) => acc + curr.quantity_bought, 0);
        setTicketCount(totalOwned);
        setActiveRaffles(raffleData.slice(0, 3));
      } catch (err) {
        console.error("Home view pipeline aggregation fault: ", err);
      }
    }
    loadWorkspaceData();
  }, []);

  // Responsive interactive touch-gesture layer for mobile/tablet hero banners
  const handleTouchStart = (e) => {
    setTouchState({
      startX: e.touches[0].clientX,
      currentOffset: 0,
      isSwiping: true
    });
  };

  const handleTouchMove = (e) => {
    if (!touchState.isSwiping) return;
    const diffX = e.touches[0].clientX - touchState.startX;
    // Cap variance offset thresholds
    setTouchState(prev => ({ ...prev, currentOffset: Math.min(Math.max(diffX, -120), 120) }));
  };

  const handleTouchEnd = () => {
    if (touchState.currentOffset < -60) {
      AudioEngine.playClick();
      onTabChange('raffle');
    }
    setTouchState({ startX: 0, currentOffset: 0, isSwiping: false });
  };

  return (
    <div className="space-y-8 w-full">
      
      {/* 📱 TOUCH-RESPONSIVE INTERACTIVE HERO BANNER */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-56 bg-black text-white p-6 flex flex-col justify-between border-2 border-black relative overflow-hidden transition-transform duration-150 ease-out"
        style={{ transform: `translateX(${touchState.currentOffset}px)` }}
      >
        <div className="space-y-1.5 max-w-[85%]">
          <span className="text-[9px] uppercase font-black tracking-[0.2em] bg-[#10B981] text-black px-2 py-0.5 inline-block">
            Premium Drops
          </span>
          <h1 className="text-xl font-black uppercase tracking-wide leading-tight">
            Exclusive Campaigns Live Now
          </h1>
          <p className="text-[11px] font-medium text-slate-400 max-w-sm">
            Access transparent probability pools with flat 1 AR registration voucher entry limits.
          </p>
        </div>

        <div className="w-full flex items-center justify-between border-t border-white/10 pt-4">
          <button 
            onClick={() => onTabChange('raffle')}
            className="btn-pro-emerald py-2 text-[10px]"
          >
            Buy Tickets
          </button>
          
          <span className="hidden md:inline-block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            Swipe left to cycle arena items →
          </span>
        </div>
      </div>

      {/* 📊 PLATFORM CONTEXT MATRIX: STAKES COUNT & AVAILABLE COUPONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Module Area A: Active Stakes Tracker summary info block */}
        <div className="border-2 border-black p-5 bg-white flex flex-col justify-between h-32 relative">
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Allocated Stakes Summary
            </span>
            <Ticket className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono leading-none">{ticketCount}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Active Vouchers
            </span>
          </div>
          <button 
            onClick={() => onTabChange('tickets')}
            className="text-[9px] font-black uppercase tracking-wider text-black underline text-left mt-auto hover:text-[#10B981] transition-colors"
          >
            Review Entry Codes
          </button>
        </div>

        {/* Module Area B: Reward Notification Claims Center Box */}
        <div className="border-2 border-black p-5 bg-white flex flex-col justify-between h-32 relative">
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Claim Vault Status
            </span>
            <Award className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
          </div>
          {voucherAvailable ? (
            <div className="space-y-1 mt-2">
              <h4 className="text-xs font-black uppercase tracking-wide text-black">
                Trading Fee Vouchers Unlocked
              </h4>
              <p className="text-[10px] font-bold text-slate-400">
                Binance replica coupons ready inside personal vaults.
              </p>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400 mt-2">No pending reward items found.</span>
          )}
          <button 
            onClick={() => onTabChange('profile')}
            className="btn-pro-black py-1 px-3 text-[9px] uppercase tracking-widest font-black ml-auto mt-auto"
          >
            View Rewards
          </button>
        </div>
      </div>

      {/* ⚡ DIRECT SELECTION STREAM: PREMIUM CAMPAIGNS TILES PREVIEWS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-black" strokeWidth={2.5} />
            <h3 className="text-xs font-black uppercase tracking-widest text-black">
              Featured Drawing Pool Previews
            </h3>
          </div>
          <button 
            onClick={() => onTabChange('raffle')}
            className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1 group transition-colors hover:text-black"
          >
            All Pools <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
          </button>
        </div>

        {/* Dense Professional Grid Layout row block context frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeRaffles.map((raffle) => {
            const poolPercentage = Math.round((raffle.tickets_sold / raffle.total_tickets) * 100);
            return (
              <div 
                key={raffle.id}
                className="border-2 border-black p-4 bg-white space-y-3 flex flex-col justify-between"
              >
                <div className="w-full h-32 bg-slate-100 border border-slate-200 relative overflow-hidden">
                  <img src={raffle.image} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 text-[8px] font-black bg-black text-white px-1.5 py-0.5 uppercase tracking-wider">
                    {raffle.category}
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-black text-black uppercase tracking-wide truncate">
                    {raffle.title}
                  </h4>
                  <div className="w-full h-1.5 bg-slate-100 border border-black overflow-hidden mt-1.5">
                    <div className="h-full bg-black" style={{ width: `${poolPercentage}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    <span>Filled Capacity</span>
                    <span className="font-mono text-black">{poolPercentage}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onTabChange('raffle')}
                  className="w-full btn-pro-black py-2 text-[10px]"
                >
                  Buy Ticket
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
