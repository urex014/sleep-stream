/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// Force Paystack to load ONLY on the client-side (browser)
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function UpgradePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<number | null>(null);

  const TIERS = [
    { level: 1, name: 'Tier 1', price: 0, dailyEarn: 750, duration: 20 },
    { level: 2, name: 'Tier 2', price: 25000, dailyEarn: 1750, duration: 20 },
    { level: 3, name: 'Tier 3', price: 50000, dailyEarn: 3000, duration: 20 },
    { level: 4, name: 'Tier 4', price: 80000, dailyEarn: 4500, duration: 20 },
    { level: 5, name: 'Tier 5', price: 100000, dailyEarn: 6000, duration: 20 },
  ];

  useEffect(() => {
    // Fetch current user data to know what tier they are on
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/dashboard', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Error fetching user", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handlePaystackSuccess = async (reference: any, tierLevel: number) => {
    setProcessingTier(tierLevel);
    try {
      const res = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: reference.reference, tierLevel })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Congratulations! You have been upgraded to Tier ${tierLevel}.`);
        window.location.reload(); // Refresh to update dashboard limits
      } else {
        toast.error(data.message || 'Upgrade failed. Please contact support.');
      }
    } catch (error) {
      toast.error('Network error. Please contact support with your reference code.');
    } finally {
      setProcessingTier(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const currentTierLevel = user?.tier || 1;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 selection:bg-indigo-500 selection:text-white animate-in fade-in duration-500">

      {/* --- PREMIUM HEADER --- */}
      <div className="relative bg-white border-b border-slate-200 py-16 px-6 mb-12 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative max-w-3xl mx-auto text-center z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl mb-6 shadow-sm border border-indigo-100">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Upgrade Your Earning Power
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Boost your daily limits and maximize your return. All packages are valid for a strict 20-day cycle.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 items-start">
          {TIERS.map((tier) => {
            const isCurrentTier = currentTierLevel === tier.level;
            const isLowerTier = currentTierLevel > tier.level;
            const maxEarnings = tier.dailyEarn * 20; // 20 days

            // Paystack Props Configuration
            const componentProps = {
              email: user?.email || 'user@sleepstream.com',
              amount: tier.price * 100, // Paystack uses Kobo
              publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
              text: `Upgrade to ${tier.name}`,
              onSuccess: (reference: any) => handlePaystackSuccess(reference, tier.level),
              onClose: () => console.log('Payment closed'),
            };

            return (
              <div
                key={tier.level}
                className={`relative flex flex-col bg-white rounded-3xl p-6 md:p-8 transition-all duration-300
                  ${isCurrentTier 
                    ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 xl:scale-105 z-10 bg-indigo-50/10' 
                    : 'border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 z-0'
                  }
                  ${isLowerTier ? 'opacity-75 grayscale-[20%]' : ''}
                `}
              >
                {/* Current Tier Badge */}
                {isCurrentTier && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    Current Plan
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold text-slate-500 tracking-tight mb-2 uppercase">{tier.name}</h3>
                  <div className="flex items-center justify-center items-baseline gap-1">
                    <span className={`text-4xl font-extrabold tracking-tight ${isCurrentTier ? 'text-indigo-600' : 'text-slate-900'}`}>
                      ₦{tier.price.toLocaleString()}
                    </span>
                  </div>
                  {tier.price === 0 && <span className="text-sm text-slate-400 font-medium">Free forever</span>}
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                    <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Daily Earn
                    </span>
                    <span className="text-sm font-bold text-emerald-600">₦{tier.dailyEarn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Total ROI (20d)
                    </span>
                    <span className="text-sm font-bold text-slate-900">₦{maxEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border-t border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">Duration</span>
                    <span className="text-sm font-bold text-slate-700">{tier.duration} Days</span>
                  </div>
                </div>

                {/* Upgrade Buttons */}
                <div className="mt-auto">
                  {processingTier === tier.level ? (
                    <button disabled className="w-full bg-slate-100 text-slate-400 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </button>
                  ) : tier.level === 1 ? (
                    <button disabled className="w-full bg-slate-50 border border-slate-200 text-slate-400 font-semibold py-3.5 rounded-xl cursor-not-allowed transition-all">
                      {isCurrentTier ? 'Active' : 'Free Tier'}
                    </button>
                  ) : isCurrentTier || isLowerTier ? (
                    <button disabled className="w-full bg-slate-50 border border-slate-200 text-slate-400 font-semibold py-3.5 rounded-xl cursor-not-allowed transition-all">
                      {isCurrentTier ? 'Currently Active' : 'Completed'}
                    </button>
                  ) : (
                    <div className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {/* Paystack Button injected safely */}
                      <PaystackButton
                        {...componentProps}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- SECURITY FOOTER --- */}
        <div className="mt-16 max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-3 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-sm text-slate-500 font-medium leading-snug">
            All payments are secured with bank-grade encryption and processed directly by <span className="font-bold text-slate-700">Paystack</span>.
          </p>
        </div>
      </div>
    </div>
  );
}