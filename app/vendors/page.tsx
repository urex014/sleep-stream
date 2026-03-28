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
    <div className="min-h-screen bg-[#f8f9fa] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Navigation */}
        <Link href="/signup" className="inline-flex items-center text-[#337ab7] hover:text-[#23527c] text-sm mb-8 font-bold hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Signup
        </Link>

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5f5f5] text-[#337ab7] rounded-full mb-2 border border-[#dddddd] shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#222222]">
            Verified Vendors
          </h1>
          <p className="text-lg text-[#666666] leading-relaxed">
            Purchase your activation code securely from our list of trusted partners.
            All vendors listed here are verified by SleepStream.
          </p>

          {/* Classic Search Bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-[#777777]" />
            </div>
            <input
              type="text"
              placeholder="Search by name or payment method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#cccccc] rounded focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] outline-none text-[#333333] transition-colors"
            />
          </div>
        </div>

        {/* VENDORS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border border-[#dddddd] rounded p-6 shadow-sm hover:border-[#bce8f1] transition-colors"
            >

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {/* Classic Square Avatar */}
                  <div className="w-12 h-12 bg-[#f5f5f5] rounded flex items-center justify-center text-[#666666] font-bold text-lg border border-[#dddddd]">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#222222] flex items-center gap-1.5">
                      {vendor.name}
                      {vendor.verified && <CheckCircle2 className="w-4 h-4 text-[#337ab7]" />}
                    </h3>
                    <div className="text-xs text-[#777777] mt-0.5">
                      Rating: <strong className="text-[#f0ad4e]">{vendor.rating}</strong>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${vendor.status === 'Online' ? 'bg-[#5cb85c]' : 'bg-[#999999]'}`}></span>
                  <span className="text-[10px] font-bold uppercase text-[#777777] tracking-wider">{vendor.status}</span>
                </div>
              </div>

              {/* Methods Badges */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {vendor.methods.map((method, idx) => (
                    <span key={idx} className="text-[10px] font-bold px-2 py-1 bg-[#f5f5f5] border border-[#cccccc] rounded text-[#666666]">
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={vendor.status === 'Online' ? vendor.link : '#'}
                target={vendor.status === 'Online' ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`w-full py-2.5 rounded font-bold text-sm flex items-center justify-center gap-2 border transition-colors
                  ${vendor.status === 'Online'
                    ? 'bg-[#5cb85c] hover:bg-[#449d44] border-[#4cae4c] text-white shadow-sm'
                    : 'bg-[#eeeeee] border-[#dddddd] text-[#999999] cursor-not-allowed pointer-events-none'
                  }`}
              >
                {vendor.platform === 'WhatsApp' && <MessageCircle className="w-4 h-4" />}
                {vendor.platform === 'Website' && <CreditCard className="w-4 h-4" />}
                {vendor.platform === 'Telegram' && <Phone className="w-4 h-4" />}
                {vendor.status === 'Online' ? `Buy via ${vendor.platform}` : 'Currently Unavailable'}
                {vendor.status === 'Online' && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
              </a>

            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#dddddd] rounded shadow-sm">
            <Search className="w-10 h-10 text-[#cccccc] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#222222]">No vendors found</h3>
            <p className="text-[#666666] mt-1">Try adjusting your search criteria.</p>
          </div>
        )}

        {/* SECURITY NOTE (Classic Bootstrap .alert-info) */}
        <div className="mt-12 bg-[#d9edf7] border border-[#bce8f1] rounded p-6 flex items-start gap-4 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-[#31708f] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[#31708f] text-lg mb-1">Safety Verification</h4>
            <p className="text-sm text-[#31708f] leading-relaxed">
              Only purchase codes from the vendors listed on this page. Do not send money to anyone claiming to be a SleepStream admin on Telegram or Instagram. All valid codes must be entered on the signup page immediately after purchase.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}