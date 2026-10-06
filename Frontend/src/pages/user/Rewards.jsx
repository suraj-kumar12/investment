import React, { useState, useEffect } from 'react';
import { Gift, Award, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { rewardService } from '../../services/rewardService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Rewards = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useData();

  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rwds = await rewardService.getRewards(user?.id);
        const rStats = await rewardService.getRewardStats(user?.id);
        setRewards(rwds);
        setStats(rStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, refreshTrigger]);

  if (loading) return <Skeleton type="table" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Reward Ledger</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detailed history of credited referral rewards and pending referral bonuses.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard
  title="Total Rewards"
  value={formatCurrency(stats?.totalRewards ?? 0)}
  subtitle="All Earned Bonuses"
  icon={Gift}
  color="indigo"
/>

<StatCard
  title="Pending Rewards"
  value={formatCurrency(stats?.pendingRewards ?? 0)}
  subtitle="Awaiting Referred Payment"
  icon={Clock}
  color="amber"
/>

<StatCard
  title="Credited Rewards"
  value={formatCurrency(stats?.creditedRewards ?? 0)}
  subtitle="Wallet Credited"
  icon={CheckCircle2}
  color="emerald"
/>
      </div>

      {/* Reward Notice Box */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          Rewards are unlocked and credited strictly upon verified eligible payment completion.
        </span>
      </div>

      {/* Reward Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Credited Rewards History</h3>

        {rewards.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="No Credited Rewards Yet"
            description="Invite friends to invest. Once their payment is verified, your $1.20 reward will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Referred User</th>
                  <th className="py-3.5 px-4">Eligible Payment Ref</th>
                  <th className="py-3.5 px-4">Reward Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {rewards.map((rwd) => (
                  <tr key={rwd.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(rwd.date)}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{rwd.referredName}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-400">{rwd.eligiblePaymentId}</td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400">+{formatCurrency(rwd.rewardAmount)}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={rwd.status}>{rwd.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
