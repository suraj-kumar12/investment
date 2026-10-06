import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INVESTMENT_PLANS, calculateInvestment } from '../../utils/investmentCalculator';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Calculator, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Plans = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [calcAmount, setCalcAmount] = useState('100');
  const calcResult = calculateInvestment(calcAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Investment Structure
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Standard Investment Plan
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Earn 4% simple interest on the 1st and 15th of every month (8% total monthly return).
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-xl mx-auto">
        {INVESTMENT_PLANS.map((plan) => (
          <div key={plan.id} className="glass-card rounded-3xl p-8 flex flex-col justify-between border border-indigo-500/30 space-y-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  4% Every 1st & 15th
                </span>
              </div>
              <p className="text-xs text-slate-400">{plan.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400">Minimum Investment</span>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(plan.minAmount)} +
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Interest Rate</span>
                <span className="text-emerald-400 font-bold">4% per payout cycle</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payout Schedule</span>
                <span className="text-white font-semibold">1st and 15th of every month</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                <span>Scheduled Monthly Rate</span>
                <span className="text-indigo-400 font-extrabold">8% Monthly</span>
              </div>
            </div>

            <Link to={isAuthenticated ? (isAdmin ? '/admin' : `/dashboard/investments/new?plan=${plan.id}`) : '/register'}>
              <Button variant="primary" className="w-full font-bold py-3.5">
                Start Investment Now
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Interactive Calculator Box */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-indigo-500/30 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Investment Returns Calculator</h3>
            <p className="text-xs text-slate-400">Enter your principal to calculate 4% payout per 15-day cycle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <Input
              label="Investment Principal ($)"
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(e.target.value)}
              placeholder="e.g. 100"
              error={!calcResult.isValid ? calcResult.error : null}
            />

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>• Payout 1 (1st of month): 4% simple interest</div>
              <div>• Payout 2 (15th of month): 4% simple interest</div>
              <div>• Total Scheduled Monthly Interest: 8%</div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Interest Rate:</span>
              <span className="font-bold text-emerald-400">4% per payout cycle</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Payout Dates:</span>
              <span className="font-bold text-indigo-300">1st & 15th of every month</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-3">
              <span className="text-slate-400">Cycle Payout (4%):</span>
              <span className="font-bold text-emerald-400">+{formatCurrency((Number(calcAmount) || 0) * 0.04)}</span>
            </div>
            <div className="flex justify-between items-center text-base border-t border-slate-800 pt-3">
              <span className="font-bold text-white">Est. Monthly Total (8%):</span>
              <span className="font-black text-2xl text-white">{formatCurrency((Number(calcAmount) || 0) * 0.08)}</span>
            </div>

            <Link to={isAuthenticated ? (isAdmin ? '/admin' : `/dashboard/investments/new?amount=${calcAmount}`) : '/register'}>
              <Button variant="emerald" className="w-full mt-2" icon={ArrowRight}>
                Invest {formatCurrency(calcAmount || 0)} Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
