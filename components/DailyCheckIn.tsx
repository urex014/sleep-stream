'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Loader2, CheckCircle2, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

interface DailyCheckInProps {
  userId: string;
  currentStreak: number;
  lastCheckInDate: string | null;
  onClaimSuccess: (newReward: number, newStreak: number) => void; 
}

export default function DailyCheckIn({ userId, currentStreak, lastCheckInDate, onClaimSuccess }: DailyCheckInProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);

  // Check if they already claimed today based on the database date
  useEffect(() => {
    if (lastCheckInDate) {
      const lastCheckIn = new Date(lastCheckInDate);
      const today = new Date();
      
      // Compare UTC dates just like your backend does
      if (
        lastCheckIn.getUTCFullYear() === today.getUTCFullYear() &&
        lastCheckIn.getUTCMonth() === today.getUTCMonth() &&
        lastCheckIn.getUTCDate() === today.getUTCDate()
      ) {
        setHasClaimedToday(true);
      }
    }
  }, [lastCheckInDate]);

  const handleClaim = async () => {
    setIsClaiming(true);
    const toastId = toast.loading("Claiming daily reward...");

    try {
      const res = await fetch('/api/user/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: toastId });
        setHasClaimedToday(true);
        // Call the parent function to update the user's wallet balance instantly!
        onClaimSuccess(data.reward, data.streak); 
      } else {
        toast.error(data.error || "Failed to claim reward", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsClaiming(false);
    }
  };

  // Calculate what their next reward will be to build anticipation
  const nextReward = Math.min(10 + ((hasClaimedToday ? currentStreak : currentStreak + 1) * 5), 50);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <Flame className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-50 rotate-12 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            Daily Check-in
            <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
              <Flame className="w-3 h-3" /> Streak: {currentStreak}
            </span>
          </h3>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Claim your free reward every day. Keep your streak alive to earn up to <span className="font-semibold text-slate-700">₦50</span> daily!
          </p>
        </div>

        <button
          onClick={handleClaim}
          disabled={hasClaimedToday || isClaiming}
          className={`shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
            hasClaimedToday
              ? 'bg-slate-50 text-emerald-600 border border-emerald-200 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white ring-1 ring-inset ring-indigo-700 active:scale-95 hover:shadow-md'
          }`}
        >
          {isClaiming ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Claiming...</>
          ) : hasClaimedToday ? (
            <><CheckCircle2 className="w-4 h-4" /> Claimed Today</>
          ) : (
            <><Gift className="w-4 h-4" /> Claim ₦{nextReward}</>
          )}
        </button>

      </div>
    </div>
  );
}