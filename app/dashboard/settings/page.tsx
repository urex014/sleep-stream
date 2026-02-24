'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Store, 
  Loader2, 
  Sparkles,
  Lock,
  ArrowRight
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
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* 1. HERO BANNER & AVATAR (Premium Overlapping Header) */}
      <div className="relative rounded-3xl overflow-hidden mb-12">
        {/* Abstract Gradient Background */}
        <div className="h-48 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 relative">
           {/* Subtle overlay pattern/noise could go here */}
           <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        </div>

        {/* Floating Profile Info */}
        <div className="relative px-8 sm:px-12 -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6">
          
          <div className="relative p-1.5 bg-slate-50 dark:bg-slate-950 rounded-full shadow-xl">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center text-4xl font-bold text-white dark:text-slate-900 shadow-inner">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {profile.fullName || 'User Profile'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-2 mt-1">
              {profile.email} 
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className={`text-xs font-bold uppercase tracking-wider ${profile.isVendor ? 'text-emerald-500' : 'text-blue-500'}`}>
                {profile.isVendor ? 'Verified Vendor' : 'Standard Member'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 sm:px-8">
        
        {/* 2. ACCOUNT SETTINGS FORM (Clean, Minimalist inputs) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Identity Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your public name and contact email.</p>
          </div>

          <div className="space-y-6">
            
            {/* Minimalist Input Field 1 */}
            <div className="group relative">
              <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2 block">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="text" 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-slate-900/50 border-b-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all rounded-t-xl"
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Minimalist Input Field 2 */}
            <div className="group relative">
              <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2 block">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-slate-900/50 border-b-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-slate-900 dark:text-white font-medium transition-all rounded-t-xl"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full overflow-hidden transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {/* Subtle hover glow effect */}
                <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. VENDOR TEASER (Premium Feature Box) */}
        <div className="lg:col-span-5">
          <div className="relative h-full min-h-[300px] rounded-3xl overflow-hidden group">
            
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"></div>
            
            {/* Decorative Orbs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-colors duration-700"></div>

            {/* Glassmorphism Content */}
            <div className="absolute inset-[2px] bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl rounded-[22px] p-8 flex flex-col justify-between border border-white/50 dark:border-slate-700/50">
              
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 mb-6 shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                  Vendor Network
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                  Ready to scale? The vendor portal will allow you to purchase access codes in bulk, generate revenue, and manage your own clients directly from the dashboard.
                </p>

                <ul className="space-y-3 mb-8">
                  {['Bulk code generation', 'Wholesale pricing tiers', 'Client management tools'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold backdrop-blur-md">
                  <Lock className="w-4 h-4" /> Coming Soon
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}