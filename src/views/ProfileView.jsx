import React, { useState } from 'react';
import { AudioEngine } from '../services/AudioEngine.js';
import { 
  Award, 
  Users, 
  Trophy, 
  Gift, 
  Bell, 
  User, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  Smartphone, 
  Image, 
  DollarSign, 
  UserPlus, 
  Copy,
  Mail,
  Phone,
  Hash,
  AlertCircle
} from 'lucide-react';

export default function ProfileView({ userProfile, onOpenWallet }) {
  const [activeMenuPage, setActiveMenuPage] = useState(null); // null | 'tasks' | 'referral' | 'wins' | 'rewards' | 'notifications' | 'kyc' | 'settings'
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [appTaskStage, setAppTaskStage] = useState('instructions'); // 'instructions' | 'proof_form'
  const [taskProofText, setTaskProofText] = useState('');
  const [taskProofImage, setTaskProofImage] = useState(false);
  const [taskStateStatus, setTaskStateStatus] = useState('normal'); // 'normal' | 'pending'

  // 🎫 REWARD VAULT COUPON CENTER: Precise Binance Replica Setup (Ref: 2872341c)
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

  const systemNotifications = [
    { id: 1, text: 'Ticket allocation bundle for Draw #09 confirmed successfully.', stamp: '2 hours ago' },
    { id: 2, text: 'Trading Fee Rebate Voucher value 50 USDT unlocked in vault.', stamp: '1 day ago' },
    { id: 3, text: 'Profile network registration audit processing complete.', stamp: '3 days ago' }
  ];

  const handleCopyAction = (text) => {
    navigator.clipboard.writeText(text);
    AudioEngine.playClick();
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleAppTaskExecution = (e) => {
    e.preventDefault();
    AudioEngine.playClick();
    if (!taskProofText || !taskProofImage) return;
    setTaskStateStatus('pending');
    setAppTaskStage('instructions');
  };

  return (
    <div className="w-full h-full relative">
      
      {/* ============================================================
          MAIN PRIMARY ROUTER PROFILE INDEX PAGE
          ============================================================ */}
      {!activeMenuPage ? (
        <div className="space-y-6 w-full animate-tab-switch">
          
          {/* PROFILE USER DATA METADATA BLOCK CARD */}
          <div className="border-2 border-black p-5 bg-white space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-black bg-black text-white flex items-center justify-center font-black text-xl">
                VS
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-black text-black tracking-wide truncate">
                  {userProfile?.username || 'vaibhav_singhal'}
                </h2>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-0.5">
                  <Hash className="w-3 h-3" /> <span>ID: {userProfile?.user_id || '9864201'}</span>
                </div>
              </div>
            </div>

            {/* EXPANDED PERSONAL DETAIL SCHEMAS FIELDS (CLEAN & SLEEK) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-black/10 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2 bg-[#F4F7F5] border border-black p-2.5">
                <Mail className="w-4 h-4 text-black shrink-0" strokeWidth={2.5} />
                <span className="truncate text-black">{userProfile?.email || 'vaibhav@singhal.com'}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#F4F7F5] border border-black p-2.5">
                <Phone className="w-4 h-4 text-black shrink-0" strokeWidth={2.5} />
                <span className="truncate text-black">{userProfile?.mobile || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>

          {/* MENUS BUTTON LINKS LIST OVERHAUL */}
          <div className="w-full bg-white border-2 border-black divide-y-2 divide-black">
            {[
              { id: 'tasks', label: 'Verification Tasks Core', icon: Award },
              { id: 'rewards', label: 'Rewards Voucher Vault', icon: Gift },
              { id: 'referral', label: 'Referral Track Pipeline', icon: Users },
              { id: 'notifications', label: 'System Alert Logs Feed', icon: Bell },
              { id: 'kyc', label: 'KYC Node Identity Proofs', icon: ShieldCheck },
              { id: 'wins', label: 'Historical Claims History', icon: Trophy }
            ].map((menu) => (
              <button
                key={menu.id}
                type="button"
                onClick={() => { AudioEngine.playClick(); setActiveMenuPage(menu.id); }}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-black uppercase tracking-wider bg-white hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <menu.icon className="w-4 h-4 text-black" strokeWidth={2.5} />
                  <span>{menu.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-black transition-colors" strokeWidth={3} />
              </button>
            ))}
          </div>

        </div>
      ) : (
        /* ============================================================
            DEDICATED FULL-CONTENT SEPARATE SUBMENU PAGES WORKSPACE
            ============================================================ */
        <div className="w-full h-full bg-white flex flex-col justify-between animate-tab-switch border-2 border-black p-4 min-h-[460px]">
          
          {/* Internal Top Control Header Navigation Strip */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4 shrink-0">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Subview Node // {activeMenuPage}
            </span>
            <button
              onClick={() => { AudioEngine.playClick(); setActiveMenuPage(null); }}
              className="btn-pro-outline py-1 px-3 text-[9px] font-black uppercase tracking-widest"
            >
              Back
            </button>
          </div>

          {/* Subview Inner Data Port Injection Target */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            
            {/* 1. LAYERED TASKS DASHBOARD PAGE */}
            {activeMenuPage === 'tasks' && (
              <div className="space-y-5 text-xs text-black">
                
                {/* Layer 1: Social Task Component item */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-0.5">Tier 1: Social Media Task</span>
                  <div className="border-2 border-black p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-black text-xs uppercase tracking-wide truncate">Follow Instagram Channel</h4>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">Reward: +15 AR Points Value</p>
                    </div>
                    <button className="btn-pro-black py-1 px-3.5 text-[9px]">Follow</button>
                  </div>
                </div>

                {/* Layer 2: Metric Benchmark Task item */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-0.5">Tier 2: Target Volume Benchmark</span>
                  <div className="border-2 border-black p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h4 className="font-black text-xs uppercase tracking-wide truncate">Deposit Benchmark Target</h4>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">Reward: Redirect to transaction terminal wallet</p>
                    </div>
                    <button onClick={() => { AudioEngine.playClick(); setActiveMenuPage(null); onOpenWallet(); }} className="btn-pro-emerald py-1 px-3.5 text-[9px]">Deposit</button>
                  </div>
                </div>

                {/* Layer 3: Advanced Task Page workflow with conditional form fields */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-0.5">Tier 3: App Task Workflow</span>
                  <div className="border-2 border-black p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <h4 className="font-black text-xs uppercase">Ecosystem Application Task</h4>
                      <span className={`text-[8px] font-black px-2 py-0.5 border border-black uppercase ${
                        taskStateStatus === 'pending' ? 'bg-amber-400 text-black' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {taskStateStatus.toUpperCase()}
                      </span>
                    </div>

                    {appTaskStage === 'instructions' ? (
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-slate-400 leading-normal">
                          Task instructions: Open our verified partner application, finalize registration metrics, copy your unique proof ID code string, and capture a full dashboard print screen.
                        </p>
                        
                        <div className="flex items-center gap-3 p-2 bg-[#F4F7F5] border border-black text-[10px] font-mono font-bold break-all">
                          <span>https://partner-app.anonroom.com/register/vaibhav_node</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => { AudioEngine.playClick(); setAppTaskStage('proof_form'); }}
                          className="w-full btn-pro-black py-2 text-[10px]"
                        >
                          Proceed To Verification Submission
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAppTaskExecution} className="space-y-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 block">Required Proof Serial ID Code String:</label>
                          <input 
                            type="text" 
                            required
                            value={taskProofText}
                            onChange={(e) => setTaskProofText(e.target.value)}
                            placeholder="Paste task summary code text..."
                            className="w-full p-2.5 bg-white border border-black text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 block">Screenshot Proof Upload Capture:</label>
                          <div 
                            onClick={() => { AudioEngine.playClick(); setTaskProofImage(true); }}
                            className="w-full p-3 border border-dashed border-black bg-slate-50 hover:bg-white text-center text-[10px] font-black text-black cursor-pointer transition-colors"
                          >
                            {taskProofImage ? "✓ validation_screenshot_proof.jpg Connected" : "Click to embed validation screenshot"}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button type="button" onClick={() => setAppTaskStage('instructions')} className="btn-pro-outline py-2 flex-1 text-[10px]">Back Steps</button>
                          <button type="submit" className="btn-pro-emerald py-2 flex-1 text-[10px]">Submit Asset Package</button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. HIGH-FIDELITY BINANCE STYLE VOUCHERS CARD VAULT (Ref: 2872341c) */}
            {activeMenuPage === 'rewards' && (
              <div className="space-y-3.5">
                {mockVouchers.map((vch) => (
                  <div key={vch.id} className="w-full h-24 border-2 border-black pro-ticket-shape rounded-none flex overflow-hidden">
                    
                    {/* Inline absolute circle clipping elements simulating ticket voucher notches layout */}
                    <div className="absolute top-[-5px] right-[28%] w-2.5 h-2.5 bg-white border-b-2 border-x-2 border-black rounded-full z-10" />
                    <div className="absolute bottom-[-5px] right-[28%] w-2.5 h-2.5 bg-white border-t-2 border-x-2 border-black rounded-full z-10" />

                    <div className="w-[72%] p-3 flex flex-col justify-between min-w-0 bg-white">
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-[11px] font-black tracking-wide text-black uppercase truncate">{vch.title}</h4>
                        <p className="text-[8px] font-bold text-slate-400 font-mono tracking-tight">{vch.rule}</p>
                      </div>
                      <div className="flex gap-2 items-center min-w-0">
                        <span className="px-1.5 py-0.2 text-[7px] font-black uppercase rounded-none bg-black text-white border border-black shrink-0">{vch.label}</span>
                        <span className="text-[8px] font-bold text-slate-400 truncate opacity-70">{vch.source}</span>
                      </div>
                    </div>

                    <div className="w-[28%] bg-slate-50 border-l-2 border-dashed border-black flex flex-col items-center justify-center p-2 text-center shrink-0">
                      <div className="mb-1 leading-none">
                        <div className="text-base font-black text-black font-mono inline-block">{vch.value}</div>
                        <div className="text-[8px] font-black text-slate-400 font-mono block mt-0.5">{vch.unit}</div>
                      </div>
                      <button onClick={() => AudioEngine.playClick()} className="cursor-pointer text-[8px] font-black uppercase tracking-wider text-white bg-black px-3 py-1 hover:bg-[#10B981] hover:text-black transition-colors shrink-0">
                        Use
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* 3. REFERRAL PIPELINE MODULE SUBVIEW PAGE */}
            {activeMenuPage === 'referral' && (
              <div className="space-y-4 text-xs text-black">
                <div className="border-2 border-black p-4 bg-slate-50 space-y-1.5">
                  <h4 className="font-black uppercase text-xs">Invite Network Program</h4>
                  <p className="font-bold text-slate-400 leading-normal">
                    Secure an automatic recurring 10% cash bonus loop mapped right into your spendable token balances whenever referred clients complete ticket checkout transactions.
                  </p>
                </div>

                <div className="p-4 border border-black flex items-center justify-between bg-white">
                  <span className="font-mono font-black text-xs select-all text-black">ANON_VAIBHAV_2026_CODE</span>
                  <button 
                    onClick={() => handleCopyAction("ANON_VAIBHAV_2026_CODE")}
                    className="btn-pro-black py-1 px-3 text-[9px] font-black uppercase"
                  >
                    {copiedReferral ? "Copied" : "Copy Code"}
                  </button>
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS FEED SYSTEM MATRIX LAYER */}
            {activeMenuPage === 'notifications' && (
              <div className="space-y-2.5">
                {systemNotifications.map((notif) => (
                  <div key={notif.id} className="p-3.5 border-2 border-black bg-white flex flex-col gap-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xs font-bold text-black leading-normal">{notif.text}</p>
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider font-medium block mt-1">{notif.stamp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 5. KYC VERIFICATION COMING SOON BLOCK */}
            {activeMenuPage === 'kyc' && (
              <div className="border-2 border-black border-dashed p-8 text-center space-y-3 my-4 bg-slate-50">
                <AlertCircle className="w-6 h-6 text-black mx-auto" strokeWidth={2.5} />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-black">Identity Verification Engine Locked</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">COMING SOON // PHASE-2 COMPLIANCE UPDATE</p>
                </div>
              </div>
            )}

            {/* 6. HISTORICAL CLAIMS WIN HISTORY RECORDS */}
            {activeMenuPage === 'wins' && (
              <p className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-wider">No winner claim history entries linked currently.</p>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
