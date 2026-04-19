/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Loader2, Copy } from 'lucide-react';

export default function DepositRequests() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- FETCH DEPOSITS ---
  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error("Failed to fetch deposits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // --- HANDLE ACTION ---
  const handleAction = async (id: string, action: 'Approve' | 'Reject') => {
    if (!confirm(`Are you sure you want to ${action} this deposit?`)) return;

    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/users/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchDeposits(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deposit Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Verify and approve user top-ups.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Proof (TX Hash)</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deposits.length > 0 ? deposits.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{tx.userId?.username || 'Unknown'}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {new Date(tx.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      +${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg w-fit max-w-[180px]">
                      <span className="font-mono text-xs text-slate-600 dark:text-slate-300 truncate">
                        {tx.txHash}
                      </span>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(tx.txHash); alert('Copied!'); }}
                        className="text-blue-500 hover:text-blue-600 shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {tx.method} <span className="text-xs opacity-70">({tx.network})</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(tx._id, 'Reject')}
                        disabled={processingId === tx._id}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                        title="Reject"
                      >
                        {processingId === tx._id ? <Loader2 className="w-5 h-5 animate-spin"/> : <XCircle className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleAction(tx._id, 'Approve')}
                        disabled={processingId === tx._id}
                        className="flex items-center gap-1 px-3 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-lg font-bold text-xs hover:opacity-90 transition shadow-lg disabled:opacity-50"
                      >
                        {processingId === tx._id ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4" />}
                        {processingId === tx._id ? 'Processing' : 'Confirm'}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No pending deposits.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}