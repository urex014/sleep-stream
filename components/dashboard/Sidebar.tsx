'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Bot, 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Settings, 
  LogOut, 
  CircleHelp,
  Loader2 
} from 'lucide-react';
import Image from 'next/image';
import Logo from '../Logo';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Bots', href: '/dashboard/bots', icon: Bot },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
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
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-col hidden md:flex h-screen sticky top-0 shadow-sm z-20 transition-colors duration-300">
      
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800">
        
          
          {/* <Image alt='SS' src="/logo.jpg" width /> */}
            <Logo />
          
          {/* <span>Sleep Stream</span> */}
        
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
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
            >
              <Icon 
                className={`w-5 h-5 transition-colors duration-200 
                ${isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} 
              />
              {item.label}
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-sm shadow-blue-500"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout / Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition w-full px-4 py-3 rounded-lg group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
          )}
          <span className="font-medium text-sm">
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </span>
        </button>
      </div>
    </aside>
  );
}