import React, { useState, useEffect } from 'react';
import { MockAPI } from '../services/MockApi.js';
import { AudioEngine } from '../services/AudioEngine.js';
import { Ticket, ChevronDown, ChevronUp, ArrowUpRight, Percent, Fingerprint } from 'lucide-react';

export default function MyTicketsView({ onTabChange }) {
  const [tickets, setTickets] = useState([]);
  const [raffles, setRaffles] = useState([]);
  const [expandedEpid, setExpandedEpid] = useState(null);

  useEffect(() => {
    async function loadTicketsLedger() {
      try {
        const [ticketData, raffleData] = await Promise.all([
          MockAPI.getUserTickets(),
          MockAPI.getRaffles()
        ]);
        setTickets(ticketData);
        setRaffles(raffleData);
      } catch (err) {
        console.error("Failed to sync structural tickets repository arrays: ", err);
      }
    }
    loadTicketsLedger();
  }, []);

  const toggleCounterBox = (epid) => {
    AudioEngine.playClick();
    setExpandedEpid(expandedEpid === epid ? null : epid);
  };

  return (
    <div className="space-y-6 w-full pb-32">
      
      {/* HEADER INDEX LEGEND BLOCK */}
      <div className="flex items-center justify-between px-1 border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-black" strokeWidth={2.5} />
          <h3 className="text-xs font-black uppercase tracking-widest text-black">
            Verified Purchase Stakes Ledger
          </h3>
        </div>
        <span className="text-[10px] font-mono font-black text-white bg-black px-2 py-0.5 uppercase tracking-wider">
          Total Batches: {tickets.length}
        </span>
      </div>

      {/* HORIZONTAL VOUCHER STACKS LOOP CHASSIS */}
      {tickets.length === 0 ? (
        <div className="border-2 border-black border-dashed p-8 text-center text-xs font-bold text-slate-400">
          No active ticket stakes allocated within this account workspace.
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((batch) => {
            const pairedPool = raffles.find((r) => r.id === batch.raffle_id);
            
            // Unique Event Participation ID (EPID) generation string matrix match rule
            const generatedEPID = `EPID-2026-${batch.id.slice(0, 4).toUpperCase()}-${batch.raffle_id.slice(-4).toUpperCase()}`;
            
            // Calculate real-time winning probability weights
            const winProbability = pairedPool
              ? ((batch.quantity_bought / pairedPool.tickets_sold) * 100).toFixed(2)
              : '0.00';

            const isBoxExpanded = expandedEpid === generatedEPID;

            return (
              <div key={batch.id} className="w-full flex flex-col">
                
                {/* 🎟️ HORIZONTAL SLICE TICKET: WITH SOLID COLORED END SQUARE & JAGS MASK */}
                <div className="pro-ticket-shape h-24 flex overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                  
                  {/* Left Descriptive Core Information Segment Block */}
                  <div className="w-[68%] p-3 flex flex-col justify-between min-w-0 pr-4">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] font-black font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-none tracking-wide uppercase inline-block">
                        {generatedEPID}
                      </span>
                      <h4 className="text-xs font-black text-black uppercase tracking-wide truncate mt-0.5">
                        {pairedPool?.title || 'System Raffle Campaign Pool'}
                      </h4>
                    </div>

                    {/* Meta-metrics alignment layout row */}
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Percent className="w-3 h-3 text-[#10B981]" strokeWidth={2.5} />
                        <span className="font-mono text-black font-black">{winProbability}% Chance</span>
                      </div>
                    </div>
                  </div>

                  {/* SMALL INTERACTIVE CLICKABLE BOX COUNTER */}
                  <div 
                    onClick={() => toggleCounterBox(generatedEPID)}
                    className="w-[12%] border-l-2 border-dashed border-black bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-mono font-black text-black leading-none">
                      {batch.quantity_bought}
                    </span>
                    <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest mt-0.5">
                      Units
                    </span>
                    <div className="mt-1">
                      {isBoxExpanded ? (
                        <ChevronUp className="w-3 h-3 text-black" strokeWidth={3} />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-black" strokeWidth={3} />
                      )}
                    </div>
                  </div>

                  {/* RIGHT BLOCK SIDE: SOLID DIFFERENT COLORED END SQUARE WITH PRIZE PHOTO EMBEDDED */}
                  <div className="w-[20%] bg-black relative border-l-2 border-black flex items-center justify-center overflow-hidden shrink-0">
                    {/* Multi-triangular cutting jagged sawtooth left edge simulation lines */}
                    <div className="absolute left-[-4px] top-0 bottom-0 w-[6px] flex flex-col justify-between py-0.5 pointer-events-none z-10">
                      {[...Array(10)].map((_, idx) => (
                        <div 
                          key={idx} 
                          className="w-1.5 h-1.5 bg-white border-r border-t border-black transform rotate-45 transform-origin-center -ml-0.5" 
                        />
                      ))}
                    </div>

                    {/* Embedded Prize Photo matrix backdrop display */}
                    {pairedPool?.image ? (
                      <img 
                        src={pairedPool.image} 
                        alt="" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900" />
                    )}
                  </div>

                </div>

                {/* 📂 EXPANDABLE COUNT VALUE SUBFRAME BLOCK INTERFACE DISCLOSURE */}
                {isBoxExpanded && (
                  <div className="p-4 bg-slate-50 border-x-2 border-b-2 border-black -mt-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] animate-tab-switch text-xs space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                          Event Registration ID String
                        </span>
                        <span className="font-mono font-bold text-black text-[11px] block select-all">
                          {generatedEPID}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                          Verified Units Stakes Lock
                        </span>
                        <span className="font-mono font-bold text-[#10B981] text-[11px] block">
                          {batch.quantity_bought} Allocations Confirmed
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-black/10 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <Fingerprint className="w-3.5 h-3.5" strokeWidth={2.5} />
                        <span>Receipt code synced locally inside dashboard variables.</span>
                      </div>

                      {/* Direct redirect link trigger block step to target drawing page */}
                      <button
                        onClick={() => onTabChange('raffle')}
                        className="btn-pro-black py-1 px-3 text-[9px] font-black flex items-center gap-1 shrink-0"
                      >
                        View Active Campaign Pool <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
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
