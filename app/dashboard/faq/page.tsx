'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Send, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: "General",
      question: "How does Sleep Stream generate money?",
      answer: "Sleep Stream views ads using bots that act like humans. Your money is used to purchase ad inventory from Google Ads. The bots then watch these ads in the background, earning you a share of the advertising revenue. This is the best way to earn passive income."
    },
    {
      category: "Earnings",
      question: "Why is my capital locked for 10 days?",
      answer: "The 10-day lock-up period ensures stability in our ad-serving network. It allows the bots to complete a full verification cycle with advertisers. Once the cycle ends, your initial capital and your profits are returned to your wallet automatically. This helps us maintain consistent earnings for all users."
    },
    {
      category: "Earnings",
      question: "Can I upgrade my bot tier later?",
      answer: "Yes. You can activate a higher tier bot at any time. However, you cannot 'upgrade' an active running bot. You must wait for its 10-day cycle to finish, or simply purchase a new bot alongside your existing one."
    },
    {
      category: 'Earnings',
      question: 'Why are my earnings so small?',
      answer: "Your earnings are small because you are probably on tier 0. Tier 0 offers only one bot watching ads for you, which means it might only be getting one ad per 2 days. Increase your tier to purchase more bots."
    },
    {
      category: "Withdrawals",
      question: "What is the minimum withdrawal amount?",
      answer: "The minimum withdrawal amount is $15. This applies to both your Normal Balance and Referral Wallet."
    },
    {
      category: "Withdrawals",
      question: "How long do withdrawals take?",
      answer: "Withdrawals are automatically processed every Wednesday and Saturday at 12am. It typically takes 0-24 hours to reflect."
    },
    {
      category: "Referrals",
      question: "Do I need to deposit to earn referral bonuses?",
      answer: "No. You can earn referral bonuses even if you haven't purchased a bot yourself. However, you must have a valid bank account linked to withdraw your earnings."
    },
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* 1. HERO HEADER & SEARCH */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 dark:from-[#0B1120] dark:via-blue-950 dark:to-slate-950 rounded-[2.5rem] p-10 md:p-16 shadow-2xl overflow-hidden text-center border border-blue-500/20 dark:border-blue-500/10">
        
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 dark:bg-white/5 backdrop-blur-md text-blue-100 rounded-2xl mb-6 shadow-inner border border-white/20">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-blue-100/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Everything you need to know about automation, earnings, and managing your Sleep Stream account.
          </p>

          {/* Premium Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 md:py-5 bg-white dark:bg-[#0B1120] border-2 border-transparent focus:border-blue-500/50 rounded-2xl outline-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all text-lg font-medium"
            />
          </div>
        </div>
      </div>

      {/* 2. FAQ ACCORDION LIST */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-white/[0.08] rounded-[2rem] shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="transition-colors duration-300 bg-transparent">
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors focus:outline-none group"
                  >
                    <span className={`font-bold text-lg tracking-tight transition-colors duration-300 pr-8 ${
                      isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}>
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-full transition-transform duration-300 shrink-0 ${isOpen ? 'bg-blue-50 dark:bg-blue-500/10 rotate-180' : 'bg-slate-50 dark:bg-white/[0.05] group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10'}`}>
                      <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`} />
                    </div>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-8 text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full mb-4">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
              <p className="text-slate-500 dark:text-slate-400">We couldn't find any FAQs matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. PREMIUM SUPPORT CTA */}
      <div className="bg-white dark:bg-[#0B1120] border border-slate-200/80 dark:border-white/[0.08] rounded-[2rem] p-8 md:p-12 text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Still need assistance?</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Our support team is available around the clock to help you with any specific issues or account inquiries.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 font-bold transition-colors">
              <Send className="w-4 h-4" /> Telegram Support
            </button>
            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 font-bold transition-colors">
              <MessageCircle className="w-5 h-5" /> WhatsApp Support
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}