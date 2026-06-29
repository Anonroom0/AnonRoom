import React from 'react';
import { ArrowLeft, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

export default function KycPage({ navigateTo }) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { AudioEngine.playClick(); navigateTo('menu'); }} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identity Verification</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">KYC Tiers and Account Security</p>
        </div>
      </div>

      <div className="card-standard bg-white overflow-hidden shadow-sm border border-slate-100 rounded-[2rem]">
        <div className="h-56 sm:h-64 bg-slate-900 relative flex flex-col items-center justify-center p-8 text-center border-b-[6px] border-amber-500">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <ShieldAlert className="w-20 h-20 text-amber-500 mb-5 relative z-10 drop-shadow-md" />
          <h2 className="text-3xl font-black text-white relative z-10 tracking-widest uppercase drop-shadow-lg">Under Construction</h2>
          <p className="text-sm text-slate-300 font-medium mt-3 relative z-10 max-w-lg leading-relaxed">Our global compliance team is currently rolling out the automated KYC verification portal for your region.</p>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 shadow-sm">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-amber-100">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Your account limits are currently unaffected.</h3>
              <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">You can continue to deposit, purchase tickets, and claim digital winnings without submitting KYC documents at this time. We will notify you when Tier 2 verification becomes mandatory.</p>
            </div>
          </div>

          <div className="space-y-4 opacity-60 select-none pointer-events-none pt-4">
            <h3 className="font-black text-slate-900 text-lg">Upcoming KYC Tiers</h3>
            
            <div className="border-2 border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Tier 1: Basic (Current)</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Email verified. Crypto deposits enabled.</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-5 h-5" /> Verified
              </div>
            </div>

            <div className="border-2 border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-4 shadow-sm">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Tier 2: Verified Identity (Coming Soon)</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Requires Government ID. Unlocks unlimited withdrawals.</p>
              </div>
              <button disabled className="btn-secondary px-8 py-3 opacity-50 font-bold text-base rounded-xl">Start Verification</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
