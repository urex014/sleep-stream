import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-800 dark:selection:text-blue-50 transition-colors duration-300">
      
      {/* ==========================================
          BACKGROUND DECORATIONS (Premium Visuals)
          ========================================== */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* 1. Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-10"></div>
        
        {/* 2. Soft Glowing Orbs (Light Mode Focus) 
            Uses mix-blend-multiply in light mode for richer, overlapping colors.
        */}
        <div className="absolute top-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-blue-400/20 dark:bg-blue-600/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal animate-pulse-slow"></div>
        
        <div className="absolute top-[20%] right-[-5%] w-[35rem] h-[35rem] bg-cyan-300/20 dark:bg-cyan-600/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal opacity-70"></div>
        
        <div className="absolute bottom-[-10%] left-[15%] w-[25rem] h-[25rem] bg-indigo-300/20 dark:bg-indigo-600/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal opacity-60"></div>
      </div>

      {/* ==========================================
          MAIN LAYOUT CONTENT
          ========================================== */}
      
      {/* Fixed Sidebar */}
      <div className="relative z-20">
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navbar */}
        <Navbar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
          {children}
        </main>
        
      </div>
    </div>
  );
}