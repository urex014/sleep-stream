'use client';

import React, { useState, useEffect } from 'react';
import { PlaySquare, MousePointerClick, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdsManagerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'timewall' | 'loottv'>('timewall');
  const [userId, setUserId] = useState<string | null>(null);

  // --- FETCH USER ID FOR THE IFRAMES ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        if (res.status === 401) return router.push('/login');

        const data = await res.json();
        if (data.success && data.user) {
          // We need the raw ID to pass to TimeWall/Loot.tv
          setUserId(data.user.id || data.user._id || data.user.name);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (isLoading || !userId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  // --- REPLACE THESE WITH YOUR ACTUAL PUBLISHER URLS ---
  // The 'userId' parameter is crucial so the network knows who to credit.
  const TIMEWALL_URL = `https://timewall.io/wall?userId=${userId}&appId=YOUR_APP_ID`;
  const LOOTTV_URL = `https://loot.tv/embed?publisherId=YOUR_PUB_ID&userId=${userId}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans text-[#333333]">

      {/* HEADER */}
      <div className="border-b items-center justify-between flex flex-row border-[#dddddd] pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#222222]">Ads & Offers</h1>
          <p className="text-[#666666] mt-1 text-sm">Complete tasks, view ads, and watch videos to earn Naira instantly.</p>
        </div>
      </div>

      {/* STATUS PANEL */}
      <div className="bg-[#d9edf7] border border-[#bce8f1] rounded p-4 text-[#31708f] flex items-start gap-3 shadow-sm mb-6">
        <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[15px]">How earning works</h4>
          <p className="text-sm">
            Earning is automated. When you complete a task below, the provider will automatically credit your <strong>Ads Balance</strong>. Please note that some high-paying video tasks may take up to 15 minutes to reflect in your dashboard.
          </p>
        </div>
      </div>

      {/* CLASSIC NAV TABS */}
      <ul className="flex border-b border-[#dddddd] mb-6">
        <li className="-mb-[1px]">
          <button
            onClick={() => setActiveTab('timewall')}
            className={`px-5 py-3 font-bold text-sm border-t border-l border-r rounded-t flex items-center gap-2 transition-colors ${activeTab === 'timewall'
              ? 'bg-white border-[#dddddd] border-b-transparent text-[#333333]'
              : 'bg-transparent border-transparent text-[#337ab7] hover:bg-[#eeeeee]'
              }`}
          >
            <MousePointerClick className="w-4 h-4" /> TimeWall (PTC & Tasks)
          </button>
        </li>
        <li className="-mb-[1px]">
          <button
            onClick={() => setActiveTab('loottv')}
            className={`px-5 py-3 font-bold text-sm border-t border-l border-r rounded-t flex items-center gap-2 transition-colors ${activeTab === 'loottv'
              ? 'bg-white border-[#dddddd] border-b-transparent text-[#333333]'
              : 'bg-transparent border-transparent text-[#337ab7] hover:bg-[#eeeeee]'
              }`}
          >
            <PlaySquare className="w-4 h-4" /> Loot.tv (Watch Videos)
          </button>
        </li>
      </ul>

      {/* IFRAME CONTAINERS (Classic well styling) */}
      <div className="bg-[#f5f5f5] border border-[#dddddd] rounded p-2 shadow-inner min-h-[700px]">
        {activeTab === 'timewall' ? (
          <iframe
            src={TIMEWALL_URL}
            className="w-full h-[700px] border-none bg-white rounded shadow-sm"
            title="TimeWall Offerwall"
          />
        ) : (
          <iframe
            src={LOOTTV_URL}
            className="w-full h-[700px] border-none bg-white rounded shadow-sm"
            title="Loot.tv Videos"
          />
        )}
      </div>

    </div>
  );
}