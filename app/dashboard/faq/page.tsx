'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail, HelpCircle } from 'lucide-react';

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
      answer: "The 10-day lock-up period ensures stability in our ad-serving network. It allows the bots to complete a full verification cycle with advertisers. Once the cycle ends, your initial capital and your profits are returned to your wallet automatically. This helps us maintain consistent earnings for all users"
    },
    {
      category: "Earnings",
      question: "Can I upgrade my bot tier later?",
      answer: "Yes. You can activate a higher tier bot at any time. However, you cannot 'upgrade' an active running bot. You must wait for its 10-day cycle to finish, or simply purchase a new bot alongside your existing one."
    },
    {
      category: 'Earnings',
      question: 'Why are my earnings so small?',
      answer:"Your earnings are small, because you are probably on tier 0. Tier 0 offers only one bot watching ads for you. which means it might only be getting one ad per 2 days. Increase your tier to purchase more bots."

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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl mb-2">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Everything you need to know about automation, earnings, and withdrawals.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-800 border rounded-xl overflow-hidden transition-all duration-200 ${
                openIndex === index 
                ? 'border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500/20' 
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-bold text-slate-800 dark:text-slate-200">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-0 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-700/50 mt-2">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 dark:text-slate-500">No matching results found.</p>
          </div>
        )}
      </div>

      {/* SUPPORT FOOTER */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mt-12 text-center">
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Can't find the answer you're looking for? Our team is here to help.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
            <Mail className="w-4 h-4" /> Telegram support
          </button>
          <button className="bg-green-600 hover:bg-green-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-100 dark:shadow-none">
            <MessageCircle className="w-4 h-4" /> Whatsapp
          </button>
        </div>
      </div>

    </div>
  );
}