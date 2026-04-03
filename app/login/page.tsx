/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ChevronLeft, Bot, ShieldCheck, BarChart3, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

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
    { id: 1, icon: Bot, title: "Automate your earnings", description: "Deploy intelligent bots that work 24/7 to maximize your ad revenue while you sleep." },
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
    setFormData({ ...formData, [e.target.type]: e.target.value });
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

      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8f9fa] font-sans selection:bg-[#337ab7] selection:text-white text-[#333333]">

      {/* --- LEFT SIDE: CAROUSEL (Desktop Only) --- */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#2b3e50] text-white p-12 border-r border-[#1e2b3c]">

        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl tracking-normal">
          <img src="landingpagelogo-nobg.png" className='h-20 w-25'></img>
        </div>

        <div className="relative z-10 max-w-lg mb-20">
          <div className="h-[220px] relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="mb-6 flex items-center justify-center w-16 h-16 bg-[#3b536b] rounded border border-[#4a6785]">
                  <slide.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                <p className="text-[#aebecd] text-lg leading-relaxed">{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Classic Dot Indicators */}
          <div className="flex gap-2 mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full ${currentSlide === idx ? 'w-3 bg-white' : 'w-2.5 bg-[#4a6785] hover:bg-[#5b7d9e]'}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-[#7a8b9c]">
          © 2026 SleepStream Inc. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">

        <div className="w-full max-w-md">

          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#337ab7] hover:text-[#23527c] text-sm font-bold hover:underline">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-[#222222]">Welcome back</h1>
            <p className="text-[#666666] mt-2">Enter your details to access your dashboard.</p>
          </div>

          {/* Classic Form Panel */}
          <div className="bg-white p-8 border border-[#dddddd] rounded shadow-sm">

            {/* Classic Bootstrap Alert for Errors */}
            {error && (
              <div className="bg-[#f2dede] border border-[#ebccd1] text-[#a94442] px-4 py-3 rounded text-sm mb-6 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#333333]">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r border-[#cccccc] bg-[#f5f5f5] rounded-l px-3">
                    <Mail className="w-4 h-4 text-[#777777]" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded py-2 pl-14 pr-3 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-[#333333]">Password</label>
                  <a href="/forgot-password" className="text-xs text-[#337ab7] hover:text-[#23527c] font-bold hover:underline">Forgot Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r border-[#cccccc] bg-[#f5f5f5] rounded-l px-3">
                    <Lock className="w-4 h-4 text-[#777777]" />
                  </div>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded py-2 pl-14 pr-10 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible((v) => !v)}
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isPasswordVisible}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#777777] hover:text-[#333333]"
                  >
                    {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] text-white font-bold py-2.5 rounded shadow-sm mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  <>
                    Continue Earning <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          <div className="text-center pt-6">
            <p className="text-[#666666] text-sm">
              Don't have an account yet?{' '}
              <Link href="/signup" className="text-[#337ab7] hover:text-[#23527c] font-bold hover:underline">
                Start Earning
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
