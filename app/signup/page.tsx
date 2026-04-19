/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

	import React, { useState, useEffect, Suspense } from 'react';
	import { Bot, Mail, Lock, User, ArrowRight, Gift, ChevronLeft, KeyRound, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
	import Link from 'next/link';
	import { useRouter, useSearchParams } from 'next/navigation';
	import Logo from '@/components/Logo';


// 1. Create the Form Component separately to handle SearchParams safely
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRefCode = searchParams.get('ref');

	  const [currentSlide, setCurrentSlide] = useState(0);
	  const [isLoading, setIsLoading] = useState(false);
	  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	  const [error, setError] = useState('');
	  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    accessCode: '',
    referralCode: ''
  });

  useEffect(() => {
    const urlCode = searchParams.get('ref');

    if (urlCode) {
      // 1. If it's in the URL, save to memory AND put it in the form data
      localStorage.setItem('sleepstream_referral', urlCode);
      setFormData(prev => ({ ...prev, referralCode: urlCode }));
    } else {
      // 2. If it's NOT in the URL, pull from memory and put it in the form data
      const savedCode = localStorage.getItem('sleepstream_referral');
      if (savedCode) {
        setFormData(prev => ({ ...prev, referralCode: savedCode }));
      }
    }
  }, [searchParams]);

  // CAROUSEL
  const slides = [
    { id: 1, icon: Bot, title: "Activate Your Bot", description: "Enter your unique access code to instantly unlock Tier 0 automation." },
    { id: 2, icon: ShieldCheck, title: "Secure Registration", description: "Your account is protected with military-grade encryption from day one." },
    { id: 3, icon: Gift, title: "Referral Bonuses", description: "Invite friends and earn instant cash rewards for every active user." }
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

        <div className="relative z-10 text-sm text-[#7a8b9c]">© 2026 SleepStream Inc. All rights reserved.</div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">

          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-[#337ab7] hover:text-[#23527c] text-sm font-bold hover:underline">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-[#222222]">Activate Account</h1>
            {/* <p className="text-[#666666] mt-2">Instantly unlock Tier 0.</p> */}
          </div>

          <div className="bg-white p-8 border border-[#dddddd] rounded shadow-sm">

            {/* Classic Alerts */}
            {error && <div className="bg-[#f2dede] border border-[#ebccd1] text-[#a94442] px-4 py-3 rounded text-sm mb-6 font-bold">{error}</div>}
            {success && <div className="bg-[#dff0d8] border border-[#d6e9c6] text-[#3c763d] px-4 py-3 rounded text-sm mb-6 font-bold">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#333333]">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r border-[#cccccc] bg-[#f5f5f5] rounded-l px-3">
                    <User className="w-4 h-4 text-[#777777]" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="JohnDizzy"
                    className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded py-2 pl-14 pr-3 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#333333]">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r border-[#cccccc] bg-[#f5f5f5] rounded-l px-3">
                    <Mail className="w-4 h-4 text-[#777777]" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded py-2 pl-14 pr-3 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#333333]">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r border-[#cccccc] bg-[#f5f5f5] rounded-l px-3">
                    <Lock className="w-4 h-4 text-[#777777]" />
                  </div>
	                  <input
	                    type={isPasswordVisible ? 'text' : 'password'}
	                    name="password"
	                    required
	                    value={formData.password}
	                    onChange={handleChange}
	                    placeholder="••••••••"
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

              {/* Access Code */}
              <div className="space-y-2 mt-6">
                <label className="text-sm font-bold text-[#337ab7] flex justify-between">
                  Activation Code <span className="text-[#999999] font-normal text-xs">*Required</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r border-[#bce8f1] bg-[#d9edf7] rounded-l px-3">
                    <KeyRound className="w-4 h-4 text-[#31708f]" />
                  </div>
                  <input
                    type="text"
                    name="accessCode"
                    required
                    value={formData.accessCode}
                    onChange={handleChange}
                    placeholder="ENTER-CODE-HERE"
                    className="w-full bg-[#f4f8fa] border border-[#bce8f1] focus:border-[#337ab7] focus:bg-white text-[#31708f] rounded py-2.5 pl-14 pr-3 outline-none transition-colors font-mono uppercase tracking-wide placeholder-[#9acfea]"
                  />
                </div>
                <p className="text-xs text-[#777777] mt-1">
                  Don't have a code? <Link href="/vendors" className="text-[#337ab7] font-bold hover:underline">Buy one from a vendor</Link>.
                </p>
              </div>

              {/* Referral Code */}
              <div className="pt-2">
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none border-r rounded-l px-3 ${formData.referralCode ? 'border-[#d6e9c6] bg-[#dff0d8]' : 'border-[#cccccc] bg-[#f5f5f5]'}`}>
                    <Gift className={`w-4 h-4 ${formData.referralCode ? 'text-[#3c763d]' : 'text-[#777777]'}`} />
                  </div>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="Referral Code (Optional)"
                    className={`w-full rounded py-2 pl-14 pr-16 outline-none transition-colors
                      ${formData.referralCode ? 'bg-[#f8fbf6] border border-[#3c763d] text-[#3c763d] font-bold' : 'bg-white border border-[#cccccc] focus:border-[#66afe9] text-[#333333]'}
                    `}
                  />
                  {formData.referralCode && (
                    <div className="absolute right-3 top-2.5 text-[#3c763d] text-xs font-bold flex items-center gap-1">
                      Applied
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={isLoading}
                className="w-full bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] text-white font-bold py-2.5 rounded shadow-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                ) : (
                  <>Validate & Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          <div className="text-center pt-6">
            <p className="text-[#666666] text-sm">
              Already valid? <Link href="/login" className="text-[#337ab7] hover:text-[#23527c] font-bold hover:underline ml-1">Log in here</Link>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><Loader2 className="w-8 h-8 animate-spin text-[#337ab7]" /></div>}>
      <SignupForm />
    </Suspense>
  );
}
