/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        if (data.success) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Helper to format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Construct Stats Array from Real Data
  const stats = [
    { 
      title: "Total Users", 
      value: dashboardData?.stats.totalUsers.toLocaleString() || "0", 
      trend: "Registered Accounts", 
      icon: Users, 
      color: "blue" 
    },
    { 
      title: "Total Money in", 
      value: formatMoney(dashboardData?.stats.totalMoneyIn || 0), 
      trend: "Total Deposits", 
      icon: DollarSign, 
      color: "emerald" 
    },
    { 
      title: "Pending Withdrawals", 
      value: dashboardData?.stats.pendingCount.toString() || "0", 
      trend: "Needs Action", 
      icon: AlertCircle, 
      color: "amber" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {idx === 2 && parseInt(stat.value) > 0 ? (
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">Action Req.</span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Live
                </span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* 2. RECENT ACTIVITY & PENDING REQUESTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pending Withdrawals List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">Pending Withdrawals</h3>
            <button 
              onClick={() => router.push('/admin/payouts')}
              className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dashboardData?.recentWithdrawals.length > 0 ? (
                  dashboardData.recentWithdrawals.map((tx: any) => (
                    <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {tx.userId?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-mono">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {tx.method} <span className='text-xs opacity-70'>({tx.network})</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => router.push('/admin/payouts')} 
                          className="bg-slate-900 dark:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No pending withdrawals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
           {/* Code Generation Shortcut */}
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
             <h3 className="font-bold text-lg mb-2">Generate Codes</h3>
             <p className="text-blue-100 text-sm mb-6">Create new batch of activation codes for vendors.</p>
             <button onClick={() => router.push('/admin/codes')} className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition shadow-sm">
               Go to Code Manager
             </button>
           </div>

           {/* Server Load (Mock Data Visuals) */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
             <h3 className="font-bold text-slate-900 dark:text-white mb-4">Server Load</h3>
             <div className="space-y-4">
               <div>
                 <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                   <span>CPU Usage</span>
                   <span>45%</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[45%] rounded-full"></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                   <span>Database</span>
                   <span>62%</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[62%] rounded-full"></div>
                 </div>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}