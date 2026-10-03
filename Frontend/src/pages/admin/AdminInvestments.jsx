import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  X,
  Wallet,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { formatCurrency, getImageUrl } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

/**
 * Robust payment-to-investment matching helper
 * Matches by investmentId, MongoDB _id, or paymentId, while enforcing user ID isolation.
 */
const getPaymentForInvestment = (investment, paymentsList) => {
  if (!investment || !paymentsList || !Array.isArray(paymentsList)) return null;

  const invMongoId = investment._id ? String(investment._id) : null;
  const invCustomId = investment.investmentId ? String(investment.investmentId) : null;
  const invId = investment.id ? String(investment.id) : null;

  const invUserId = investment.userId
    ? typeof investment.userId === 'object'
      ? String(investment.userId._id || investment.userId.id)
      : String(investment.userId)
    : null;

  return (
    paymentsList.find((p) => {
      // Enforce User ID match if available to prevent cross-user screenshot mismatch
      const pmtUserId = p.userId
        ? typeof p.userId === 'object'
          ? String(p.userId._id || p.userId.id)
          : String(p.userId)
        : null;

      if (invUserId && pmtUserId && invUserId !== pmtUserId) {
        return false;
      }

      const pmtInvId = p.investmentId ? String(p.investmentId) : null;
      const pmtId = p.paymentId ? String(p.paymentId) : p.id ? String(p.id) : p._id ? String(p._id) : null;

      // Exclude WALLET_DEPOSIT string when matching plan investments
      if (pmtInvId === 'WALLET_DEPOSIT') return false;

      return (
        (pmtInvId && (pmtInvId === invCustomId || pmtInvId === invMongoId || pmtInvId === invId)) ||
        (pmtId && (pmtId === invCustomId || pmtId === invMongoId || pmtId === invId))
      );
    }) || null
  );
};

