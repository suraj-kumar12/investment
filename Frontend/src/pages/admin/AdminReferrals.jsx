import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';

export const AdminReferrals = () => {
  const { refreshTrigger } = useData();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRefs = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllReferrals();
        setReferrals(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRefs();
  }, [refreshTrigger]);

  const filtered = referrals.filter(
    (r) =>
      r.referrerName.toLowerCase().includes(search.toLowerCase()) ||
      r.referredName.toLowerCase().includes(search.toLowerCase()) ||
      r.referrerCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Referrals & Rewards Audit</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Track payment verification status alongside referral reward triggers.</p>
        </div>
        <div className="w-full sm:w-64">
          <Input icon={Search} placeholder="Search referrals..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          Verification rule check: <strong>Payment Status === SUCCESSFUL</strong> is strictly required for <strong>Reward Status === CREDITED</strong>.
        </span>
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
                  <th className="py-3.5 px-4">Referred User</th>
                  <th className="py-3.5 px-4">Referral Code</th>
                  <th className="py-3.5 px-4">Investment Amount</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Reward</th>
                  <th className="py-3.5 px-4">Reward Status</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-bold text-white">{ref.referrerName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{ref.referredName}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{ref.referrerCode}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {ref.investmentAmount > 0 ? formatCurrency(ref.investmentAmount) : '$0'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={ref.paymentStatus}>{ref.paymentStatus}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {ref.rewardStatus === 'CREDITED' ? (
                        <span className="text-emerald-400">$1.20</span>
                      ) : (
                        <span className="text-slate-500">$0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={ref.rewardStatus}>{ref.rewardStatus}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(ref.registrationDate)}</td>
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
