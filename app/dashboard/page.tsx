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
  Gift,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);

  const MIN_ADS_WITHDRAWAL = 20000;
  const MIN_REF_WITHDRAWAL = 12000;

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Data & Notifications in parallel
        const [userRes, notifRes] = await Promise.all([
          fetch('/api/user/dashboard'),
          fetch('/api/user/notifications').catch(() => null) // fail gracefully
        ]);

        if (userRes.status === 401) {
          router.push('/login');
          return;
        }

        const userDataRes = await userRes.json();
        
        if (userDataRes.success) {
          setUserData(userDataRes.user);
        } else {
          console.error("Dashboard Error:", userDataRes.message);
        }

        // Handle Notifications
        if (notifRes && notifRes.ok) {
          const notifData = await notifRes.json();
          if (notifData.success && notifData.notifications) {
            setNotifications(notifData.notifications);
          }
        }

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // --- NOTIFICATION CAROUSEL LOGIC ---
  useEffect(() => {
    if (notifications.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentNotifIndex((prev) => (prev + 1) % notifications.length);
    }, 5000); // cycle every 5 seconds
    
    return () => clearInterval(timer);
  }, [notifications]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="text-[#db3030] bg-[#f2dede] px-6 py-4 rounded-xl border border-[#ebccd1] font-medium flex items-center gap-2 shadow-sm">
        Please check your internet connection or login again.
      </div>
    </div>
  );

  // Progress Calculations
  const adsProgress = Math.min((userData.adsBalance / MIN_ADS_WITHDRAWAL) * 100, 100);
  const refProgress = Math.min((userData.referralBalance / MIN_REF_WITHDRAWAL) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans text-[#333333] selection:bg-[#337ab7] selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* --- HEADER & NOTIFICATION CAROUSEL --- */}
        <div className="border-b border-[#dddddd]/60 pb-5 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#222222] tracking-tight">
              Overview
            </h1>
            <p className="text-[#666666] mt-1.5 text-sm">
              Welcome back, <span className="font-semibold text-[#333333]">{userData.name}</span>. Start watching ads to increase your balance.
            </p>
          </div>

          {/* Sleek Notification Carousel */}
          <div className="bg-white border border-[#dddddd]/80 px-4 py-3 rounded-xl shadow-sm flex items-start gap-3 w-full md:w-[320px] lg:w-[400px] min-h-[48px]">
  <Bell className="w-4 h-4 text-[#f0ad4e] shrink-0 mt-0.5" />
  <div className="flex-1 grid">
    {notifications.length > 0 ? (
      notifications.map((notif, index) => (
        <div
          key={notif.id || index}
          className={`col-start-1 row-start-1 w-full text-sm font-medium transition-all duration-500 ease-in-out ${
            index === currentNotifIndex 
              ? 'opacity-100 translate-y-0 z-10' 
              : 'opacity-0 translate-y-4 pointer-events-none z-0'
          }`}
        >
          {notif.message}
        </div>
      ))
    ) : (
      <div className="col-start-1 row-start-1 text-sm text-[#777777] font-medium">
        You're all caught up!
      </div>
    )}
  </div>
</div>
        </div>

        {/* --- WELCOME BONUS ALERT --- */}
        {userData.hasClaimedBonus && (
          <div className="bg-[#dff0d8]/80 border border-[#d6e9c6] text-[#3c763d] px-5 py-4 rounded-xl shadow-sm flex items-start gap-3">
            <Gift className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[15px] mb-0.5">₦2,000 Sign-up Bonus Credited!</h4>
              <p className="text-sm opacity-90">Your default balance has been credited. Complete daily ad tasks to reach the ₦20,000 withdrawal limit.</p>
            </div>
          </div>
        )}

        {/* --- QUICK ACTIONS --- */}
        <div className="flex flex-wrap gap-3 pb-2">
          <button
            onClick={() => router.push('/dashboard/ads')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5cb85c] hover:bg-[#449d44] active:bg-[#398439] border border-[#4cae4c] rounded-xl text-sm font-bold text-white shadow-sm hover:shadow transition-all"
          >
            <PlaySquare className="w-4 h-4" /> Watch Ads & Earn
          </button>
          <button
            onClick={() => router.push('/dashboard/referrals')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#cccccc] rounded-xl text-sm font-bold text-[#333333] hover:bg-[#f5f5f5] active:bg-[#ebebeb] transition-all shadow-sm hover:shadow"
          >
            <Users className="w-4 h-4 text-[#337ab7]" /> Invite Friends
          </button>
          <button
            onClick={() => router.push('/dashboard/wallet')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#cccccc] rounded-xl text-sm font-bold text-[#333333] hover:bg-[#f5f5f5] active:bg-[#ebebeb] transition-all shadow-sm hover:shadow"
          >
            <Wallet className="w-4 h-4 text-[#f0ad4e]" /> Withdraw Funds
          </button>
        </div>

        {/* --- DUAL WALLET OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. ADS WALLET */}
          <div className="bg-white border border-[#dddddd]/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-[#dddddd]/60 bg-[#fbfbfb] flex justify-between items-center">
              <h3 className="font-bold text-[#333333] flex items-center gap-2">
                <PlaySquare className="w-4 h-4 text-[#337ab7]" /> Ads Balance
              </h3>
              <span className="text-[11px] font-bold text-[#777777] uppercase tracking-wider bg-white px-2 py-1 rounded border border-[#dddddd]/60">Tasks & Clicks</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-4xl font-bold text-[#222222] mb-1 tracking-tight">
                  ₦{userData.adsBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[#777777] text-xs font-bold uppercase tracking-wider">Current Balance</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#444444] mb-2">
                  <span>Withdrawal Progress</span>
                  <span>{adsProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden mb-2 shadow-inner">
                  <div 
                    className="h-full bg-[#337ab7] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${adsProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#777777] font-medium text-right">Min. Payout: ₦{MIN_ADS_WITHDRAWAL.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* 2. REFERRAL WALLET */}
          <div className="bg-white border border-[#dddddd]/60 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-[#dddddd]/60 bg-[#fbfbfb] flex justify-between items-center">
              <h3 className="font-bold text-[#333333] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5cb85c]" /> Referral Balance
              </h3>
              <span className="text-[11px] font-bold text-[#777777] uppercase tracking-wider bg-white px-2 py-1 rounded border border-[#dddddd]/60">Network Earnings</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-4xl font-bold text-[#222222] mb-1 tracking-tight">
                  ₦{userData.referralBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
                <p className="text-[#777777] text-xs font-bold uppercase tracking-wider">Current Balance</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#444444] mb-2">
                  <span>Withdrawal Progress</span>
                  <span>{refProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-[#f0f0f0] rounded-full overflow-hidden mb-2 shadow-inner">
                  <div 
                    className="h-full bg-[#5cb85c] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${refProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#777777] font-medium text-right">Min. Payout: ₦{MIN_REF_WITHDRAWAL.toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>

        {/* --- DAILY STATISTICS --- */}
        <div className="bg-white border border-[#dddddd]/60 rounded-2xl shadow-sm overflow-hidden mt-2">
          <div className="p-5 border-b border-[#dddddd]/60 bg-[#fbfbfb] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#777777]" />
            <h3 className="font-bold text-[#333333] text-base">Today's Activity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#dddddd]/60">
            <div className="p-6 text-center hover:bg-[#fcfcfc] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#337ab7]/10 flex items-center justify-center mx-auto mb-3">
                <PlaySquare className="w-6 h-6 text-[#337ab7]" />
              </div>
              <div className="text-2xl font-bold text-[#222222]">{userData.adsWatchedToday}</div>
              <div className="text-[11px] text-[#777777] uppercase font-bold tracking-wider mt-1">Videos Watched</div>
            </div>

            <div className="p-6 text-center hover:bg-[#fcfcfc] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#f0ad4e]/10 flex items-center justify-center mx-auto mb-3">
                <MousePointerClick className="w-6 h-6 text-[#f0ad4e]" />
              </div>
              <div className="text-2xl font-bold text-[#222222]">{userData.linksClickedToday}</div>
              <div className="text-[11px] text-[#777777] uppercase font-bold tracking-wider mt-1">Links Clicked</div>
            </div>

            <div className="p-6 text-center hover:bg-[#fcfcfc] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#5cb85c]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#5cb85c]" />
              </div>
              <div className="text-2xl font-bold text-[#222222]">{userData.activeReferrals}</div>
              <div className="text-[11px] text-[#777777] uppercase font-bold tracking-wider mt-1">Active Referrals</div>
            </div>
          </div>

          <div className="p-4 bg-[#fbfbfb] border-t border-[#dddddd]/60 text-center">
            <button
              onClick={() => router.push('/dashboard/ads')}
              className="text-[#337ab7] font-semibold text-sm hover:text-[#23527c] transition-colors flex items-center justify-center gap-1.5 mx-auto group"
            >
              Go to Ads Manager 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Dummy loader component
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  );
}