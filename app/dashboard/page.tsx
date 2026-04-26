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
  Bell,
  HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, X } from 'lucide-react';
import DailyCheckIn from '@/components/DailyCheckIn';
import LoyaltyLock from '@/components/LoyaltyLock';




export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(true);
  // --- NOTIFICATION STATE ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);

  const MIN_ADS_WITHDRAWAL = 20000;
  const MIN_REF_WITHDRAWAL = 12000;




  const handleLockSuccess = (amountDeducted: number) => {
    setUserData((prev: any) => ({
      ...prev,
      adsBalance: prev.adsBalance - amountDeducted
    }));
  };



  

//check in success(streak)
  const handleCheckInSuccess = (rewardAmount: number, newStreak: number) => {
    setUserData((prev: any) => ({
      ...prev,
      adsBalance: prev.adsBalance + rewardAmount,
      currentStreak: newStreak,
      lastCheckInDate: new Date().toISOString() // Update the date locally so the button locks
    }));
  };

  


//user warning box
  const dismissAlert = async () => {
  setShowAlert(false); 
  try {
    await fetch('/api/user/alert/dismiss', { method: 'POST' });
  } catch (error) {
    console.error("Failed to dismiss alert");
  }
};



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
          // console.log("user data:",userDataRes.user);
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
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* STREAK */}
        {userData && (userData._id || userData.id) ? (
          <DailyCheckIn 
            userId={userData.id || userData._id} 
            currentStreak={userData.currentStreak || 0} 
            lastCheckInDate={userData.lastCheckInDate}
            onClaimSuccess={handleCheckInSuccess}
          />
        ):(
          <p></p>
        )
        }

        {/* --- HEADER & NOTIFICATION CAROUSEL --- */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Overview
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              Welcome back, <span className="font-semibold text-slate-700">{userData?.name || 'User'}</span>. Start watching ads to increase your balance.
            </p>
          </div>

          {/* Sleek Notification Carousel */}
          <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm flex items-start gap-3 w-full md:w-[320px] lg:w-[400px] min-h-[48px]">
            <Bell className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div className="flex-1 grid">
              {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                  <div
                    key={notif.id || index}
                    className={`col-start-1 row-start-1 w-full text-sm font-medium text-slate-700 transition-all duration-500 ease-in-out ${
                      index === currentNotifIndex 
                        ? 'opacity-100 translate-y-0 z-10' 
                        : 'opacity-0 translate-y-4 pointer-events-none z-0'
                    }`}
                  >
                    {notif.message}
                  </div>
                ))
              ) : (
                <div className="col-start-1 row-start-1 text-sm text-slate-400 font-medium">
                  You're all caught up!
                </div>
              )}
            </div>
          </div>
        </div>

        

        {/* --- ALERT --- */}
        {userData?.dashboardAlert && showAlert && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <div className="flex justify-between items-start pl-2">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Action Required</h3>
                  <p className="text-sm text-amber-700 mt-1 font-medium leading-relaxed">
                    {userData.dashboardAlert}
                  </p>
                </div>
              </div>
              <button 
                onClick={dismissAlert}
                className="text-amber-500 hover:text-amber-700 hover:bg-amber-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- QUICK ACTIONS --- */}
        <div className="flex flex-wrap gap-3 pb-2">
          <button
            onClick={() => router.push('/dashboard/ads')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#337ab7] hover:bg-[#337ab7] text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all ring-1 ring-inset ring-[#286090]"
          >
            <PlaySquare className="w-4 h-4" /> Watch Ads & Earn
          </button>
          <button
            onClick={() => router.push('/dashboard/referrals')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Users className="w-4 h-4 text-indigo-500" /> Invite Friends
          </button>
          <button
            onClick={() => router.push('/dashboard/wallet')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Wallet className="w-4 h-4 text-emerald-500" /> Withdraw Funds
          </button>
          <button
            onClick={() => router.push('/dashboard/surveys')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" /> Take Surveys
          </button>
        </div>

        {/* --- DUAL WALLET OVERVIEW --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. ADS WALLET */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <PlaySquare className="w-4 h-4 text-indigo-500" /> Ads & Surveys
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full">
                Tasks & Clicks
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-8">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Current Balance</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                  ₦{(userData?.adsBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2.5">
                  <span>Withdrawal Progress</span>
                  <span className="text-indigo-600">{adsProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-[#337ab7] to-[#337ab7]rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${adsProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium text-right">
                  Min. Payout: <span className="font-semibold text-slate-700">₦{MIN_ADS_WITHDRAWAL.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 2. REFERRAL WALLET */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" /> Referrals
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full">
                Network Earnings
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="mb-8">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Current Balance</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                  ₦{(userData?.referralBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2.5">
                  <span>Withdrawal Progress</span>
                  <span className="text-emerald-600">{refProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${refProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium text-right">
                  Min. Payout: <span className="font-semibold text-slate-700">₦{MIN_REF_WITHDRAWAL.toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>

        </div>


        {userData && (userData._id || userData.id) && (
        <LoyaltyLock 
          userId={userData._id || userData.id}
          adsBalance={userData.adsBalance || 0}
          onLockSuccess={handleLockSuccess}
        />
      )}

        {/* --- DAILY STATISTICS --- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-4">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-800 text-base">Today's Activity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x lg:divide-y-0 divide-slate-100">
            {/* Stat 1 */}
            <div className="p-6 text-center hover:bg-slate-50 transition-colors flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                <PlaySquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{userData?.adsWatchedToday || 0}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Videos Watched</div>
            </div>

            {/* Stat 2 */}
            <div className="p-6 text-center hover:bg-slate-50 transition-colors flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <MousePointerClick className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{userData?.linksClickedToday || 0}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Links Clicked</div>
            </div>

            {/* Stat 3 */}
            <div className="p-6 text-center hover:bg-slate-50 transition-colors flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{userData?.activeReferrals || 0}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Active Referrals</div>
            </div>

            {/* Stat 4 */}
            <div className="p-6 text-center hover:bg-slate-50 transition-colors flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
                <HelpCircle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{userData?.surveysCompleted || 0}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1.5">Surveys Completed</div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => router.push('/dashboard/ads')}
              className="text-[#337ab7]  font-bold text-sm hover:text-[#286090] transition-colors flex items-center justify-center gap-1.5 mx-auto group"
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