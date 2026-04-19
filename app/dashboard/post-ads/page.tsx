/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Lock,
  PlaySquare,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  Loader2,
  List
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

// Force Paystack to load ONLY on the client-side
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function PostAdsPage() {
  const router = useRouter();

  // Data States
  const [user, setUser] = useState<any>(null);
  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Interaction States
  const [hasPaid, setHasPaid] = useState(false);
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);

  // Ad Form State
  const [adType, setAdType] = useState<'video' | 'link'>('video');
  const [adForm, setAdForm] = useState({
    title: '',
    url: '',
    duration: '15',
    reference: '' // To store the Paystack transaction ID
  });

  const AD_FEE = 5000;

  // --- 1. FETCH USER & HISTORY ---
  const fetchDashboardData = async () => {
    try {
      const userRes = await fetch('/api/user/dashboard', { cache: 'no-store' });
      if (userRes.status === 401) return router.push('/login');
      const userData = await userRes.json();
      if (userData.success) setUser(userData.user);

      // Fetch user's ad history
      const campaignsRes = await fetch('/api/user/campaigns');
      const campaignsData = await campaignsRes.json();
      if (campaignsData.success) setMyCampaigns(campaignsData.campaigns);
    } catch (error) {
      console.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  // --- 2. PAYSTACK CONFIG ---
  const paystackProps = {
    email: user?.email || 'user@example.com',
    amount: AD_FEE * 100, // Paystack uses Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    text: "Pay ₦5,000 & Continue",
    onSuccess: (reference: any) => {
      setAdForm({ ...adForm, reference: reference.reference });
      setHasPaid(true);
    },
    onClose: () => console.log('Payment closed'),
  };

  // --- 3. SUBMIT AD TO BACKEND ---
  const handlePostAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title || !adForm.url || !adForm.reference) return alert("Missing required fields.");

    setIsSubmittingAd(true);

    try {
      const res = await fetch('/api/user/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: adForm.title,
          url: adForm.url,
          type: adType,
          duration: adForm.duration,
          reference: adForm.reference
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Your ad has been successfully submitted and is pending admin review!");
        setAdForm({ title: '', url: '', duration: '15', reference: '' });
        setHasPaid(false);
        fetchDashboardData(); // Refresh history table
      } else {
        toast.error(data.message || "Failed to submit ad.");
      }
    } catch (error) {
      toast.error("Network error while submitting ad.");
    } finally {
      setIsSubmittingAd(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#337ab7] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans text-[#333333]">
      {/* HEADER */}
      <div className="border-b border-[#dddddd] pb-4 mb-6 flex items-center gap-3">
        <div className="p-2 bg-[#f5f5f5] border border-[#dddddd] rounded text-[#337ab7]">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#222222]">Advertise with us</h1>
          <p className="text-[#666666] mt-1 text-sm">Promote your business, YouTube channel, or affiliate links to our users.</p>
        </div>
      </div>

      {/* --- STEP 1: PAYMENT GATE --- */}
      {!hasPaid ? (
        <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">
          <div className="bg-[#f5f5f5] border-b border-[#dddddd] p-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#777777]" />
            <h3 className="font-bold text-[#333333] text-base">Payment Required</h3>
          </div>

          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-[#f9f9f9] border border-[#cccccc] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Megaphone className="w-10 h-10 text-[#337ab7]" />
            </div>
            <h2 className="text-2xl font-bold text-[#222222] mb-3">Create a New Ad Campaign</h2>
            <p className="text-[#666666] max-w-lg mx-auto mb-8 text-sm leading-relaxed">
              Reach thousands of active daily users. To maintain network quality and prevent spam, creating a new advertisement requires a flat placement fee.
            </p>

            <div className="bg-[#f9f9f9] border border-[#dddddd] rounded max-w-sm mx-auto p-6 mb-8">
              <p className="text-[#777777] text-xs font-bold uppercase tracking-wider mb-1">Placement Fee</p>
              <p className="text-4xl font-bold text-[#222222]">₦{AD_FEE.toLocaleString()}</p>
            </div>

            {/* Paystack Button Integration */}
            <PaystackButton
              {...paystackProps}
              className="bg-[#5cb85c] hover:bg-[#449d44] border border-[#4cae4c] text-white font-bold py-3 px-8 rounded shadow-sm inline-flex items-center justify-center gap-2 transition-colors text-lg"
            />
          </div>
        </div>
      ) : (

        /* --- STEP 2: AD CREATION FORM --- */
        <div className="animate-in fade-in duration-500">
          <div className="bg-[#dff0d8] border border-[#d6e9c6] text-[#3c763d] px-4 py-3 rounded shadow-sm flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">Payment successful! You can now configure your ad below.</span>
          </div>

          <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden">
            <div className="bg-[#f5f5f5] border-b border-[#dddddd] p-4 flex justify-between items-center">
              <h3 className="font-bold text-[#333333] text-base">Campaign Details</h3>
              <span className="text-xs font-bold bg-[#337ab7] text-white px-2 py-1 rounded">Paid</span>
            </div>

            <form onSubmit={handlePostAd} className="p-6 md:p-8 space-y-6">
              {/* Ad Type Selection */}
              <div>
                <label className="block text-sm font-bold text-[#333333] mb-3">Select Ad Format</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setAdType('video')}
                    className={`cursor-pointer border rounded p-4 flex items-center gap-3 transition-colors ${adType === 'video' ? 'bg-[#e4f0f9] border-[#66afe9]' : 'bg-white border-[#cccccc] hover:bg-[#f9f9f9]'}`}
                  >
                    <div className={`p-2 rounded ${adType === 'video' ? 'bg-[#337ab7] text-white' : 'bg-[#eeeeee] text-[#777777]'}`}>
                      <PlaySquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#333333]">Video Ad</p>
                      <p className="text-xs text-[#666666]">YouTube or direct MP4 link</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setAdType('link')}
                    className={`cursor-pointer border rounded p-4 flex items-center gap-3 transition-colors ${adType === 'link' ? 'bg-[#e4f0f9] border-[#66afe9]' : 'bg-white border-[#cccccc] hover:bg-[#f9f9f9]'}`}
                  >
                    <div className={`p-2 rounded ${adType === 'link' ? 'bg-[#337ab7] text-white' : 'bg-[#eeeeee] text-[#777777]'}`}>
                      <MousePointerClick className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#333333]">Website Link</p>
                      <p className="text-xs text-[#666666]">Drive traffic to your site</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={adForm.title}
                  onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                  placeholder="e.g., Subscribe to my Tech Channel!"
                  className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] text-[#333333] rounded px-4 py-2.5 outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">Target URL</label>
                <input
                  type="url"
                  value={adForm.url}
                  onChange={(e) => setAdForm({ ...adForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] text-[#333333] rounded px-4 py-2.5 outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#333333] mb-2">View Duration Required</label>
                <select
                  value={adForm.duration}
                  onChange={(e) => setAdForm({ ...adForm, duration: e.target.value })}
                  className="w-full bg-white border border-[#cccccc] focus:border-[#66afe9] text-[#333333] rounded px-4 py-2.5 outline-none text-sm"
                >
                  <option value="15">15 Seconds (Standard)</option>
                  <option value="30">30 Seconds</option>
                  <option value="60">60 Seconds</option>
                </select>
              </div>

              <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] p-4 rounded text-sm flex items-start gap-3 mt-4">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  <strong>Note:</strong> All ads are manually reviewed to ensure they meet our community guidelines. Offensive or malicious links will be rejected without a refund.
                </p>
              </div>

              <div className="pt-4 border-t border-[#eeeeee]">
                <button
                  type="submit"
                  disabled={isSubmittingAd}
                  className="w-full bg-[#337ab7] hover:bg-[#286090] border border-[#2e6da4] text-white font-bold py-3 rounded shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingAd ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
                  {isSubmittingAd ? "Submitting for review..." : "Publish Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HISTORY TABLE --- */}
      <div className="bg-white border border-[#dddddd] rounded shadow-sm overflow-hidden mt-8">
        <div className="p-4 border-b border-[#dddddd] bg-[#f5f5f5] flex items-center gap-2">
          <List className="w-4 h-4 text-[#777777]" />
          <h3 className="font-bold text-[#333333] text-base">My Ad Campaigns</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9f9f9] text-[#777777] text-xs uppercase font-bold border-b border-[#dddddd]">
              <tr>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-[#333333]">
              {myCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#999999]">
                    You haven't created any campaigns yet.
                  </td>
                </tr>
              ) : myCampaigns.map((camp: any) => (
                <tr key={camp._id} className="border-b border-[#eeeeee] hover:bg-[#f9f9f9]">
                  <td className="px-6 py-4 font-bold text-[#337ab7]">{camp.title}</td>
                  <td className="px-6 py-4">
                    <span className="bg-[#eeeeee] text-[#555555] px-2 py-1 rounded text-xs font-bold border border-[#cccccc] capitalize">{camp.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${camp.status === 'Active' ? 'bg-[#5cb85c] text-white' : 'bg-[#f0ad4e] text-white'}`}>
                      {camp.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-[#999999]">
                    {new Date(camp.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}