'use client';
import React from 'react';
import { ArrowRight, CheckCircle2, DollarSign, PlayCircle, Star, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      {/* --- MODERN NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl px-6 md:px-12 py-4 flex justify-between items-center ">
        <div className="flex items-center gap-2 text-[#333333] font-bold text-xl tracking-normal hover:opacity-80 transition-opacity cursor-pointer">
          <img src="landingpagelogo-nobg.png" className='h-20 w-25 object-contain' alt="SleepStream Logo" />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-bold text-[#666666] hover:text-[#337ab7] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="bg-gradient-to-b from-[#337ab7] to-[#286090] hover:from-[#286090] hover:to-[#204d74] text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-[0_4px_10px_rgba(51,122,183,0.3)] hover:shadow-[0_6px_15px_rgba(51,122,183,0.4)] hover:-translate-y-0.5 border border-[#286090]"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 lg:pt-40 min-h-[90vh] pb-24 px-6 overflow-hidden border-b border-[#eeeeee] flex items-center justify-center">
        {/* Background Image with advanced blending */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/hero-bg.jpg"
            alt="background"
            fill
            priority
            className="object-cover object-center filter blur-md scale-110 opacity-100"
          />
          {/* Multi-layered gradient for perfect text legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/80 to-[#fcfcfc]"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center">

          

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#222222] leading-[1.1] mb-6 tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Get Paid Daily for <br className="hidden md:block" />
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#337ab7] to-[#5cb85c]">Attention.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#555555] max-w-2xl mx-auto leading-relaxed mb-10 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Turn your spare time into real earnings. View high-value PTC ads and sponsored videos. Simple tasks, instant rewards, and reliable payouts directly in Naira.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button
              onClick={() => router.push('/signup')}
              className="w-full sm:w-auto bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-lg px-10 py-4 rounded-full flex items-center justify-center gap-2 border border-[#2e6da4] shadow-[0_8px_20px_rgba(51,122,183,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(51,122,183,0.4)]"
            >
              Start Earning Now <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:ml-4 text-sm text-[#777777] font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#eeeeee] flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Join <strong className="text-[#222222]">14,000+</strong> earners</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS (Card Based Layout) --- */}
      <section className="py-12 bg-white relative z-20 -mt-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-2xl p-8 border border-[#eeeeee] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-[#337ab7]" />
            </div>
            <div className="text-4xl font-extrabold text-[#222222] tracking-tight mb-1">14,203</div>
            <div className="text-xs text-[#777777] uppercase font-bold tracking-wider">Active Members</div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-2xl p-8 border border-[#eeeeee] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <DollarSign className="w-7 h-7 text-[#5cb85c]" />
            </div>
            <div className="text-4xl font-extrabold text-[#222222] tracking-tight mb-1">₦13M+</div>
            <div className="text-xs text-[#777777] uppercase font-bold tracking-wider">Total Paid Out</div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-2xl p-8 border border-[#eeeeee] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center text-center transform transition-transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <PlayCircle className="w-7 h-7 text-red-500" />
            </div>
            <div className="text-4xl font-extrabold text-[#222222] tracking-tight mb-1">928K</div>
            <div className="text-xs text-[#777777] uppercase font-bold tracking-wider">Ads Viewed Today</div>
          </div>
        </div>
      </section>

      {/* --- THE CONCEPT --- */}
      <section className="py-24 bg-[#fcfcfc]">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#337ab7] mb-3">The Process</h2>
            <p className="text-4xl md:text-5xl font-extrabold text-[#222222] tracking-tight leading-tight">
              Your path to passive income.
            </p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <div className="flex items-center gap-5">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-[#337ab7] font-black text-2xl shadow-inner border border-blue-100">1</span>
                  <h3 className="text-[#222222] font-extrabold text-3xl tracking-tight">Create Cheap Account</h3>
                </div>
                <p className="text-[#666666] text-lg leading-relaxed md:pl-[76px]">
                  Sign up in seconds on any device. Instantly unlock access to your personalized ads dashboard at a subsidized rate, and start exploring available tasks.
                </p>
              </div>
              <div className="w-full h-[350px] md:h-[450px] relative order-1 md:order-2 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#eeeeee] group">
                <img
                  src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop"
                  alt="Registering on phone"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-20 items-center">
              <div className="w-full h-[350px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#eeeeee] group">
                <img
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop"
                  alt="Watching videos on laptop"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-[#337ab7] font-black text-2xl shadow-inner border border-blue-100">2</span>
                  <h3 className="text-[#222222] font-extrabold text-3xl tracking-tight">Complete Daily Tasks</h3>
                </div>
                <p className="text-[#666666] text-lg leading-relaxed md:pl-[76px]">
                  Log in daily to find fresh opportunities. Click high-value PTC links, visit sponsored websites, or watch short videos. Simply wait for the secure timer to finish and get rewarded instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <div className="flex items-center gap-5">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 text-[#5cb85c] font-black text-2xl shadow-inner border border-green-100">3</span>
                  <h3 className="text-[#222222] font-extrabold text-3xl tracking-tight">Withdraw Your Funds</h3>
                </div>
                <p className="text-[#666666] text-lg leading-relaxed md:pl-[76px]">
                  Once your dashboard reaches the minimum threshold, request a payout. Withdraw your hard-earned funds directly to your local Nigerian bank account or secure crypto wallet.
                </p>
              </div>
              <div className="w-full h-[350px] md:h-[450px] relative order-1 md:order-2 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#eeeeee] group">
                <img
                  src="/nigga-smiling.jpg"
                  alt="Withdrawal happiness"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DARK CTA SECTION (High Contrast) --- */}
      <section className="py-24 bg-[#1a252f] relative overflow-hidden">
        {/* Subtle background pattern/glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#337ab7] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to start earning?
          </h2>
          <p className="text-lg text-[#aebecd] mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of Nigerians who are already turning their idle time into passive income. Simple tasks, real money, no experience needed.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-lg px-10 py-4 rounded-full  inline-flex items-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(92,184,92,0.4)]"
          >
            Create Your Free Account <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-[#7a8b9c] mt-6 flex items-center justify-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#5cb85c]" /> Payouts processed every Wed, Sat & Sun
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 px-6 text-center border-t border-[#111820] bg-[#1a252f]">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 bg-[#2b3e50] p-4 rounded-2xl border border-[#3b536b] mb-8">
            <span className="text-[#aebecd] text-sm font-medium">Boost your earnings! Refer a friend and get</span>
            <span className="bg-[#337ab7] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">₦1,800</span>
            <span className="text-[#aebecd] text-sm font-medium">instantly.</span>
            <a href="/faq" className="text-[#5cb85c] hover:text-[#4cae4c] text-sm font-bold flex items-center gap-1 hover:underline ml-2">
              Learn more <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-xs text-[#5b7d9e] font-medium tracking-wide uppercase">
            &copy; {new Date().getFullYear()} SleepStream Enterprise. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}