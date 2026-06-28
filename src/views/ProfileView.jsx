import React, { useState } from 'react';
import { AudioEngine } from '../services/AudioEngine.js';
import { 
  Award, 
  Users, 
  Trophy, 
  Gift, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  Smartphone, 
  Image, 
  DollarSign, 
  UserPlus, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function ProfileView({ userProfile, onOpenWallet }) {
  const [activeSubView, setActiveSubView] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [appTaskInput, setAppTaskInput] = useState('');
  const [imageFileAttached, setImageFileAttached] = useState(false);
  const [isTaskSubmitted, setIsTaskSubmitted] = useState(false);

  // 🎫 REWARD HUB OVERHAUL: Precise Binance Coupon Stub Matrix Replication Array (Ref: 2872341c)
  const mockVouchers = [
    { 
      id: 'vch-101', 
      title: 'Trading Fee Rebate Voucher', 
      value: '30', 
      unit: 'USDT', 
      rule: 'Use before 2026-07-28 19:10 (UTC+5.5)', 
      label: 'Spot', 
      source: 'From nguyen Global All churn deposit campaigns' 
    },
    { 
      id: 'vch-102', 
      title: 'Trading Fee Rebate Voucher', 
      value: '75', 
      unit: 'USDT', 
      rule: 'Use before 2026-07-28 19:10 (UTC+5.5)', 
      label: 'Spot', 
      source: 'From Future Click Task Rewards Hub allocation' 
    },
    { 
      id: 'vch-103', 
      title: 'Trading Fee Rebate Voucher', 
      value: '20', 
      unit: 'USDT', 
      rule: 'Use before 2026-07-25 18:48 (UTC+5.5)', 
      label: 'Spot', 
      source: 'From secondary tier social milestones verification' 
    }
  ];

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("ANON_VAIBHAV_77");
    AudioEngine.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleAppTaskSubmit = (e) => {
    e.preventDefault();
    AudioEngine.playClick();
    if (!appTaskInput || !imageFileAttached) return;
    setIsTaskSubmitted(true);
    setTimeout(() => {
      setIsTaskSubmitted(false);
      setAppTaskInput('');
      setImageFileAttached(false);
      setActiveSubView(null);
    }, 1800);
  };

  return (
    <div className="w-full h-full relative">
      
      {/* ============================================================
          MAIN PROFILE PRIMARY VIEW SURFACE
          ============================================================ */}
      <div className="space-y-8 pb-32 w-full">
        
        {/* 👤 IDENTITY PROFILE CONTAINER: Curvy Termite 76 Re-engineering */}
        <div className="termite-card border-4 border-[#1A1D20] bg-white relative pt-8 pb-6 px-4">
          {/* Top Circular Cartoon Silhouette Frame (Bigger & Crisp) */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00F5D4] via-[#9D4EDD] to-[#FFF275] border-4 border-[#1A1D20] shadow-[0px_6px_0px_#1A1D20] mx-auto flex items-center justify-center font-black text-3xl text-[#1A1D20]">
            VS
          </div>
          
          <div className="mt-4 space-y-1">
            <h2 className="text-xl font-black text-[#1A1D20] tracking-wide">
              vaibhav_singhal
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F4F7F5] border-2 border-[#1A1D20] text-[10px] font-black uppercase tracking-wider text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38B000]" strokeWidth={3} /> Verified Sandbox Node Account
            </div>
          </div>

          {/* Core System Interaction Button Anchor Section */}
          <div className="mt-6 pt-5 border-t-4 border-dashed border-[#1A1D20]/10 flex justify-center">
            <button 
              onClick={() => { AudioEngine.playClick(); onOpenWallet(); }}
              className="btn-cartoon-green text-xs font-black tracking-widest px-8 py-2.5"
            >
              Manage Node Balance Wallet
            </button>
          </div>
        </div>

        {/* 📋 CHUNKY 2X2 MACRO CARDS NAVIGATION SWITCH GRID (BIGGER TARGET MODULES) */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'tasks', title: 'Task Core Hub', desc: '3 Specialized Tiers', icon: Award, color: 'text-[#9D4EDD]', shadow: 'shadow-[5px_5px_0px_#9D4EDD]' },
            { id: 'referral', title: 'Referral Track', desc: '10% Recurring Yield', icon: Users, color: 'text-[#4EA8DE]', shadow: 'shadow-[5px_5px_0px_#4EA8DE]' },
            { id: 'wins', title: 'Claim Ledger', desc: 'Reward Claims History', icon: Trophy, color: 'text-[#FF9F1C]', shadow: 'shadow-[5px_5px_0px_#FF9F1C]' },
            { id: 'rewards', title: 'Voucher Vault', desc: 'Binance Replica Cards', icon: Gift, color: 'text-[#38B000]', shadow: 'shadow-[5px_5px_0px_#38B000]' }
          ].map((card) => {
            const IconComponent = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => { AudioEngine.playClick(); setActiveSubView(card.id); }}
                className={`bg-white border-4 border-[#1A1D20] rounded-3xl p-4 flex flex-col items-start text-left justify-between h-28 ${card.shadow} active:translate-y-1 active:shadow-none transition-all group relative overflow-hidden`}
              >
                <div className={`p-2 rounded-xl bg-[#F4F7F5] border-2 border-[#1A1D20] ${card.color}`}>
                  <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="w-full space-y-0.5 pt-2">
                  <h4 className="text-xs font-black text-[#1A1D20] tracking-wide uppercase flex items-center justify-between w-full">
                    {card.title} <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-black transition-colors" strokeWidth={3} />
                  </h4>
                  <p className="text-[9px] font-bold text-slate-400 truncate tracking-wide uppercase">{card.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 📚 LEGAL PROTOCOL BROADCAST LITIGATION TILES */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 px-1 block">
            Ecosystem Literature Guidelines
          </span>
          <div className="w-full bg-white border-4 border-[#1A1D20] rounded-2xl divide-y-4 divide-[#1A1D20] shadow-[4px_4px_0px_#1A1D20]">
            
            {/* Whitepaper Internal Tile Link */}
            <div className="p-4 flex items-center justify-between text-xs font-black text-[#1A1D20] bg-white cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#9D4EDD]" strokeWidth={2.5} />
                <span className="tracking-wide">Platform Protocol Architecture Whitepaper</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
            </div>

            {/* Terms and Conditions Segment Internal Link */}
            <div className="p-4 flex items-center justify-between text-xs font-black text-[#1A1D20] bg-white cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#38B000]" strokeWidth={2.5} />
                <span className="tracking-wide">Terms of Litigation & Service Conditions</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* ❓ PROFILE COMPREHENSIVE INLINE FAQ ACCORDIONS ACCELERATOR */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-1">
            <HelpCircle className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">
              Personal Node Operational FAQ Info
            </span>
          </div>
          <div className="space-y-2">
            {[
              { q: "What security layer keeps task screenshots safe?", a: "Every form package file submission asset is written cleanly into localized secure sandbox environment nodes, completely separating user privacy vectors from public ledger records." },
              { q: "How long does verification audit execution take?", a: "Social media and app task audits execute inside manual review pipelines within 12-24 hours. Points append automatically as spendable token vouchers upon confirmation." }
            ].map((faq, idx) => {
              const isFaqOpen = expandedFaq === idx;
              return (
                <div key={idx} className="bg-white border-2 border-[#1A1D20] rounded-xl overflow-hidden shadow-[2px_2px_0px_#1A1D20]">
                  <button
                    type="button"
                    onClick={() => { AudioEngine.playClick(); setExpandedFaq(isFaqOpen ? null : idx); }}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs font-black text-[#1A1D20] active:bg-slate-50"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isFaqOpen ? 'transform rotate-90 text-[#9D4EDD]' : ''}`} strokeWidth={3} />
                  </button>
                  {isFaqOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-[11px] font-bold leading-relaxed text-slate-500 border-t border-slate-100 bg-[#F4F7F5]/50 animate-view-jump">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ============================================================
          DETACHED MODULE FULL-SCREEN OVERLAYS (SUBVIEW INTERFACES)
          ============================================================ */}
      {activeSubView && (
        <div className="absolute inset-0 z-50 bg-[#F4F7F5] flex flex-col justify-between border-t-4 border-[#1A1D20] animate-view-jump">
          
          {/* Sub-view Sticky Navigation Top Header Bar */}
          <div className="w-full h-16 border-b-4 border-[#1A1D20] px-4 flex items-center justify-between bg-white sticky top-0 z-30">
            <span className="text-xs font-black uppercase tracking-widest text-[#1A1D20] capitalize">
              {activeSubView} Management Terminal Workspace
            </span>
            <button 
              onClick={() => { AudioEngine.playClick(); setActiveSubView(null); }}
              className="btn-cartoon-secondary py-1 px-4 text-[10px] font-black uppercase tracking-wide"
            >
              Exit View
            </button>
          </div>

          {/* Scrollable Container Sub-Viewport Body Frame */}
          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar pb-32">
            
            {/* --------------------------------------------------------
                SUBVIEW 1: RE-ENGINEERED 3-SECTION TASK MATRIX 
                -------------------------------------------------------- */}
            {activeSubView === 'tasks' && (
              <div className="space-y-6 text-xs">
                
                {/* SECTION 1: SOCIAL MEDIA JOBS LAYER */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 block">
                    Tier 1: Social Platform Operations
                  </span>
                  
                  {/* Task Item Box A: Follow IG Handle */}
                  <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E1306C]/10 border-2 border-[#1A1D20] flex items-center justify-center shrink-0 font-black text-[#E1306C] shadow-[2px_2px_0px_#1A1D20]">
                        IG
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[#1A1D20] text-xs truncate">Follow Official Sandbox Channel</h4>
                        <p className="text-[10px] font-black text-[#38B000] uppercase tracking-wider mt-0.5">+15 AR Points</p>
                      </div>
                    </div>
                    <button onClick={() => AudioEngine.playClick()} className="btn-cartoon-purple py-1 px-4 text-[10px] tracking-wide shrink-0 font-black">
                      Follow
                    </button>
                  </div>

                  {/* Task Item Box B: Like Retweet Core */}
                  <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#1DA1F2]/10 border-2 border-[#1A1D20] flex items-center justify-center shrink-0 font-black text-[#1DA1F2] shadow-[2px_2px_0px_#1A1D20]">
                        TW
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[#1A1D20] text-xs truncate">Like & Tweet Protocol Update</h4>
                        <p className="text-[10px] font-black text-[#38B000] uppercase tracking-wider mt-0.5">+20 AR Points</p>
                      </div>
                    </div>
                    <button onClick={() => AudioEngine.playClick()} className="btn-cartoon-purple py-1 px-4 text-[10px] tracking-wide shrink-0 font-black">
                      Retweet
                    </button>
                  </div>
                </div>

                {/* SECTION 2: DEPOSIT TARGETS & REFERRAL TARGETS BENCHMARKS */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 block">
                    Tier 2: Target Volume Benchmarks
                  </span>

                  {/* Benchmark Box A: Deposit Target */}
                  <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/10 border-2 border-[#1A1D20] flex items-center justify-center shrink-0 text-[#1A1D20] shadow-[2px_2px_0px_#1A1D20]">
                        <DollarSign className="w-5 h-5 text-[#1A1D20]" strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[#1A1D20] text-xs truncate">Deposit Target Benchmark</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Commit and allocate &gt;50 AR tokens into active pool streams.</p>
                      </div>
                    </div>
                    <button onClick={() => { AudioEngine.playClick(); setActiveSubView(null); onOpenWallet(); }} className="btn-cartoon-green py-1 px-4 text-[10px] tracking-wide shrink-0 font-black">
                      Deposit
                    </button>
                  </div>

                  {/* Benchmark Box B: Referral Target */}
                  <div className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[4px_4px_0px_#1A1D20] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FF9F1C]/10 border-2 border-[#1A1D20] flex items-center justify-center shrink-0 text-[#1A1D20] shadow-[2px_2px_0px_#1A1D20]">
                        <UserPlus className="w-5 h-5 text-[#1A1D20]" strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[#1A1D20] text-xs truncate">Invite 5 Class 11 Network Friends</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Track secondary user balance ledger logs.</p>
                      </div>
                    </div>
                    <button onClick={() => { AudioEngine.playClick(); setAppTaskInput(''); setActiveSubView('referral'); }} className="btn-cartoon-green py-1 px-4 text-[10px] tracking-wide shrink-0 font-black">
                      Invite
                    </button>
                  </div>
                </div>

                {/* SECTION 3: APP VALIDATION SUBMISSION SUITE INTERFACE (WITH SCREENSHOT FLIGHT EMBED) */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 block">
                    Tier 3: Advanced App Validation Portal
                  </span>

                  <div className="cartoon-plate-purple p-4 space-y-4 shadow-[4px_4px_0px_#1A1D20]">
                    <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-2">
                      <div className="w-9 h-9 rounded-xl bg-[#FFF275] border-2 border-[#1A1D20] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1A1D20]">
                        <Smartphone className="w-5 h-5 text-[#1A1D20]" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="font-black text-[#1A1D20] text-xs">Ecosystem Partner App Registration Verification</h4>
                        <p className="text-[9px] font-black text-[#9D4EDD] uppercase tracking-wider mt-0.5">Prize Bounty: +50 AR Spending Vouchers</p>
                      </div>
                    </div>

                    {/* Step-by-step Tutorial Guidelines Embedded Graphic Chips */}
                    <div className="space-y-1.5 bg-[#F4F7F5] border-2 border-[#1A1D20] p-3 rounded-xl">
                      <div className="flex items-center gap-1 text-[10px] font-black text-[#1A1D20] uppercase tracking-wider"><Info className="w-3.5 h-3.5" /> Instruction Steps:</div>
                      <ol className="text-[10px] font-bold text-slate-500 list-decimal pl-4 space-y-0.5 mt-1">
                        <li>Download our partner app application workspace sandbox platform.</li>
                        <li>Complete account authorization registration setups on port nodes.</li>
                        <li>Extract the single confirmation serial code asked below and snap a full dashboard layout capture asset.</li>
                      </ol>
                    </div>

                    {/* Form Input Submission Suite */}
                    <form onSubmit={handleAppTaskSubmit} className="space-y-3.5 pt-1">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-[#1A1D20] block px-0.5">
                          Verification Confirmation Code String:
                        </label>
                        <input 
                          type="text" 
                          required
                          value={appTaskInput}
                          onChange={(e) => setAppTaskInput(e.target.value)}
                          placeholder="Paste registration code string validation parameter..."
                          className="w-full px-4 py-2.5 bg-white border-2 border-[#1A1D20] rounded-xl text-xs font-bold text-[#1A1D20] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-wider text-[#1A1D20] block px-0.5">
                          Upload Screen Capture Screenshot Proof Asset:
                        </label>
                        <div 
                          onClick={() => { AudioEngine.playClick(); setImageFileAttached(true); }}
                          className="w-full p-4 border-2 border-dashed border-[#1A1D20] bg-[#F4F7F5] hover:bg-white rounded-xl text-center text-xs font-black text-[#1A1D20] cursor-pointer transition-colors flex flex-col items-center justify-center gap-1"
                        >
                          <Image className="w-5 h-5 text-slate-400" strokeWidth={2.5} />
                          <span>
                            {imageFileAttached ? "✓ validation_proof_capture.png Linked" : "Tap here to select and attach image verification document file"}
                          </span>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full btn-cartoon-purple py-2.5 text-xs font-black uppercase tracking-widest mt-1"
                      >
                        Submit Verification Package Assets
                      </button>
                    </form>
                  </div>
                </div>

                {/* Validation Confirmation Chip Alert Box */}
                {isTaskSubmitted && (
                  <div className="p-3.5 bg-[#00F5D4] border-4 border-[#1A1D20] text-[#1A1D20] font-black rounded-xl flex items-center gap-2 shadow-[3px_3px_0px_#1A1D20] animate-bounce">
                    <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                    <span>Package compiled! In-app verification records written successfully.</span>
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------
                SUBVIEW 2: REFERRAL INTERACTION ENGINE DOCK
                -------------------------------------------------------- */}
            {activeSubView === 'referral' && (
              <div className="space-y-5 animate-view-jump text-xs">
                <div className="cartoon-plate-amber p-5 bg-[#FFF275] text-[#1A1D20] space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-wide">Invite Node Network Hub Connections</h3>
                  <p className="font-bold leading-normal text-[#1A1D20]/80">
                    Secure an instant, uncapped recurring 10% cash bonus commission package written directly onto your profile asset layers every single time your referred accounts commit deposit actions inside the server network pipeline.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1 block">
                    Your Alpha-Numeric Personal Refer Code Link:
                  </label>
                  <div className="w-full p-4 bg-white border-4 border-[#1A1D20] rounded-2xl flex items-center justify-between gap-4 shadow-[4px_4px_0px_#1A1D20]">
                    <span className="font-mono text-sm font-black text-[#9D4EDD] tracking-wider select-all">
                      ANON_VAIBHAV_77
                    </span>
                    <button 
                      onClick={handleCopyReferralCode}
                      className="btn-cartoon-secondary py-1.5 px-4 text-[10px] tracking-wide shrink-0 font-black"
                    >
                      {copiedCode ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                SUBVIEW 3: HISTORICAL WINS LEDGER ARCHIVE 
                -------------------------------------------------------- */}
            {activeSubView === 'wins' && (
              <div className="space-y-3 animate-view-jump text-xs">
                {[
                  { id: 'w-801', title: 'Fractional Bitcoin Pool Pack Draw #09', classification: 'Digital Reward Asset', value: 'Claimable Status Unlocked' },
                  { id: 'w-802', title: 'Thematic Cyber PVC Tape Apparel Box', classification: 'Physical Goods Special', value: 'Claimed Asset In Transit Tracking' }
                ].map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white border-4 border-[#1A1D20] rounded-2xl p-4 shadow-[3px_3px_0px_#1A1D20] flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <h4 className="font-black text-xs text-[#1A1D20] tracking-wide truncate">{item.title}</h4>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Type: {item.classification}</p>
                    </div>
                    <button onClick={() => AudioEngine.playClick()} className="btn-cartoon-purple py-1 px-3 text-[10px] tracking-wide font-black shrink-0">
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* --------------------------------------------------------
                SUBVIEW 4: HIGH-FIDELITY BINANCE VOUCHER HUB REPLICATION 
                -------------------------------------------------------- */}
            {activeSubView === 'rewards' && (
              <div className="space-y-4 animate-view-jump">
                <div className="flex items-center gap-1 px-1">
                  <Sparkles className="w-4 h-4 text-[#FF9F1C]" strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Claim Vouchers Coupon Center</span>
                </div>
                
                {/* Dynamic Mapping Matrix replicating the custom layout slots from image 2872341c */}
                <div className="space-y-4">
                  {mockVouchers.map((coupon) => (
                    <div 
                      key={coupon.id} 
                      className="w-full h-28 voucher-stub-shape rounded-2xl flex overflow-hidden border-4 border-[#1A1D20] bg-white shadow-[4px_4px_0px_#1A1D20] relative"
                    >
                      {/* Geometric Pop-Art Canvas Coupon Notch Circles Cutouts Overhaul */}
                      <div className="voucher-notch-top border-x-4 border-b-4 border-[#1A1D20]" />
                      <div className="voucher-notch-bottom border-x-4 border-t-4 border-[#1A1D20]" />
                      
                      {/* Left Block Side: Descriptive Metrics Data Metadata Layer */}
                      <div className="w-[70%] p-4 flex flex-col justify-between min-w-0 bg-white">
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-black tracking-wide text-[#1A1D20] leading-tight truncate">
                            {coupon.title}
                          </h4>
                          <p className="text-[9px] font-bold text-slate-400 font-mono tracking-tight">
                            {coupon.rule}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 items-center min-w-0">
                          <span className="px-2 py-0.5 text-[8px] font-black uppercase rounded-md bg-[#FFF275] text-[#1A1D20] border-2 border-[#1A1D20] shadow-[1px_1px_0px_#1A1D20] shrink-0">
                            {coupon.label}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 truncate opacity-80 leading-none">
                            {coupon.source}
                          </span>
                        </div>
                      </div>

                      {/* Right Block Side: Binance Numerical Token Coupon Value Column Trigger (Ref: 2872341c) */}
                      <div className="w-[30%] bg-[#00F5D4]/10 border-l-4 border-dashed border-[#1A1D20] flex flex-col items-center justify-center p-2 text-center">
                        <div className="mb-2">
                          <div className="text-xl font-black tracking-tighter text-[#1A1D20] font-mono leading-none">
                            {coupon.value}
                          </div>
                          <div className="text-[9px] font-black text-slate-500 font-mono tracking-widest uppercase leading-none mt-0.5">
                            {coupon.unit}
                          </div>
                        </div>
                        
                        {/* Interactive Yellow Core Pop Push Action Button Custom Target (Ref: 2872341c) */}
                        <button 
                          onClick={() => AudioEngine.playClick()} 
                          className="cursor-pointer text-[10px] font-black uppercase tracking-wider text-[#1A1D20] bg-[#FFF275] px-4 py-1 rounded-full border-2 border-[#1A1D20] shadow-[0px_3px_0px_#1A1D20] active:translate-y-0.5 active:shadow-none transition-all transform shrink-0"
                        >
                          Use
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
