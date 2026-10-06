import React, { useState, useEffect } from 'react';
import { Receipt, Search, Filter, Download } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Transactions = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useData();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchTxns = async () => {
      setLoading(true);
      try {
        const data = await transactionService.getTransactions({
          type: typeFilter,
          status: statusFilter,
          search,
        });
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, [user?.id, typeFilter, statusFilter, search, refreshTrigger]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Transaction History</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete ledger of investments, referral credits, maturity payouts, and wallet deposits.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="glass-card p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 align-middle">
          <div className="sm:col-span-5">
            <Input
              icon={Search}
              placeholder="Search by ID, reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="sm:col-span-3 flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase">Type Filter</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Transaction Types</option>
              <option value="Wallet Deposit">Wallet Deposit</option>
              <option value="Investment">Investment</option>
              <option value="Interest Credit">Interest Credit</option>
              <option value="Investment Bonus">Investment Bonus</option>
              <option value="Referral Reward">Referral Reward</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>

          <div className="sm:col-span-4 flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
            > 
              <option value="ALL">All Statuses</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        {loading ? (
          <Skeleton type="table" />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions matched"
            description="Try clearing your search query or adjusting your filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method / Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{txn.id}</td>
                    <td className="py-3.5 px-4">{txn.type}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {['Referral Reward', 'Interest Credit', 'INTEREST_CREDIT', 'Investment Bonus', 'Wallet Deposit'].includes(txn.type) ? (
                        <span className="text-emerald-400">+{formatCurrency(txn.amount)}</span>
                      ) : (
                        formatCurrency(txn.amount)
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{txn.paymentMethod} ({txn.reference})</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatDate(txn.date)}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={txn.status}>{txn.status}</Badge>
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
