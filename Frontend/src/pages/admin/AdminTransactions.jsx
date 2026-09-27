import React, { useState, useEffect } from 'react';
import { Receipt, Search } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';

export const AdminTransactions = () => {
  const { refreshTrigger } = useData();
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTxns = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAllTransactions();
        setTxns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, [refreshTrigger]);

  const filtered = txns.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      (t.reference && t.reference.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System Transactions Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Platform-wide audit of all investments, referral payouts, and wallet credits.</p>
        </div>
        <div className="w-full sm:w-64">
          <Input icon={Search} placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <th className="py-3.5 px-4">Txn ID</th>
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method / Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{t.id}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.userId}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{t.type}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{formatCurrency(t.amount)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.paymentMethod} ({t.reference})</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(t.date)}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={t.status}>{t.status}</Badge>
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
