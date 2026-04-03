/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  ChevronLeft,
  Store,
  CreditCard,
  Phone,
  Loader2,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- FETCH REAL VENDORS (With Pagination & Search) ---
  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/vendors?page=${currentPage}&limit=6&search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setVendors(data.vendors);
          setTotalPages(data.pagination.pages);
        }
      } catch (error) {
        console.error("Failed to load vendors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search so it doesn't fire on every single keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchVendors();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  // Handle Search Input (Reset to page 1 when typing)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white">

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Navigation */}
        <Link href="/signup" className="inline-flex items-center text-[#337ab7] hover:text-[#23527c] text-sm mb-8 font-bold hover:underline transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Signup
        </Link>

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5f5f5] text-[#337ab7] rounded-full mb-2 border border-[#dddddd] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight">
            Verified Vendors
          </h1>
          <p className="text-lg text-[#666666] leading-relaxed font-medium">
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
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#cccccc] rounded focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] outline-none text-[#333333] transition-all font-medium"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-[#337ab7] animate-spin" />
          </div>
        ) : (
          <>
            {/* VENDORS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <div
                  key={vendor._id || vendor.id}
                  className="bg-white border border-[#cccccc] rounded p-6 shadow-[0_2px_5px_rgba(0,0,0,0.05)] hover:border-[#bce8f1] hover:shadow-[0_4px_10px_rgba(49,112,143,0.1)] transition-all"
                >

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {/* Classic Square Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-b from-[#f5f5f5] to-[#e6e6e6] rounded flex items-center justify-center text-[#555555] font-extrabold text-xl border border-[#cccccc] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                        {vendor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#222222] flex items-center gap-1.5 text-base line-clamp-1">
                          {vendor.name}
                          {vendor.verified && <CheckCircle2 className="w-4 h-4 text-[#5cb85c]" />}
                        </h3>
                        <div className="text-xs text-[#777777] mt-0.5 font-bold tracking-wide">
                          Rating: <strong className="text-[#f0ad4e]">{vendor.rating}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-1.5 bg-[#f9f9f9] border border-[#eeeeee] px-2 py-1 rounded">
                      <span className={`w-2 h-2 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] ${vendor.status === 'Online' ? 'bg-[#5cb85c]' : vendor.status === 'Away' ? 'bg-[#f0ad4e]' : 'bg-[#d9534f]'}`}></span>
                      <span className="text-[10px] font-extrabold uppercase text-[#777777] tracking-widest">{vendor.status}</span>
                    </div>
                  </div>

                  {/* Methods Badges */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {vendor.methods.map((method: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-1 bg-[#fcfcfc] border border-[#dddddd] rounded text-[#666666] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={vendor.status !== 'Offline' ? vendor.link : '#'}
                    target={vendor.status !== 'Offline' ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded font-bold text-sm flex items-center justify-center gap-2 border transition-all
                      ${vendor.status !== 'Offline'
                        ? 'bg-gradient-to-b from-[#5cb85c] to-[#449d44] hover:from-[#47a447] hover:to-[#398439] border-[#398439] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.1)] text-shadow-sm'
                        : 'bg-[#eeeeee] border-[#cccccc] text-[#999999] cursor-not-allowed pointer-events-none shadow-inner'
                      }`}
                    style={vendor.status !== 'Offline' ? { textShadow: '0 -1px 0 rgba(0,0,0,0.3)' } : {}}
                  >
                    {vendor.platform === 'WhatsApp' && <MessageCircle className="w-4 h-4" />}
                    {vendor.platform === 'Website' && <CreditCard className="w-4 h-4" />}
                    {vendor.platform === 'Telegram' && <Phone className="w-4 h-4" />}
                    {vendor.status !== 'Offline' ? `Buy via ${vendor.platform}` : 'Currently Unavailable'}
                    {vendor.status !== 'Offline' && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
                  </a>

                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {vendors.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#dddddd] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <Search className="w-10 h-10 text-[#cccccc] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#222222]">No vendors found</h3>
                <p className="text-[#666666] mt-1 font-medium">Try adjusting your search criteria.</p>
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-10 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-[#cccccc] rounded text-[#337ab7] hover:bg-[#eeeeee] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-bold text-[#555555] px-4">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-[#cccccc] rounded text-[#337ab7] hover:bg-[#eeeeee] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-12 bg-gradient-to-b from-[#d9edf7] to-[#c4e3f3] border border-[#bce8f1] rounded p-6 flex items-start gap-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.05)]">
          <ShieldCheck className="w-6 h-6 text-[#31708f] shrink-0 mt-0.5 drop-shadow-sm" />
          <div>
            <h4 className="font-bold text-[#31708f] text-lg mb-1" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}>Safety Verification</h4>
            <p className="text-sm text-[#31708f] leading-relaxed font-medium">
              Only purchase codes from the vendors listed on this page. Do not send money to anyone claiming to be a SleepStream admin on Telegram or Instagram. All valid codes must be entered on the signup page immediately after purchase.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}