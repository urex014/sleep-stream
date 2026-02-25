'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Bot, Mail, Lock, User, ArrowRight, Gift, ChevronLeft, KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

// 1. Create the Form Component separately to handle SearchParams safely
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // <--- Hook to get URL params
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    accessCode: '',
    referralCode: ''
  });

  //checking for referal code in url bar
  useEffect(() => {
    const refCode = searchParams.get('ref'); // Looks for ?ref=code123
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  // CAROUSEL
  const slides = [
    { id: 1, icon: Bot, title: "Activate Your Bot", description: "Enter your unique access code to instantly unlock Tier 0 automation.", color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: 2, icon: ShieldCheck, title: "Secure Registration", description: "Your account is protected with military-grade encryption from day one.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { id: 3, icon: Gift, title: "Referral Bonuses", description: "Invite friends and earn instant cash rewards for every active user.", color: "text-purple-400", bg: "bg-purple-500/10" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500">
      
      {/* LEFT SIDE: CAROUSEL */}
      <div className="hidden lg:flex flex-col justify-between relative bg-slate-900 text-white p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight">
          
            {/* <Bot className="w-5 h-5 text-white" /> */}
            <Logo />
          
          {/* <span>SleepStream</span> */}
        </div>

        <div className="relative z-10 max-w-lg mb-20">
          <div className="h-[280px] relative"> 
            {slides.map((slide, index) => (
              <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 border border-white/10 backdrop-blur-md ${slide.bg}`}>
                  <slide.icon className={`w-8 h-8 ${slide.color}`} />
                </div>
                <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">{slide.title}</h2>
                <p className="text-slate-400 text-lg leading-relaxed">{slide.description}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-8">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">© 2026 SleepStream Inc. All rights reserved.</div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none lg:hidden"></div>

        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm transition font-medium group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Activate Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Instantly unlock Tier 0.</p>
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">{error}</div>}
          {success && <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" />
                <input type="text" name="username" required value={formData.username} onChange={handleChange} placeholder="JohnDizzy" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" />
                <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-1 uppercase tracking-wider flex justify-between">
                Activation Code <span className="text-slate-400 dark:text-slate-500 font-normal normal-case">*Required</span>
              </label>
              <div className="relative group mt-1.5">
                <div className="absolute left-4 top-3.5 w-5 h-5 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input type="text" name="accessCode" required value={formData.accessCode} onChange={handleChange} placeholder="ENTER-CODE-HERE" className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-blue-900 dark:text-blue-200 placeholder:text-blue-300 dark:placeholder:text-blue-700 rounded-xl py-3 pl-12 pr-4 outline-none transition-all text-sm font-bold tracking-widest uppercase" />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 ml-1">
                Don't have a code? <Link href="/vendors" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Buy one from a vendor</Link>.
              </p>
            </div>

            {/* Referral Code (Auto-Filled) */}
            <div className="pt-1">
               <div className="relative group">
                <div className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="Referral Code (Optional)"
                  // Visual cue if code is present
                  className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-dashed text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none transition-all text-sm
                    ${formData.referralCode ? 'border-emerald-500 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-700'}
                  `}
                />
                {/* Checkmark if valid ref code exists */}
                {formData.referralCode && (
                  <div className="absolute right-4 top-3.5 text-emerald-500 text-xs font-bold flex items-center gap-1">
                     Applied
                  </div>
                )}
              </div>
            </div>

            <button disabled={isLoading} className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> creating account...</> : <>Validate & Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Already valid? <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold hover:underline transition ml-1">Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. MAIN COMPONENT (With Suspense)
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <SignupForm />
    </Suspense>
  );
}