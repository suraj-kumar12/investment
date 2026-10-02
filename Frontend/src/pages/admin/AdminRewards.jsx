import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';

export const AdminRewards = () => {
  const { refreshTrigger } = useData();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRwds = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllRewards();
        setRewards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRwds();
  }, [refreshTrigger]);

  const filtered = rewards.filter(
    (r) =>
      (r.referrerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.referredName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.rewardId || r.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.eligiblePaymentId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Multi-Level Rewards Audit Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit of issued referral rewards (Level 1: 5%, Level 2: 3%, Level 3: 2%, Level 4: 1%) linked to verified payment events.</p>
        </div>
        <div className="w-full sm:w-64">
          <Input icon={Search} placeholder="Search rewards..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        {loading ? (
          <Skeleton type="table" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase font-semibold">
                  <th className="py-3.5 px-4">Referrer</th>
                  <th className="py-3.5 px-4">Investor</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Investment ID</th>
                  <th className="py-3.5 px-4">Payment ID</th>
                  <th className="py-3.5 px-4">Investment Amount</th>
                  <th className="py-3.5 px-4">Percentage</th>
                  <th className="py-3.5 px-4">Reward Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((r) => (
                  <tr key={r.rewardId || r.id || r._id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white">{r.referrerName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{r.referredName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Level {r.level || 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{r.investmentId || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-mono text-purple-400">{r.eligiblePaymentId}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      {formatCurrency(r.investmentAmount || 0)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-300">
                      {r.percentage ? `${r.percentage}%` : '5%'}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-400">
                      +{formatCurrency(r.rewardAmount || 0)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={r.status}>{r.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(r.date)}</td>
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
