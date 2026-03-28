'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Bot,
  Wallet,
  Users,
  Settings,
  CircleHelp,
  LogOut,
  Loader2
} from 'lucide-react';
import NotificationBell from '../NotificationBell';
import Logo from '../Logo';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);

  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Bots', href: '/dashboard/bots', icon: Bot },
    { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { label: 'FAQ', href: '/dashboard/faq', icon: CircleHelp },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // 1. On Mount: Fetch User (Removed Dark Mode Theme Check)
  useEffect(() => {
    setMounted(true);

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/dashboard');
        const data = await res.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user info");
      }
    };
    fetchUser();

  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) router.push('/login');
      else setIsLoggingOut(false);
    } catch (error) {
      console.error("Error logging out", error);
      setIsLoggingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Classic Solid Navbar */}
      <header className="h-[72px] bg-white border-b border-[#dddddd] sticky top-0 z-30 px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.05)]">

        {/* Left: Mobile Menu Trigger & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-[#777777] hover:text-[#333333] hover:bg-[#eeeeee] rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block">
            <h2 className="font-bold text-[#222222] text-lg tracking-normal">Dashboard</h2>
            <p className="text-xs text-[#777777] font-bold mt-0.5">
              Welcome back, {userData?.name || 'User'}
            </p>
          </div>

          {/* Mobile Logo Fallback */}
          <div className="md:hidden flex items-center">
            <h2 className="font-bold text-[#337ab7] text-lg tracking-normal">SleepStream</h2>
          </div>
        </div>

        {/* Right: Status, Controls & Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="h-6 w-px bg-[#dddddd] hidden sm:block"></div>

          <NotificationBell />

          {/* Classic Square/Rounded Avatar */}
          <div
            onClick={() => router.push('/dashboard/settings')}
            className="h-9 w-9 rounded bg-[#337ab7] border border-[#2e6da4] flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-[#286090] transition-colors shadow-sm"
          >
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY (Classic Admin Panel Style) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Solid opacity backdrop (no blur) */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-[#f8f9fa] border-r border-[#dddddd] shadow-lg flex flex-col">

            <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#dddddd] bg-white">
              <Logo className="h-8 w-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-[#999999] hover:text-[#a94442] hover:bg-[#f2dede] rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-bold transition-colors border ${isActive
                        ? 'bg-[#337ab7] text-white border-[#2e6da4] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)]'
                        : 'bg-transparent text-[#666666] border-transparent hover:bg-[#eeeeee] hover:text-[#333333] hover:border-[#dddddd]'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#999999]'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#dddddd] bg-white">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 text-[#a94442] hover:bg-[#f2dede] hover:border-[#ebccd1] border border-transparent transition w-full px-4 py-2.5 rounded text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin text-[#a94442]" /> : <LogOut className="w-4 h-4 text-[#ebccd1]" />}
                <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}