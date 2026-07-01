import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  ChevronRight, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  TrendingUp,
  Gift,
  Smartphone,
  Laptop,
  Gamepad,
  Ticket,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { SupabaseService } from '../services/SupabaseService.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ============================================================================
 * REDEEM VIEW COMPONENT
 * ============================================================================
 * A full-scale digital storefront for users to redeem AR coins for rewards.
 * Includes category filtering, search, sorting, and a transactional popup flow.
 * 
 * @param {Object} props
 * @param {Function} props.navigateTo - Router function from App.jsx
 * @param {Object} props.userProfile - User data containing current AR balance
 */
export default function RedeemView({ navigateTo, userProfile }) {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // popular, price-low, price-high
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Transaction States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseStep, setPurchaseStep] = useState('idle'); // idle, confirm, processing, success, error
  
  const auth = useAuth();
  const activeUserProfile = userProfile || auth?.userProfile;
  // User Balance (derive from auth profile, fallback to prop or demo)
  const [userBalance, setUserBalance] = useState(Number(activeUserProfile?.ar_balance ?? activeUserProfile?.arBalance ?? 0));
  const [toast, setToast] = useState(null);

  // --------------------------------------------------------------------------
  // CATEGORIES & PRODUCT STATE
  // --------------------------------------------------------------------------
  const categories = [
    { id: 'all', label: 'All Rewards', icon: ShoppingBag },
    { id: 'tech & gadgets', label: 'Tech & Gadgets', icon: Smartphone },
    { id: 'gaming gear', label: 'Gaming Gear', icon: Gamepad },
    { id: 'gift cards', label: 'Gift Cards', icon: Gift },
    { id: 'platform voucher', label: 'Platform Voucher', icon: Ticket }
  ];

  const [products, setProducts] = useState([]);

  const normalizeCategory = (value) => {
    const category = String(value || '').toLowerCase();
    if (category.includes('gift')) return 'gift cards';
    if (category.includes('game')) return 'gaming gear';
    if (category.includes('voucher') || category.includes('platform')) return 'platform voucher';
    return 'tech & gadgets';
  };

  const getCategoryDisplay = (value) => {
    const category = String(value || '').toLowerCase();
    const found = categories.find((c) => c.id === category);
    return found?.label || 'Tech & Gadgets';
  };

  // Fetch products from Supabase on mount and map to UI shape
  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      try {
        const data = await SupabaseService.getProducts();
        if (!mounted || !data) return;

        const mapped = data.map((p) => ({
          id: p.id,
          title: p.name || p.title || p.label || 'Product',
          description: p.description || p.desc || 'Available for immediate redemption.',
          category: normalizeCategory(p.category || p.type || p.kind),
          label: p.label || p.badge || (p.type === 'digital' ? 'Instant delivery' : 'Limited release'),
          price: Number(p.price_ar ?? p.price ?? p.cost ?? 0),
          originalPrice: Number(p.original_price ?? p.originalPrice ?? 0) || null,
          stock: Number(p.stock ?? p.inventory ?? 0),
          image: p.image_url || p.image || '',
          rating: 4.5,
          reviews: p.reviews || 0,
          isFeatured: p.is_featured || p.isFeatured || false,
          tags: Array.isArray(p.tags) ? p.tags : [],
          type: String(p.type || (p.digital ? 'digital' : 'physical')).toLowerCase()
        }));

        setProducts(mapped);
      } catch (err) {
        console.warn('Failed to load products from Supabase:', err);
      }
    }
    loadProducts();
    return () => { mounted = false; };
  }, []);

  // Sync userBalance when the active profile changes
  useEffect(() => {
    if (activeUserProfile?.id) {
      setUserBalance(Number(activeUserProfile?.ar_balance ?? activeUserProfile?.arBalance ?? 0));
    }
  }, [activeUserProfile?.id, activeUserProfile?.ar_balance, activeUserProfile?.arBalance]);

  // --------------------------------------------------------------------------
  // DERIVED STATE & FILTERING LOGIC
  // --------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // 2. Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured).slice(0, 3);
  }, [products]);

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------
  
  const handleSelectProduct = (product) => {
    if (window.AudioEngine) window.AudioEngine.playClick();
    setSelectedProduct(product);
    setPurchaseStep('confirm');
  };

  const handleCloseModal = () => {
    if (purchaseStep === 'processing') return; // Prevent closing while processing
    if (window.AudioEngine) window.AudioEngine.playClick();
    setSelectedProduct(null);
    setPurchaseStep('idle');
  };

  const executePurchase = async () => {
    if (!selectedProduct || !activeUserProfile?.id) return;

    if (userBalance < selectedProduct.price) {
      setPurchaseStep('error');
      return;
    }

    if (window.AudioEngine) window.AudioEngine.playClick();
    setPurchaseStep('processing');

    try {
      await SupabaseService.redeemProduct(
        activeUserProfile.id,
        selectedProduct.id,
        selectedProduct.price,
        selectedProduct.type === 'digital' ? 'digital' : 'physical'
      );

      const refreshedProfile = await SupabaseService.getUserProfile(activeUserProfile.id);
      if (refreshedProfile?.ar_balance != null) {
        setUserBalance(Number(refreshedProfile.ar_balance || 0));
      } else {
        setUserBalance((prev) => prev - selectedProduct.price);
      }

      setPurchaseStep('success');

      if (window.AudioEngine && typeof window.AudioEngine.playSuccess === 'function') {
        window.AudioEngine.playSuccess();
      }
    } catch (error) {
      console.error('Redemption failed:', error);
      setPurchaseStep('error');
    }
  };

  const navigateToWinningsPage = () => {
    if (window.AudioEngine) window.AudioEngine.playClick();
    handleCloseModal();
    
    // Trigger the router provided by App.jsx to go to Winnings
    // Ensure App.jsx passes a function that can route to Profile -> Winnings
    if (navigateTo) {
      navigateTo('winnings'); 
    } else {
      console.error("navigateTo function not provided to RedeemView");
    }
  };

  // --------------------------------------------------------------------------
  // HELPER COMPONENTS
  // --------------------------------------------------------------------------
  
  /**
   * Renders the stylized coin balance header
   */
  const BalanceHeader = () => (
    <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-slate-900/20">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-slate-400 font-medium mb-1 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            Available AR Balance
          </p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              {userBalance.toLocaleString()}
            </h1>
            <span className="text-lg font-bold text-amber-400 uppercase tracking-widest">AR</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { if (window.AudioEngine) window.AudioEngine.playClick(); navigateTo('tasks'); }}
            className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-5 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Earn More
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Renders an individual product card
   */
  const ProductCard = ({ product }) => {
    const canAfford = userBalance >= product.price;
    const isOutOfStock = product.stock <= 0;

    return (
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
        
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs shadow-lg transform -rotate-12">
              Out of Stock
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative w-full h-48 bg-slate-50 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isFeatured && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                Hot Deal
              </span>
            )}
            {product.tags.map(tag => (
              <span key={tag} className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {getCategoryDisplay(product.category)}
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              4.5 ({product.reviews})
            </div>
          </div>

          <div className="mb-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              {product.label}
            </span>
          </div>
          
          <h3 className="font-black text-slate-900 text-lg leading-tight mb-1.5 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4">
            {product.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-xl font-black tracking-tight ${canAfford ? 'text-slate-900' : 'text-red-500'}`}>
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500">AR</span>
              </div>
              {product.originalPrice && (
                <p className="text-xs text-slate-400 line-through font-medium">
                  {product.originalPrice.toLocaleString()} AR
                </p>
              )}
            </div>
            
            <button 
              disabled={isOutOfStock}
              onClick={() => handleSelectProduct(product)}
              className={`p-3 rounded-xl transition-all active:scale-95 shadow-sm ${
                !canAfford 
                  ? 'bg-slate-100 text-slate-400 hover:bg-slate-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the massive transaction modal handling Confirm -> Process -> Success states
   */
  const TransactionModal = () => {
    if (!selectedProduct || purchaseStep === 'idle') return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={purchaseStep === 'processing' || purchaseStep === 'success' ? undefined : handleCloseModal}
        />
        
        {/* Modal Content */}
        <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-slide-up">
          
          {/* STATE 1: CONFIRMATION */}
          {purchaseStep === 'confirm' && (
            <>
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Confirm Redemption</h2>
                <p className="text-slate-500 text-sm font-medium">
                  You are about to exchange your AR coins for this reward.
                </p>
              </div>
              
              <div className="p-6 sm:p-8 bg-slate-50 space-y-6">
                {/* Item Summary */}
                <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <img src={selectedProduct.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{selectedProduct.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{getCategoryDisplay(selectedProduct.category)}</p>
                  </div>
                </div>

                {/* Calculation */}
                <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Current Balance</span>
                    <span className="font-bold text-slate-900">{userBalance.toLocaleString()} AR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Item Cost</span>
                    <span className="font-bold text-red-500">-{selectedProduct.price.toLocaleString()} AR</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between">
                    <span className="text-slate-900 font-bold">Remaining Balance</span>
                    <span className="font-black text-slate-900">
                      {(userBalance - selectedProduct.price).toLocaleString()} AR
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={handleCloseModal}
                    className="flex-1 py-3.5 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executePurchase}
                    className="flex-1 py-3.5 px-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-colors"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STATE 2: ERROR (Insufficient Funds) */}
          {purchaseStep === 'error' && (
            <div className="p-8 sm:p-10 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Insufficient Balance</h2>
              <p className="text-slate-500 font-medium mb-8">
                You do not have enough AR coins to redeem {selectedProduct.title}.
              </p>
              <button 
                onClick={handleCloseModal}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold transition-transform active:scale-95"
              >
                Close
              </button>
            </div>
          )}

          {/* STATE 3: PROCESSING */}
          {purchaseStep === 'processing' && (
            <div className="p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Coins className="w-6 h-6 text-slate-400" />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 animate-pulse">Processing Transaction...</h2>
              <p className="text-slate-500 text-sm mt-2">Securing your reward securely on the blockchain.</p>
            </div>
          )}

          {/* STATE 4: SUCCESS (AS REQUESTED) */}
          {purchaseStep === 'success' && (
            <div className="p-8 sm:p-10 text-center flex flex-col items-center relative overflow-hidden">
              
              {/* Confetti simulation elements (CSS Only) */}
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-[ping_1.5s_infinite]"></div>
              <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-[ping_2s_infinite]"></div>
              <div className="absolute bottom-20 left-10 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-[ping_1.8s_infinite]"></div>
              
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-50"></div>
                <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2">Redemption Successful!</h2>
              
              {/* EXACT MESSAGE REQUESTED */}
              <p className="text-slate-600 font-medium mb-6 px-4">
                claim your reward from my winnings .
              </p>

              <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 flex items-center gap-4 text-left">
                <img src={selectedProduct.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Acquired</p>
                  <p className="font-bold text-slate-900 truncate">{selectedProduct.title}</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>

              {/* EXACT BUTTON REQUESTED */}
              <button 
                onClick={navigateToWinningsPage}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                See Winnings <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // MAIN RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 pt-4 px-4 sm:px-6 lg:px-8 animate-fade-in relative min-h-screen bg-slate-50/50">
      
      {/* 1. Header & Balance Area */}
      <BalanceHeader />

      {/* 2. Controls Area (Search, Filter, Sort) */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl py-4 border-b border-slate-200/50 -mx-4 px-4 sm:mx-0 sm:px-0">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search for rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        </div>

        {/* Filters & Sorting */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={sortBy}
              onChange={(e) => { if (window.AudioEngine) window.AudioEngine.playClick(); setSortBy(e.target.value); }}
              className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
          
          <button 
            onClick={() => { if (window.AudioEngine) window.AudioEngine.playClick(); setIsFilterOpen(!isFilterOpen); }}
            className={`p-3 rounded-xl border transition-colors shadow-sm flex items-center justify-center gap-2 ${
              isFilterOpen || activeCategory !== 'all' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span className="md:hidden font-bold">Filters</span>
          </button>
        </div>
      </div>

      {/* 3. Category Pills (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto pb-4 pt-2 -mt-4 custom-scrollbar hide-scrollbar">
        <div className="flex items-center gap-3 min-w-max px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { if (window.AudioEngine) window.AudioEngine.playClick(); setActiveCategory(cat.id); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm border ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-slate-900/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-blue-400' : 'text-slate-400'}`} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Product Grid */}
      <div className="space-y-6">
        
        {/* Results Info */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black text-slate-900">
            {activeCategory === 'all' ? 'Discover Rewards' : categories.find(c => c.id === activeCategory)?.label}
          </h2>
          <span className="text-sm font-bold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">
            {filteredProducts.length} Items
          </span>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="w-full bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No rewards found</h3>
            <p className="text-slate-500 font-medium max-w-md">
              We couldn't find any items matching your current filters or search query. Try adjusting your criteria.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Grid Rendering */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Footer Info Section (Adds bulk and professional credibility) */}
      <div className="mt-16 pt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">100% Secure Redemption</h4>
              <p className="text-sm text-slate-500 font-medium">All physical and digital rewards are verified and sourced from official brand partners.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Instant Digital Delivery</h4>
              <p className="text-sm text-slate-500 font-medium">Gift cards and platform vouchers are added directly to your Winnings page immediately after purchase.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Need Help?</h4>
              <p className="text-sm text-slate-500 font-medium">Physical items usually ship within 3-5 business days. Check your Winnings page for tracking information.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal Portal */}
      <TransactionModal />
      
    </div>
  );
}
