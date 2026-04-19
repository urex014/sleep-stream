import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Navbar from '@/components/dashboard/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      {/* ==========================================
          MAIN LAYOUT CONTENT
          ========================================== */}

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8f9fa]">

        {/* Navbar */}
        <Navbar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}