/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  MoreHorizontal,
  Loader2,
  Info,
  Activity,
  Zap,
  Plus,
  Users,
  Cpu,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import LiveTerminal from '@/components/LiveTerminal';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // --- GREETING LOGIC ---
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        const data = await res.json();

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120]">
        <div className="relative flex items-center justify-center">
           <div className="absolute inset-0 w-12 h-12 border-4 border-slate-200 dark:border-blue-900/30 rounded-full animate-ping"></div>
           <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // Mock data for the engaging elements (Replace with real backend data later)
  const cycleProgress = 60; // e.g., 6 out of 10 days
  const adsProcessed = 12403;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] p-4 md:p-8 lg:p-10 font-sans text-slate-800 dark:text-slate-200 animate-in fade-in duration-700 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
      
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {greeting}, {userData.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {userData.tier} is currently deployed
            </p>
          </div>
          <div className="hidden md:block text-right bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] px-4 py-2 rounded-xl shadow-sm">
             <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-0.5">Network Time</p>
             <p className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">
               {new Date().toLocaleTimeString()}
             </p>
          </div>
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          <button 
            onClick={() => router.push('/dashboard/wallet')}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Add Capital
          </button>
          <button 
            onClick={() => router.push('/dashboard/bots')}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors shadow-sm whitespace-nowrap"
          >
            <Zap className="w-4 h-4 text-amber-500" /> Upgrade Bot
          </button>
          <button 
            onClick={() => router.push('/dashboard/referrals')}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors shadow-sm whitespace-nowrap"
          >
            <Users className="w-4 h-4 text-emerald-500" /> Invite & Earn
          </button>
        </div>

        {/* --- FINANCIAL OVERVIEW (2 Columns) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. NET WORTH CARD */}
          <div className="bg-white dark:bg-[#060913] p-8 rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-white/[0.05] flex flex-col justify-between h-[280px] group hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 dark:bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-500/20">
                <Wallet className="w-6 h-6" />
              </div>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            <div className="relative z-10">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                Net Worth
              </p>
              <h3 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                ${userData.totalBalance.toFixed(2)}
              </h3>
              
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/[0.05] rounded-lg">
                   <Info className="w-3.5 h-3.5 text-slate-500" />
                   <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">Cash + Capital</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">+${userData.dailyProfit.toFixed(2)} Daily</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. REFERRAL NETWORK CARD (UPDATED) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#0B1120] dark:to-[#060913] p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-between h-[280px] relative overflow-hidden border border-slate-800 dark:border-white/[0.08]">
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 opacity-90">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                 <p className="text-xs font-bold tracking-widest uppercase text-blue-100">Referral Earnings</p>
              </div>
              <h3 className="text-5xl lg:text-6xl font-bold tracking-tight">${userData.referralEarnings.toFixed(2)}</h3>
            </div>
            
            <div className="relative z-10">
              <p className="text-blue-200/80 text-sm mb-5 font-medium leading-relaxed">
                Automatically credited to your main balance for withdrawal.
              </p>
              <button 
                onClick={() => router.push('/dashboard/referrals')}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                View Network <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION (Terminal + Telemetry) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LIVE TERMINAL */}
          <div className="lg:col-span-8 flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">Live Network Activity</h3>
            </div>
            <div className="bg-white dark:bg-[#060913] border border-slate-200/80 dark:border-white/[0.08] rounded-[2rem] p-1.5 shadow-sm overflow-hidden flex-1">
               <div className="h-full w-full bg-[#0A0A0A] rounded-[1.6rem] overflow-hidden border border-white/5 shadow-inner">
                 <LiveTerminal />
               </div>
            </div>
          </div>

          {/* TELEMETRY & UPSELL */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full pt-2 lg:pt-14">
            
            {/* Bot Telemetry Card */}
            <div className="bg-white dark:bg-[#060913] border border-slate-200/80 dark:border-white/[0.05] rounded-[2rem] p-6 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" /> System Health
              </h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Cycle Progress</span>
                    <span className="text-slate-900 dark:text-white">{cycleProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full relative" style={{ width: `${cycleProgress}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-right font-medium uppercase">Day 6 of 10</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-white/[0.02] rounded-xl p-4 border border-slate-100 dark:border-transparent">
                    <Clock className="w-4 h-4 text-slate-400 mb-2" />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">99.9%</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Uptime</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/[0.02] rounded-xl p-4 border border-slate-100 dark:border-transparent">
                    <Activity className="w-4 h-4 text-emerald-500 mb-2" />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{(adsProcessed / 1000).toFixed(1)}k</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">Ads Viewed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Upsell Card */}
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white overflow-hidden group cursor-pointer hover:shadow-lg transition-all flex-1 flex flex-col justify-center" onClick={() => router.push('/dashboard/bots')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-purple-100" />
                </div>
                <h4 className="text-xl font-bold mb-2">Scale Your Yield</h4>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  Upgrade to the next tier to increase your daily ad views and boost your passive income.
                </p>
                <div className="flex items-center text-sm font-bold text-white group-hover:gap-3 transition-all gap-2">
                  Explore Tiers <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}