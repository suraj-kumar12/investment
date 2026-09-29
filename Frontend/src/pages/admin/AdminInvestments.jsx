import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle2, XCircle, AlertCircle, Image as ImageIcon, ExternalLink, X, Loader2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const AdminInvestments = () => {
  const { refreshTrigger, refreshData } = useData();
  const { showToast } = useToast();

  const [investments, setInvestments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Proof Review Modal State
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const filtered = investments.filter(
    (i) =>
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.userName.toLowerCase().includes(search.toLowerCase()) ||
      i.planName.toLowerCase().includes(search.toLowerCase())
  );

  const getPaymentForInvestment = (invId) => {
    return payments.find((p) => p.investmentId === invId || p.paymentId === invId);
  };

  const handleOpenReviewModal = (inv) => {
    const pmt = getPaymentForInvestment(inv.id);
    setSelectedInvestment(inv);
    setSelectedPayment(pmt || null);
    setRejectionReason('');
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setSelectedInvestment(null);
    setRejectionReason('');
  };

  const handleApprovePayment = async () => {
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      const pmtId = selectedPayment.paymentId || selectedPayment._id || selectedPayment.id;
      const res = await adminService.approvePayment(pmtId);
      showToast(res.message || 'Payment approved successfully! Investment activated.', 'success');
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
    if (!selectedPayment) return;
    setActionLoading(true);
    try {
      const pmtId = selectedPayment.paymentId || selectedPayment._id || selectedPayment.id;
      const res = await adminService.rejectPayment(pmtId, rejectionReason || 'Payment proof could not be verified.');
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Investments & Payment Verification Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Review screenshot proofs, approve/reject pending payments, and manage active investment portfolios.</p>
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
                  <th className="py-3.5 px-4">Payment Method / Ref</th>
                  <th className="py-3.5 px-4">Proof Screenshot</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Investment Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {filtered.map((inv) => {
                  const payment = getPaymentForInvestment(inv.id);
                  const txHash = payment?.transactionHash || payment?.referenceId || inv.reference;
                  const hasScreenshot = Boolean(payment?.screenshotUrl);
                  const isPending = payment?.status === 'PENDING' || inv.paymentStatus === 'PENDING';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{inv.id}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{inv.userName}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(inv.amount)}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-amber-300 font-semibold block">{payment?.paymentMethod || inv.paymentMethod || 'USDT (BEP-20)'}</span>
                        {txHash && (
                          <span className="text-slate-400 block truncate max-w-[140px]" title={txHash}>
                            Ref: {txHash}
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
                          <Badge status={payment?.status || inv.paymentStatus}>
                            {payment?.status || inv.paymentStatus}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={inv.status}>{inv.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReviewModal(inv)}
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

      {/* ------------------------------------------------------------- */}
      {/* PROOF REVIEW MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Admin Review Panel</span>
              <h2 className="text-2xl font-black text-white">Payment Proof Inspection</h2>
            </div>

            {/* Overview Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Investor:</span>
                <span className="font-bold text-white">{selectedInvestment.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Investment ID:</span>
                <span className="font-mono text-indigo-400 font-bold">{selectedInvestment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan & Amount:</span>
                <span className="text-emerald-400 font-bold">{selectedInvestment.planName} ({formatCurrency(selectedInvestment.amount)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="text-amber-300 font-semibold">{selectedPayment?.paymentMethod || selectedInvestment.paymentMethod || 'USDT (BEP-20)'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Reference / TxHash:</span>
                <span className="font-mono text-slate-200 font-bold truncate max-w-[240px]">
                  {selectedPayment?.transactionHash || selectedPayment?.referenceId || 'N/A'}
                </span>
              </div>
            </div>

            {/* Screenshot Display */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                Uploaded Receipt Screenshot Proof:
              </label>
              {selectedPayment?.screenshotUrl ? (
                <div className="rounded-2xl border border-slate-800 bg-black p-2 overflow-hidden flex flex-col items-center">
                  <img
                    src={`http://localhost:5000${selectedPayment.screenshotUrl}`}
                    onError={(e) => {
                      // Fallback relative path if domain differs
                      e.target.src = selectedPayment.screenshotUrl;
                    }}
                    alt="Payment Screenshot Proof"
                    className="max-h-72 w-auto object-contain rounded-xl"
                  />
                  <a
                    href={`http://localhost:5000${selectedPayment.screenshotUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Full Resolution Image
                  </a>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 space-y-1">
                  <AlertCircle className="w-6 h-6 mx-auto text-slate-600" />
                  <p>No screenshot image proof attached to this payment record.</p>
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
                className="w-full sm:w-1/2"
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
