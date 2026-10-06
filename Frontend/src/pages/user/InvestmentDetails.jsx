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
    { label: '25% Progress', percent: 25, completed: (investment.progressPercent ?? 0) >= 25 },
    { label: '50% Halfway', percent: 50, completed: (investment.progressPercent ?? 0) >= 50 },
    { label: '75% Maturity', percent: 75, completed: (investment.progressPercent ?? 0) >= 75 },
    { label: 'Full Maturity', percent: 100, completed: (investment.progressPercent ?? 0) >= 100, date: investment.maturityDate },
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
            <span className="text-xs font-semibold text-slate-400 uppercase">Investment Plan</span>
            <h2 className="text-3xl font-extrabold text-white mt-0.5">{investment.planName || 'Standard Investment'}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={investment.paymentStatus}>{investment.paymentStatus}</Badge>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              4% Every 1st & 15th
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
            <span className="text-xs text-slate-400 block">Earned Interest</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">+{formatCurrency(investment.earnedInterest || 0)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Investment Bonus</span>
            <span className="text-xl font-black text-cyan-400 mt-1 block">+{formatCurrency(investment.bonusAmount || 0)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Activation Date</span>
            <span className="text-sm font-semibold text-slate-300 mt-1 block">{formatDate(investment.startDate || investment.createdAt)}</span>
          </div>
        </div>

        {/* Schedule & Rate Info Box */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Interest Rate:</span>
            <span className="text-sm font-bold text-emerald-400">4% per payout cycle</span>
          </div>
          <div>
            <span className="text-slate-400 block">Payout Schedule:</span>
            <span className="text-sm font-bold text-indigo-300">1st & 15th of every month</span>
          </div>
          <div>
            <span className="text-slate-400 block">Scheduled Monthly Rate:</span>
            <span className="text-sm font-bold text-white">8% Monthly</span>
          </div>
        </div>

        {/* Notice Disclaimer */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Interest is calculated from original principal and credited on the 1st and 15th of every month via admin payout processing.</span>
        </div>
      </div>
    </div>
  );
};
