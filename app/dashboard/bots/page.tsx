'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Zap, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BotsPage() {
  
  const router = useRouter();
  const [myBots, setMyBots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- UPDATED TIERS (USD) ---
  const tiers = [
    { id: 0, name: 'Tier 0', price: 5, theme: 'slate', active: true, desc: 'Included with Code' },
    { id: 1, name: 'Tier 1', price: 10, theme: 'blue' },
    { id: 2, name: 'Tier 2', price: 40, theme: 'emerald' },
    { id: 3, name: 'Tier 3', price: 80, theme: 'purple' },
    { id: 4, name: 'Tier 4', price: 120, theme: 'amber' },
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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }
  // Inside BotsPage component...

const handlePurchase = async (tierId: number) => {
  if (!confirm(`Confirm purchase of Tier ${tierId} for $${tiers.find(t => t.id === tierId)?.price}?`)) return;

  try {
    const res = await fetch('/api/user/dashboard/bots/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tierId }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.reload(); // Refresh to show new active bot
    } else {
      alert(data.message); // Show "Insufficient balance" error
    }
  } catch (error) {
    alert('Transaction failed');
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bot Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor active units and deploy new automated servers.</p>
      </div>

      {/* SECTION 1: ACTIVE FLEET */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Bots</h2>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            {myBots.length} RUNNING
          </span>
        </div>

        {myBots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBots.map((bot) => (
              <div key={bot.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-700/30 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{bot.tier}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold tracking-wide">ONLINE</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Profit</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">${bot.totalEarnedSoFar.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>Cycle Progress</span>
                      <span className="text-slate-700 dark:text-slate-300">Day {bot.currentDay} / {bot.totalDays}</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000 relative"
                        style={{ width: `${(bot.currentDay / bot.totalDays) * 100}%` }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                        <span className="text-slate-400 dark:text-slate-500">Started: {bot.startDate}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Daily: +${bot.dailyEarn.toFixed(2)}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
            <p className="text-slate-500 dark:text-slate-400">No active bots found.</p>
          </div>
        )}
      </section>

      {/* SECTION 2: SHOP */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Deploy New Bot</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const dailyReturn = tier.price * 0.15;
            const totalReturn = dailyReturn * 10;
            const profit = totalReturn - tier.price;
            
            // Dynamic Color Logic for Light AND Dark Theme
            const colorMap: Record<string, string> = {
              slate: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-600',
              blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-blue-100 dark:ring-blue-800',
              emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-emerald-100 dark:ring-emerald-800',
              purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 ring-purple-100 dark:ring-purple-800',
              amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-amber-100 dark:ring-amber-800'
            };

            const isCurrentTier = myBots.length > 0 && myBots[0].tier.includes(tier.name);

            return (
              <div key={tier.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${colorMap[tier.theme]}`}>
                    {tier.name}
                  </span>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
                    ${tier.price.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{tier.id === 0 ? "Free Deposit" : "Capital Investment"}</p>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex justify-between text-sm border-b border-slate-50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Daily Income</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">${dailyReturn.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-slate-50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Total Return</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">${totalReturn.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-slate-500 dark:text-slate-400">Net Profit</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">+${profit.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                onClick={()=>handlePurchase(tier.id)}
                  disabled={tier.id === 0 || isCurrentTier}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg 
                    ${(tier.id === 0 || isCurrentTier)
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none' 
                      : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 shadow-slate-200 dark:shadow-slate-900/50'
                    }`}
                >
                  {isCurrentTier ? 'Currently Active' : tier.id === 0 ? 'Already Activated' : 'Activate Bot'} <Zap className="w-4 h-4 opacity-70" />
                </button>
                
                <div className="mt-4 text-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 10 Day Lock-up Period
                    </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  );
}