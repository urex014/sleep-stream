/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { LockKeyhole, Mail, Lock, ArrowRight, ChevronLeft, Bot, ShieldCheck, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function LoginPage() {
  
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- CAROUSEL LOGIC ---
  const slides = [
    { id: 1, icon: Bot, title: "Automate your earnings", description: "Deploy intelligent bots that work 24/7 to maximize your ad revenue while you sleep.", color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: 2, icon: ShieldCheck, title: "Bank-Grade Security", description: "Your funds and data are protected by industry-leading encryption and security protocols.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { id: 3, icon: BarChart3, title: "Real-Time Analytics", description: "Track your daily profits, referral bonuses, and withdrawals with our live dashboard.", color: "text-purple-400", bg: "bg-purple-500/10" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // --- HANDLERS ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Redirect based on role (optional, assuming standard user for now)
      // TODO: If your API returns role, you can check: if (data.user.role === 'admin') router.push('/admin');
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      
      // router.push('/dashboard'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500">
      
      {/* --- LEFT SIDE: CAROUSEL (Desktop Only) --- */}
      <div className="hidden lg:flex flex-col justify-between relative bg-slate-900 text-white p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10 flex items-center gap-2 font-bold text-xl tracking-tight">
          
            {/* <Bot className="w-5 h-5 text-white" /> */}
            <Logo  />
          
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

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none lg:hidden"></div>

        <div className="w-full max-w-md space-y-8">
          
          <Link href="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm transition font-medium group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your details to access your dashboard.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold hover:underline">Forgot Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-6 transition-all hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Continue Earning <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

          </form>

          <div className="text-center pt-2">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Don't have an account yet?{' '}
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold hover:underline transition ml-1">
                Start Earning
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}