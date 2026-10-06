import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Gift,
  Activity,
  Award,
  Wallet,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { Skeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { refreshTrigger, refreshAll } = useData();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [payoutInfo, setPayoutInfo] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [payoutResult, setPayoutResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const [data, pInfo] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getPayoutInfo(),
        ]);
        setStats(data);
        setPayoutInfo(pInfo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [refreshTrigger]);

  const handleTriggerPayout = async () => {
    setSubmitting(true);
    try {
      const res = await adminService.processInterestPayout();
      setPayoutResult(res);
      setConfirmModalOpen(false);
      setResultModalOpen(true);
      showToast(res.message || 'Interest payout processed successfully!', 'success');
      const pInfo = await adminService.getPayoutInfo();
      setPayoutInfo(pInfo);
      if (refreshAll) refreshAll();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to process interest payout', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const rewardDistributionData = [
    { name: 'Referral Rewards', value: stats?.totalReferralRewards ?? 0, color: '#10b981' },
  ];

  const userGrowthData = stats?.userGrowthData || stats?.userGrowth || [
    { month: 'Jan', users: Math.max(0, Math.round((stats?.totalUsers || 0) * 0.2)) },
    { month: 'Feb', users: Math.max(0, Math.round((stats?.totalUsers || 0) * 0.4)) },
    { month: 'Mar', users: Math.max(0, Math.round((stats?.totalUsers || 0) * 0.6)) },
    { month: 'Apr', users: Math.max(0, Math.round((stats?.totalUsers || 0) * 0.8)) },
    { month: 'May', users: stats?.totalUsers || 0 },
  ];

  if (loading) return <Skeleton type="card" />;

  const pendingWalletCount = stats?.pendingWalletDeposits || 0;
  const pendingTotalCount = stats?.pendingPaymentsCount || 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Platform-wide financial metrics, user growth, and deposit proof review.</p>
        </div>
      </div>

      {/* Pending Wallet Deposit Alert Banner */}
      {pendingWalletCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                Pending Wallet Deposit Requests ({pendingWalletCount})
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                {pendingWalletCount} user deposit request(s) awaiting Admin screenshot proof inspection and balance credit.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/investments')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-md"
          >
            <span>Review & Approve Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Interest Payout Action Card */}
      <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Interest Payout</h2>
              <p className="text-xs text-slate-400">Scheduled 4% simple interest processing for 1st & 15th of month</p>
            </div>
          </div>
          <Button
            variant="emerald"
            onClick={() => setConfirmModalOpen(true)}
            className="font-bold shrink-0"
            disabled={!payoutInfo?.isPayoutDay}
          >
            Calculate & Credit Interest
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Payout Date</span>
            <span className="text-base font-extrabold text-white mt-1 block">
              {payoutInfo?.currentPayoutDate || 'N/A'}
            </span>
            <span className={`text-[11px] font-bold block mt-1 ${payoutInfo?.isPayoutDay ? 'text-emerald-400' : 'text-amber-400'}`}>
              {payoutInfo?.message || ''}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Scheduled Rate</span>
            <span className="text-base font-extrabold text-emerald-400 mt-1 block">
              4% per payout cycle
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              8% Scheduled Monthly Rate (1st & 15th)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Eligible Active Investments</span>
            <span className="text-base font-extrabold text-indigo-400 mt-1 block">
              {payoutInfo?.eligibleCount ?? 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Verified active portfolios
            </span>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="Registered Investor Accounts"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Wallet Deposits"
          value={formatCurrency(stats?.totalWalletDepositAmount || 0)}
          subtitle={`${stats?.pendingWalletDeposits || 0} Deposit Request(s) Pending`}
          icon={Wallet}
          color="purple"
        />
        <StatCard
          title="Investment Volume"
          value={formatCurrency(stats?.totalInvestmentAmount || 0)}
          subtitle="Verified Capital Invested"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Referral Rewards Issued"
          value={formatCurrency(stats?.totalReferralRewards || 0)}
          subtitle="Verified Bonus Credits"
          icon={Gift}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Pending Payment Reviews</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">{pendingTotalCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Verified Payments</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">{stats?.successfulPayments || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Investments</span>
            <span className="text-2xl font-bold text-white mt-1 block">{stats?.activeInvestments || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        
      </div>

      {/* Admin Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">User Growth Analytics</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="users" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white">Referral Reward Distribution</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={rewardDistributionData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {rewardDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Interest Payout Execution"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-300">
            Calculate and credit interest for all eligible investments for the current payout cycle?
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Payout Cycle:</span>
              <span className="font-mono text-indigo-400 font-bold">{payoutInfo?.currentPayoutDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Scheduled Rate:</span>
              <span className="text-emerald-400 font-bold">4% per payout cycle</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Eligible Investments:</span>
              <span className="text-white font-bold">{payoutInfo?.eligibleCount ?? 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button
              variant="emerald"
              isLoading={submitting}
              disabled={submitting}
              onClick={handleTriggerPayout}
              className="w-1/2 font-bold"
            >
              Confirm & Credit Payout
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dynamic Results Modal */}
      <Modal
        isOpen={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        title="Interest Payout Execution Results"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            {payoutResult?.message || 'Interest payout completed successfully.'}
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Investments Processed:</span>
              <span className="text-white font-bold">{payoutResult?.totalProcessed ?? 0}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Total Interest Credited:</span>
              <span className="text-emerald-400 font-black text-sm">{formatCurrency(payoutResult?.totalCredited ?? 0)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Already Processed (Skipped):</span>
              <span className="text-amber-400 font-bold">{payoutResult?.alreadyProcessed ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Skipped (Zero / Ineligible):</span>
              <span className="text-slate-300 font-bold">{payoutResult?.skipped ?? 0}</span>
            </div>
          </div>

          <Button variant="primary" onClick={() => setResultModalOpen(false)} className="w-full font-bold">
            Close Summary
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
