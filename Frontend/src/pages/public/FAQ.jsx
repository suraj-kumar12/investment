import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Are the returns on this platform real or guaranteed?',
      a: 'No. This is a portfolio/demo fintech project. All interest returns, rate percentages (8%, 10%, 12%), and maturity values are projected demo values for presentation purposes.',
    },
    {
      q: 'When do I receive my $100 referral reward?',
      a: 'You receive $100 ONLY after an eligible user registered with your referral code completes a successful payment/investment. Registration alone yields $0.',
    },
    {
      q: 'What happens if a referred user registers but payment is pending?',
      a: 'The referral status will display "Payment Pending" and your reward will remain $0 until payment status transitions to "SUCCESSFUL".',
    },
    {
      q: 'Can the same referred user generate multiple $100 rewards?',
      a: 'No. The referral rule limits rewards to the first eligible payment per referred user to prevent duplicate crediting.',
    },
    {
      q: 'Is real money connected to the payment options?',
      a: 'No real payment gateways are connected. The payment screen uses a mock payment processing simulator.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          Knowledge Base
        </span>
        <h1 className="text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-400 text-sm">Everything you need to know about plans, returns, and referral rules.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-800 transition-all duration-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/40 transition-colors"
              >
                <span className="text-base font-bold text-white flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  {faq.q}
                </span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
