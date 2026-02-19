/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {useRouter} from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Gift, Wallet, Clock, Loader2 } from 'lucide-react';

export default function ReferralsPage() {
  const router = useRouter()
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Referrals</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Invite friends and earn <span className="font-bold text-slate-700 dark:text-slate-200">${stats.bonusPerReferral.toLocaleString()}</span> for every active bot they launch.
        </p>
      </div>

      {/* 1. HERO BANNER & LINK */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 text-white shadow-lg dark:shadow-none relative overflow-hidden border border-blue-500/20">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white">
              <Gift className="w-3.5 h-3.5" /> Referral Program
            </div>
            <h2 className="text-3xl font-bold mb-2">Invite & Earn Big</h2>
            <p className="text-blue-100 mb-6 max-w-sm text-sm leading-relaxed">
              Share your unique link. When your friends sign up and activate a bot, you get paid instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-blue-800/50 border border-blue-500/30 rounded-xl px-4 py-3 flex items-center justify-between overflow-hidden">
                <span className="text-sm font-mono text-blue-100 truncate">{referralLink}</span>
              </div>
              <button 
                onClick={handleCopy}
                className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 min-w-[120px] shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            {/* Visual Representation of Network */}
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 w-full max-w-xs text-center">
              <div className="text-4xl font-bold mb-1">${stats.bonusPerReferral.toLocaleString()}</div>
              <div className="text-sm text-blue-100">After 9 dollars </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-blue-200">
                <span>Your Reward</span>
                <span>@ $9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Earnings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Paid Out
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">${stats.totalEarned.toLocaleString()}</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Referral Earnings</p>
        </div>

        {/* Total Invites */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
           <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalInvites}</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Link Clicks</p>
        </div>

        {/* Action Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
           <h3 className="font-bold text-slate-900 dark:text-white">Ready to cash out?</h3>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
             You can withdraw referral bonuses separately from your bot earnings.
           </p>
           <button onClick={()=>router.push('/dashboard/wallet')} className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition shadow-md shadow-slate-200 dark:shadow-none">
             Withdraw Bonus
           </button>
        </div>
      </div>

      {/* 3. RECENT REFERRALS LIST */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Referral History</h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {referralHistory.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{ref.name}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{ref.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                      ${ref.status === 'Active' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' 
                        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800'
                      }`}
                    >
                      {ref.status === 'Active' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {ref.reward > 0 ? `+$${ref.reward.toLocaleString()}` : '—'}
                  </td>
                </tr>
              ))}
              {referralHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No referrals yet. Share your link to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}