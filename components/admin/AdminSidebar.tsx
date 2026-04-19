'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Code2,
  LogOut, 
  ShieldAlert,
  Bell,
  Menu,
  X,
  Loader2,
  PlaySquare,
  ShoppingBag
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Payout Requests', href: '/admin/withdrawals', icon: Wallet },  // Updated to payouts
  { label: 'Generate Codes', href: "/admin/codes", icon: Code2 },
  {label: 'Register Vendor', href: "/admin/vendors", icon: ShoppingBag},
  { label: 'Push Notifications', href: '/admin/notifications', icon: Bell },
  { label:"post ads", href:"/admin/ads", icon: PlaySquare },
  {label:'Manage Ads', href: '/admin/ad-req', icon: ShieldAlert}
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // --- Responsive State ---
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      if (!isLoggingOut) setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {/* This button floats on top of the layout on mobile devices */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 p-2 bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* --- MOBILE BACKDROP OVERLAY --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      {/* On mobile: Fixed position, sliding in/out based on `isOpen`.
        On desktop: Static flex item, permanently visible (`md:static`, `md:translate-x-0`).
      */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:z-auto text-slate-300
        `}
      >
        
        {/* Admin Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2 text-white font-bold tracking-tight text-xl">
            <div className="p-1.5 bg-red-500 rounded-lg text-white shadow-lg shadow-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span>Inner Circle</span>
          </div>
          
          {/* Mobile Close Button inside Sidebar */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1 text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsOpen(false)} // Close drawer on navigation (Mobile)
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-red-500 text-white shadow-md shadow-red-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                <Icon 
                  className={`w-5 h-5 transition-colors duration-200 
                  ${isActive 
                    ? 'text-white' 
                    : 'text-slate-500 group-hover:text-slate-300'
                  }`} 
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin User Info / Sign Out */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold shadow-inner">
               AD
             </div>
             <div>
               <p className="text-sm font-bold text-white tracking-wide">Admin</p>
               <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">Authorized</p>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition w-full px-4 py-2.5 rounded-lg font-bold text-sm border border-transparent hover:border-red-900/50 disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} 
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </aside>
    </>
  );
}