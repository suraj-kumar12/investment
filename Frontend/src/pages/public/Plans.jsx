import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INVESTMENT_PLANS, calculateInvestment } from '../../utils/investmentCalculator';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Calculator, ArrowRight } from 'lucide-react';

export const Plans = () => {
  const [calcAmount, setCalcAmount] = useState('120');
  const calcResult = calculateInvestment(calcAmount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Demo Investment Plans
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Flexible Growth Tiers
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Choose a tier or use our live demo calculator below to preview your 1-year projected maturity value.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INVESTMENT_PLANS.map((plan) => {
          const sampleAmount = plan.minAmount;
          const profit = (sampleAmount * plan.rate) / 100;
          const maturity = sampleAmount + profit;

          return (
            <div key={plan.id} className="glass-card rounded-3xl p-8 flex flex-col justify-between border border-slate-800 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {plan.rate}% Demo Return
                  </span>
                </div>
                <p className="text-xs text-slate-400">{plan.description}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-xs text-slate-400">Investment Range</span>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(plan.minAmount)} {plan.maxAmount < 10000 ? `– ${formatCurrency(plan.maxAmount)}` : '+'}
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Duration</span>
                  <span className="text-white">{plan.duration}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Est. Profit ({formatCurrency(sampleAmount)})</span>
                  <span className="text-indigo-400 font-bold">+{formatCurrency(profit)}</span>
                </div>
                <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-2">
                  <span>Est. Maturity</span>
                  <span className="text-white font-extrabold">{formatCurrency(maturity)}</span>
                </div>
              </div>

              <Link to="/register">
                <Button variant="primary" className="w-full">
                  Invest Now
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Interactive Calculator Box */}
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-indigo-500/30 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Live Investment Returns Preview</h3>
            <p className="text-xs text-slate-400">Enter an amount to see applicable plan & projected profit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <Input
              label="Investment Amount ($)"
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(e.target.value)}
              placeholder="e.g. 120"
              error={!calcResult.isValid ? calcResult.error : null}
            />

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>Rule 1: $12 – $60 (₹1,000–₹4,999 equiv) → 8% Annual</div>
              <div>Rule 2: $60 – $120 (₹5,000–₹9,999 equiv) → 10% Annual</div>
              <div>Rule 3: $120+ (₹10,000+ equiv) → 12% Annual</div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Applicable Plan:</span>
              <span className="font-bold text-indigo-400">{calcResult.planName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Demo Rate:</span>
              <span className="font-bold text-emerald-400">{calcResult.rate}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Projected 1-Yr Profit:</span>
              <span className="font-bold text-emerald-400">+{formatCurrency(calcResult.profit)}</span>
            </div>
            <div className="flex justify-between items-center text-base border-t border-slate-800 pt-3">
              <span className="font-bold text-white">Projected Maturity:</span>
              <span className="font-black text-2xl text-white">{formatCurrency(calcResult.maturityValue)}</span>
            </div>

            <Link to="/register">
              <Button variant="emerald" className="w-full mt-2" icon={ArrowRight}>
                Proceed with {formatCurrency(calcAmount || 0)}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
