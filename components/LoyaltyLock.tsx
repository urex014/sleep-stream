'use client';

import React, { useState } from 'react';
import { Lock, TrendingUp, Calendar, ShieldCheck, Loader2, Info, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoyaltyLockProps {
  userId: string;
  adsBalance: number;
  onLockSuccess: (amountDeducted: number) => void;
}

export default function LoyaltyLock({ userId, adsBalance, onLockSuccess }: LoyaltyLockProps) {
  const [amount, setAmount] = useState<string>('');
  const [lockDays, setLockDays] = useState<14 | 30>(14);
  const [isLocking, setIsLocking] = useState(false);

  // Real-time ROI Calculator
  const numAmount = parseFloat(amount) || 0;
  const bonusPercentage = lockDays === 14 ? 0.05 : 0.15;
  const bonusAmount = numAmount * bonusPercentage;
  const totalReturn = numAmount + bonusAmount;

  const handleLock = async () => {
    if (numAmount <= 0) return toast.error("Enter a valid amount to lock.");
    if (numAmount > adsBalance) return toast.error("Insufficient Ads Balance.");

    setIsLocking(true);
    const toastId = toast.loading(`Locking ₦${numAmount} for ${lockDays} days...`);

    try {
      const res = await fetch('/api/user/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          lockAmount: numAmount, 
          lockDays 
        }),
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success("Funds successfully locked!", { id: toastId });
        setAmount(''); 
        onLockSuccess(numAmount); 
      } else {
        toast.error(data.error || "Failed to lock funds", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <div className="relative flex flex-col bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 transition-all duration-300 hover:shadow-md hover:border-indigo-200">
      
      {/* Header (Matches your UpgradePage Icon & Header structure) */}
      <div className="flex items-start gap-4 mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 text-[#286090]  rounded-2xl shadow-sm border border-indigo-100 shrink-0">
          <Lock className="w-7 h-7" />
        </div>
        <div className="pt-1">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Loyalty Vault</h3>
          <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
            Lock your available balance securely to earn up to 15% guaranteed ROI.
          </p>
          <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">The more you lock, the more your ROI🚀</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6 flex-1">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">Amount to Lock</label>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              Available: <span className="font-bold text-[#337ab7]">₦{adsBalance.toLocaleString()}</span>
            </span>
          </div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-indigo-600 transition-colors">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-9 pr-20 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <button 
              onClick={() => setAmount(adsBalance.toString())}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Duration Toggle (Matches the Active/Inactive Card states from UpgradePage) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setLockDays(14)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative ${
              lockDays === 14 
                ? 'border-[#286090] bg-indigo-50/10 shadow-sm z-10' 
                : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 z-0'
            }`}
          >
            <div className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" /> 14 Days
            </div>
            <div className={`text-xl font-extrabold tracking-tight ${lockDays === 14 ? 'text-[#337ab7]' : 'text-slate-900'}`}>
              +5% Bonus
            </div>
          </button>

          <button
            onClick={() => setLockDays(30)}
            className={`p-4 rounded-xl border-2 text-left transition-all duration-300 relative overflow-hidden ${
              lockDays === 30 
                ? 'border-[#286090] bg-indigo-50/10 shadow-sm z-10' 
                : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm hover:-translate-y-0.5 z-0'
            }`}
          >
            {lockDays === 30 && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">
                Best Value
              </div>
            )}
            <div className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" /> 30 Days
            </div>
            <div className={`text-xl font-extrabold tracking-tight ${lockDays === 30 ? 'text-[#286090]' : 'text-slate-900'}`}>
              +15% Bonus
            </div>
          </button>
        </div>

        {/* ROI Preview Box (Matches the summary list in UpgradePage) */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Estimated Return
            </span>
            <span className="text-base font-bold text-emerald-600 flex items-center gap-1">
              ₦{totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {numAmount > 0 && <TrendingUp className="w-4 h-4" />}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 border border-slate-100 rounded-xl">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Guaranteed Profit
            </span>
            <span className="text-base font-bold text-slate-900">
              +₦{bonusAmount.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* Submit Button (Matches the Paystack Button styling exactly) */}
      <div className="mt-8">
        <button
          onClick={handleLock}
          disabled={isLocking || numAmount <= 0 || numAmount > adsBalance}
          className="w-full  bg-gradient-to-br from-[#337ab7] to-[#286090] hover:bg-[#286090] text-white font-semibold py-3.5 rounded-xl shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
        >
          {isLocking ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : (
            <><ShieldCheck className="w-5 h-5" /> Secure & Lock Funds</>
          )}
        </button>
        
        <p className="text-xs text-slate-400 text-center font-medium flex items-center justify-center gap-1.5 mt-4">
          <Info className="w-4 h-4" /> Locked funds are held securely until the duration ends.
        </p>
      </div>

    </div>
  );
}