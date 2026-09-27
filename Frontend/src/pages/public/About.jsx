import React from 'react';
import { Shield, Target, Users, Zap, CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          About ApexInvest
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Empowering Next-Gen Demo Investors
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          ApexInvest is a portfolio-grade fintech demonstration application designed to showcase real-time financial modeling and referral incentive mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Provide transparent financial growth simulations and referral tracking tools without complex banking overhead.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Strict Compliance UX</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            All return values are labeled as projected demo metrics. Referral rewards require verified payment completion before unlocking.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="p-3 w-fit rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Real-Time Simulation</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Experience state synchronization across investor portfolios, transaction logs, and administrative controls.
          </p>
        </div>
      </div>
    </div>
  );
};
