'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  PlaySquare,
  LayoutDashboard,
  Wallet,
  Users,
  Settings,
  LogOut,
  CircleHelp,
  Loader2,
  Upload
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Watch Ads', href: '/dashboard/ads', icon: PlaySquare },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { label: 'Upgrade Tier', href: '/dashboard/upgrade', icon: Upload },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { label: 'FAQ', href: '/dashboard/faq', icon: CircleHelp },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

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
    <aside className="w-64 bg-[#f8f9fa] border-r border-[#dddddd] flex-col hidden md:flex h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

      {/* Logo Area */}
      <div className="h-[80px] flex items-center px-8 border-b border-[#dddddd] bg-[#f8f9fa]">
        <img src='/landingpagelogo-nobg.png' alt='SleepStream' className='h-12 w-auto object-contain' />
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative
                ${isActive
                  ? 'bg-[#337ab7] text-white shadow-md shadow-[#337ab7]/20'
                  : 'bg-transparent text-[#666666] hover:bg-[#eeeeee] hover:text-[#333333]'
                }`}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-white rounded-r-full" />
              )}
              
              <Icon
                className={`w-4 h-4 transition-all duration-200 
                ${isActive
                    ? 'text-white'
                    : 'text-[#999999] group-hover:text-[#666666] group-hover:translate-x-0.5'
                  }`}
              />
              <span className={`transition-transform duration-200 ${!isActive && 'group-hover:translate-x-0.5'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout / Footer */}
      <div className="p-4 border-t border-[#dddddd] bg-[#f8f9fa]">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 text-[#a94442] hover:bg-[#f2dede] hover:border-[#ebccd1] border border-transparent w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#a94442]" />
          ) : (
            <LogOut className="w-4 h-4 text-[#ebccd1] group-hover:text-[#a94442] transition-colors" />
          )}
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </span>
        </button>
      </div>
    </aside>
  );
}