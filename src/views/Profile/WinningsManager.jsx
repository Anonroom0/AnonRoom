import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  Package, 
  Gift, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Info
} from 'lucide-react';
import { AudioEngine } from '../../services/AudioEngine.js';
import { SupabaseService } from '../../services/SupabaseService.js';

/**
 * WinningsManager Component
 * -----------------------------------------------------------------------------
 * Handles the display and claiming process for both digital and physical prizes.
 * Uses isolated local state to manage the shipping form and claim success screens,
 * completely preventing global state crashes.
 */
export default function WinningsManager({ navigateTo, userProfile, onRefresh }) {
  // ---------------------------------------------------------------------------
  // 1. INTERNAL SUB-ROUTING & STATE
  // ---------------------------------------------------------------------------
  // Views: 'list' | 'claim'
  const [currentView, setCurrentView] = useState('list');
  const [selectedPrize, setSelectedPrize] = useState(null);
  
  // Claim Process States
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Status tracking for the currently selected item
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [myWinnings, setMyWinnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWinnings = async () => {
      if (!userProfile?.id) return;
      try {
        setLoading(true);
        const data = await SupabaseService.getWinnings(userProfile.id);
        const normalized = (data || []).map((item) => ({
          id: item.id,
          title: item.title || item.name || 'Prize',
          type: item.type || (item.product_id ? 'physical' : 'digital'),
          ticketId: item.ticket_id || item.id,
          wonOn: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently received',
          image: item.image || 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
          status: item.status === 'claimed' || item.status === 'claim processed' ? 'claimed' : 'pending'
        }));
        setMyWinnings(normalized);
      } catch (err) {
        console.error('Failed to load winnings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWinnings();
  }, [userProfile?.id]);

  // ---------------------------------------------------------------------------
  // 2. MOCK WINNINGS REGISTRY
  // ---------------------------------------------------------------------------
  const [myWinningsSeed, setMyWinningsSeed] = useState([
    { 
      id: 'win-1', 
      title: 'Sony PlayStation 5 Pro Edition', 
      type: 'physical', 
      ticketId: 'EPID-2026-A8F2',
      wonOn: 'June 25, 2026',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
      status: 'pending' // pending | claimed
    },
    { 
      id: 'win-2', 
      title: '50 AR Token Bonus Credit', 
      type: 'digital', 
      ticketId: 'EPID-2026-B99X',
      wonOn: 'June 10, 2026',
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1000&auto=format&fit=crop',
      status: 'pending'
    },
    { 
      id: 'win-3', 
      title: 'Apple AirPods Pro (2nd Gen)', 
      type: 'physical', 
      ticketId: 'EPID-2026-C44Z',
      wonOn: 'May 15, 2026',
      image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop',
      status: 'claimed'
    }
  ]);

  // ---------------------------------------------------------------------------
  // 3. INTERACTION HANDLERS
  // ---------------------------------------------------------------------------
  
  const handleBack = () => {
    AudioEngine.playClick();
    if (currentView === 'claim') {
      // If we back out of a claim, reset form states to keep it clean
      setCurrentView('list');
      setIsSubmitted(false);
      setSelectedPrize(null);
    } else {
      navigateTo('menu');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPrize = (prize) => {
    AudioEngine.playClick();
    // Deep copy to prevent reference mutation
    setSelectedPrize({...prize});
    // Reset form tracking variables
    setIsSubmitted(prize.status === 'claimed');
    setShippingName('');
    setShippingPhone('');
    setShippingAddress('');
    setCurrentView('claim');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDigitalClaim = async () => {
    AudioEngine.playClick();
    if (!selectedPrize?.id) return;
    try {
      await SupabaseService.claimDigitalWinning(selectedPrize.id);
      setMyWinnings(prev => prev.map(p => p.id === selectedPrize.id ? { ...p, status: 'claimed' } : p));
      setIsSubmitted(true);
      onRefresh?.();
    } catch (err) {
      console.error('Failed to claim digital prize:', err);
    }
  };

  const handlePhysicalSubmit = async (e) => {
    e.preventDefault();
    if (!shippingName || !shippingPhone || !shippingAddress) return;
    
    AudioEngine.playClick();
    // Safely update local list
    setMyWinnings(prev => prev.map(p => p.id === selectedPrize.id ? { ...p, status: 'claimed' } : p));
    setIsSubmitted(true);
  };

  // ---------------------------------------------------------------------------
  // 4. RENDER: WINNINGS LIST (HOME VIEW)
  // ---------------------------------------------------------------------------
  if (currentView === 'list') {
    const pendingCount = myWinnings.filter(w => w.status === 'pending').length;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
        
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleBack} 
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Winnings</h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {pendingCount > 0 ? `You have ${pendingCount} unclaimed prizes waiting.` : 'Track and review your past wins.'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card-standard py-20 flex flex-col items-center justify-center text-center bg-white shadow-sm border border-slate-100">
            <Trophy className="w-10 h-10 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700 mt-4">Loading winnings…</h3>
          </div>
        ) : myWinnings.length === 0 ? (
          <div className="card-standard py-20 flex flex-col items-center justify-center text-center bg-white shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center shadow-inner border border-slate-100 mb-4">
              <Trophy className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No Winnings Yet</h3>
            <p className="text-sm text-slate-500 font-medium mt-1 max-w-xs">
              Participate in raffles to win exclusive physical and digital prizes.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {myWinnings.map((prize) => (
              <div 
                key={prize.id} 
                className={`card-standard bg-white p-4 flex flex-col sm:flex-row items-center gap-5 sm:h-40 border transition-all ${
                  prize.status === 'claimed' ? 'border-slate-200 shadow-sm' : 'border-amber-200 shadow-md shadow-amber-500/10'
                }`}
              >
                
                {/* Prize Image Block */}
                <div className="w-full sm:w-36 h-40 sm:h-full bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative shadow-inner border border-slate-200/50">
                  <img src={prize.image} alt={prize.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {prize.type}
                  </div>
                </div>

                {/* Prize Info Block */}
                <div className="flex-1 min-w-0 w-full flex flex-col justify-between py-1 h-full gap-4 sm:gap-0">
                  <div className="space-y-1">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight line-clamp-2 pr-2">
                      {prize.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Won on {prize.wonOn}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Block */}
                  <div className="flex items-center justify-between w-full pt-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm flex items-center gap-1.5 ${
                      prize.status === 'claimed' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                    }`}>
                      {prize.status === 'claimed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {prize.status === 'claimed' ? 'Claim Processed' : 'Action Required'}
                    </span>
                    
                    <button 
                      onClick={() => handleSelectPrize(prize)} 
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm border flex items-center gap-2 ${
                        prize.status === 'claimed' 
                          ? 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-700 shadow-indigo-600/20'
                      }`}
                    >
                      {prize.status === 'claimed' ? 'View Details' : 'Claim Prize'}
                      {prize.status === 'pending' && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. RENDER: CLAIM PRIZE (DETAILS & FORMS)
  // ---------------------------------------------------------------------------
  if (currentView === 'claim' && selectedPrize) {
    const isPhysical = selectedPrize.type === 'physical';

    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in pb-12">
        <div className="card-standard bg-white overflow-hidden shadow-sm border border-slate-100">
          
          {/* Detailed Hero Image */}
          <div className="h-48 sm:h-64 relative bg-slate-900 border-b border-slate-200">
            <img src={selectedPrize.image} alt="Prize" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            <button 
              onClick={handleBack} 
              className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-slate-900 shadow-sm hover:bg-white transition-colors flex items-center gap-2 font-bold text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-lg">
                {selectedPrize.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/30 uppercase tracking-widest shadow-sm">
                  {selectedPrize.type} Item
                </span>
                <span className="text-sm font-medium text-white/90 flex items-center gap-1.5 drop-shadow-md font-mono bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  ID: {selectedPrize.ticketId}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            
            {/* ==========================================
                FLOW A: DIGITAL ITEM CLAIM 
                ========================================== */}
            {!isPhysical && (
              <div className="animate-fade-in">
                {!isSubmitted ? (
                  <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl text-center space-y-5 shadow-inner">
                    <div className="w-20 h-20 bg-white border border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Gift className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">Digital Reward Ready</h3>
                      <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                        This digital prize is verified and ready to be credited. Click below to securely transfer it to your account's Reward Center.
                      </p>
                    </div>
                    <button 
                      onClick={handleDigitalClaim} 
                      className="btn-primary w-full max-w-xs mx-auto py-4 shadow-indigo-600/20 active:scale-95 transition-all bg-indigo-600 hover:bg-indigo-700 border-indigo-700"
                    >
                      Claim to Reward Center
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center space-y-5 animate-slide-up shadow-sm">
                    <div className="w-20 h-20 bg-white border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">Reward Successfully Claimed!</h3>
                      <p className="text-sm font-medium text-slate-600 max-w-sm mx-auto leading-relaxed">
                        Your digital item has been securely vaulted. You can view and activate it in your Reward Center.
                      </p>
                    </div>
                    <button 
                      onClick={() => navigateTo('rewards')} 
                      className="btn-secondary border-green-300 text-green-800 hover:bg-green-100 w-full max-w-xs mx-auto py-4 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Open Reward Center <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                FLOW B: PHYSICAL ITEM CLAIM (SHIPPING)
                ========================================== */}
            {isPhysical && !isSubmitted && (
              <form onSubmit={handlePhysicalSubmit} className="space-y-6 animate-fade-in">
                
                {/* Security/Info Banner */}
                <div className="flex items-start gap-4 text-slate-800 bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-blue-900">Secure Logistics Portal</h3>
                    <p className="text-sm font-medium text-blue-700/80 mt-1 leading-relaxed">
                      Please provide accurate shipping information. Our logistics partner will use this to deliver your physical prize directly to your door.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block">Full Legal Name</label>
                    <input 
                      type="text" required value={shippingName} onChange={e => setShippingName(e.target.value)} 
                      placeholder="e.g. Vaibhav K. Singhal"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium shadow-inner transition-all" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block">Contact Phone Number</label>
                    <input 
                      type="tel" required value={shippingPhone} onChange={e => setShippingPhone(e.target.value)} 
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium shadow-inner transition-all" 
                    />
                    <p className="text-xs text-slate-400 font-medium pl-1 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" /> Required for courier coordination
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block">Complete Delivery Address</label>
                    <textarea 
                      required value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} 
                      placeholder="Street Address, Building/Apt, City, State, ZIP/Postal Code" rows={3}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium shadow-inner resize-none transition-all" 
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-sm shadow-inner mt-4">
                  <span className="font-bold text-slate-600">Shipping & Handling Fee:</span>
                  <span className="font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 shadow-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Fully Waived
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button type="submit" className="btn-primary bg-indigo-600 border-indigo-700 hover:bg-indigo-700 w-full py-4 text-base shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Truck className="w-5 h-5" /> Confirm Shipping Details
                  </button>
                </div>
              </form>
            )}

            {/* Physical Item - Post Submit Success State */}
            {isPhysical && isSubmitted && (
              <div className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center space-y-6 animate-slide-up shadow-sm">
                <div className="w-24 h-24 bg-white border border-green-200 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                  <Package className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Order Processing!</h3>
                  <p className="text-sm font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your shipping details have been securely saved and sent to dispatch.
                  </p>
                </div>
                
                {/* Important Follow-up Notice */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-flex flex-col items-center gap-2 mx-auto">
                  <span className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-500" /> Dispatch Notice
                  </span>
                  <span className="text-xs font-medium text-slate-500 max-w-[280px]">
                    Our team will soon contact you to ask for final contact details and coordinate your delivery process securely.
                  </span>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => navigateTo('shipments')} 
                    className="btn-secondary border-green-300 text-green-800 hover:bg-green-100 w-full max-w-xs mx-auto py-4 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Track in My Shipments <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return null;
}
