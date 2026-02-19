'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  MessageCircle, 
  CheckCircle2, 
  ChevronLeft,
  Store,
  CreditCard,
  Phone
} from 'lucide-react';
import Link from 'next/link';

export default function VendorsPage() {
  
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK VENDORS DATA ---
  const vendors = [
    { 
      id: 1, 
      name: "Crypto Exchange Naija", 
      methods: ["USDT", "BTC", "Bank Transfer"], 
      platform: "WhatsApp", 
      link: "https://wa.me/1234567890", 
      status: "Online", 
      rating: "4.9/5",
      verified: true 
    },
    { 
      id: 2, 
      name: "FastCodes Agent", 
      methods: ["Bank Transfer", "OPay", "PalmPay"], 
      platform: "Telegram", 
      link: "#", 
      status: "Online", 
      rating: "4.8/5",
      verified: true 
    },
    { 
      id: 3, 
      name: "Digital Solutions Ltd", 
      methods: ["Card Payment", "Bank Transfer"], 
      platform: "Website", 
      link: "#", 
      status: "Away", 
      rating: "4.7/5",
      verified: true 
    },
    { 
      id: 4, 
      name: "Sarah's Fintech Hub", 
      methods: ["Bank Transfer"], 
      platform: "WhatsApp", 
      link: "https://wa.me/0987654321", 
      status: "Online", 
      rating: "5.0/5",
      verified: true 
    },
    { 
      id: 5, 
      name: "Code Master", 
      methods: ["USDT", "Binance Pay"], 
      platform: "WhatsApp", 
      link: "https://wa.me/1122334455", 
      status: "Offline", 
      rating: "4.6/5",
      verified: true 
    },
  ];

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.methods.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        
        {/* Navigation */}
        <Link href="/signup" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-sm mb-12 transition font-medium group">
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Signup
        </Link>

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-3xl mb-4 border border-blue-100 dark:border-blue-800 shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Verified Vendors
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Purchase your activation code securely from our list of trusted partners. 
            All vendors listed here are verified by SleepStream.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or payment method..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/50 outline-none text-slate-800 dark:text-white shadow-lg shadow-slate-200/20 dark:shadow-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* VENDORS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group relative overflow-hidden"
            >
              {/* Status Indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${vendor.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{vendor.status}</span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg border border-slate-200 dark:border-slate-700">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {vendor.name} 
                    {vendor.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50 dark:fill-blue-900/50" />}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>Vendor Rating:</span>
                    <span className="font-bold text-amber-500">{vendor.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex flex-wrap gap-2">
                  {vendor.methods.map((method, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-400">
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <a 
                href={vendor.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                  ${vendor.status === 'Online' 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-50 shadow-lg shadow-slate-200 dark:shadow-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
              >
                {vendor.platform === 'WhatsApp' && <MessageCircle className="w-4 h-4" />}
                {vendor.platform === 'Website' && <CreditCard className="w-4 h-4" />}
                {vendor.platform === 'Telegram' && <Phone className="w-4 h-4" />}
                {vendor.status === 'Online' ? `Buy via ${vendor.platform}` : 'Currently Unavailable'} 
                {vendor.status === 'Online' && <ExternalLink className="w-3.5 h-3.5 opacity-70" />}
              </a>

            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No vendors found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria.</p>
          </div>
        )}

        {/* SECURITY NOTE */}
        <div className="mt-16 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Safety Verification</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
              Only purchase codes from the vendors listed on this page. Do not send money to anyone claiming to be a SleepStream admin on Telegram or Instagram. All valid codes must be entered on the signup page immediately after purchase.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}