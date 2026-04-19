'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Copy, Clock, Loader2, Wallet } from 'lucide-react';
import toast from 'react-hot-toast'; // <-- Added Toast!

export default function PayoutRequests() {

  const [filter, setFilter] = useState('Pending');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- 1. FETCH DATA ---
  const fetchPayouts = async () => {
    try {
      const res = await fetch('/api/admin/payouts');
      const data = await res.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      }
    } catch (error) {
      console.error("Failed to load payouts");
      toast.error("Failed to load payouts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  // --- 2. FILTER DATA ---
  const getTabStatus = (apiStatus: string) => {
    // FIX: Match these EXACTLY to the Tab names!
    if (apiStatus === 'Success') return 'Approved';
    if (apiStatus === 'Failed' || apiStatus === 'Rejected') return 'Rejected';
    return 'Pending';
  };

  const filteredData = withdrawals.filter(w => getTabStatus(w.status) === filter);

  // Stats Calculation
  const pendingTotal = withdrawals
    .filter(w => w.status === 'Pending')
    .reduce((sum, w) => sum + w.amount, 0);

  const paidToday = withdrawals
    .filter(w => w.status === 'Success' && new Date(w.updatedAt).toDateString() === new Date().toDateString())
    .reduce((sum, w) => sum + w.amount, 0);

  // --- 3. HANDLE ACTION ---
  const handleAction = async (id: string, action: 'Approve' | 'Reject') => {
    if (!confirm(`Are you sure you want to ${action} this withdrawal?`)) return;

    setProcessingId(id);
    // Optional loading toast
    const loadingToast = toast.loading(`Processing ${action}...`);

    try {
      const res = await fetch('/api/admin/payouts/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message, { id: loadingToast }); // Replace loading toast with success
        fetchPayouts(); 
      } else {
        toast.error(data.message, { id: loadingToast }); // Replace loading toast with error
      }
    } catch (error) {
      toast.error("Network Error", { id: loadingToast });
    } finally {
      setProcessingId(null);
    }
  };

  // Helper to extract bank info safely
  const getBankDetails = (item: any) => {
    return item.destination || item.reference || 'No details provided';
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Pending Payouts</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₦{pendingTotal.toLocaleString()}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Paid Today</p>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">₦{paidToday.toLocaleString()}</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors ${filter === tab
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-b-2 border-blue-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Request Details</th>
                <th className="px-6 py-4">Amount & Wallet</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.length > 0 && filteredData.map((item) => {
                const bankInfo = getBankDetails(item);
                const walletType = item.wallet || 'Ads';

                const isFormattedBank = bankInfo.includes('|');
                const parsedBankDetails = isFormattedBank ? bankInfo.split(' | ') : [bankInfo];

                return (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{item.userId?.username || 'Unknown User'}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">₦{item.amount.toLocaleString()}</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        ${walletType === 'Referral' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
                        >
                          <Wallet className="w-3 h-3" /> {walletType}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-lg w-fit min-w-[200px]">

                        {/* FIX: Cleaned up the TypeScript map! */}
                        <div className="flex flex-col gap-1">
                          {parsedBankDetails.map((detail: string, idx: number) => (
                            <span key={idx} className="font-mono text-xs text-slate-600 dark:text-slate-300">
                              {detail}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            let textToCopy = bankInfo;
                            if (bankInfo.includes('Acc:')) {
                              const match = bankInfo.match(/Acc:\s*(\d+)/);
                              if (match) textToCopy = match[1];
                            }
                            navigator.clipboard.writeText(textToCopy);
                            toast.success("Account Number Copied!"); // <-- Replaced alert with toast
                          }}
                          className="text-blue-500 hover:text-blue-600 shrink-0 mt-1"
                          title="Copy Account Number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {item.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAction(item._id, 'Reject')}
                            disabled={processingId === item._id}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                            title="Reject & Refund"
                          >
                            {processingId === item._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleAction(item._id, 'Approve')}
                            disabled={processingId === item._id}
                            className="flex items-center gap-1 px-3 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-bold text-xs hover:opacity-90 transition shadow-lg disabled:opacity-50"
                          >
                            {processingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {processingId === item._id ? 'Processing...' : 'Approve'}
                          </button>
                        </div>
                      ) : (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full 
                        ${item.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status === 'Success' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">No {filter.toLowerCase()} requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}