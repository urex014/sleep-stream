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
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans text-[#333333]">

      {/* HEADER */}
      <div className="border-b border-[#dddddd] pb-4 mb-6">
        <h1 className="text-3xl font-bold text-[#222222]">Account Settings</h1>
        <p className="text-[#666666] mt-1 text-sm">Manage your profile and vendor status.</p>
      </div>

      {/* 1. HERO BANNER & AVATAR (Classic Panel Style) */}
      <div className="bg-white border border-[#dddddd] rounded shadow-sm p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded bg-[#f5f5f5] border border-[#cccccc] flex items-center justify-center text-4xl font-bold text-[#337ab7] shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          {profile.isVendor && (
            <div className="absolute -bottom-2 -right-2 p-1 bg-[#5cb85c] text-white rounded border border-[#4cae4c] shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left mt-2">
          <h2 className="text-2xl font-bold text-[#222222] mb-1">
            {profile.fullName || 'User Profile'}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
            <span className="text-[#666666] text-sm">
              {profile.email}
            </span>
            <span className="hidden sm:block text-[#cccccc]">|</span>
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold border w-max mx-auto sm:mx-0
              ${profile.isVendor
                ? 'bg-[#dff0d8] border-[#d6e9c6] text-[#3c763d]'
                : 'bg-[#d9edf7] border-[#bce8f1] text-[#31708f]'}`}>
              {profile.isVendor ? 'Verified Vendor' : 'Standard Member'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 2. ACCOUNT SETTINGS FORM */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white border border-[#dddddd] rounded shadow-sm flex-1 flex flex-col">

            <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5]">
              <h2 className="font-bold text-[#333333] text-base">Identity Settings</h2>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-6">

              {/* Classic Input Group 1 */}
              <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">
                  Full Name
                </label>
                <div className="flex shadow-sm">
                  <span className="bg-[#eeeeee] border border-[#cccccc] border-r-0 px-3 py-2 text-[#555555] rounded-l flex items-center">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="flex-1 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded-r px-3 py-2 outline-none transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Classic Input Group 2 */}
              <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">
                  Email Address
                </label>
                <div className="flex shadow-sm">
                  <span className="bg-[#eeeeee] border border-[#cccccc] border-r-0 px-3 py-2 text-[#555555] rounded-l flex items-center">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="flex-1 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] text-[#333333] rounded-r px-3 py-2 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 mt-auto">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-[#337ab7] hover:bg-[#286090] border border-[#2e6da4] text-white font-bold py-2.5 px-6 rounded shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 3. VENDOR TEASER (Classic Bootstrap Warning Panel) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#fcf8e3] border border-[#faebcc] rounded shadow-sm flex-1 flex flex-col text-[#8a6d3b]">

            <div className="p-4 border-b border-[#faebcc] bg-[#faf2cc] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-base">Vendor Network</h3>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-sm mb-5 leading-relaxed">
                Ready to scale? The vendor portal will allow you to purchase access codes in bulk, generate revenue, and manage your own clients directly from the dashboard.
              </p>

              <ul className="space-y-2.5 mb-6">
                {['Bulk code generation', 'Wholesale pricing tiers', 'Client management tools'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold">
                    <span className="w-1.5 h-1.5 bg-[#8a6d3b] rounded-full shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5 border-t border-[#faebcc] flex justify-between items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#8a6d3b] text-white text-xs font-bold">
                  <Lock className="w-3 h-3" /> Coming Soon
                </div>
                <ArrowRight className="w-4 h-4 text-[#8a6d3b] opacity-70" />
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}