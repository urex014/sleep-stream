'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Zap, 
  Activity, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BotsPage() {
  const router = useRouter();
  const [myBots, setMyBots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<number | null>(null);

  // --- UPDATED TIERS (USD) ---
  const tiers = [
    { id: 0, name: 'Starter', price: 5, active: true, desc: 'Included with Code' },
    { id: 1, name: 'Growth', price: 10 },
    { id: 2, name: 'Pro', price: 40 },
    { id: 3, name: 'Elite', price: 80 },
    { id: 4, name: 'Enterprise', price: 120 },
  ];

  // --- FETCH BOTS ---
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await fetch('/api/user/dashboard/bots');
        const data = await res.json();
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (data.success) {
          setMyBots(data.bots);
        }
      } catch (error) {
        console.error("Failed to fetch bots");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBots();
  }, [router]);

  const handlePurchase = async (tierId: number) => {
    if (!confirm(`Confirm purchase of ${tiers.find(t => t.id === tierId)?.name} Tier for $${tiers.find(t => t.id === tierId)?.price}?`)) return;

    setIsPurchasing(tierId);
    try {
      const res = await fetch('/api/user/dashboard/bots/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        window.location.reload(); 
      } else {
        alert(data.message); 
      }
    } catch (error) {
      alert('Transaction failed');
    } finally {
      setIsPurchasing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative flex items-center justify-center">
           <div className="absolute inset-0 w-12 h-12 border-4 border-slate-200 dark:border-slate-800 rounded-full animate-ping"></div>
           {/* <Loader2 className="w-8 h-8 text-slate-900 dark:text-white animate-spin relative z-10" /> */}
        </div>
      </div>
    );
  }

  const activeBot = myBots.length > 0 ? myBots[0] : null;
  const progressPercentage = activeBot ? (activeBot.currentDay / activeBot.totalDays) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Active Bots</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Monitor your yield and upgrade your fleet.</p>
      </div>

      {/* 1. CURRENT ACTIVE BOT (The "Bento Box" Hero) */}
      {activeBot ? (
        <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Identity & Status */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  System Online
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  {activeBot.tier}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                  <Activity className="w-4 h-4" /> Generating yield automatically
                </p>
              </div>
            </div>

            {/* Right: Telemetry & Progress */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Stats Row */}
              <div className="grid lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-6">
                <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Daily Yield</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    ${activeBot.dailyEarn.toFixed(2)} <span className="text-sm font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg tracking-normal">/ day</span>
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                    ${activeBot.totalEarnedSoFar.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Cycle Progress</p>
                  <p className="text-sm font-medium text-slate-500">Day {activeBot.currentDay} of {activeBot.totalDays}</p>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 dark:via-black/20 to-transparent -translate-x-full animate-shimmer"></div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-400 font-medium">
                  <span>Started: {activeBot.startDate}</span>
                  <span>Ends: Day {activeBot.totalDays}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <Bot className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Machinery</h3>
          <p className="text-slate-500 max-w-md mx-auto">You currently don't have any bots running. Select a tier below to start generating yield.</p>
        </div>
      )}

      {/* 2. UPGRADE STORE (Stripe-style Pricing Grid) */}
      <div className="space-y-8 pt-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Marketplace</h2>
          <p className="text-slate-500 text-sm mt-1">Deploy new bots. Note: You can only run one bot at a time.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            // Re-calculate the logic since we aren't fetching full detail arrays from DB for the shop
            const dailyReturn = tier.price * 0.15; 
            const totalReturn = dailyReturn * 10;
            const profit = totalReturn - tier.price;

            // Check if user currently has THIS tier running
            const isCurrentTier = activeBot?.tier.includes(tier.id.toString());
            
            // Tier 0 logic check
            const isFreeTier = tier.id === 0;

            return (
              <div 
                key={tier.id} 
                className={`relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ${activeBot ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                {/* Plan Title & Price */}
                <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">${tier.price}</span>
                    <span className="text-slate-500 font-medium">/ 10 days</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{isFreeTier ? "Free Welcome Bonus" : "Capital Investment"}</p>
                </div>

                {/* Features List */}
                <div className="flex-1 space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Returns <b>${dailyReturn.toFixed(2)}</b> daily</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Total ROI: <b>${totalReturn.toFixed(2)}</b></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded-lg -ml-2">
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Net Profit: <b>+${profit.toFixed(2)}</b></span>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handlePurchase(tier.id)}
                  disabled={isFreeTier || activeBot !== null || isPurchasing === tier.id}
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900"
                >
                  {isPurchasing === tier.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCurrentTier ? (
                    'Currently Active'
                  ) : isFreeTier ? (
                    'Already Claimed'
                  ) : activeBot ? (
                    'Locked'
                  ) : (
                    <>Deploy <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  );
}