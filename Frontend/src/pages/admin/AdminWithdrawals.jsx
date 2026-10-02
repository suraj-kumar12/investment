import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  Send,
  Building2,
  Check,
  Play,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const AdminWithdrawals = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Rejection Modal State
  const [rejectingItem, setRejectingItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllWithdrawals();
      setWithdrawals(data || []);
    } catch (err) {
      console.error('Failed to fetch admin withdrawals:', err);
      showToast('Error loading withdrawal requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await adminService.approveWithdrawal(id);
      showToast('Withdrawal request approved successfully!', 'success');
      await fetchWithdrawals();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to approve withdrawal', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcess = async (id) => {
    setActionLoading(true);
    try {
      await adminService.processWithdrawal(id);
      showToast('Withdrawal marked as Processing', 'info');
      await fetchWithdrawals();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to update withdrawal status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(true);
    try {
      await adminService.completeWithdrawal(id);
      showToast('Withdrawal completed successfully!', 'success');
      await fetchWithdrawals();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to complete withdrawal', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a reason for rejecting this withdrawal request.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await adminService.rejectWithdrawal(rejectingItem.id || rejectingItem.withdrawalId, rejectionReason.trim());
      showToast('Withdrawal request rejected. Reserved funds restored to user balance.', 'info');
      setRejectingItem(null);
      setRejectionReason('');
      await fetchWithdrawals();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to reject withdrawal', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesStatus = filterStatus === 'ALL' || w.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (w.withdrawalId && w.withdrawalId.toLowerCase().includes(searchLower)) ||
      (w.userName && w.userName.toLowerCase().includes(searchLower)) ||
      (w.userEmail && w.userEmail.toLowerCase().includes(searchLower)) ||
      (w.userId?.name && w.userId.name.toLowerCase().includes(searchLower)) ||
      (w.userId?.email && w.userId.email.toLowerCase().includes(searchLower)) ||
      (w.method && w.method.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalAmount = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
  const pendingCount = withdrawals.filter((w) => w.status === 'PENDING').length;
  const approvedCount = withdrawals.filter((w) => ['APPROVED', 'PROCESSING'].includes(w.status)).length;
  const completedCount = withdrawals.filter((w) => w.status === 'COMPLETED').length;
  const rejectedCount = withdrawals.filter((w) => w.status === 'REJECTED').length;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Wallet className="w-8 h-8 text-purple-400" />
            <span>Withdrawal Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review user payout requests, verify bank/crypto destination details, and process approvals.
          </p>
        </div>

        <Button variant="ghost" size="sm" icon={RefreshCw} onClick={fetchWithdrawals}>
          Refresh Requests
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requested"
          value={formatCurrency(totalAmount)}
          subtitle={`${withdrawals.length} Total Request(s)`}
          icon={Wallet}
          color="purple"
        />
        <StatCard
          title="Pending Review"
          value={pendingCount}
          subtitle="Action Required"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Approved / Processing"
          value={approvedCount}
          subtitle="In Payout Queue"
          icon={Play}
          color="indigo"
        />
        <StatCard
          title="Completed Payouts"
          value={completedCount}
          subtitle={`${rejectedCount} Rejected`}
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Controls & Table Container */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {['ALL', 'PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search user, ID, method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Requests Table */}
        {filteredWithdrawals.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Clock className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No withdrawal requests found matching filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Destination Details</th>
                  <th className="py-3.5 px-4">Request Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filteredWithdrawals.map((w) => {
                  const userName = w.userName || w.userId?.name || 'Investor';
                  const userEmail = w.userEmail || w.userId?.email || '';

                  return (
                    <tr key={w.id || w.withdrawalId} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                        {w.withdrawalId || w.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{userName}</span>
                          <span className="text-[10px] text-slate-400">{userEmail}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {formatCurrency(w.amount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-300">
                        {w.method}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs font-mono text-[11px]">
                        <span className="block truncate">{w.walletAddress || 'N/A'}</span>
                        {w.accountDetails && <span className="text-[10px] text-slate-500 block truncate">{w.accountDetails}</span>}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(w.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={w.status}>{w.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(w.id || w.withdrawalId)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-[11px] font-bold transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingItem(w);
                                  setRejectionReason('');
                                }}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 hover:text-white border border-rose-500/30 text-[11px] font-bold transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {w.status === 'APPROVED' && (
                            <>
                              <button
                                onClick={() => handleProcess(w.id || w.withdrawalId)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-amber-600/20 text-amber-300 hover:bg-amber-600 hover:text-white border border-amber-500/30 text-[11px] font-bold transition-all"
                              >
                                Process
                              </button>
                              <button
                                onClick={() => handleComplete(w.id || w.withdrawalId)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[11px] font-bold transition-all"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingItem(w);
                                  setRejectionReason('');
                                }}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 hover:text-white border border-rose-500/30 text-[11px] font-bold transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {w.status === 'PROCESSING' && (
                            <>
                              <button
                                onClick={() => handleComplete(w.id || w.withdrawalId)}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[11px] font-bold transition-all"
                              >
                                Complete Payout
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingItem(w);
                                  setRejectionReason('');
                                }}
                                disabled={actionLoading}
                                className="px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 hover:text-white border border-rose-500/30 text-[11px] font-bold transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {w.status === 'COMPLETED' && (
                            <span className="text-[11px] font-bold text-emerald-400">Completed</span>
                          )}

                          {w.status === 'REJECTED' && (
                            <span className="text-[11px] font-bold text-rose-400 truncate max-w-[120px]" title={w.rejectionReason}>
                              Rejected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Reject Withdrawal Request</h3>
            </div>

            <p className="text-xs text-slate-300">
              You are rejecting request <span className="font-mono font-bold text-purple-400">{rejectingItem.withdrawalId || rejectingItem.id}</span> of{' '}
              <span className="font-bold text-white">{formatCurrency(rejectingItem.amount)}</span>. This will unlock and return the reserved amount back to the user balance.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Rejection Reason *</label>
              <textarea
                rows="3"
                placeholder="Specify reason (e.g. Invalid wallet address, account mismatch)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectingItem(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
