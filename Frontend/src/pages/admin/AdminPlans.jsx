import React from 'react';
import { PieChart, Plus } from 'lucide-react';
import { INVESTMENT_PLANS } from '../../utils/investmentCalculator';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const AdminPlans = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Investment Plans Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Configure interest tiers, minimum investments, and demo rates.</p>
        </div>
        <Button variant="emerald" icon={Plus}>Add New Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INVESTMENT_PLANS.map((plan) => (
          <div key={plan.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {plan.rate}% Demo Rate
              </span>
            </div>
            <p className="text-xs text-slate-400">{plan.description}</p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Range:</span>
                <span className="text-white font-bold">{formatCurrency(plan.minAmount)} – {plan.maxAmount < 1000000 ? formatCurrency(plan.maxAmount) : '+'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="text-white">{plan.duration}</span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full mt-2">Edit Plan Parameters</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
