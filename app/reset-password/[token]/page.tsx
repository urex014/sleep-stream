'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string; // Grab the token from the URL

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000); // Auto-redirect after 3 seconds
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
            <img className='w-25 h-20' src="/landingpagelogo-nobg.png" alt="Sleepstream" />
          </Link>
        </div>

        {/* Classic Container Panel */}
        <div className="bg-[#fcfcfc] border-t-[5px] border-t-[#337ab7] border-x border-b border-[#cccccc] rounded shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 relative">

          {/* Glossy Header Highlight */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none"></div>

          {!success ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-[#222222] tracking-tight" style={{ textShadow: '1px 1px 0px #ffffff' }}>Create New Password</h1>
                <p className="text-[#555555] mt-1 text-sm font-medium">
                  Please enter your new password below.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-gradient-to-b from-[#f2dede] to-[#e8c4c4] border border-[#ebccd1] text-[#a94442] px-4 py-3 rounded text-sm mb-6 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
                  <span style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-[#333333] mb-1.5" style={{ textShadow: '1px 1px 0px #ffffff' }}>New Password</label>
                  <div className="relative flex rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] bg-white border border-[#b3b3b3]">
                    <div className="flex items-center justify-center px-3 bg-[#e6e6e6] border-r border-[#cccccc] rounded-l text-[#555555] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-[#333333] py-2.5 px-3 outline-none focus:bg-[#fafffa] font-medium tracking-widest"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-[#333333] mb-1.5" style={{ textShadow: '1px 1px 0px #ffffff' }}>Confirm Password</label>
                  <div className="relative flex rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] bg-white border border-[#b3b3b3]">
                    <div className="flex items-center justify-center px-3 bg-[#e6e6e6] border-r border-[#cccccc] rounded-l text-[#555555] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-[#333333] py-2.5 px-3 outline-none focus:bg-[#fafffa] font-medium tracking-widest"
                    />
                  </div>
                </div>

                {/* Glossy 3D Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full bg-gradient-to-b from-[#5cb85c] via-[#4cae4c] to-[#419641] hover:from-[#47a447] hover:to-[#398439] border border-[#398439] text-white font-bold text-base py-3 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_5px_rgba(0,0,0,0.15)] mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.2)] active:translate-y-[1px]"
                  style={{ textShadow: '0 -1px 0 rgba(0,0,0,0.3)' }}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin drop-shadow-sm" /> : <>Update Password <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-gradient-to-b from-[#dff0d8] to-[#c8e5bc] border border-[#d6e9c6] text-[#3c763d] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.1)]">
                <CheckCircle2 className="w-8 h-8 drop-shadow-sm" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#222222] mb-2 tracking-tight" style={{ textShadow: '1px 1px 0px #ffffff' }}>Success!</h2>
              <p className="text-[#555555] text-sm mb-6 font-medium">
                Your password has been reset successfully. You will be redirected to the login page momentarily.
              </p>

              <Link
                href="/login"
                className="inline-block bg-[#f5f5f5] hover:bg-[#e6e6e6] border border-[#cccccc] text-[#333333] font-bold py-2 px-6 rounded shadow-sm transition-colors"
              >
                Go to Login Now
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}