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
import { formatCurrency } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useData();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, [refreshTrigger]);

  const userGrowthData = [
    { month: 'May', users: 12 },
    { month: 'Jun', users: 24 },
    { month: 'Jul', users: 45 },
    { month: 'Aug', users: 78 },
    { month: 'Sep', users: 120 },
  ];

  const rewardDistributionData = [
    { name: 'Credited ($1.20)', value: stats?.totalReferralRewards || 9.60, color: '#10b981' },
    { name: 'Pending ($0)', value: 3.60, color: '#f59e0b' },
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
          <div className="flex justify-around text-xs">
            <span className="text-emerald-400 font-semibold">• Credited</span>
            <span className="text-amber-400 font-semibold">• Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
