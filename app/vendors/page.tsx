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
  ChevronRight,
  Zap,
  Copy,
  Mail
} from 'lucide-react';
import Link from 'next/link';

// 1. Import dynamic from Next.js
import dynamic from 'next/dynamic';

// 2. Safely import PaystackButton so it ONLY loads in the browser
const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Auto-Purchase State
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isProcessingCode, setIsProcessingCode] = useState(false);
  const [purchasedCode, setPurchasedCode] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [copied, setCopied] = useState(false);

  const CODE_PRICE = 5000;

  const handlePaystackSuccess = async (reference: any) => {
    setIsProcessingCode(true);
    setPurchaseError('');

    try {
      const res = await fetch('/api/codes/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: reference.reference, email: buyerEmail })
      });
      const data = await res.json();

      if (data.success) {
        setPurchasedCode(data.code);
        
        // --- NEW: SAVE CODE TO BROWSER FOR AUTO-FILL ---
        if (typeof window !== 'undefined') {
          localStorage.setItem('sleepstream_activation_code', data.code);
        }
        // -----------------------------------------------
        
      } else {
        setPurchaseError(data.message || 'Failed to retrieve code.');
      }
    } catch (error) {
      setPurchaseError('Network error while retrieving code. Please contact support with your payment reference.');
    } finally {
      setIsProcessingCode(false);
    }
  };

  const handlePaystackClose = () => {
    console.log('Payment closed');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchasedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- FETCH REAL VENDORS ---
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

    const delayDebounceFn = setTimeout(() => fetchVendors(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Props for the dynamic Paystack Button
  const paystackProps = {
    email: buyerEmail,
    amount: CODE_PRICE * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    text: `Pay ₦${CODE_PRICE.toLocaleString()}`,
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#333333] font-sans selection:bg-[#337ab7] selection:text-white pb-20">

      <div className="max-w-5xl mx-auto px-6 py-12">

        <Link href="/signup" className="inline-flex items-center text-[#337ab7] hover:text-[#23527c] text-sm mb-8 font-bold hover:underline transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Signup
        </Link>

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5f5f5] text-[#337ab7] rounded-full mb-2 border border-[#dddddd] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight">
            Activation Codes
          </h1>
          <p className="text-lg text-[#666666] leading-relaxed font-medium">
            Purchase your activation code instantly via card or bank transfer, or securely through our list of trusted manual vendors.
          </p>
        </div>

        {/* --- INSTANT AUTO-PURCHASE SECTION --- */}
        <div className="bg-white border-t-[5px] border-t-[#5cb85c] border-x border-b border-[#cccccc] rounded shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 max-w-2xl mx-auto mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-b from-[#dff0d8] to-[#c8e5bc] rounded shadow-[inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center border border-[#d6e9c6]">
              <Zap className="w-5 h-5 text-[#3c763d]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#222222] tracking-tight">Instant Auto-Purchase</h2>
              <p className="text-sm text-[#555555] font-medium">Pay ₦{CODE_PRICE.toLocaleString()} securely with Paystack</p>
            </div>
          </div>

          {purchasedCode ? (
            <div className="bg-gradient-to-b from-[#f8fbf6] to-[#eef7ea] border-2 border-dashed border-[#5cb85c] rounded p-6 text-center animate-in zoom-in-95 duration-300 shadow-sm">
              <h3 className="text-[#3c763d] font-bold mb-2">Payment Successful! Your Code:</h3>
              <div className="bg-white border border-[#d6e9c6] text-[#222222] text-2xl font-mono font-extrabold py-4 px-6 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] tracking-widest flex items-center justify-between mb-4">
                <span>{purchasedCode}</span>
                <button
                  onClick={copyToClipboard}
                  className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white p-2 rounded transition-colors shadow-sm"
                  title="Copy Code"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-md text-[#555555] font-medium mb-4">Your code has been emailed to <span className="font-bold">{buyerEmail}</span>. Please check your inbox (and spam folder) for details.</p>
              <Link href="https://t.me/void0145">
                <button className="inline-flex items-center justify-center rounded border border-[#bcdff1] bg-gradient-to-b from-[#f4fbff] to-[#e6f4fb] px-4 py-2 text-sm font-bold text-[#337ab7] shadow-sm transition-all hover:border-[#8ec7e6] hover:from-[#eef8fe] hover:to-[#dff0f8] hover:text-[#23527c]">
                  click here for issues with activation code
                </button>
              </Link>
              <p className="text-sm text-[#555555] font-medium">
                Copy this code and return to the <Link href="/signup" className="text-[#337ab7] hover:underline font-bold">Signup Page</Link> to activate your account.
              </p>
            </div>
          ) : isProcessingCode ? (
            <div className="text-center py-10">
              <Loader2 className="w-10 h-10 text-[#5cb85c] animate-spin mx-auto mb-4" />
              <p className="text-[#555555] font-bold">Verifying payment & generating code...</p>
            </div>
          ) : (
            <div>
              {purchaseError && (
                <div className="bg-[#f2dede] border border-[#ebccd1] text-[#a94442] px-4 py-2.5 rounded text-sm mb-4 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                  {purchaseError}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#333333] mb-1.5" style={{ textShadow: '1px 1px 0px #ffffff' }}>Email Address for Receipt</label>
                <div className="relative flex rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] bg-white border border-[#b3b3b3]">
                  <div className="flex items-center justify-center px-3 bg-[#e6e6e6] border-r border-[#cccccc] rounded-l text-[#555555] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => {
                      setBuyerEmail(e.target.value);
                      setPurchaseError(''); // Clear error when typing
                    }}
                    placeholder="Enter email to begin..."
                    className="w-full bg-transparent text-[#333333] py-2.5 px-3 outline-none focus:bg-[#fafffa] font-medium"
                  />
                </div>
              </div>

              {/* Conditional rendering to prevent click without email */}
              {/* <div className="space-y-3 mt-4">
                <button
                  type="button"
                  disabled
                  className="w-full bg-[#eeeeee] border border-[#cccccc] text-[#999999] font-bold text-base py-3 rounded shadow-inner flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5 drop-shadow-sm" /> Auto-Purchase Currently Disabled
                </button>
                <div className="bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] px-4 py-3 rounded text-sm text-center font-bold shadow-sm">
                  Card payments are temporarily paused. Please scroll down to purchase manually from a verified vendor below!
                </div>
              </div> */}
              {buyerEmail && buyerEmail.includes('@') ? (
                <PaystackButton
                  {...paystackProps}
                
                  className="w-full bg-gradient-to-b from-[#5cb85c] via-[#4cae4c] to-[#419641] hover:from-[#47a447] hover:to-[#398439] border border-[#398439] text-white font-bold text-base py-3 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_5px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 transition-all active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.2)] active:translate-y-[1px] [text-shadow:0_-1px_0_rgba(0,0,0,0.3)]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPurchaseError("Please enter a valid email address first.")}
                  className="w-full bg-gradient-to-b from-[#5cb85c] via-[#4cae4c] to-[#419641] hover:from-[#47a447] hover:to-[#398439] border border-[#398439] text-white font-bold text-base py-3 rounded shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_5px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 transition-all active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.2)] active:translate-y-[1px]"
                  style={{ textShadow: '0 -1px 0 rgba(0,0,0,0.3)' }}
                >
                  <CreditCard className="w-5 h-5 drop-shadow-sm" /> Pay ₦{CODE_PRICE.toLocaleString()} 
                </button>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 max-w-2xl mx-auto">
          <div className="flex-1 border-t border-[#cccccc]"></div>
          <span className="text-[#999999] font-bold text-sm uppercase tracking-wider">OR BUY MANUALLY</span>
          <div className="flex-1 border-t border-[#cccccc]"></div>
        </div>

        {/* --- MANUAL VENDORS SECTION --- */}
         <div className="mb-8 flex justify-between items-end">
          <h2 className="text-xl font-bold text-[#222222]">Manual Vendors</h2>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-[#777777]" />
            </div>
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#cccccc] rounded focus:border-[#66afe9] outline-none text-[#333333] text-sm shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)]"
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
                      <div className="w-12 h-12 bg-gradient-to-b from-[#f5f5f5] to-[#e6e6e6] rounded flex items-center justify-center text-[#555555] font-extrabold text-xl border border-[#cccccc] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                        {vendor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#222222] flex items-center gap-1.5 text-base line-clamp-1">
                          {vendor.name}
                          {vendor.verified && <CheckCircle2 className="w-4 h-4 text-[#337ab7]" />}
                        </h3>
                        <div className="text-xs text-[#777777] mt-0.5 font-bold tracking-wide">
                          Rating: <strong className="text-[#f0ad4e]">{vendor.rating}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#f9f9f9] border border-[#eeeeee] px-2 py-1 rounded">
                      <span className={`w-2 h-2 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] ${vendor.status === 'Online' ? 'bg-[#5cb85c]' : vendor.status === 'Away' ? 'bg-[#f0ad4e]' : 'bg-[#d9534f]'}`}></span>
                      <span className="text-[10px] font-extrabold uppercase text-[#777777] tracking-widest">{vendor.status}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {vendor.methods.map((method: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-1 bg-[#fcfcfc] border border-[#dddddd] rounded text-[#666666] shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={vendor.status !== 'Offline' ? vendor.link : '#'}
                    target={vendor.status !== 'Offline' ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded font-bold text-sm flex items-center justify-center gap-2 border transition-all
                      ${vendor.status !== 'Offline'
                        ? 'bg-gradient-to-b from-[#337ab7] to-[#286090] hover:from-[#286090] hover:to-[#204d74] border-[#204d74] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.1)] text-shadow-sm'
                        : 'bg-[#eeeeee] border-[#cccccc] text-[#999999] cursor-not-allowed pointer-events-none shadow-inner'
                      }`}
                    style={vendor.status !== 'Offline' ? { textShadow: '0 -1px 0 rgba(0,0,0,0.3)' } : {}}
                  >
                    {vendor.platform === 'WhatsApp' && <MessageCircle className="w-4 h-4" />}
                    {vendor.platform === 'Website' && <ExternalLink className="w-4 h-4" />}
                    {vendor.platform === 'Telegram' && <Phone className="w-4 h-4" />}
                    {vendor.status !== 'Offline' ? `Message via ${vendor.platform}` : 'Currently Unavailable'}
                  </a>

                </div>
              ))}
            </div> 

            {vendors.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#dddddd] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                <Search className="w-10 h-10 text-[#cccccc] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#222222]">No vendors found</h3>
                <p className="text-[#666666] mt-1 font-medium">Try adjusting your search criteria.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-10 gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 bg-white border border-[#cccccc] rounded text-[#337ab7] hover:bg-[#eeeeee] disabled:opacity-50 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-bold text-[#555555] px-4">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 bg-white border border-[#cccccc] rounded text-[#337ab7] hover:bg-[#eeeeee] disabled:opacity-50 transition-colors">
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
              Only purchase codes from the verified methods listed on this page. Do not send money to anyone claiming to be a SleepStream admin on Telegram or Instagram. All valid codes must be entered on the signup page immediately after purchase.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
