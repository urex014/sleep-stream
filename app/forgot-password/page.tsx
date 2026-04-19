'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9ecef] flex flex-col justify-center items-center p-4 selection:bg-[#337ab7] selection:text-white text-[#333333] relative overflow-hidden">

      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#e6ebf0] rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e6ebf0] rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="w-full max-w-[420px] relative z-10">

        {/* Brand Header */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-normal drop-shadow-sm hover:opacity-90 transition-opacity">
            <img src="landingpagelogo-nobg.png" className='h-20 w-25'></img>
          </Link>
        </div>

        {/* Classic Container Panel */}
        <div className="bg-[#fcfcfc] border-t-[5px] border-t-[#337ab7] border-x border-b border-[#cccccc] rounded-b shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 relative">

          {/* Glossy Header Highlight */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none"></div>

          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-[#222222] tracking-tight" style={{ textShadow: '1px 1px 0px #ffffff' }}>Reset Password</h1>
                <p className="text-[#555555] mt-1 text-sm font-medium">
                  Enter your email address to receive a secure reset link.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-gradient-to-b from-[#f2dede] to-[#e8c4c4] border border-[#ebccd1] text-[#a94442] px-4 py-3 rounded text-sm mb-6 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                  <span style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#333333] mb-1.5" style={{ textShadow: '1px 1px 0px #ffffff' }}>Email Address</label>
                  <div className="relative flex rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] bg-white border border-[#b3b3b3]">
                    <div className="flex items-center justify-center px-3 bg-[#e6e6e6] border-r border-[#cccccc] rounded-l text-[#555555] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-transparent text-[#333333] py-2.5 px-3 outline-none focus:bg-[#fafffa] font-medium"
                    />
                  </div>
                </div>

                {/* Glossy 3D Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-b from-[#337ab7] via-[#2e6da4] to-[#286090] hover:from-[#286090] hover:to-[#204d74] border border-[#204d74] text-white font-bold text-base py-3 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_3px_5px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                  style={{ textShadow: '0 -1px 0 rgba(0,0,0,0.4)' }}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin drop-shadow-sm" /> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-b from-[#dff0d8] to-[#c8e5bc] border border-[#d6e9c6] text-[#3c763d] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.1)]">
                <CheckCircle2 className="w-8 h-8 drop-shadow-sm" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#222222] mb-2 tracking-tight" style={{ textShadow: '1px 1px 0px #ffffff' }}>Check Your Email</h2>
              <p className="text-[#555555] text-sm mb-6 leading-relaxed font-medium">
                We've sent a password reset link to <br />
                <span className="font-bold text-[#333333] bg-[#eeeeee] px-2 py-0.5 rounded border border-[#cccccc] inline-block mt-1">{email}</span>. <br />
                The link will expire in 15 minutes.
              </p>

              {/* Classic Beveled Divider */}
              <div className="my-6">
                <div className="border-t border-[#cccccc] border-b border-b-white h-0"></div>
              </div>

              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-bold text-[#337ab7] hover:text-[#23527c] hover:underline transition-colors drop-shadow-sm"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-6 bg-gradient-to-b from-[#ffffff] to-[#e6e6e6] border border-[#cccccc] rounded shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-3">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#555555] hover:text-[#337ab7] transition-colors" style={{ textShadow: '1px 1px 0px #ffffff' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}