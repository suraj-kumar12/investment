import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Copy,
  Users,
  PieChart,
  Lock,
  Sparkles,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { INVESTMENT_PLANS } from '../../utils/investmentCalculator';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const Home = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const demoReferralCode = 'SUR123';
  const demoReferralLink = `${window.location.origin}/register?ref=${demoReferralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(demoReferralCode);
    setCopiedCode(true);
    showToast('Referral code SUR123 copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(demoReferralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const steps = [
    {
      step: '01',
      title: 'Create Account',
      description: 'Sign up securely in less than 2 minutes with basic information.',
      icon: Lock,
    },
    {
      step: '02',
      title: 'Choose a Plan',
      description: 'Select your preferred investment tier from $12 to $120+.',
      icon: PieChart,
    },
    {
      step: '03',
      title: 'Track Investment',
      description: 'Monitor your projected returns and maturity timeline live.',
      icon: TrendingUp,
    },
    {
      step: '04',
      title: 'Refer & Earn',
      description: 'Share your link and receive $1.20 after an eligible referred payment completes.',
      icon: Gift,
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Fintech Portfolio Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Invest. Track. <br />
                <span className="text-gradient-primary">Grow.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Manage your investment portfolio and referral rewards from one simple dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto">
                    Start Investing
                  </Button>
                </Link>
                <Link to="/plans" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    View Investment Plans
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Instant Demo Calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-indigo-400" />
                  <span>$1.20 Referral Reward Engine</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="glass-card rounded-3xl p-6 relative border border-slate-700/80 shadow-2xl space-y-6 glow-indigo">
                  {/* Mock Dashboard Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white font-bold">
                        AI
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Apex Portfolio Overview</h4>
                        <span className="text-xs text-slate-400">Demo User Account</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  {/* Portfolio Stat Mini Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium">Total Investment</span>
                      <p className="text-xl font-bold text-white mt-1">$300</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-xs text-slate-400 font-medium">Projected Maturity</span>
                      <p className="text-xl font-bold text-emerald-400 mt-1">$336</p>
                    </div>
                  </div>

                  {/* Referral Progress Mini Box */}
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-indigo-300">Referral Reward Status</span>
                      <p className="text-sm font-bold text-white mt-0.5">Rahul Sharma (Payment Verified)</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      +$1.20 Credited
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Step-by-Step Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Start your investment journey and earn referral rewards in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="glass-card glass-card-hover p-8 rounded-3xl relative flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-indigo-500/40">{s.step}</span>
                    <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- INVESTMENT PLANS ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Investment Plans
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Select an investment tier tailored to your portfolio goals. All yields are calculated on a demo 1-year annual return model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {INVESTMENT_PLANS.map((plan) => {
            const sampleAmount = plan.minAmount;
            const profit = (sampleAmount * plan.rate) / 100;
            const maturity = sampleAmount + profit;

            return (
              <div
                key={plan.id}
                className={`glass-card rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  plan.isPopular ? 'border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 scale-105 z-10' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-xs font-medium text-slate-400">Investment Range</span>
                    <div className="text-xl font-extrabold text-white">
                      {formatCurrency(plan.minAmount)} {plan.maxAmount < 10000 ? `– ${formatCurrency(plan.maxAmount)}` : '+'}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Demo Return Rate</span>
                      <span className="font-bold text-emerald-400">{plan.rate}% Annual</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Duration</span>
                      <span className="font-medium text-slate-200">{plan.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t border-slate-800 pt-3">
                      <span className="text-slate-400">Sample Profit ({formatCurrency(sampleAmount)})</span>
                      <span className="font-bold text-indigo-400">+{formatCurrency(profit)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Sample Maturity</span>
                      <span className="font-extrabold text-white">{formatCurrency(maturity)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Link to="/register">
                    <Button variant={plan.isPopular ? 'primary' : 'secondary'} className="w-full">
                      Invest Now
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- REFERRAL SECTION ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-indigo-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                Referral Program Rules
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Invite Friends. Earn <span className="text-gradient-emerald">$1.20 Demo Reward</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Invite friends using your referral link. When an eligible referred user successfully completes their payment/investment, you receive a $1.20 demo referral reward (equivalent to ₹100 INR).
              </p>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Rule Notice:</strong> Registration alone yields $0. Reward is credited strictly after payment verification succeeds.
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              {/* Copy Code Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Your Referral Code</span>
                <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
                  <span className="text-lg font-mono font-bold text-indigo-400">{demoReferralCode}</span>
                  <Button variant="secondary" size="sm" icon={Copy} onClick={handleCopyCode}>
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
              </div>

              {/* Copy Link Box */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Referral Link</span>
                <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono text-slate-300 truncate">{demoReferralLink}</span>
                  <Button variant="emerald" size="sm" icon={Copy} onClick={handleCopyLink}>
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
