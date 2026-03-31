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
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm px-6 md:px-12 py-4 flex justify-between items-center border-b border-[#eeeeee] shadow-sm">
        <div className="flex items-center gap-2 text-[#333333] font-bold text-xl tracking-normal">
          <Logo className="h-9 w-auto" />
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
      <section className="relative pt-32 min-h-screen pb-24 px-6 overflow-hidden border-b border-[#eeeeee]">
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

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#d9edf7] border border-[#bce8f1] text-[#31708f] px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-inner">
            <Star className="w-3.5 h-3.5 fill-[#31708f]" /> Now open to all users in Nigeria
          </div>

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
      <section className="py-24 bg-[#fbfcfd]">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#337ab7] mb-2">How It Works</h2>
            <p className="text-4xl font-extrabold text-[#222222] tracking-tight">Earning Naira is as easy as 1-2-3</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-[#eeeeee] transition-all hover:shadow-[0_8px_30px_rgb(51,122,183,0.1)] group">
              <div className="w-full h-48 relative mb-8 rounded-lg overflow-hidden border border-[#eeeeee]">
                {/* Conceptual Image: Signup/Register */}
                <img
                  src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop"
                  alt="Registering on phone"
                  
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#337ab7] text-white font-bold text-sm">1</span>
                <h3 className="text-[#222222] font-bold text-xl tracking-tight">Create Free Account</h3>
              </div>
              <p className="text-[#666666] text-base leading-relaxed">
                Sign up in seconds. No credit card required. Get instant access to your personalized ads dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-[#eeeeee] transition-all hover:shadow-[0_8px_30px_rgb(51,122,183,0.1)] group">
              <div className="w-full h-48 relative mb-8 rounded-lg overflow-hidden border border-[#eeeeee]">
                {/* Conceptual Image: Watching Media/Laptop */}
                <img
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop"
                  alt="Watching videos on laptop"
                  
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#337ab7] text-white font-bold text-sm">2</span>
                <h3 className="text-[#222222] font-bold text-xl tracking-tight">Complete Daily Tasks</h3>
              </div>
              <p className="text-[#666666] text-base leading-relaxed">
                Click PTC links or watch short sponsored videos. Wait for the timer to finish and get rewarded instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-[#eeeeee] transition-all hover:shadow-[0_8px_30px_rgb(51,122,183,0.1)] group">
              <div className="w-full h-48 relative mb-8 rounded-lg overflow-hidden border border-[#eeeeee]">
                {/* Conceptual Image: Cash/Wallet/Success */}
                <img
                  src="https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=600&auto=format&fit=crop"
                  alt="Naira currency concept"
                  
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5cb85c] text-white font-bold text-sm">3</span>
                <h3 className="text-[#222222] font-bold text-xl tracking-tight">Withdraw Your Funds</h3>
              </div>
              <p className="text-[#666666] text-base leading-relaxed">
                Once you hit the threshold, withdraw your earnings directly to your local Nigerian bank account or crypto wallet.
              </p>
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
          <p className="text-xs text-[#777777] mt-6">
            &copy; {new Date().getFullYear()} SleepStream Enterprise. All rights reserved. Payouts subject to minimum thresholds.
          </p>
        </div>
      </footer>

    </div>
  );
}