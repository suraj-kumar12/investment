import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PlusCircle, Calendar, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Investments = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useData();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchInvs = async () => {
      setLoading(true);
      try {
        const data = await investmentService.getInvestments(user?.id);
        setInvestments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvs();
  }, [user?.id, refreshTrigger]);

  const filteredInvs = filter === 'ALL'
    ? investments
    : investments.filter((i) => i.paymentStatus.toUpperCase() === filter);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton type="table" />
        <Skeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">My Investments</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track portfolio progress, demo interest returns, and maturity schedules.
          </p>
        </div>
        <Link to="/dashboard/investments/new">
          <Button variant="emerald" icon={PlusCircle}>
            Create Investment
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        {['ALL', 'SUCCESSFUL', 'PENDING'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f === 'ALL' ? 'All Investments' : f === 'SUCCESSFUL' ? 'Active / Successful' : 'Pending Payment'}
          </button>
        ))}
      </div>

      {filteredInvs.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No investments found"
          description="You haven't created any investments under this filter yet."
          action={
            <Link to="/dashboard/investments/new">
              <Button variant="primary">Start Your First Investment</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInvs.map((inv) => (
            <div
              key={inv.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400">{inv.id}</span>
                  <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  4% Every 1st & 15th
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Plan Name</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{inv.planName || 'Standard Investment'}</h4>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Principal Amount</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{formatCurrency(inv.amount)}</h4>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Earned Interest</span>
                  <h4 className="text-base font-bold text-emerald-400 mt-0.5">+{formatCurrency(inv.earnedInterest || 0)}</h4>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Investment Bonus</span>
                  <h4 className="text-base font-bold text-cyan-400 mt-0.5">+{formatCurrency(inv.bonusAmount || 0)}</h4>
                </div>
              </div>

              {/* Progress Bar Timeline Teaser */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Duration Progress</span>
                  <span className="font-semibold text-indigo-300">{inv.progressPercent ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${inv.progressPercent ?? 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Matures: {formatDate(inv.maturityDate)}
                </span>

                {inv.paymentStatus === 'PENDING' ? (
                  <Link to={`/dashboard/payment/${inv.id}`}>
                    <Button variant="emerald" size="sm" icon={ArrowRight}>
                      Pay Now
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/dashboard/investments/${inv.id}`}>
                    <Button variant="outline" size="sm" icon={Eye}>
                      View Timeline
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
