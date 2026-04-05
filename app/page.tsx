'use client';
import React from 'react';
import { ArrowRight, CheckCircle2, DollarSign, PlayCircle, Star, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Image from 'next/image';

// NOTE: Ensure you have an image saved as public/hero-bg.jpg for this to work.

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      {/* --- MODERN NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md px-6 md:px-12 py-4 flex justify-between items-center border-b border-[#eeeeee] shadow-sm">
        <div className="flex items-center gap-2 text-[#333333] font-bold text-xl tracking-normal">
          <img src="landingpagelogo.png" className='h-15 w-25'></img>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-bold text-[#666666] hover:text-[#337ab7] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="bg-[#337ab7] hover:bg-[#286090] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            Get Started Free
          </button>
        </div>
      </nav>

	      {/* --- HERO SECTION with blurred background image --- */}
	      <section className="relative pt-32 min-h-screen pb-24 px-6 overflow-hidden border-b border-[#eeeeee] flex items-center">
	        {/* Background Image with 30% blur applied via CSS */}
	        <div className="absolute inset-0 z-0">
	          <Image
	            src="/hero-bg.jpg" 
	            alt="background"
	            fill
	            priority
	            className="object-cover object-center filter blur-[1px] scale-110 opacity-80"
	          />
	          {/* Subtle gradient overlay to enhance readability */}
	          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white/20"></div>
	        </div>
	        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">

	          <h1 className="text-5xl md:text-6xl font-extrabold text-[#222222] leading-tight mb-6 tracking-tight">
	            Get Paid Daily for <br />
	            Your <span className="text-[#337ab7]">Attention.</span>
	          </h1>

          <p className="text-xl text-[#555555] max-w-3xl mx-auto leading-relaxed mb-10">
            Turn your spare time into real earnings. View high-value PTC ads and sponsored videos. Simple tasks, instant rewards, and reliable payouts directly in Naira.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/signup')}
              className="w-full sm:w-auto bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-lg px-10 py-4 rounded-full flex items-center justify-center gap-2 border border-[#2e6da4] shadow-lg transition-transform hover:scale-105"
            >
              Start Earning Now <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-[#777777]">Join <strong className="text-[#333333]">14,000+</strong> users already earning.</p>
          </div>
        </div>
      </section>

      {/* --- THE CONCEPT (Modern Grid with Images) --- */}
      <section className="py-24 bg-[#fbfcfd] border-y border-[#eeeeee]">
        <div className="max-w-6xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#337ab7] mb-2">The Process</h2>
            <p className="text-5xl font-extrabold text-[#222222] tracking-tight leading-tight">
              Your path to passive income in Nigeria
            </p>
          </div>

          {/* --- Modern Alternating Layout --- */}
          <div className="space-y-24 md:space-y-32">

            {/* Step 1: Text Left, Image Right */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
              {/* Text Block */}
              <div className="space-y-5 order-2 md:order-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#337ab7] text-white font-bold text-2xl shadow-lg">1</span>
                  <h3 className="text-[#222222] font-extrabold text-3xl tracking-tight leading-snug">Create Free Account</h3>
                </div>
                <p className="text-[#555555] text-lg leading-relaxed pl-16">
                  Sign up in seconds on any device. No credit card required. Instantly unlock access to your personalized ads dashboard and start exploring available tasks.
                </p>
              </div>
              {/* Image Block */}
              <div className="w-full h-[300px] md:h-[400px] relative order-1 md:order-2 rounded-3xl overflow-hidden shadow-2xl border border-[#eeeeee]">
                <img
                  src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop"
                  alt="Registering on phone"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Step 2: Image Left, Text Right (Zig-Zag) */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-20 items-center">
              {/* Image Block */}
              <div className="w-full h-[300px] md:h-[400px] relative rounded-3xl overflow-hidden shadow-2xl border border-[#eeeeee]">
                <img
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop"
                  alt="Watching videos on laptop"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              {/* Text Block */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#337ab7] text-white font-bold text-2xl shadow-lg">2</span>
                  <h3 className="text-[#222222] font-extrabold text-3xl tracking-tight leading-snug">Complete Daily Tasks</h3>
                </div>
                <p className="text-[#555555] text-lg leading-relaxed pl-16">
                  Log in daily to find fresh opportunities. Click high-value PTC links, visit sponsored websites, or watch short videos. Simply wait for the secure timer to finish and get rewarded instantly.
                </p>
              </div>
            </div>

            {/* Step 3: Text Left, Image Right */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
              {/* Text Block */}
              <div className="space-y-5 order-2 md:order-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5cb85c] text-white font-bold text-2xl shadow-lg">3</span>
                  <h3 className="text-[#222222] font-extrabold text-3xl tracking-tight leading-snug">Withdraw Your Funds</h3>
                </div>
                <p className="text-[#555555] text-lg leading-relaxed pl-16">
                  Once your dashboard reaches the minimum threshold, request a payout. Withdraw your hard-earned funds directly to your local Nigerian bank account or secure crypto wallet.
                </p>
              </div>
              {/* Image Block */}
              <div className="w-full h-[300px] md:h-[400px] relative order-1 md:order-2 rounded-3xl overflow-hidden shadow-2xl border border-[#eeeeee]">
                <img
                  src="/nigga-smiling.jpg"
                  alt="Withdrawal happiness"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- LIVE STATS (Cleaned up) --- */}
      <section className="py-16 bg-white border-y border-[#eeeeee]">
        <div className="max-w-5xl mx-auto text-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#eeeeee]">
            <div className="flex flex-col items-center gap-2 py-6 md:py-0 md:px-8">
              <Users className="w-7 h-7 text-[#337ab7] mb-2" />
              <div className="text-5xl font-extrabold text-[#222222] tracking-tight">14,203</div>
              <div className="text-sm text-[#777777] uppercase font-bold tracking-wider mt-1">Active Members</div>
            </div>
            <div className="flex flex-col items-center gap-2 py-6 md:py-0 md:px-8">
              <DollarSign className="w-7 h-7 text-[#5cb85c] mb-2" />
              <div className="text-5xl font-extrabold text-[#222222] tracking-tight">₦13M+</div>
              <div className="text-sm text-[#777777] uppercase font-bold tracking-wider mt-1">Total Paid Out</div>
            </div>
            <div className="flex flex-col items-center gap-2 py-6 md:py-0 md:px-8">
              <PlayCircle className="w-7 h-7 text-red-500 mb-2" />
              <div className="text-5xl font-extrabold text-[#222222] tracking-tight">928K</div>
              <div className="text-sm text-[#777777] uppercase font-bold tracking-wider mt-1">Ads Viewed Today</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (Modernized with gradient) --- */}
      <section className="py-24 bg-[#fbfcfd]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-white to-[#f4f9fc] p-12 border border-[#dddddd] rounded-3xl shadow-xl text-center">
            <h2 className="text-4xl font-extrabold text-[#222222] tracking-tight mb-5">
              Ready to start earning?
            </h2>
            <p className="text-lg text-[#666666] mb-10 max-w-2xl mx-auto">
              Join thousands of Nigerians who are already turning their idle time into passive income. Simple tasks, real money, no experience needed.
            </p>
            <button
              onClick={() => router.push('/signup')}
              className="bg-[#5cb85c] hover:bg-[#449d44] text-white font-bold text-lg px-10 py-4 rounded-full border border-[#4cae4c] shadow-lg inline-flex items-center gap-2 transition-transform hover:scale-105"
            >
              Create Your Free Account <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-[#999999] mt-4 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5cb85c]" /> Payouts processed every Wed, Sat & Sun
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER / REFERRAL BAR --- */}
      <footer className="py-8 px-6 text-center border-t border-[#333333] bg-[#222222]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#cccccc] text-base flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            Boost your earnings! Refer a friend and get
            <strong className="text-white bg-[#337ab7] px-3 py-1.5 rounded-full text-sm font-bold shadow-inner">₦1,800</strong>
            instantly when they become active.
          </p>
          <a href="/faq" className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#337ab7] hover:underline"> click here to learn more <ArrowRight className="w-4 h-4" /> </a>
          <p className="text-xs text-[#777777] mt-6">
            &copy; {new Date().getFullYear()} SleepStream Enterprise. All rights reserved. Payouts subject to minimum thresholds.
          </p>
        </div>
      </footer>

    </div>
  );
}
