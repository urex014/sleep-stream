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
  <h2 className="text-xl font-bold text-[#222222] mb-3">1. Introduction</h2>
  <p>
    Welcome to Sleepstream. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform to view ads, participate in surveys, and manage your earnings.
  </p>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">2. Information We Collect</h2>
  <p>To provide and improve our services, we collect the following types of information:</p>
  <ul className="list-disc pl-5 space-y-2 marker:text-[#337ab7]">
    <li><strong>Personal Identification Data:</strong> Your username, email address, and account password.</li>
    <li><strong>Financial Data:</strong> Nigerian local bank account details or cryptocurrency wallet addresses provided strictly for the purpose of processing your withdrawals.</li>
    <li><strong>Automatically Collected Data:</strong> When you access the platform, we automatically collect your IP address, browser type, device identifiers, and operating system. This is required to verify ad views and prevent fraudulent activity.</li>
  </ul>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">3. How We Use Your Information</h2>
  <p>We use the information we collect to operate, maintain, and secure the Sleepstream ecosystem. Specifically, we use your data to:</p>
  <ul className="list-disc pl-5 space-y-2 marker:text-[#337ab7]">
    <li>Create and manage your user account.</li>
    <li>Process your account upgrades, tier purchases, and withdrawal requests.</li>
    <li>Serve targeted market research surveys and advertisements based on demographic eligibility.</li>
    <li>Detect and prevent fraud, including the use of automated bots, VPNs, and multiple account abuse.</li>
    <li>Send you administrative emails regarding payouts, platform updates, and security alerts.</li>
  </ul>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">4. How We Share Your Information</h2>
  <p>We do not sell your personal data. We only share your information with trusted third parties necessary to run our platform:</p>
  <ul className="list-disc pl-5 space-y-2 marker:text-[#337ab7]">
    <li><strong>Payment Processors:</strong> We use Paystack to securely process card payments and fiat withdrawals. Your financial data is securely transmitted to them to facilitate transactions.</li>
    <li><strong>Market Research Partners:</strong> To provide you with earning opportunities, we share anonymized or pseudonymized identifiers (such as a generic User ID) with survey partners like CPX Research.</li>
    <li><strong>Legal Obligations:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
  </ul>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">5. Cookies and Tracking Technologies</h2>
  <p>
    Sleepstream utilizes cookies and similar tracking technologies to maintain your active session, track referral links, and verify the completion of ad views. Our advertising and survey partners may also use cookies to track your progress and prevent you from completing the same task twice. You can instruct your browser to refuse cookies, but doing so may prevent you from earning rewards on the platform.
  </p>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">6. Data Security</h2>
  <p>
    We implement industry-standard security measures, including encryption and secure server hosting, to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal data, we cannot guarantee its absolute security.
  </p>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">7. Your Data Privacy Rights</h2>
  <p>Depending on your jurisdiction, you have the right to:</p>
  <ul className="list-disc pl-5 space-y-2 marker:text-[#337ab7]">
    <li>Request access to the personal data we hold about you.</li>
    <li>Request the correction of inaccurate or incomplete data.</li>
    <li>Request the deletion of your account and associated personal data.</li>
  </ul>
  <p className="mt-2">
    To exercise any of these rights, please contact us using the information below.
  </p>
</section>

<section>
  <h2 className="text-xl font-bold text-[#222222] mb-3">8. Contact Us</h2>
  <p>
    If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact our support team at:
  </p>
  <p className="mt-2 font-bold text-[#337ab7]">
    sleepstreamngn@zohomail.com
  </p>
</section>

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