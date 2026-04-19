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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans text-[#333333]">

      {/* HEADER */}
      <div className="border-b border-[#dddddd] pb-4 mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Partner Program</h1>
        <p className="text-[#666666] mt-1 text-sm">Invite friends and earn capital instantly.</p>
      </div>

      {/* 1. HERO JUMBOTRON PANEL */}
      <div className="bg-[#f9f9f9] border border-[#dddddd] rounded shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Top colored border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#337ab7]"></div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#cccccc] text-[#337ab7] text-[11px] font-bold uppercase tracking-wider rounded mb-4">
            <Gift className="w-3.5 h-3.5" /> Referral Link
          </div>
          <h2 className="text-2xl font-bold text-[#222222] mb-2">
            Share your unique link.
          </h2>
          <p className="text-[#666666] text-sm mb-6 max-w-md mx-auto md:mx-0">
            When your friends sign up and activate a task, you get paid <strong className="text-[#333333]">₦{stats.bonusPerReferral.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> instantly.
          </p>

          {/* Classic Input Group */}
          <div className="flex shadow-sm max-w-lg mx-auto md:mx-0">
            <div className="flex-1 bg-white border border-[#cccccc] border-r-0 px-4 py-2.5 flex items-center rounded-l overflow-hidden">
              <span className="text-[#555555] font-mono text-sm truncate w-full select-all">
                {referralLink || "Generating link..."}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`font-bold px-6 py-2.5 rounded-r border flex items-center justify-center gap-2 transition-colors shrink-0
                ${copied
                  ? 'bg-[#5cb85c] border-[#4cae4c] text-white'
                  : 'bg-[#337ab7] hover:bg-[#286090] border-[#2e6da4] text-white'
                }`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Right Visual (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 bg-white border border-[#dddddd] rounded shadow-sm text-center min-w-[200px]">
          <p className="text-[#777777] text-xs font-bold uppercase tracking-wider mb-2">Your Reward</p>
          <div className="text-3xl font-bold text-[#5cb85c]">
            ₦{stats.bonusPerReferral.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-[#999999] uppercase font-bold mt-2">Per active user</p>
        </div>
      </div>

      {/* 2. STATS & ACTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Earnings Card */}
        <div className="md:col-span-2 bg-white border border-[#dddddd] rounded shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <Wallet className="w-4 h-4 text-[#337ab7]" />
              <p className="font-bold text-[#777777] uppercase tracking-wider text-xs">Available Earnings</p>
            </div>
            <div className="text-4xl font-bold text-[#222222]">
              ₦{stats.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="w-full sm:w-auto bg-[#f9f9f9] border border-[#eeeeee] p-4 rounded text-center sm:text-left shrink-0">
            <p className="text-xs text-[#666666] font-bold mb-3">Ready to cash out?</p>
            <button
              onClick={() => router.push('/dashboard/wallet')}
              className="w-full sm:w-auto bg-white border border-[#cccccc] text-[#333333] hover:bg-[#e6e6e6] font-bold px-4 py-2 rounded text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Withdraw Funds <ArrowRight className="w-4 h-4 text-[#777777]" />
            </button>
          </div>
        </div>

        {/* Network Stats Card */}
        <div className="bg-white border border-[#dddddd] rounded shadow-sm p-6 flex flex-col justify-center text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <Users className="w-4 h-4 text-[#337ab7]" />
            <p className="font-bold text-[#777777] uppercase tracking-wider text-xs">Total Network</p>
          </div>
          <div className="flex items-baseline justify-center sm:justify-start gap-1">
            <span className="text-4xl font-bold text-[#222222]">{stats.totalInvites}</span>
            <span className="text-[#999999] text-xs font-bold uppercase">clicks</span>
          </div>
          <p className="text-xs text-[#5cb85c] font-bold mt-3 flex items-center justify-center sm:justify-start gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {stats.activeReferrals} Active Conversions
          </p>
        </div>

      </div>

      {/* 3. RECENT REFERRALS LIST (Classic Bootstrap Table) */}
      <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#777777]" />
            <h3 className="font-bold text-[#333333] text-base">Network History</h3>
          </div>
          <span className="text-[11px] font-bold bg-white border border-[#cccccc] text-[#666666] px-2 py-1 rounded">
            {referralHistory.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="bg-[#f9f9f9] text-[#777777] text-xs uppercase font-bold border-b border-[#dddddd]">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">User</th>
                <th className="px-6 py-3 whitespace-nowrap">Date Joined</th>
                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">Commission</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#333333]">
              {referralHistory.map((ref) => (
                <tr key={ref.id} className="border-b border-[#eeeeee] hover:bg-[#f9f9f9] transition-colors">
                  <td className="px-6 py-4 font-bold text-[#222222] whitespace-nowrap">
                    {ref.name}
                  </td>
                  <td className="px-6 py-4 text-[#666666] whitespace-nowrap">
                    {ref.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-[11px] font-bold text-white
                      ${ref.status === 'Active' ? 'bg-[#5cb85c]' : 'bg-[#999999]'}`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#3c763d] text-base whitespace-nowrap">
                    {ref.reward > 0 ? `+₦${ref.reward.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                  </td>
                </tr>
              ))}
              {referralHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#999999] bg-[#f9f9f9]">
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