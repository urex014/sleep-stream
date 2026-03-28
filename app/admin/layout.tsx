'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/check-role'); 
        const data = await res.json();

        if (!res.ok) throw new Error('Unauthorized');
        if (data.role === 'admin') {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // --- 1. LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // --- 2. UNAUTHORIZED STATE (Blurred Overlay) ---
  if (!isAuthorized) {
    return (
      <div className="relative min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
        
        {/* The BLURRED Content (Unclickable) */}
        <div className="absolute inset-0 filter blur-xl opacity-50 pointer-events-none select-none" aria-hidden="true">
          <div className="flex h-full">
            <AdminSidebar />
            <div className="flex-1 p-8">
               <header className="h-16 mb-8 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
                  <h2 className="font-bold text-slate-200">System Overview</h2>
               </header>
               <div className="grid grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-40 bg-slate-800 rounded-2xl"></div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* The Warning Overlay */}
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 p-8 rounded-3xl shadow-2xl max-w-md text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              This area is restricted to administrators only. Your attempt to login as admin has been recorded.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition"
              >
                Return to Dashboard
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="w-full py-3 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white transition"
              >
                Sign in as different user
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // --- 3. AUTHORIZED ADMIN CONTENT ---
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans animate-in fade-in duration-500">
      
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Simple Top Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
           <h2 className="font-bold pl-5 text-slate-700 dark:text-slate-200">Admin dashboard</h2>
           {/* <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-xs font-mono text-slate-500">SERVER: ONLINE</span>
           </div> */}
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}