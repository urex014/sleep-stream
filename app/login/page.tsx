/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ChevronLeft, Bot, ShieldCheck, BarChart3, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import Logo from '@/components/Logo'; // Uncomment if needed

export default function LoginPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- CAROUSEL LOGIC ---
  const slides = [
    { id: 1, icon: Bot, title: "Automate your earnings", description: "Set it up once and earn passively from the comfort of your home." },
    { id: 2, icon: ShieldCheck, title: "Bank-Grade Security", description: "Your funds and data are protected by industry-leading encryption and security protocols." },
    { id: 3, icon: BarChart3, title: "Real-Time Analytics", description: "Track your daily profits, referral bonuses, and withdrawals with our live dashboard." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name || e.target.type]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
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

      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8f9fa] font-sans selection:bg-[#337ab7] selection:text-white text-[#333333]">

      {/* --- LEFT SIDE: CAROUSEL (Desktop Only) --- */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#2b3e50] text-white p-12 lg:p-16 border-r border-[#1e2b3c]">

        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl tracking-normal">
          <img src="/landingpagelogo-nobg.png" alt="Logo" className='h-12 w-auto object-contain' />
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <div className="h-[240px] relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                  index === currentSlide 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="mb-8 flex items-center justify-center w-14 h-14 bg-[#3b536b] rounded-2xl shadow-lg border border-[#4a6785]/50">
                  <slide.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                <p className="text-[#aebecd] text-lg leading-relaxed">{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Modernized Dash Indicators */}
          <div className="flex gap-2 mt-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 ease-in-out rounded-full ${
                  currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-[#4a6785] hover:bg-[#5b7d9e]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-[#7a8b9c] font-medium">
          © {new Date().getFullYear()} SleepStream Inc. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">

        <div className="w-full max-w-md">

          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#777777] hover:text-[#337ab7] text-sm font-medium transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </Link>
          </div>

          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#222222]">Welcome back</h1>
            <p className="text-[#666666] mt-3">Enter your details to access your dashboard.</p>
          </div>

          {/* Welcoming Form Card */}
          <div className="bg-white p-6 sm:p-10 border border-[#dddddd]/60 rounded-2xl shadow-xl shadow-black/[0.03]">

            {/* Smoothed Error Alert */}
            {error && (
              <div className="bg-[#f2dede]/80 border border-[#ebccd1] text-[#a94442] px-4 py-3 rounded-xl text-sm mb-6 font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 opacity-90" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#333333]">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#999999] group-focus-within:text-[#66afe9] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-[#fcfcfc] border border-[#cccccc] focus:bg-white focus:border-[#66afe9] focus:ring-4 focus:ring-[#66afe9]/20 text-[#333333] rounded-xl py-3 pl-11 pr-4 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#333333]">Password</label>
                  <Link href="/forgot-password" className="text-sm text-[#337ab7] hover:text-[#23527c] font-medium hover:underline underline-offset-2 transition-all">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#999999] group-focus-within:text-[#66afe9] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#fcfcfc] border border-[#cccccc] focus:bg-white focus:border-[#66afe9] focus:ring-4 focus:ring-[#66afe9]/20 text-[#333333] rounded-xl py-3 pl-11 pr-12 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((v) => !v)}
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[#999999] hover:text-[#333333] transition-colors"
                  >
                    {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>


              

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
          </div>

          <div className="text-center mt-8">
            <p className="text-[#666666] text-sm">
              Don't have an account yet?{' '}
              <Link href="/signup" className="text-[#337ab7] hover:text-[#23527c] font-semibold hover:underline underline-offset-2 transition-all">
                Start Earning
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}