import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Zap, Shield, Gift, Mail, Lock, User, X, ChevronRight, Coins
} from 'lucide-react';
import { SupabaseService } from '../services/SupabaseService';

function AuthModal({ authMode, setAuthMode, onSubmit, isLoading, errorMsg }) {
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '' });
  const isLogin = authMode === 'signIn';

  const handleChange = (field) => (e) => {
    setFormValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAuthMode('idle')} />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <button onClick={() => setAuthMode('idle')} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            {isLogin ? 'Enter your details to access your wallet.' : 'Start earning AR coins and winning raffles today.'}
          </p>

          <form onSubmit={(e) => onSubmit(e, formValues)} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formValues.name}
                  onChange={handleChange('name')}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formValues.email}
                onChange={handleChange('email')}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                required
                value={formValues.password}
                onChange={handleChange('password')}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 mt-4 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setAuthMode(isLogin ? 'signUp' : 'signIn')}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingView({ onAuthenticate }) {
  // 'idle' | 'signIn' | 'signUp'
  const [authMode, setAuthMode] = useState('idle');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authMode === 'idle') {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [authMode]);

  const handleSubmit = async (e, formValues) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const isLogin = authMode === 'signIn';

      if (isLogin) {
        await SupabaseService.signIn(formValues.email, formValues.password);
      } else {
        await SupabaseService.signUp(formValues.email, formValues.password, formValues.name);
      }

      const session = await SupabaseService.getSession();
      const profile = await SupabaseService.getUserProfile(session.user.id);
      onAuthenticate(profile);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // AUTHENTICATION MODAL
  // --------------------------------------------------------------------------
  if (authMode === 'idle') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
        
        {/* Navbar */}
        <nav className="w-full py-6 px-6 sm:px-12 flex items-center justify-between bg-white/80 backdrop-blur-md fixed top-0 z-40 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">AnonRoom</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAuthMode('signIn')}
              className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => setAuthMode('signUp')}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-8">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Platform Live</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight max-w-4xl leading-[1.1] mb-6">
            Earn Rewards. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Win Premium Raffles.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mb-10">
            Complete daily tasks, earn AR coins, and use them to enter exclusive raffles for high-end electronics, gift cards, and crypto vouchers.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={() => setAuthMode('signUp')}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setAuthMode('signIn')}
              className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-base font-bold hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
            >
              Sign In to Dashboard
            </button>
          </div>
        </main>

        <section className="bg-white border-t border-slate-100 py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Premium Rewards</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Exchange your AR coins directly for guaranteed items in our redemption shop, including iPhones and PlayStations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Fair Raffles</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Our draw system is completely transparent. See exactly how many tickets are sold and your exact odds of winning.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Instant Tasks</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Earning coins is easy. Complete quick partner surveys, download apps, or refer your friends to build your balance.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <AuthModal
      authMode={authMode}
      setAuthMode={setAuthMode}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      errorMsg={errorMsg}
    />
  );

}
