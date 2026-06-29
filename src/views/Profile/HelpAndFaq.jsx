import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';

export default function HelpAndFaq({ navigateTo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('General');
  const [expandedId, setExpandedId] = useState(null);

  const mockFaqs = [
    { id: 1, category: 'General', question: 'What is AnonRoom?', answer: 'AnonRoom is a premium, secure platform where users can participate in transparent digital and physical item raffles, complete promotional tasks for points, and track their digital assets natively.' },
    { id: 2, category: 'General', question: 'Are the raffles actually fair?', answer: 'Yes. All draws are executed using cryptographically secure random number generation. You can verify the integrity of every draw in the blockchain ledger associated with your ticket.' },
    { id: 3, category: 'Rewards', question: 'How do I earn more Reward Points?', answer: 'You can earn points by checking the Task Center daily, completing app installs, following our partners on social media, or referring friends using your unique link.' },
    { id: 4, category: 'Rewards', question: 'Do my coupons expire?', answer: 'Yes. Most coupons have a validity period ranging from 7 to 30 days. You can check the exact expiration date for every coupon directly inside the Reward Center.' },
    { id: 5, category: 'Shipments', question: 'Do I have to pay for shipping?', answer: 'No! If you win a physical item, global shipping and handling fees are entirely covered by AnonRoom. You will never be asked to pay courier fees.' },
    { id: 6, category: 'Account', question: 'How do I complete KYC?', answer: 'KYC (Identity Verification) is currently rolling out regionally. Once available in your area, you will be prompted to upload a valid government ID to unlock higher withdrawal limits.' }
  ];

  const categories = ['General', 'Rewards', 'Shipments', 'Account'];
  
  const displayedFaqs = mockFaqs.filter(faq => {
    const matchCategory = searchQuery ? true : faq.category === activeCategory;
    const matchSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigateTo('menu')} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Help Center & FAQs</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Find answers to common questions quickly.</p>
        </div>
      </div>

      <div className="relative w-full bg-white rounded-[1.25rem] shadow-sm border border-slate-200 p-2">
        <input 
          type="text" placeholder="Search all help topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-base rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-inner"
        />
        <Search className="absolute left-6 top-6 w-5 h-5 text-slate-400" />
      </div>

      {!searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { AudioEngine.playClick(); setActiveCategory(cat); }} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shrink-0 ${activeCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="card-standard bg-white divide-y divide-slate-100 shadow-sm border border-slate-100 rounded-[1.5rem] overflow-hidden">
        {displayedFaqs.length === 0 ? (
          <div className="p-16 text-center text-slate-500 font-medium">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-700 font-bold">No results found</p>
            <p className="text-sm mt-1">We couldn't find any articles matching "{searchQuery}".</p>
          </div>
        ) : (
          displayedFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div key={faq.id} className="transition-colors hover:bg-slate-50/50">
                <button onClick={() => { AudioEngine.playClick(); setExpandedId(isExpanded ? null : faq.id); }} className="w-full flex items-start justify-between p-6 text-left gap-4 outline-none">
                  <span className={`text-base sm:text-lg font-bold transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-900'}`}>{faq.question}</span>
                  {isExpanded ? <ChevronUp className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> : <ChevronDown className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />}
                </button>
                {isExpanded && <div className="px-6 pb-6 text-[15px] text-slate-600 font-medium leading-relaxed animate-fade-in border-l-2 border-blue-500 ml-6 pl-5">{faq.answer}</div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
