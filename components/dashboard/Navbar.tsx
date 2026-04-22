'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Wallet,
  Users,
  Settings,
  CircleHelp,
  LogOut,
  Loader2,
  Upload,
  PlayCircleIcon
} from 'lucide-react';
import NotificationBell from '../NotificationBell';

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
    { label: 'Watch Ads', href: '/dashboard/ads', icon: PlayCircleIcon },
    {label: 'Surveys/Offers', href: '/dashboard/surveys', icon: CircleHelp},
    { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Upgrade Tier', href: '/dashboard/upgrade', icon: Upload },
    { label: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { label: 'FAQ', href: '/dashboard/faq', icon: CircleHelp },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  // 1. On Mount: Fetch User
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
      {/* Modern Solid Navbar */}
      <header className="h-[80px] bg-white/95 backdrop-blur-sm border-b border-[#dddddd] sticky top-0 z-30 px-5 md:px-8 flex items-center justify-between shadow-sm transition-all">

        {/* Left: Mobile Menu Trigger & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 text-[#666666] hover:text-[#337ab7] hover:bg-[#f0f4f8] rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block">
            <h2 className="font-bold text-[#222222] text-xl tracking-tight">Dashboard</h2>
            <p className="text-sm text-[#777777] font-medium mt-0.5">
              Welcome back, <span className="font-semibold text-[#333333]">{userData?.name || 'User'}</span>
            </p>
          </div>

          {/* Mobile Logo Fallback */}
          <div className="md:hidden flex items-center">
            <img src="/landingpagelogo-nobg.png" alt="SleepStream" className="h-10 w-auto object-contain" />
          </div>
        </div>

        {/* Right: Status, Controls & Profile */}
        <div className="flex items-center gap-5 md:gap-7">
          <NotificationBell />

          <div className="h-8 w-px bg-[#dddddd] hidden sm:block"></div>

          {/* Modern Avatar */}
          <div
            onClick={() => router.push('/dashboard/settings')}
            className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#337ab7] to-[#286090] border border-[#2e6da4] flex items-center justify-center text-white text-lg font-bold cursor-pointer shadow-md shadow-[#337ab7]/20 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with blur & fade-in */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sliding Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#f8f9fa] border-r border-[#dddddd] shadow-[4px_0_24px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-left duration-300 ease-out">

            <div className="h-[80px] flex items-center justify-between px-6 border-b border-[#dddddd] bg-[#f8f9fa]">
              <img src="/landingpagelogo-nobg.png" alt="SleepStream" className="h-12 w-auto object-contain" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#999999] hover:text-[#a94442] hover:bg-[#f2dede] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
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

                    <Icon className={`w-4 h-4 transition-all duration-200 ${isActive ? 'text-white' : 'text-[#999999] group-hover:text-[#666666] group-hover:translate-x-0.5'}`} />
                    <span className={`transition-transform duration-200 ${!isActive && 'group-hover:translate-x-0.5'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#dddddd] bg-[#f8f9fa]">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 text-[#a94442] hover:bg-[#f2dede] hover:border-[#ebccd1] border border-transparent transition-all duration-200 w-full px-4 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed group"
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
            
          </div>
        </div>
      )}
    </>
  );
}