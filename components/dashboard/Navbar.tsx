'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
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

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // --- NEW: State for User Name ---
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

  // 1. On Mount: Check Theme & Fetch User
  useEffect(() => {
    setMounted(true);
    
    // Theme Check
    const userPrefersDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (userPrefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // --- NEW: Fetch User Name ---
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

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

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
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between transition-colors duration-300">
        
        {/* Left: Mobile Menu Trigger & Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Dashboard</h2>
            {/* --- FIX: Added Optional Chaining (?.) and Fallback --- */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Welcome back, {userData?.name || 'User'}
            </p>
          </div>
          <div className="md:hidden">
             <h2 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">SleepStream</h2>
          </div>
        </div>

        {/* Right: Status, Controls & Profile */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button> */}
          
          <NotificationBell />
          

          {/* Avatar (First letter of name or 'U') */}
          <div className="h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:bg-blue-700 transition-colors">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <span>Sleep Stream</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
               <button 
                 onClick={handleLogout} 
                 disabled={isLoggingOut}
                 className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition w-full px-4 py-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
               >
                  {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                  <span className="font-medium text-sm">{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}