import React, { useState, useEffect } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';

export const AdminInvestments = () => {
  const { refreshTrigger } = useData();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInvs = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllInvestments();
        setInvestments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvs();
  }, [refreshTrigger]);

  const filtered = investments.filter(
    (i) =>
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.userName.toLowerCase().includes(search.toLowerCase()) ||
      i.planName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Investments Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Platform-wide investment portfolios and maturity schedule audit.</p>
        </div>
        <div className="w-full sm:w-64">
          <Input icon={Search} placeholder="Search investments..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <th className="py-3.5 px-4">Investment ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Plan</th>
                  <th className="py-3.5 px-4">Rate</th>
                  <th className="py-3.5 px-4">Projected Profit</th>
                  <th className="py-3.5 px-4">Maturity Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{inv.id}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{inv.userName}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{formatCurrency(inv.amount)}</td>
                    <td className="py-3.5 px-4">{inv.planName}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">{inv.rate}%</td>
                    <td className="py-3.5 px-4 text-indigo-300 font-bold">+{formatCurrency(inv.profit)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(inv.maturityDate)}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
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
