/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Copy, 
  CheckCircle2, 
  Gift, 
  Wallet, 
  Clock, 
  Loader2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ThumbsUp
} from 'lucide-react';

export default function ReferralsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  
  // Data States
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalInvites: 0,
    activeReferrals: 0,
    bonusPerReferral: 1.5
  });
  const [referralHistory, setReferralHistory] = useState<any[]>([]);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/dashboard/referral');
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setReferralHistory(data.history);
          
          // Generate Link Dynamically
          const origin = typeof window !== 'undefined' && window.location.origin 
            ? window.location.origin 
            : '';
          setReferralLink(`${origin}/signup?ref=${data.referralCode}`);
        }
      } catch (error) {
        console.error("Failed to load referrals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative flex items-center justify-center">
           <div className="absolute inset-0 w-12 h-12 border-4 border-slate-200 dark:border-slate-800 rounded-full animate-ping"></div>
           <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* 1. HERO BENTO BOX */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 dark:from-[#0B1120] dark:via-blue-950 dark:to-slate-950 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden border border-blue-500/20 dark:border-blue-500/10">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-blue-50 mb-6 shadow-sm">
              <Gift className="w-4 h-4 text-blue-200" /> Partner Program
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
              Invite friends.<br />Earn capital.
            </h1>
            <p className="text-blue-100/80 text-lg mb-8 max-w-md leading-relaxed">
              Share your unique link. When your friends sign up and activate a bot, you get paid instantly.
            </p>
            
            {/* Link Copier */}
            <div className="flex flex-col sm:flex-row gap-3 w-[70%] lg:max-w-lg">
              <div className="flex-1 bg-black/20 dark:bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4 flex items-center shadow-inner">
                <span className="text-sm font-mono text-white/90 truncate select-all">{referralLink}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white text-blue-900 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shrink-0"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Right Content - Visual Representation */}
          <div className="lg:col-span-5 hidden lg:flex justify-end">
            <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-900">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <p className="text-blue-100 font-medium mb-1">Your Reward</p>
              <div className="text-6xl font-bold text-white tracking-tighter mb-4">
                ${stats.bonusPerReferral.toFixed(2)}
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-blue-200/80 leading-relaxed">
                  Earned immediately for every user who deposits and deploys their first bot.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. STATS & ACTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Earnings & Withdraw Action (Spans 8 cols) */}
        <div className="md:col-span-8 bg-white dark:bg-[#0B1120] rounded-[2rem] border border-slate-200 dark:border-slate-800/60 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">Available Earnings</p>
            </div>
            <div className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              ${stats.totalEarned.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
          </div>

          <div className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center sm:text-left shrink-0">
             <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">Ready to cash out?</p>
             <button 
               onClick={() => router.push('/dashboard/wallet')} 
               className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
             >
               Withdraw Funds <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Network Stats (Spans 4 cols) */}
        <div className="md:col-span-4 bg-white dark:bg-[#0B1120] rounded-[2rem] border border-slate-200 dark:border-slate-800/60 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs">Total Network</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">{stats.totalInvites}</span>
            <span className="text-slate-500 font-medium text-sm">clicks</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> {stats.activeReferrals} Active Conversions
          </p>
        </div>

      </div>

      {/* 3. RECENT REFERRALS LIST */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
          <h3 className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">Network History</h3>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">
            {referralHistory.length} Records
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white dark:bg-[#0B1120] text-slate-400 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60">User</th>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60">Date Joined</th>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60">Status</th>
                <th className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/60 text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {referralHistory.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/30 font-bold text-slate-900 dark:text-white">
                    {ref.name}
                  </td>
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/30 text-slate-500 dark:text-slate-400 font-medium">
                    {ref.date}
                  </td>
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/30">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                      ${ref.status === 'Active' 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {ref.status === 'Active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/30 text-right font-bold text-emerald-600 dark:text-emerald-400 text-base">
                    {ref.reward > 0 ? `+$${ref.reward.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
              {referralHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-medium bg-slate-50/50 dark:bg-transparent">
                    No referrals yet. Share your link to start building your network!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}