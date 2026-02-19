'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Code2,
  LogOut, 
  ShieldAlert,
  Store,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Deposit Requests', href: '/admin/users', icon: Users }, 
  // { label: 'Vendor Registry', href: '/admin/vendors', icon: Store }, 
  { label: 'Payout Requests', href: '/admin/withdrawals', icon: Wallet },
  {label:'Generate Codes', href:"/admin/codes", icon:Code2 },
  {label:'Push Notifications', href:'/admin/notifications', icon:Bell}
  // { label: 'System Settings', href: '/admin/settings', icon: Settings },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        // Redirect to login on success
        router.push('/login');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      // We don't set loading back to false if successful, 
      // because we are redirecting away.
      if (!isLoggingOut) setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex h-screen sticky top-0 shadow-xl z-20 text-slate-300">
      
      {/* Admin Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 text-white font-bold tracking-tight text-xl">
          <div className="p-1.5 bg-red-600 rounded-lg text-white shadow-lg shadow-red-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span>Inner Circle</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/20' 
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

      {/* Admin User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 mb-4 px-2">
           <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
             AD
           </div>
           <div>
             <p className="text-sm font-bold text-white">Admin</p>
           </div>
        </div>
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition w-full px-4 py-2.5 rounded-lg font-medium text-sm border border-transparent hover:border-red-900/50">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}