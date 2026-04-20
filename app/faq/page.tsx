'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle, Send, HelpCircle, ArrowBigLeft } from 'lucide-react';
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
      answer: "Withdrawal requests are automatically processed and disbursed to your account on weekends. All withdrawal requests should be made during the week"
    },
    {
      category: "Referrals",
      question: "How much can I earn per referral?",
      answer: "You earn a fixed bonus of ₦1,800 for every active user you refer. For example, successfully referring just 7 friends will earn you ₦12,600."
    },
    {
      category:"General",
      question:"Can I post my own ads on Sleep Stream?",
      answer:"Yes, we offer advertising opportunities for businesses and individuals. Click on the post ads button in the watch ads page and follow the onscreen instructions "
    },
    {
      category:"Account Limit",
      question:"Why am I limited to 20 tasks per day?",
      answer: "We implement daily task limits to maintain a healthy, sustainable ecosystem for both our users and our advertisers.  Advertisers pay for genuine engagement.If users were allowed to click hundreds of ads non- stop, the quality of that engagement drops, which harms the platform.By pacing the tasks, we ensure advertisers get real value, which in turn guarantees we can continue paying you reliably.Additionally, limits prevent automated bots from draining the reward pools, keeping the platform fair for real humans."
    },
    
  ];

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-w-screen bg-white mx-auto space-y-8 pb-16 font-sans text-[#333333]">

      {/* 1. HERO HEADER & SEARCH (Classic Jumbotron Style) */}
      <div className="bg-[#337ab7] border border-[#2e6da4] rounded shadow-sm p-10 md:p-14 text-center text-white">
        <Link href="/" className="absolute top-4 left-4 p-2 rounded-full bg-[#286090] border border-[#1e4b73] text-white hover:bg-[#204d74] transition-colors">
          <ArrowBigLeft className='w-10 h-10'/>
        </Link>
        

        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#286090] border border-[#1e4b73] text-white rounded-full mb-4 shadow-sm">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          How can we help?
        </h1>
        <p className="text-[#c4e3f3] text-base max-w-xl mx-auto mb-8">
          Everything you need to know about earnings and managing your Sleep Stream account.
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
          <Link href="https://t.me/SLEEPSTREAMNG" target="_blank">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-white border border-[#cccccc] text-[#333333] hover:bg-[#e6e6e6] hover:border-[#adadad] font-bold transition-colors shadow-sm text-sm">
            <Send className="w-4 h-4 text-[#337ab7]" /> Telegram Support
          </button>
          </Link>
          
          <Link href="mailto:sleepstreamngn@zohomail.com" target="_blank">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#5cb85c] border border-[#4cae4c] text-white hover:bg-[#449d44] font-bold transition-colors shadow-sm text-sm">
            <MessageCircle className="w-4 h-4" /> Email Support
          </button>
          </Link>
        </div>
      </div>

    </div>
  );
}