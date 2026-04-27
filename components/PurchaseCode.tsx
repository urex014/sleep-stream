'use client';

import React, { useState } from 'react';
import { KeyRound, Loader2, ShieldCheck, Copy } from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

interface BuyWholesaleProps {
  userId: string;
  email: string;
}

export default function BuyWholesaleCode({ userId, email }: BuyWholesaleProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const WHOLESALE_PRICE = 4500;

  const handlePaystackSuccess = async (reference: any) => {
    setIsProcessing(true);
    const loadingToast = toast.loading("Verifying payment & generating code...");

    try {
      const res = await fetch('/api/vendor/buy-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          reference: reference.reference 
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Code generated successfully!", { id: loadingToast });
        setGeneratedCode(data.code); // The backend returns the newly created string like "SLP-XXXX-XXXX"
      } else {
        toast.error(data.message || "Failed to generate code", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error. Contact support with your reference.", { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const componentProps = {
    email: email,
    amount: WHOLESALE_PRICE * 100, // Paystack uses kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    text: "Pay ₦4,500 to Generate Code",
    onSuccess: handlePaystackSuccess,
    onClose: () => toast("Payment cancelled"),
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 text-[#5cb85c] rounded-2xl border border-[#5cb85c]/20 shrink-0">
          <KeyRound className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Buy Wholesale Code</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Generate a valid activation code to sell.</p>
        </div>
      </div>

      {generatedCode ? (
        <div className="bg-blue-50 border border-[#337ab7]/30 p-6 rounded-2xl text-center animate-in zoom-in-95 duration-300">
          <p className="text-sm font-bold text-[#337ab7] uppercase tracking-wider mb-2">Your New Activation Code</p>
          <p className="text-2xl font-mono font-black text-slate-900 tracking-widest bg-white py-3 px-4 rounded-xl border border-blue-100 shadow-sm mb-4">
            {generatedCode}
          </p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(generatedCode);
              toast.success("Code copied to clipboard!");
            }}
            className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Copy className="w-5 h-5" /> Copy Code
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
             <span className="font-semibold text-slate-600">Wholesale Price:</span>
             <span className="text-xl font-black text-slate-900">₦4,500</span>
          </div>

          {isProcessing ? (
            <button disabled className="w-full bg-slate-100 text-slate-400 font-semibold py-4 rounded-xl flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
            </button>
          ) : (
            <PaystackButton
              {...componentProps}
              className="w-full bg-[#5cb85c] hover:bg-[#4cae4c] text-white font-bold py-4 rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            />
          )}
          <p className="text-xs text-slate-400 text-center font-medium flex items-center justify-center gap-1 mt-4">
            <ShieldCheck className="w-4 h-4" /> Payment secured by Paystack
          </p>
        </div>
      )}
    </div>
  );
}