/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Users,
  PlaySquare,
  MousePointerClick,
  ArrowRight,
  TrendingUp,
  Gift
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const MIN_ADS_WITHDRAWAL = 20000;
  const MIN_REF_WITHDRAWAL = 12000;

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/user/dashboard');

        // If the user's token is expired or missing, redirect to login
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();

        if (data.success) {
          setUserData(data.user);
        } else {
          console.error("Dashboard Error:", data.message);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-[#337ab7] font-bold flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  if (!userData) return(
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="text-[#db3030] font-bold flex items-center gap-2">
        please check your internet connection
      </div>
    </div>
  );

  // Progress Calculations
  const adsProgress = Math.min((userData.adsBalance / MIN_ADS_WITHDRAWAL) * 100, 100);
  const refProgress = Math.min((userData.referralBalance / MIN_REF_WITHDRAWAL) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans text-[#333333] selection:bg-[#337ab7] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* --- HEADER --- */}
        <div className="border-b border-[#dddddd] pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#222222]">
              Overview
            </h1>
            <p className="text-[#666666] mt-1 text-sm">
              Welcome back, {userData.name}. Start watching ads to increase your balance.
            </p>
          </div>
          <div className="text-sm font-bold text-[#777777] bg-white border border-[#dddddd] px-3 py-1.5 rounded shadow-sm">
            Server Time: <span className="font-mono text-[#333333]">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* --- WELCOME BONUS ALERT (Classic Bootstrap .alert-success) --- */}
        {userData.hasClaimedBonus && (
          <div className="bg-[#dff0d8] border border-[#d6e9c6] text-[#3c763d] px-4 py-3 rounded shadow-sm flex items-start gap-3">
            <Gift className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[15px] mb-0.5">₦2,000 Sign-up Bonus Credited!</h4>
              <p className="text-sm">Your default balance has been credited. Complete daily ad tasks to reach the ₦20,000 withdrawal limit.</p>
            </div>
          </div>
        )}

        {/* --- QUICK ACTIONS --- */}
        <div className="flex flex-wrap gap-3 pb-2">
          <button
            onClick={() => router.push('/dashboard/ads')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] rounded text-sm font-bold text-white shadow-sm transition-colors"
          >
            <PlaySquare className="w-4 h-4" /> Watch Ads & Earn
          </button>
          <button
            onClick={() => router.push('/dashboard/referrals')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#cccccc] rounded text-sm font-bold text-[#333333] hover:bg-[#e6e6e6] transition-colors shadow-sm"
          >
            <Users className="w-4 h-4 text-[#337ab7]" /> Invite Friends
          </button>
          <button
            onClick={() => router.push('/dashboard/wallet')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#cccccc] rounded text-sm font-bold text-[#333333] hover:bg-[#e6e6e6] transition-colors shadow-sm"
          >
            <Wallet className="w-4 h-4 text-[#f0ad4e]" /> Withdraw Funds
          </button>
        </div>

        {/* --- DUAL WALLET OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. ADS WALLET */}
          <div className="bg-white border border-[#dddddd] rounded shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex justify-between items-center">
              <h3 className="font-bold text-[#333333] flex items-center gap-2">
                <PlaySquare className="w-4 h-4 text-[#337ab7]" /> Ads Balance
              </h3>
              <span className="text-xs font-bold text-[#777777] uppercase">Tasks & Clicks</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-6">
                <h3 className="text-4xl font-bold text-[#222222] mb-1">
                  ₦{userData.adsBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[#666666] text-xs font-bold uppercase tracking-wider">Current Balance</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#333333] mb-1">
                  <span>Withdrawal Progress</span>
                  <span>{adsProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-[#f5f5f5] rounded border border-[#cccccc] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] mb-2">
                  <div className="h-full bg-[#337ab7] shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]" style={{ width: `${adsProgress}%` }}></div>
                </div>
                <p className="text-[11px] text-[#777777] font-bold text-right">Min. Payout: ₦{MIN_ADS_WITHDRAWAL.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 2. REFERRAL WALLET */}
          <div className="bg-white border border-[#dddddd] rounded shadow-sm flex flex-col h-full">
            <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex justify-between items-center">
              <h3 className="font-bold text-[#333333] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5cb85c]" /> Referral Balance
              </h3>
              <span className="text-xs font-bold text-[#777777] uppercase">Network Earnings</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-6">
                <h3 className="text-4xl font-bold text-[#222222] mb-1">
                  ₦{userData.referralBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[#666666] text-xs font-bold uppercase tracking-wider">Current Balance</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#333333] mb-1">
                  <span>Withdrawal Progress</span>
                  <span>{refProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-4 bg-[#f5f5f5] rounded border border-[#cccccc] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] mb-2">
                  <div className="h-full bg-[#5cb85c] shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]" style={{ width: `${refProgress}%` }}></div>
                </div>
                <p className="text-[11px] text-[#777777] font-bold text-right">Min. Payout: ₦{MIN_REF_WITHDRAWAL.toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>

        {/* --- DAILY STATISTICS --- */}
        <div className="bg-white border border-[#dddddd] rounded shadow-sm">
          <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#777777]" />
            <h3 className="font-bold text-[#333333] text-base">Today's Activity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#dddddd]">

            <div className="p-6 text-center hover:bg-[#f9f9f9] transition-colors">
              <PlaySquare className="w-6 h-6 text-[#337ab7] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#222222]">{userData.adsWatchedToday}</div>
              <div className="text-xs text-[#777777] uppercase font-bold mt-1">Videos Watched</div>
            </div>

            <div className="p-6 text-center hover:bg-[#f9f9f9] transition-colors">
              <MousePointerClick className="w-6 h-6 text-[#f0ad4e] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#222222]">{userData.linksClickedToday}</div>
              <div className="text-xs text-[#777777] uppercase font-bold mt-1">Links Clicked</div>
            </div>

            <div className="p-6 text-center hover:bg-[#f9f9f9] transition-colors">
              <Users className="w-6 h-6 text-[#5cb85c] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#222222]">{userData.activeReferrals}</div>
              <div className="text-xs text-[#777777] uppercase font-bold mt-1">Active Referrals</div>
            </div>

          </div>

          <div className="p-4 bg-[#f9f9f9] border-t border-[#dddddd] text-center">
            <button
              onClick={() => router.push('/dashboard/ads')}
              className="text-[#337ab7] font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              Go to Ads Manager <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Dummy loader component to prevent errors if you haven't extracted it
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  );
}