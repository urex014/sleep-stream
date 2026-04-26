'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Send, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: "General",
      question: "How does Sleep Stream generate money?",
      answer: "Sleep Stream generates revenue through advertising partnerships and user registration fees. This sustainable model allows us to share profits directly with our community for their engagement."
    },
    {
      category: "Earnings",
      question: "How do I earn money on the platform?",
      answer: "You can earn money by watching video ads and inviting new users through our referral program. Additional earning methods, such as PTC (Pay-To-Click) tasks and links, will be introduced in upcoming updates."
    },
    {
      category: "Withdrawals",
      question: "What is the minimum withdrawal amount?",
      answer: "The minimum withdrawal threshold depends on the wallet you are withdrawing from: it is ₦20,000 for your Ads Wallet (earnings from viewing ads) and ₦12,000 for your Referral Wallet (earnings from inviting friends)."
    },
    {
      category: "Withdrawals",
      question: "When are withdrawals processed?",
      answer: "Withdrawal requests are automatically processed and disbursed to your account on weekends. All withdrawal requests should be made during the week."
    },
    {
      category: "Referrals",
      question: "How much can I earn per referral?",
      answer: "You earn a fixed bonus of ₦1,800 for every active user you refer. For example, successfully referring just 7 friends will earn you ₦12,600."
    },
    {
      category: "General",
      question: "Can I post my own ads on Sleep Stream?",
      answer: "Yes, we offer advertising opportunities for businesses and individuals. Click on the post ads button in the watch ads page and follow the onscreen instructions."
    },
    {
      category: "Account Limit",
      question: "Why am I limited to 20 tasks per day?",
      answer: "We implement daily task limits to maintain a healthy, sustainable ecosystem for both our users and our advertisers. Advertisers pay for genuine engagement. If users were allowed to click hundreds of ads non-stop, the quality of that engagement drops, which harms the platform. By pacing the tasks, we ensure advertisers get real value, which in turn guarantees we can continue paying you reliably. Additionally, limits prevent automated bots from draining the reward pools."
    },
    {
      category: "General",
      question: "Can I also be a code vendor?",
      answer: "Yes, the vendor registration will be available to all eligible users in the coming weeks. As a code vendor, you can earn by selling activation codes by adding your own interest. To be a vendor you must have bought a tier and processed withdrawals twice."
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl min-w-screen bg-white mx-auto space-y-8 pb-20 font-sans text-slate-800 animate-in fade-in duration-500">

      {/* 1. HERO HEADER & SEARCH */}
      <div className="relative bg-white border border-slate-200 rounded-3xl p-10 md:p-14 text-center shadow-sm overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div>
          <Link href="/" className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400 absolute left-6 top-6 cursor-pointer hover:text-slate-600 transition-colors" />
          </Link>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-[#337ab7] rounded-2xl mb-6 shadow-sm border border-indigo-100">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Everything you need to know about earnings and managing your Sleepstream account.
          </p>

          {/* Modern Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl outline-none text-slate-900 font-medium placeholder-slate-400 transition-all text-base shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. FAQ ACCORDION LIST */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="group">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full flex items-center justify-between p-6 text-left transition-all duration-200 focus:outline-none ${
                      isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-bold text-base md:text-lg transition-colors pr-8 ${
                      isOpen ? 'text-[#337ab7]' : 'text-slate-900 group-hover:text-[#337ab7]'
                    }`}>
                      {faq.question}
                    </span>
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-50 transition-colors">
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? 'text-[#337ab7] rotate-180' : 'text-slate-400'
                      }`} />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-6 pt-2 pb-8 text-slate-500 text-sm md:text-base font-medium leading-relaxed bg-slate-50/50 border-t border-slate-50">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 px-6 bg-slate-50/50">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-500 font-medium">We couldn't find any FAQs matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. VIDEO GUIDE */}
      <div className="w-full bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
        <div className="rounded-2xl overflow-hidden w-full aspect-video bg-slate-100">
          <iframe 
            className="w-full h-full" 
            src="https://www.youtube.com/embed/hVw4mZyso9U" 
            title="Sleepstream Video Guide" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* 4. PREMIUM SUPPORT CTA */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">Still need assistance?</h3>
        <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
          Our dedicated support team is available around the clock to help you with any specific issues or account inquiries.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="https://t.me/Void0145" target="_blank" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#337ab7]hover:border-indigo-200 hover:bg-indigo-50/50 font-bold transition-all shadow-sm active:scale-95">
              <Send className="w-5 h-5 text-indigo-500" /> Telegram Support
            </button>
          </Link>
          <Link href="mailto:sleepstreamngn@zohomail.com" target="_blank" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#337ab7] border border-[#337ab7] text-white hover:bg-[#286090] hover:border-[#337ab7] font-bold transition-all shadow-sm active:scale-95">
              <MessageCircle className="w-5 h-5" /> Email Support
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}