'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, DollarSign, PlayCircle, Users, Zap, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  // Add a subtle shadow to the navbar when scrolling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      {/* --- PREMIUM NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12 py-4 flex justify-between items-center ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-[#eeeeee] shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <Image src="/landingpagelogo-nobg.png" width={100} height={80} className='h-10 w-20 object-contain' alt="SleepStream Logo" priority />
        </div>
        <div className="flex items-center gap-5 md:gap-8">
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-[#555555] hover:text-[#337ab7] transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="bg-[#337ab7] hover:bg-[#286090] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-[0_2px_10px_rgba(51,122,183,0.2)] hover:shadow-[0_6px_15px_rgba(51,122,183,0.3)] hover:-translate-y-0.5 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 lg:pt-48 min-h-[90vh] pb-24 px-6 overflow-hidden flex items-center justify-center">
        {/* Abstract Premium Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-100/40 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center">
          
          

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1a1a] leading-[1.15] mb-6 tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Get Paid Daily for <br className="hidden md:block" />
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#337ab7] via-[#286090] to-[#5cb85c]">Attention.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#666666] max-w-2xl mx-auto leading-relaxed mb-10 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Turn your spare time into real earnings. View high-value ads, complete premium surveys, and withdraw reliable payouts directly to your crypto wallets .
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button
              onClick={() => router.push('/signup')}
              className="w-full sm:w-auto bg-[#337ab7] hover:bg-[#286090] text-white font-semibold text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(51,122,183,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(51,122,183,0.35)] active:scale-95 group"
            >
              Start Earning Now <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:ml-4 text-sm text-[#777777] font-medium bg-white/60 px-4 py-2 rounded-full border border-gray-100 backdrop-blur-sm shadow-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-[#eeeeee] flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Join <strong className="text-[#1a1a1a]">14,203+</strong> earners</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIVE STATS (Floating Glass Cards) --- */}
      <section className="pb-20 relative z-20 -mt-16 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, color: 'text-[#337ab7]', bg: 'bg-blue-50', value: '14,203', label: 'Active Members' },
            { icon: DollarSign, color: 'text-[#5cb85c]', bg: 'bg-green-50', value: '₦13M+', label: 'Total Paid Out' },
            { icon: Zap, color: 'text-[#f0ad4e]', bg: 'bg-orange-50', value: '1.2M', label: 'Ads Viewed Today' }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="text-4xl font-extrabold text-[#1a1a1a] tracking-tight mb-1">{stat.value}</div>
              <div className="text-xs text-[#777777] uppercase font-bold tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- THE CONCEPT (Asymmetric Layout) --- */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#337ab7] mb-3">The Process</h2>
            <p className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
              Your path to passive income.
            </p>
          </div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center group">
              <div className="space-y-6 order-2 md:order-1 relative">
                <div className="flex items-center gap-5">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-[#337ab7] font-black text-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,1)] border border-blue-200">1</span>
                  <h3 className="text-[#1a1a1a] font-bold text-3xl tracking-tight">Create Cheap Account</h3>
                </div>
                <p className="text-[#666666] text-lg leading-relaxed md:pl-[76px]">
                  Sign up in seconds on any device. Instantly unlock access to your personalized ads dashboard at a subsidized rate, and start exploring available tasks.
                </p>
              </div>
              <div className="w-full h-[350px] md:h-[450px] relative order-1 md:order-2 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=600&auto=format&fit=crop"
                  alt="Registering on phone"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 md:gap-20 items-center group">
              <div className="w-full h-[350px] md:h-[450px] relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=600&auto=format&fit=crop"
                  alt="Watching videos on laptop"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="space-y-6 relative">
                <div className="flex items-center gap-5">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 font-black text-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,1)] border border-indigo-200">2</span>
                  <h3 className="text-[#1a1a1a] font-bold text-3xl tracking-tight">Complete Daily Tasks</h3>
                </div>
                <p className="text-[#666666] text-lg leading-relaxed md:pl-[76px]">
                  Log in daily to find fresh opportunities. Click high-value links, take premium surveys, or watch videos. Wait for the secure timer to finish and get rewarded instantly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12 md:gap-20 items-center group">
              <div className="space-y-6 order-2 md:order-1 relative">
                <div className="flex items-center gap-5">
                  <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 text-[#5cb85c] font-black text-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,1)] border border-green-200">3</span>
                  <h3 className="text-[#1a1a1a] font-bold text-3xl tracking-tight">Withdraw Your Funds</h3>
                </div>
                <p className="text-[#666666] text-lg leading-relaxed md:pl-[76px]">
                  Once your dashboard reaches the minimum threshold, request a payout. Withdraw your hard-earned funds directly to your local Nigerian bank account.
                </p>
              </div>
              <div className="w-full h-[350px] md:h-[450px] relative order-1 md:order-2 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100">
                <img
                  src="/nigga-smiling.jpg"
                  alt="Withdrawal happiness"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DARK CTA SECTION (High Contrast) --- */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#337ab7] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to start earning?
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Join thousands of users who are already turning their idle time into passive income. Simple tasks, real money, no experience needed.
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold text-lg px-10 py-4 rounded-full inline-flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(92,184,92,0.3)] active:scale-95 group"
          >
            Create Your Free Account <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-[#64748b] text-sm font-medium">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#5cb85c]" /> Secure Platform</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#5cb85c]" /> Weekly Payouts</span>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 px-6 text-center border-t border-[#1e293b] bg-[#0f172a]">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 bg-[#1e293b] p-4 rounded-2xl border border-[#334155] mb-8 shadow-inner">
            <span className="text-[#cbd5e1] text-sm font-medium">Boost your earnings! Refer a friend and get</span>
            <span className="bg-[#337ab7] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">₦1,800</span>
            <span className="text-[#cbd5e1] text-sm font-medium">instantly.</span>
          </div>

          <p className="text-xs text-[#64748b] font-medium tracking-wide uppercase">
            &copy; {new Date().getFullYear()} SleepStream Enterprise. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}