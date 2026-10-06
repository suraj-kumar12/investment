import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Award,
  Users,
  Gift,
  ArrowUpRight,
  PlusCircle,
  Copy,
  Clock,
  PieChart as PieIcon,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { referralService } from '../../services/referralService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const UserDashboard = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useData();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [refStats, setRefStats] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invs = await investmentService.getInvestments(user?.id);
        const rStats = await referralService.getReferralStats(user?.id);
        const sumData = await investmentService.getDashboardSummary();
        setInvestments(invs);
        setRefStats(rStats);
        setSummary(sumData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, refreshTrigger]);

  const activeInvs = investments.filter((i) => i.paymentStatus === 'SUCCESSFUL');
  const totalInvestment = summary?.totalInvestment ?? activeInvs.reduce((sum, i) => sum + i.amount, 0);
  const totalProfit = summary?.totalProfit ?? activeInvs.reduce((sum, i) => sum + i.profit, 0);
  const totalMaturity = totalInvestment + totalProfit;
  const referralRewards = refStats?.totalRewards || 0;

  // Chart Data Setup
  const growthData = [
    { month: 'Month 1', value: totalInvestment * 0.2 },
    { month: 'Month 3', value: totalInvestment * 0.45 },
    { month: 'Month 6', value: totalInvestment * 0.7 },
    { month: 'Month 9', value: totalInvestment * 0.88 },
    { month: 'Month 12', value: totalMaturity },
  ];

  const allocationData = [
    { name: 'Premium (12%)', value: totalInvestment * 0.5, color: '#6366f1' },
    { name: 'Growth (10%)', value: totalInvestment * 0.3, color: '#3b82f6' },
    { name: 'Starter (8%)', value: totalInvestment * 0.2, color: '#10b981' },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
          <Skeleton type="card" />
        </div>
        <Skeleton type="table" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.name || 'Investor'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your live investment growth overview and referral earnings summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/withdraw">
            <Button variant="outline" icon={Wallet}>
              Withdraw
            </Button>
          </Link>
          <Link to="/dashboard/investments/new">
            <Button variant="emerald" icon={PlusCircle}>
              New Investment
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Wallet & Investment Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Available Wallet Balance"
          value={formatCurrency(summary?.walletBalance ?? user?.walletBalance ?? 0)}
          subtitle="Ready to Invest / Withdraw"
          icon={Wallet}
          color="indigo"
        />
        <StatCard
          title="Pending Deposit"
          value={formatCurrency(summary?.pendingDeposits ?? 0)}
          subtitle="Awaiting Admin Review"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Investment"
          value={formatCurrency(summary?.totalInvestment ?? 0)}
          subtitle={`${summary?.activeInvestmentsCount ?? activeInvs.length} Active Plan(s)`}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Investment Bonus"
          value={formatCurrency(summary?.investmentBonus ?? 0)}
          subtitle="One-time 5% Active Bonus"
          icon={Gift}
          color="cyan"
        />
        <StatCard
          title="Earned Interest"
          value={formatCurrency(summary?.earnedInterest ?? 0)}
          subtitle="4% Simple Interest per 15 Days"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Available WITHDRAWABLE BALANCE"
          value={formatCurrency(summary?.withdrawableProfit ?? 0)}
          subtitle="Total Ledger Balance Available"
          icon={Award}
          color="blue"
        />
      </div>

      {/* Secondary Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 glass-card p-4 rounded-2xl border border-slate-800">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Referrals</span>
          <span className="text-lg font-bold text-white">{refStats?.totalReferrals || 0}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] text-emerald-400 font-semibold block">Successful Referrals</span>
          <span className="text-lg font-bold text-emerald-400">{refStats?.successfulReferrals || 0}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] text-amber-400 font-semibold block">Pending Referrals</span>
          <span className="text-lg font-bold text-amber-400">{refStats?.pendingReferrals || 0}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] text-indigo-400 font-semibold block">Commission Structure</span>
          <span className="text-lg font-bold text-indigo-400">4 Tier Levels</span>
        </div>
      </div>

      {/* Recharts Data Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Line Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Portfolio Growth Projection</h3>
              <p className="text-xs text-slate-400">12-Month demo maturity timeline</p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Demo Projected
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val) => [formatCurrency(val), 'Projected Value']}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Donut Chart */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Investment Allocation</h3>
            <p className="text-xs text-slate-400">Distribution across active plan tiers</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocationData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={5}>
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val) => [formatCurrency(val), 'Allocated']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Premium (12%)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Growth (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Investments Summary Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Active Investments</h3>
            <p className="text-xs text-slate-400">Track current status and projected maturity dates</p>
          </div>
          <Link to="/dashboard/investments">
            <Button variant="ghost" size="sm" icon={ArrowUpRight}>
              View All
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                <th className="py-3.5 px-4">Investment ID</th>
                <th className="py-3.5 px-4">Plan</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Rate</th>
                <th className="py-3.5 px-4">Projected Profit</th>
                <th className="py-3.5 px-4">Maturity Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
              {investments.slice(0, 3).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{inv.id}</td>
                  <td className="py-3.5 px-4">{inv.planName}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{formatCurrency(inv.amount)}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{inv.rate}%</td>
                  <td className="py-3.5 px-4 text-indigo-300 font-bold">+{formatCurrency(inv.profit)}</td>
                  <td className="py-3.5 px-4 text-slate-400">{formatDate(inv.maturityDate)}</td>
                  <td className="py-3.5 px-4">
                    <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/dashboard/investments/${inv.id}`}>
                      <Button variant="outline" size="sm">Details</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
