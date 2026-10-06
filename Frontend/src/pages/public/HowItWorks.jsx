import React from 'react';
import { Lock, PieChart, TrendingUp, Gift, ShieldCheck } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Create Account',
      description: 'Register securely with your name, email, and mobile number. Enter a referral code if invited.',
      icon: Lock,
    },
    {
      num: '02',
      title: 'Choose a Plan',
      description: 'Select an investment amount between $1,000 to $10,000+. View demo rates (8%, 10%, 12%).',
      icon: PieChart,
    },
    {
      num: '03',
      title: 'Track Investment',
      description: 'Monitor your investment timeline, projected maturity date, and estimated returns.',
      icon: TrendingUp,
    },
    {
      num: '04',
      title: 'Refer & Earn',
      description: 'Share your code. Receive multi-level referral rewards (5% Level 1, 3% Level 2, 2% Level 3, 1% Level 4) ONLY after an eligible referred payment completes.',
      icon: Gift,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          User Guide
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          How ApexInvest Works
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Understand the end-to-end flow of investing, tracking progress, and unlocking multi-level referral rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="glass-card p-8 rounded-3xl relative border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-indigo-500/30">{s.num}</span>
                <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
            </div>
          );
        })}
      </div>

      {/* Referral Flow Highlight Box */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Referral Verification Flow</h3>
            <p className="text-xs text-slate-400">Strict reward rules to prevent spam or duplicate crediting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-semibold">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            User A shares referral link
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            User B registers
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            User B selects Plan
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            User B completes payment
          </div>
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
            User A earns referral reward
          </div>
        </div>
      </div>
    </div>
  );
};
