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
  Loader2,
  ArrowRight,
  TrendingUp
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
    bonusPerReferral: 1800 // Hardcoded to match our backend engine
  });
  const [referralHistory, setReferralHistory] = useState<any[]>([]);

  // --- SINGLE UNIFIED FETCH EFFECT ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // We run both fetch requests at the same time for speed using Promise.all
        const [dashRes, historyRes] = await Promise.all([
          fetch('/api/user/dashboard/referral', { cache: 'no-store' }).catch(() => null),
          fetch('/api/user/referrals', { cache: 'no-store' }).catch(() => null)
        ]);

        // Process Dashboard Stats & Link
        if (dashRes && dashRes.ok) {
          const dashData = await dashRes.json();
          if (dashData.success) {
            setStats({
              totalEarned: dashData.stats?.totalEarned || 0,
              totalInvites: dashData.stats?.totalInvites || 0,
              activeReferrals: dashData.stats?.activeReferrals || 0,
              bonusPerReferral: 1800
            });

            // Generate Link Dynamically
            const origin = typeof window !== 'undefined' && window.location.origin
              ? window.location.origin
              : '';
            setReferralLink(`${origin}/signup?ref=${dashData.referralCode}`);
          }
        }

        // Process the new Referral History table data
        if (historyRes && historyRes.ok) {
          const historyData = await historyRes.json();
          if (historyData.success) {
            setReferralHistory(historyData.history);
          }
        }

      } catch (error) {
        console.error("Failed to load referrals data:", error);
      } finally {
        setIsLoading(false); // Only stop loading after EVERYTHING is done
      }
    };

    fetchAllData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white animate-in fade-in duration-500">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Partner Program</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">Invite friends and earn capital instantly.</p>
        </div>
      </div>

      {/* --- 1. HERO JUMBOTRON PANEL --- */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group hover:shadow-md transition-shadow">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 -mr-20 -mt-20 transition-opacity opacity-50 group-hover:opacity-100"></div>

        <div className="flex-1 text-center md:text-left z-10 w-full">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-widest rounded-lg mb-5">
            <Gift className="w-3.5 h-3.5" /> Referral Link
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            Share your unique link.
          </h2>
          <p className="text-slate-500 text-base mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
            When your friends sign up and activate a task, you get paid <strong className="text-slate-900 font-bold">₦{stats.bonusPerReferral.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> instantly.
          </p>

          {/* Modern Input Group */}
          <div className="flex items-center w-full max-w-lg mx-auto md:mx-0 bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
            <div className="flex-1 px-5 py-4 overflow-hidden">
              <span className="text-slate-600 font-mono text-sm truncate block select-all">
                {referralLink || "Generating link..."}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`h-full px-6 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-all shrink-0 border-l-2 border-slate-200
                ${copied
                  ? 'bg-emerald-500 text-white border-l-emerald-500'
                  : 'bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 active:bg-indigo-100'
                }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Right Visual Badge */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-slate-50/80 border border-slate-200 rounded-3xl text-center min-w-[220px] shrink-0">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Your Reward</p>
          <div className="text-3xl font-bold text-emerald-600 tracking-tight">
            ₦{stats.bonusPerReferral.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-slate-500 font-medium uppercase mt-2 bg-white px-2 py-1 rounded-md border border-slate-200">Per active user</p>
        </div>
      </div>

      {/* --- 2. STATS & ACTION GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Premium Earnings Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl shadow-lg p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
          
          <div className="text-center sm:text-left z-10">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Wallet className="w-4 h-4 text-indigo-200" />
              </div>
              <p className="font-semibold text-slate-300 uppercase tracking-wider text-xs">Available Earnings</p>
            </div>
            <div className="text-4xl md:text-5xl font-bold tracking-tight">
              ₦{stats.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl text-center sm:text-left shrink-0 z-10">
            <p className="text-xs text-indigo-100 font-medium mb-3">Ready to cash out?</p>
            <button
              onClick={() => router.push('/dashboard/wallet')}
              className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Withdraw Funds <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Network Stats Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 flex flex-col justify-center text-center sm:text-left hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-4">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-xs">Total Network</p>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
            <span className="text-4xl font-bold text-slate-900 tracking-tight">{stats.totalInvites}</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">clicks</span>
          </div>
          
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-xs text-emerald-600 font-semibold flex items-center justify-center sm:justify-start gap-1.5 bg-emerald-50 w-fit sm:mx-0 mx-auto px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" /> {stats.activeReferrals} Active Conversions
            </p>
          </div>
        </div>

      </div>

      {/* --- 3. RECENT REFERRALS TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl">
              <Users className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">Network History</h3>
          </div>
          <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg">
            {referralHistory.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">User</th>
                <th className="px-6 py-4 whitespace-nowrap">Date Joined</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Commission</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {referralHistory.map((ref) => (
                <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                    {ref.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                    {ref.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide
                      ${ref.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600 text-base whitespace-nowrap">
                    {ref.reward > 0 ? `+₦${ref.reward.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                  </td>
                </tr>
              ))}
              {referralHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium bg-white">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-1">
                        <Users className="w-6 h-6 text-slate-300" />
                      </div>
                      No referrals yet. Share your link to start building your network!
                    </div>
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