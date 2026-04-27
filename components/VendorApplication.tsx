'use client';

import React, { useState } from 'react';
import { Store, Loader2, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import BuyWholesaleCode from './PurchaseCode';

interface VendorAppProps {
  userId: string;
  isAlreadyVendor: boolean;
  vendorStatus: string | null; // Changed to match the API string ('Pending', 'Rejected', or null)
  email: string;
}

export default function VendorApplication({ userId, isAlreadyVendor, vendorStatus, email }: VendorAppProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    const loadingToast = toast.loading("Submitting application...");

    try {
      const res = await fetch('/api/user/vendor/apply', {
        method: 'POST', // Fixed typo here
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Application submitted successfully!", { id: loadingToast });
        window.location.reload(); 
      } else {
        toast.error(data.message || "Failed to submit application", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { id: loadingToast });
    } finally {
      setIsApplying(false);
    }
  };

  if (isAlreadyVendor) {
    return <BuyWholesaleCode userId={userId} email={email} />;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all hover:shadow-md hover:border-[#337ab7]/30">
      <div className="flex items-start gap-4 mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-[#337ab7] rounded-xl border border-[#337ab7]/20 shrink-0">
          <Store className="w-6 h-6" />
        </div>
        <div className="pt-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Become a Code Vendor</h3>
          <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
            Apply to become an official vendor. Once approved, you can purchase activation codes at a wholesale rate of <strong>₦4,500</strong> and sell them to new users for a profit.
          </p>
        </div>
      </div>

      {vendorStatus === "Pending" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
          <Clock className="w-5 h-5" /> Application under review by Admin
        </div>
      )}

      {/* Show the button if they have never applied OR if they were rejected previously */}
      {(vendorStatus === null || vendorStatus === "None" || vendorStatus === "Rejected") && (
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="w-full bg-[#337ab7] hover:bg-[#286090] text-white font-bold py-3.5 rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
        </button>
      )}
    </div>
  );
}