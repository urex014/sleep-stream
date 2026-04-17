'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, CheckCircle2, TrendingUp, Loader2, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import dynamic from 'next/dynamic';

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
        alert(`Congratulations! You have been upgraded to Tier ${tierLevel}.`);
        window.location.reload(); // Refresh to update dashboard limits
      } else {
        alert(data.message || 'Upgrade failed. Please contact support.');
      }
    } catch (error) {
      alert('Network error. Please contact support with your reference code.');
    } finally {
      setProcessingTier(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-10 h-10 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  const currentTierLevel = user?.tier || 1;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#333333] font-sans pb-20">

      {/* Glossy Page Header */}
      <div className="bg-gradient-to-b from-[#ffffff] to-[#f5f5f5] border-b border-[#dddddd] shadow-[0_2px_4px_rgba(0,0,0,0.02)] py-12 px-6 mb-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d9edf7] text-[#31708f] rounded-full mb-4 border border-[#bce8f1] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight mb-3" style={{ textShadow: '1px 1px 0px #ffffff' }}>
            Upgrade Your Earning Power
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto font-medium leading-relaxed">
            Boost your daily limits and maximize your return. All packages are valid for a strict 20-day cycle.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TIERS.map((tier) => {
            const isCurrentTier = currentTierLevel === tier.level;
            const isLowerTier = currentTierLevel > tier.level;
            const maxEarnings = tier.dailyEarn * 20; // 20 ads/day for 20 days

            // Paystack Props Configuration for this specific tier
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
                className={`bg-white rounded-lg p-6 relative flex flex-col shadow-[0_4px_10px_rgba(0,0,0,0.05)] border-t-[5px] border-x border-b border-[#cccccc] transition-transform hover:-translate-y-1
                  ${isCurrentTier ? 'border-t-[#337ab7] shadow-[0_8px_20px_rgba(51,122,183,0.15)] scale-105 z-10' : 'border-t-[#777777]'}
                `}
              >
                {/* Glossy Header Highlight */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent opacity-60 pointer-events-none rounded-t"></div>

                {isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#337ab7] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Current Tier
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-extrabold text-[#222222] mb-1">{tier.name}</h3>
                  <div className="flex items-center justify-center items-baseline gap-1">
                    <span className="text-2xl font-black text-[#337ab7]">₦{tier.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-[#eeeeee] pb-2">
                    <span className="text-sm font-bold text-[#777777]">Daily Earn</span>
                    <span className="text-sm font-extrabold text-[#3c763d]">₦{tier.dailyEarn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#eeeeee] pb-2">
                    <span className="text-sm font-bold text-[#777777]">Duration</span>
                    <span className="text-sm font-bold text-[#222222]">{tier.duration} Days</span>
                  </div>
                  
                </div>

                {/* Upgrade Buttons */}
                {processingTier === tier.level ? (
                  <button disabled className="w-full bg-[#eeeeee] border border-[#cccccc] text-[#777777] font-bold py-3 rounded flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </button>
                ) : tier.level === 1 ? (
                  <button disabled className="w-full bg-[#f9f9f9] border border-[#dddddd] text-[#999999] font-bold py-3 rounded cursor-not-allowed shadow-inner">
                    {isCurrentTier ? 'Active' : 'Free Tier'}
                  </button>
                ) : isCurrentTier || isLowerTier ? (
                  <button disabled className="w-full bg-[#f9f9f9] border border-[#dddddd] text-[#999999] font-bold py-3 rounded cursor-not-allowed shadow-inner">
                    {isCurrentTier ? 'Currently Active' : 'Completed'}
                  </button>
                ) : (
                  <div className="w-full">
                    {/* Paystack Button injected safely */}
                    <PaystackButton
                      {...componentProps}
                            className="w-full bg-gradient-to-b from-[#5cb85c] via-[#4cae4c] to-[#419641] hover:from-[#47a447] hover:to-[#398439] border border-[#398439] text-white font-bold py-3 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_5px_rgba(0,0,0,0.15)] flex items-center justify-center gap-1.5 transition-all active:translate-y-[1px] [text-shadow:0_-1px_0_rgba(0,0,0,0.3)]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security Footer */}
        <div className="mt-12 max-w-2xl mx-auto bg-[#f9f9f9] border border-[#dddddd] rounded p-4 flex items-center justify-center gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
          <ShieldCheck className="w-5 h-5 text-[#5cb85c]" />
          <p className="text-sm text-[#555555] font-medium">All payments are secured and processed directly by Paystack.</p>
        </div>
      </div>
    </div>
  );
}