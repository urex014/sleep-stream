'use client';
import React from 'react';
import { Bot, ArrowRight, Wallet, Activity, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-sans selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden transition-colors duration-500">
      
      {/* --- BACKGROUND DECORATION --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* 2. Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- MINIMAL NAVBAR --- */}
      <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold tracking-tight">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-lg">SleepStream</span>
        </div>
        <button 
          onClick={() => router.push('/login')} 
          className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition"
        >
          Log In
        </button>
      </nav>

      {/* --- HERO --- */}
      <section className="relative z-10 pt-48 pb-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live System v2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Automate your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              daily income.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Deploy automated bots to view high-value ads. <br className="hidden md:block" />
            Secure <span className="text-slate-900 dark:text-white font-bold decoration-blue-500/30 underline decoration-4 underline-offset-2">15% daily returns</span> with zero effort.
          </p>

          <div className="pt-8 flex flex-col items-center">
            <button 
              onClick={() => router.push('/signup')} 
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-50 transition-all font-bold text-lg px-8 py-4 rounded-xl flex items-center gap-2 shadow-xl shadow-slate-200 dark:shadow-slate-900/50 hover:shadow-blue-200 dark:hover:shadow-blue-900/20 hover:-translate-y-1"
            >
              Start Earning Now <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium">No credit card required • Instant activation</p>
          </div>
        </div>
      </section>

      {/* --- THE CONCEPT (Clean Cards) --- */}
      <section className="relative z-10 py-24 bg-white/50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Card 1 */}
          <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 mb-2 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-xl">1. Deposit Capital</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Select a bot tier. Your funds are securely locked in the trading pool for a fixed 10-day cycle.</p>
          </div>

          {/* Card 2 */}
          <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 mb-2 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-xl">2. Automate Views</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Your bot works 24/7 validating ad views. You earn 15% ROI credited to your dashboard daily.</p>
          </div>

          {/* Card 3 */}
          <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 mb-2 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-xl">3. Withdraw Profit</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">On Day 11, your capital is unlocked. Withdraw your initial deposit + all profit instantly.</p>
          </div>

        </div>
      </section>

      {/* --- LIVE STATS & CTA --- */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Live Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-20 opacity-80 hover:opacity-100 transition duration-500">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">14,203</div>
              <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-2 font-bold">Active Bots</div>
            </div>
            <div className="p-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">₦13M+</div>
              <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-2 font-bold">Paid Out</div>
            </div>
            <div className="col-span-2 md:col-span-1 p-4 md:border-l border-slate-200 dark:border-slate-800">
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tighter">99.9%</div>
              <div className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-2 font-bold">Uptime</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative overflow-hidden group">
            {/* Glow behind CTA */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
            
            <div className="relative space-y-8 bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ready to automate your finances?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                Join thousands of users earning passive income daily. 
                Create a free account to view live bot performance.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => router.push('/signup')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-12 py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 mx-auto shadow-xl shadow-blue-500/20"
                >
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            
            </div>
          </div>

        </div>
      </section>

      {/* --- REFERRAL BAR --- */}
      <section className="py-8 px-6 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Refer a friend, earn <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md ml-1">$1.5</span> instantly per active bot.
          </p>
      </section>

    </div>
  );
}