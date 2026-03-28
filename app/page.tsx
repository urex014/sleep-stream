'use client';
import React from 'react';
import { Bot, ArrowRight, Wallet, Activity, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      {/* --- CLASSIC SOLID NAVBAR --- */}
      <nav className="w-full px-8 py-4 flex justify-between items-center bg-white border-b border-[#dddddd] shadow-sm">
        <div className="flex items-center gap-2 text-[#333333] font-bold text-xl tracking-normal">
          <Logo className="h-8 w-auto" />
          {/* <span>SleepStream</span> */}
        </div>
        <button
          onClick={() => router.push('/login')}
          className="text-sm font-bold text-[#337ab7] hover:text-[#23527c] hover:underline"
        >
          Log In
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-20 pb-16 px-6 text-center bg-white border-b border-[#eeeeee]">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-5xl font-bold text-[#222222] leading-tight mb-6">
            Automate your daily income.
          </h1>

          <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed mb-8">
           view high-value ads. Secure <strong>15% returns</strong> with little effort. The smartest way to manage passive income.
          </p>

          <div>
            <button
              onClick={() => router.push('/signup')}
              className="bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-lg px-8 py-3 rounded flex items-center justify-center gap-2 mx-auto border border-[#2e6da4] shadow-sm"
            >
              Start Earning Now <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-[#999999] mt-3">No credit card required to register.</p>
          </div>
        </div>
      </section>

      {/* --- THE CONCEPT (Standard Grid Cards) --- */}
      <section className="py-16 bg-[#f8f9fa] border-b border-[#eeeeee]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-white p-6 border border-[#dddddd] rounded shadow-sm text-center">
            <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center border border-[#dddddd] text-[#337ab7] mb-4 mx-auto">
              <Wallet className="w-8 h-8" />
            </div>
            <h3 className="text-[#333333] font-bold text-lg mb-2">1. Deposit Capital</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Select a bot tier. Your funds are used to purchase automated bots to act on your behalf.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 border border-[#dddddd] rounded shadow-sm text-center">
            <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center border border-[#dddddd] text-[#337ab7] mb-4 mx-auto">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-[#333333] font-bold text-lg mb-2">2. Automate Views</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Your bot works 24/7 validating ad views. You earn 15% ROI credited to your dashboard daily.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 border border-[#dddddd] rounded shadow-sm text-center">
            <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center border border-[#dddddd] text-[#337ab7] mb-4 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-[#333333] font-bold text-lg mb-2">3. Withdraw Profit</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              On Day 11, your capital is unlocked. Withdraw your initial deposit + all profit instantly.
            </p>
          </div>

        </div>
      </section>

      {/* --- LIVE STATS --- */}
      <section className="py-12 bg-white border-b border-[#eeeeee]">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-[#333333]">14,203</div>
              <div className="text-sm text-[#777777] uppercase font-bold mt-1">Active Bots</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#333333]">₦13M+</div>
              <div className="text-sm text-[#777777] uppercase font-bold mt-1">Paid Out</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#5cb85c]">99.9%</div>
              <div className="text-sm text-[#777777] uppercase font-bold mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-10 border border-[#dddddd] rounded shadow-sm text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-4">
              Ready to automate your finances?
            </h2>
            <p className="text-[#666666] mb-8">
              Join thousands of users already earning passive income. Create an account to view live bot performance.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="bg-[#5cb85c] hover:bg-[#449d44] text-white font-bold text-lg px-8 py-3 rounded border border-[#4cae4c] shadow-sm inline-flex items-center gap-2"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER / REFERRAL BAR --- */}
      <footer className="py-6 px-6 text-center border-t border-[#333333] bg-[#222222]">
        <p className="text-[#cccccc] text-sm">
          Refer a friend, earn <strong className="text-white bg-[#337ab7] px-2 py-1 rounded ml-1">$1.5</strong> instantly per active bot.
        </p>
      </footer>

    </div>
  );
}