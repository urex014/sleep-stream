'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Save, 
  Store, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock 
} from 'lucide-react';

export default function SettingsPage() {
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    vendorStatus: 'None', // None, Pending, Approved, Rejected
    businessName: '',
    isVendor: false
  });

  // Application Form State
  const [appForm, setAppForm] = useState({
    businessName: '',
    businessDescription: ''
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
      if (res.ok) alert("Profile Updated!");
      else alert("Update failed");
    } catch (error) {
      alert("Network Error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. SUBMIT VENDOR APP ---
  const handleVendorApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      const res = await fetch('/api/user/vendor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appForm),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        setProfile({ ...profile, vendorStatus: 'Pending' }); // Optimistic Update
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your personal details and business status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PROFILE SUMMARY */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div className="w-24 h-24 bg-blue-600 dark:bg-blue-500 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile.fullName}</h3>
            
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300">
              {profile.isVendor ? (
                <><Store className="w-3 h-3 text-emerald-500" /> Verified Vendor</>
              ) : (
                <><User className="w-3 h-3" /> Standard User</>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FORMS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. PERSONAL INFORMATION */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Personal Details
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input 
                    type="text" 
                    value={profile.fullName} 
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} 
                Save Changes
              </button>
            </div>
          </div>

          {/* 2. VENDOR APPLICATION */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Register as a vendor
              </h2>
              {/* STATUS BADGE */}
              {profile.vendorStatus === 'Approved' && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active Vendor</span>
              )}
              {profile.vendorStatus === 'Pending' && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> Application Pending</span>
              )}
              {profile.vendorStatus === 'Rejected' && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Application Rejected</span>
              )}
            </div>

            {/* Content Based on Status */}
            <p>coming soon ...</p>
            {/* {profile.isVendor ? (
              <div className="text-center py-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                <Store className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-lg">You are a Verified Vendor</h3>
                <p className="text-emerald-600/80 dark:text-emerald-400/70 text-sm mt-1">
                   Name: <b>{profile.businessName}</b>
                </p>
              </div>
            ) : profile.vendorStatus === 'Pending' ? (
              <div className="text-center py-8 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
                <Clock className="w-12 h-12 text-amber-500 mx-auto mb-3 animate-pulse" />
                <h3 className="font-bold text-amber-700 dark:text-amber-400 text-lg">Application Under Review</h3>
                <p className="text-amber-600/80 dark:text-amber-400/70 text-sm mt-1 max-w-sm mx-auto">
                  Our team is reviewing your request. You will be notified once a decision is made.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVendorApply} className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6">
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Become a vendor to sell products and access exclusive business tools. Fill out the details below to apply.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name</label>
                  <input 
                    type="text" 
                    required
                    value={appForm.businessName}
                    onChange={(e) => setAppForm({...appForm, businessName: e.target.value})}
                    placeholder="e.g. Acme Trading Co."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300"> Desription</label>
                  <textarea 
                    required
                    value={appForm.businessDescription}
                    onChange={(e) => setAppForm({...appForm, businessDescription: e.target.value})}
                    placeholder="Describe your business activities..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    disabled={isApplying}
                    className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-500 transition flex items-center gap-2 shadow-lg disabled:opacity-70"
                  >
                    {isApplying ? <Loader2 className="w-4 h-4 animate-spin"/> : <Store className="w-4 h-4" />}
                    Submit Application
                  </button>
                </div>
              </form>
            )} */}
          </div>

        </div>
      </div>
    </div>
  );
}