export const AdminInvestments = () => {
  const { refreshTrigger, refreshData } = useData();
  const { showToast } = useToast();

  const [investments, setInvestments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'WALLET_DEPOSIT', 'INVESTMENT'

  // Proof Review Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invsData, pmtsData] = await Promise.all([
        adminService.getAllInvestments(),
        adminService.getAllPayments(),
      ]);
      setInvestments(invsData || []);
      setPayments(pmtsData || []);
    } catch (err) {
      console.error('Error fetching admin investments or payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Combine payments and investments into a unified ledger
  const unifiedItems = [];
  const processedItemIds = new Set();

  // 1. Process Plan Investments and link with corresponding Payment
  investments.forEach((inv) => {
    const invId = inv.investmentId || (inv._id ? String(inv._id) : inv.id);
    const linkedPayment = getPaymentForInvestment(inv, payments);

    if (linkedPayment) {
      const pmtId = linkedPayment.paymentId || String(linkedPayment._id || linkedPayment.id);
      processedItemIds.add(pmtId);
    }
    processedItemIds.add(invId);

    const userName = linkedPayment?.userId?.name || inv.userName || 'Unknown User';
    const userEmail = linkedPayment?.userId?.email || '';

    unifiedItems.push({
      id: invId,
      paymentId: linkedPayment ? (linkedPayment.paymentId || String(linkedPayment._id)) : invId,
      investmentId: invId,
      type: 'INVESTMENT',
      typeLabel: inv.planName || 'Plan Investment',
      userName,
      userEmail,
      amount: linkedPayment?.amount || inv.amount,
      paymentMethod: linkedPayment?.paymentMethod || inv.paymentMethod || 'USDT (BEP-20)',
      transactionHash: linkedPayment?.transactionHash || linkedPayment?.referenceId || inv.reference || '',
      screenshotUrl: linkedPayment?.screenshotUrl || '',
      status: linkedPayment?.status || inv.paymentStatus || 'PENDING',
      investmentStatus: inv.status || 'PENDING',
      createdAt: inv.createdAt || (linkedPayment ? linkedPayment.createdAt : new Date().toISOString()),
      rawPayment: linkedPayment || null,
      rawInvestment: inv,
    });
  });

  // 2. Process remaining Payments (Wallet Deposits & unlinked payments)
  payments.forEach((p) => {
    const pmtId = p.paymentId || String(p._id || p.id);
    if (processedItemIds.has(pmtId)) return; // Already processed as linked investment payment
    processedItemIds.add(pmtId);

    const isWalletDeposit = p.type === 'WALLET_DEPOSIT' || p.investmentId === 'WALLET_DEPOSIT';
    const userName = p.userId?.name || p.userName || 'Unknown User';
    const userEmail = p.userId?.email || '';

    unifiedItems.push({
      id: pmtId,
      paymentId: pmtId,
      investmentId: p.investmentId || 'WALLET_DEPOSIT',
      type: isWalletDeposit ? 'WALLET_DEPOSIT' : 'INVESTMENT',
      typeLabel: isWalletDeposit ? 'Wallet Deposit' : 'Investment Payment',
      userName,
      userEmail,
      amount: p.amount || p.expectedAmount || 0,
      paymentMethod: p.paymentMethod || 'USDT (BEP-20)',
      transactionHash: p.transactionHash || p.referenceId || '',
      screenshotUrl: p.screenshotUrl || '',
      status: p.status || p.paymentStatus || 'PENDING',
      investmentStatus: 'N/A',
      createdAt: p.createdAt || new Date().toISOString(),
      rawPayment: p,
      rawInvestment: null,
    });
  });

  // Sort by created date descending
  unifiedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Count metrics for tabs
  const countAll = unifiedItems.length;
  const countWalletDeposits = unifiedItems.filter((i) => i.type === 'WALLET_DEPOSIT').length;
  const countPendingWalletDeposits = unifiedItems.filter(
    (i) => i.type === 'WALLET_DEPOSIT' && i.status === 'PENDING'
  ).length;
  const countInvestments = unifiedItems.filter((i) => i.type === 'INVESTMENT').length;

  // Filter items by active tab and search query
  const filtered = unifiedItems.filter((item) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'WALLET_DEPOSIT' && item.type === 'WALLET_DEPOSIT') ||
      (activeTab === 'INVESTMENT' && item.type === 'INVESTMENT');

    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.id.toLowerCase().includes(searchLower) ||
      item.userName.toLowerCase().includes(searchLower) ||
      item.userEmail.toLowerCase().includes(searchLower) ||
      item.typeLabel.toLowerCase().includes(searchLower) ||
      item.transactionHash.toLowerCase().includes(searchLower);

    return matchesTab && matchesSearch;
  });

  const handleOpenReviewModal = (item) => {
    setSelectedItem(item);
    setRejectionReason('');
    setImageError(false);

    const resolvedUrl = getImageUrl(item?.screenshotUrl);
    console.log('Selected item/payment:', item);
    console.log('Raw screenshotUrl:', item?.screenshotUrl);
    console.log('Resolved screenshot URL:', resolvedUrl);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setRejectionReason('');
    setImageError(false);
  };

  const handleApprovePayment = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const pmtId = selectedItem.paymentId || selectedItem.id;
      const res = await adminService.approvePayment(pmtId);
      showToast(
        res.message ||
          (selectedItem.type === 'WALLET_DEPOSIT'
            ? 'Wallet deposit approved and credited successfully!'
            : 'Payment approved successfully! Investment activated.'),
        'success'
      );
      handleCloseModal();
      refreshData();
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to approve payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const pmtId = selectedItem.paymentId || selectedItem.id;
      const res = await adminService.rejectPayment(
        pmtId,
        rejectionReason || 'Payment proof could not be verified.'
      );
      showToast(res.message || 'Payment proof rejected.', 'info');
      handleCloseModal();
      refreshData();
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to reject payment', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const resolvedImageUrl = selectedItem ? getImageUrl(selectedItem.screenshotUrl) : null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Investments & Payment Verification Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review user deposit screenshot proofs, approve/reject pending payments, and manage active investment portfolios.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            icon={Search}
            placeholder="Search payments & users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs & Badges */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ALL'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Payments</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {countAll}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('WALLET_DEPOSIT')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 relative ${
            activeTab === 'WALLET_DEPOSIT'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4 text-purple-400" />
          <span>Wallet Deposits</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-purple-950 text-purple-300 border border-purple-500/30">
            {countWalletDeposits}
          </span>
          {countPendingWalletDeposits > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse absolute -top-1 -right-1" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('INVESTMENT')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'INVESTMENT'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Plan Investments</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {countInvestments}
          </span>
        </button>
      </div>

      {/* Main Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        {loading ? (
          <Skeleton type="table" />
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500" />
            <p className="font-semibold text-slate-300">No payment or deposit records found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase font-semibold">
                  <th className="py-3.5 px-4">Investment ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method / Ref</th>
                  <th className="py-3.5 px-4">Proof Screenshot</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Investment Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((item) => {
                  const hasScreenshot = Boolean(item.screenshotUrl);
                  const isPending = item.status === 'PENDING';
                  const isWalletDep = item.type === 'WALLET_DEPOSIT';

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="block">{item.userName}</span>
                        {item.userEmail && (
                          <span className="text-[11px] text-slate-400 font-normal block truncate max-w-[160px]">
                            {item.userEmail}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-amber-300 font-semibold block">
                          {item.paymentMethod}
                        </span>
                        {item.transactionHash && (
                          <span
                            className="text-slate-400 block truncate max-w-[140px]"
                            title={item.transactionHash}
                          >
                            Ref: {item.transactionHash}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {hasScreenshot ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5" />
                            Uploaded
                          </span>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPending ? (
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-flex items-center gap-1">
                            Needs Review
                          </span>
                        ) : (
                          <Badge status={item.status}>{item.status}</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isWalletDep ? (
                          <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                            Wallet Deposit
                          </span>
                        ) : (
                          <Badge status={item.investmentStatus}>{item.investmentStatus}</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReviewModal(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors text-xs font-semibold inline-flex items-center gap-1.5 border border-slate-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review Proof
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PROOF REVIEW MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Admin Review Panel
              </span>
              <h2 className="text-2xl font-black text-white">Payment Proof Inspection</h2>
            </div>

            {/* Overview Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Investor:</span>
                <span className="font-bold text-white">{selectedItem.userName}</span>
              </div>
              {selectedItem.userEmail && (
                <div className="flex justify-between">
                  <span className="text-slate-400">User Email:</span>
                  <span className="text-slate-300 font-mono">{selectedItem.userEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Investment ID:</span>
                <span className="font-mono text-indigo-400 font-bold">{selectedItem.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan & Amount:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedItem.typeLabel} ({formatCurrency(selectedItem.amount)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="text-amber-300 font-semibold">{selectedItem.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Reference / TxHash:</span>
                <span className="font-mono text-slate-200 font-bold truncate max-w-[240px]">
                  {selectedItem.transactionHash || 'N/A'}
                </span>
              </div>
            </div>

            {/* Screenshot Display */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                Uploaded Receipt Screenshot Proof:
              </label>
              {!resolvedImageUrl ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 space-y-1">
                  <AlertCircle className="w-6 h-6 mx-auto text-slate-600" />
                  <p>No screenshot image proof attached to this payment record.</p>
                </div>
              ) : imageError ? (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 space-y-2">
                  <AlertCircle className="w-6 h-6 mx-auto text-amber-500" />
                  <p className="text-amber-400 font-semibold">Unable to load payment screenshot.</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-md mx-auto">
                    {resolvedImageUrl}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-black p-2 overflow-hidden flex flex-col items-center">
                  <img
                    src={resolvedImageUrl}
                    onError={() => {
                      console.error('Failed to load image from URL:', resolvedImageUrl);
                      setImageError(true);
                    }}
                    alt="Payment Screenshot Proof"
                    className="max-h-72 w-auto object-contain rounded-xl"
                  />
                  <a
                    href={resolvedImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Full Resolution Image
                  </a>
                </div>
              )}
            </div>

            {/* Rejection Note Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">
                Rejection Note / Reason (Only required if rejecting):
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Screenshot unreadable or UTR number mismatched"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleRejectPayment}
                isLoading={actionLoading}
                disabled={actionLoading}
                className="w-full sm:w-1/2 !bg-red-500/10 !border-red-500/30 !text-red-400 hover:!bg-red-500/20"
                icon={XCircle}
              >
                Reject Payment
              </Button>
              <Button
                variant="emerald"
                onClick={handleApprovePayment}
                isLoading={actionLoading}
                disabled={actionLoading}
                className="w-full sm:w-1/2 font-bold"
                icon={CheckCircle2}
              >
                Approve Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestments;
