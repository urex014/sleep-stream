/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  TrendingUp,
  MoreHorizontal,
  Loader2,
  Info,
  Activity
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 font-sans text-slate-800 dark:text-slate-200 animate-in fade-in duration-500 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
      
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {greeting}, {userData.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {userData.tier} is active
            </p>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-xs text-slate-400 font-mono">SERVER TIME</p>
             <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
               {new Date().toLocaleTimeString()}
             </p>
          </div>
        </div>

        {/* --- FINANCIAL OVERVIEW (2 Columns) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. NET WORTH CARD */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-64 group hover:shadow-lg transition-all relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

            <div className="relative z-10 flex justify-between items-start">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                <Wallet className="w-6 h-6" />
              </div>
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            <div className="relative z-10">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
                Net Worth
              </p>
              <h3 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                ${userData.totalBalance.toFixed(2)}
              </h3>
              
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                   <Info className="w-3.5 h-3.5 text-slate-400" />
                   <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cash + Bot Capital</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">+${userData.dailyProfit.toFixed(2)} incoming</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. REFERRAL / WITHDRAWAL CARD */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-slate-950/50 text-white flex flex-col justify-between h-64 relative overflow-hidden border border-slate-800">
            {/* Glowing Mesh Gradient */}
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                 <p className="text-sm font-medium tracking-wide uppercase">Referral Earnings</p>
              </div>
              <h3 className="text-5xl font-bold tracking-tight">${userData.referralEarnings.toFixed(2)}</h3>
            </div>
            
            <div className="relative z-10">
              <p className="text-slate-400 text-xs mb-4">
                Available for immediate withdrawal to your bank or crypto wallet.
              </p>
              <button 
                onClick={() => router.push('/dashboard/wallet')}
                className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Withdraw Funds <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* --- LIVE TERMINAL --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Live Server Activity</h3>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-1 shadow-sm overflow-hidden h-[450px]">
             {/* Inner padding wrapper for terminal */}
             <div className="h-full w-full bg-black rounded-[1.3rem] overflow-hidden">
               <LiveTerminal />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}