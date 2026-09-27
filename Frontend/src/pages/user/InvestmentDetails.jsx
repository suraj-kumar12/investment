import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Calendar, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { useToast } from '../../context/ToastContext';

export const InvestmentDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const inv = await investmentService.getInvestmentById(id);
        setInvestment(inv);
      } catch (err) {
        showToast('Investment not found', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Skeleton type="card" />;
  if (!investment) return <p className="text-slate-400">Investment record not found.</p>;

  const timelineSteps = [
    { label: 'Started', percent: 0, completed: true, date: investment.startDate },
    { label: '25% Progress', percent: 25, completed: (investment.progressPercent || 0) >= 25 },
    { label: '50% Halfway', percent: 50, completed: (investment.progressPercent || 0) >= 50 },
    { label: '75% Maturity', percent: 75, completed: (investment.progressPercent || 0) >= 75 },
    { label: 'Full Maturity', percent: 100, completed: (investment.progressPercent || 0) >= 100, date: investment.maturityDate },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/investments">
          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Investment Details ({investment.id})</h1>
          <p className="text-xs text-slate-400">Complete performance breakdown and maturity tracker</p>
        </div>
      </div>

      {/* Main Breakdown Card */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Plan Tier</span>
            <h2 className="text-3xl font-extrabold text-white mt-0.5">{investment.planName} Plan</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={investment.paymentStatus}>{investment.paymentStatus}</Badge>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {investment.rate}% Demo Rate
            </span>
          </div>
        </div>

        {/* Core Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Principal Amount</span>
            <span className="text-xl font-bold text-white mt-1 block">{formatCurrency(investment.amount)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Projected Profit</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">+{formatCurrency(investment.profit)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Maturity Value</span>
            <span className="text-xl font-black text-white mt-1 block">{formatCurrency(investment.maturityValue)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Maturity Date</span>
            <span className="text-sm font-semibold text-slate-300 mt-1 block">{formatDate(investment.maturityDate)}</span>
          </div>
        </div>

        {/* Visual Progress Timeline Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Investment Progress Timeline
            </h3>
            <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {investment.progressPercent || 5}% Completed
            </span>
          </div>

          <div className="relative py-8">
            {/* Timeline Horizontal Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${investment.progressPercent || 5}%` }}
              />
            </div>

            {/* Timeline Step Circles */}
            <div className="relative z-10 flex justify-between">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                      step.completed
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : `${step.percent}%`}
                  </div>
                  <span className="text-xs font-semibold text-slate-300 mt-2">{step.label}</span>
                  {step.date && <span className="text-[10px] text-slate-500 mt-0.5">{formatDate(step.date)}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Notice Disclaimer */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>All returns displayed are calculated based on fixed demo tier rate rules ({investment.rate}% per annum).</span>
        </div>
      </div>
    </div>
  );
};
