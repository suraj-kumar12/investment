import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Gift, Info } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Description */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Apex<span className="text-indigo-400">Invest</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern fintech demo platform enabling users to track simulated investments and earn referral rewards seamlessly.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Demo / Portfolio Simulation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link>
            <Link to="/plans" className="text-sm hover:text-white transition-colors">Investment Plans</Link>
            <Link to="/how-it-works" className="text-sm hover:text-white transition-colors">How It Works</Link>
          </div>

          {/* Legal & Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Information</h4>
            <Link to="/faq" className="text-sm hover:text-white transition-colors">Frequently Asked Questions</Link>
            <Link to="/contact" className="text-sm hover:text-white transition-colors">Support & Contact</Link>
            <Link to="/register" className="text-sm hover:text-white transition-colors text-indigo-400 font-medium">Create Account</Link>
          </div>

          {/* Referral Notice Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Referral Structure</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn multi-level referral commissions (<strong className="text-emerald-400 font-bold">5% Level 1, 3% Level 2, 2% Level 3, 1% Level 4</strong>) after eligible payment verification succeeds. Registration alone returns $0.
            </p>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>All investment returns and referral rewards shown on this platform are for demonstration and projected display purposes only.</span>
          </div>
          <div>© {new Date().getFullYear()} ApexInvest Demo Platform. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
