'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Loader2, 
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function SettingsPage() {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    vendorStatus: 'None', 
    businessName: '',
    isVendor: false
  });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/user/settings');
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // --- 2. UPDATE PROFILE ---
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: profile.fullName, email: profile.email }),
      });
      if (res.ok) alert("Profile Updated Successfully");
      else alert("Update failed. Please try again.");
    } catch (error) {
      alert("Network Error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="relative flex items-center justify-center">
           <div className="absolute inset-0 w-12 h-12 border-4 border-blue-500/20 rounded-full animate-ping"></div>
           {/* <Loader2 className="w-8 h-8 text-blue-600 animate-spin relative z-10" /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 sm:pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* 1. HERO BANNER & AVATAR */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200/50 dark:border-white/[0.05] bg-white dark:bg-[#0B1120]">
        
        {/* Abstract Gradient Background (Shorter on mobile) */}
        <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 dark:to-[#060913] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        </div>

        {/* Floating Profile Info (Adjusted negative margin for mobile) */}
        <div className="relative px-5 sm:px-10 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-20">
          
          <div className="relative p-1.5 sm:p-2 bg-white dark:bg-[#0B1120] rounded-full shadow-lg">
            {/* Avatar size scales from w-20 to w-32 */}
            <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-3xl sm:text-5xl font-bold text-slate-800 dark:text-white shadow-inner border border-slate-200 dark:border-white/5">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            {profile.isVendor && (
               <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 bg-emerald-500 text-white rounded-full shadow-lg border-2 border-white dark:border-[#0B1120]">
                 <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
               </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left mb-1 sm:mb-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {profile.fullName || 'User Profile'}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-1.5 sm:mt-2">
              <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                {profile.email} 
              </span>
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden sm:block"></span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider 
                ${profile.isVendor 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20' 
                  : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20'}`}>
                {profile.isVendor ? 'Verified Vendor' : 'Standard Member'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* 2. ACCOUNT SETTINGS FORM */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm flex-1 flex flex-col">
            <div className="mb-6 sm:mb-8 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1 sm:mb-2">Identity Settings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Update your public name and contact email.</p>
            </div>

            <div className="space-y-5 sm:space-y-6 flex-1">
              
              {/* Minimalist Input Field 1 */}
              <div>
                <label className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2 sm:mb-3 block pl-1">
                  Full Name
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-white/[0.05] rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-sm">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-3 sm:mr-4 shrink-0" />
                  <input 
                    type="text" 
                    value={profile.fullName} 
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium text-base sm:text-lg placeholder:text-slate-400"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Minimalist Input Field 2 */}
              <div>
                <label className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2 sm:mb-3 block pl-1">
                  Email Address
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-[#060913] border border-slate-200 dark:border-white/[0.05] rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-sm">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-3 sm:mr-4 shrink-0" />
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium text-base sm:text-lg placeholder:text-slate-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-8 sm:pt-10 mt-auto">
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center gap-2 text-sm sm:text-[15px]">
                  {isSaving ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"/> : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. VENDOR TEASER (Premium Feature Box) */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="relative h-full min-h-[300px] sm:min-h-[350px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden group border border-slate-200 dark:border-slate-800 flex-1 shadow-sm hover:shadow-xl transition-shadow duration-500">
            
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#060913] dark:to-[#0B1120]"></div>
            
            {/* Decorative Orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700"></div>

            {/* Glassmorphism Content */}
            <div className="relative h-full p-6 sm:p-10 flex flex-col justify-between z-10 bg-white/40 dark:bg-transparent backdrop-blur-[2px]">
              
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-400 dark:from-amber-400 dark:to-amber-600 text-amber-900 dark:text-amber-950 mb-6 sm:mb-8 shadow-lg shadow-amber-500/20 border border-amber-300/50">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 sm:mb-4">
                  Vendor Network
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8">
                  Ready to scale? The vendor portal will allow you to purchase access codes in bulk, generate revenue, and manage your own clients directly from the dashboard.
                </p>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {['Bulk code generation', 'Wholesale pricing tiers', 'Client management tools'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-slate-200/80 dark:border-white/[0.08]">
                <div className="inline-flex items-center justify-between w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold backdrop-blur-md border border-slate-900/5 dark:border-white/5">
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4" /> Coming Soon
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}