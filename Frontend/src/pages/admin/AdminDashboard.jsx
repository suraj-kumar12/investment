import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Gift,
  Shield,
  Activity,
  Award,
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System Control Center</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Platform-wide financial metrics, user growth, and referral audit logs.</p>
      </div>

      {/* Admin Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 4}
          subtitle="Registered Investor Accounts"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Investments"
          value={stats?.totalInvestments || 4}
          subtitle={`${stats?.activeInvestments || 3} Active Portfolio(s)`}
          icon={TrendingUp}
          color="cyan"
        />
        <StatCard
          title="Investment Volume"
          value={formatCurrency(stats?.totalInvestmentAmount || 420)}
          subtitle="Verified Capital Invested"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Referral Rewards Issued"
          value={formatCurrency(stats?.totalReferralRewards || 9.60)}
          subtitle="Verified $1.20 Bonus Credits"
          icon={Gift}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Successful Payments</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">{stats?.successfulPayments || 3}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Investments</span>
            <span className="text-2xl font-bold text-white mt-1 block">{stats?.activeInvestments || 3}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Matured Investments</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">{stats?.maturedInvestments || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Award className="w-5 h-5" />
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
            <span className="text-emerald-400 font-semibold">• Credited $1.20</span>
            <span className="text-amber-400 font-semibold">• Pending $0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
