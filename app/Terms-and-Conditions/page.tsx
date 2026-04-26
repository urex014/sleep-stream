'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  const lastUpdated = "April 26, 2026";

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#333333] font-sans pb-24">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-[#eeeeee] pt-12 pb-8 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-[#999999] hover:text-[#337ab7] text-sm font-bold transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#337ab7]/10 text-[#337ab7] flex items-center justify-center border border-[#337ab7]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#222222] tracking-tight">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-sm text-[#666666] font-medium mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* --- CONTENT PROSE --- */}
      <div className="max-w-3xl mx-auto px-6 mt-10">
        <div className="prose prose-slate max-w-none text-[#555555] leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-[#222222] mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using the Sleepstream platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#222222] mb-3">2. Earning Mechanisms & Limits</h2>
            <ul className="list-disc pl-5 space-y-2 marker:text-[#337ab7]">
              <li><strong>Daily Limits:</strong> Users are strictly limited to a maximum number of daily tasks (e.g., 20 tasks per day) to preserve network quality.</li>
              <li><strong>Third-Party Surveys:</strong> Rewards from survey partners are subject to their own validation. Rushing, failing attention checks, or providing inconsistent answers may result in chargebacks and reversed earnings.</li>
              <li><strong>Anti-Fraud:</strong> The use of VPNs, automated bots, multiple accounts, or ad-blockers to manipulate tasks is strictly prohibited and will result in immediate account termination.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#222222] mb-3">3. Withdrawals and Payouts</h2>
            <p>
              Withdrawal requests are processed during the weekend. You are solely responsible for providing accurate destination details. <strong>We are not liable for funds lost due to incorrect cryptocurrency wallet addresses or mismatched blockchain networks.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#222222] mb-3">4. Vendor Program</h2>
            <p>
              Approved Activation Code Vendors operate as independent contractors. Vendors are permitted to add their own markup to wholesale codes but must adhere to our fair pricing guidelines.
            </p>
          </section>

          {/* Add more sections as needed */}

        </div>

        {/* --- FOOTER CTA --- */}
        <div className="mt-16 pt-8 border-t border-[#eeeeee]">
          <p className="text-sm text-[#666666] font-medium">
            Have questions about these terms? <Link href="mailto:sleepstreamngn@zohomail.com" className="text-[#337ab7] hover:text-[#286090] font-bold underline decoration-2 underline-offset-2">Contact Support</Link>
          </p>
        </div>
      </div>

    </div>
  );
}