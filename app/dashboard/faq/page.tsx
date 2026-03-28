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
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans text-[#333333]">

      {/* 1. HERO HEADER & SEARCH (Classic Jumbotron Style) */}
      <div className="bg-[#337ab7] border border-[#2e6da4] rounded shadow-sm p-10 md:p-14 text-center text-white">

        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#286090] border border-[#1e4b73] text-white rounded-full mb-4 shadow-sm">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          How can we help?
        </h1>
        <p className="text-[#c4e3f3] text-base max-w-xl mx-auto mb-8">
          Everything you need to know about automation, earnings, and managing your Sleep Stream account.
        </p>

        {/* Classic Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-[#999999]" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#cccccc] focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] rounded outline-none text-[#333333] placeholder-[#999999] transition-all text-base shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>

      {/* 2. FAQ ACCORDION LIST (Classic Bootstrap Panel Group) */}
      <div className="bg-white border border-[#dddddd] rounded shadow-sm">
        <div className="divide-y divide-[#dddddd]">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="bg-white">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-colors focus:outline-none ${isOpen ? 'bg-[#f5f5f5]' : 'hover:bg-[#f9f9f9]'
                      }`}
                  >
                    <span className={`font-bold text-base transition-colors pr-8 ${isOpen ? 'text-[#337ab7]' : 'text-[#333333]'
                      }`}>
                      {faq.question}
                    </span>
                    <div className="shrink-0">
                      <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'text-[#337ab7] rotate-180' : 'text-[#999999]'
                        }`} />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out bg-white ${isOpen ? 'max-h-[500px] border-t border-[#eeeeee]' : 'max-h-0'
                      }`}
                  >
                    <div className="p-6 text-[#666666] text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 px-6 bg-[#f9f9f9]">
              <Search className="w-10 h-10 text-[#cccccc] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#222222] mb-1">No results found</h3>
              <p className="text-[#666666]">We couldn't find any FAQs matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. PREMIUM SUPPORT CTA (Classic Well/Panel) */}
      <div className="bg-[#f9f9f9] border border-[#dddddd] rounded p-8 md:p-10 text-center shadow-sm">
        <h3 className="text-xl font-bold text-[#222222] mb-2">Still need assistance?</h3>
        <p className="text-[#666666] mb-8 max-w-md mx-auto text-sm">
          Our support team is available around the clock to help you with any specific issues or account inquiries.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-white border border-[#cccccc] text-[#333333] hover:bg-[#e6e6e6] hover:border-[#adadad] font-bold transition-colors shadow-sm text-sm">
            <Send className="w-4 h-4 text-[#337ab7]" /> Telegram Support
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#5cb85c] border border-[#4cae4c] text-white hover:bg-[#449d44] font-bold transition-colors shadow-sm text-sm">
            <MessageCircle className="w-4 h-4" /> WhatsApp Support
          </button>
        </div>
      </div>

    </div>
  );
}