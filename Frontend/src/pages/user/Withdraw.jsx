import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Building2,
  QrCode,
  ShieldAlert,
  Send,
  Info,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { withdrawalService } from '../../services/withdrawalService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Withdraw = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [balanceData, setBalanceData] = useState({
    availableBalance: 0,
    minWithdrawalAmount: 10,
    walletBalance: 0,
    uninvestedDeposit: 0,
    totalEarnedInterest: 0,
    totalBonusAmount: 0,
    totalRewards: 0,
    totalActivePrincipal: 0,
    totalPendingWithdrawals: 0,
    totalCompletedWithdrawals: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);

  // Form State
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('USDT (BEP-20)');
  const [network, setNetwork] = useState('BEP-20');
  const [walletAddress, setWalletAddress] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const fetchWithdrawalData = async () => {
    try {
      setLoading(true);
      const [bal, history] = await Promise.all([
        withdrawalService.getAvailableBalance(),
        withdrawalService.getMyWithdrawals(),
      ]);
      if (bal) setBalanceData(bal);
      if (history) setWithdrawals(history);
    } catch (err) {
      console.error('Failed to load withdrawal data:', err);
      showToast('Error loading withdrawal details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalData();
  }, [user?.id]);

  const handleQuickAmount = (ratio) => {
    const calculated = (balanceData.availableBalance || 0) * ratio;
    setAmount(calculated > 0 ? calculated.toFixed(2) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    // Dynamic Frontend Validation
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid withdrawal amount greater than $0', 'error');
      return;
    }

    if (numAmount < (balanceData.minWithdrawalAmount || 10)) {
      showToast(`Minimum withdrawal amount is ${formatCurrency(balanceData.minWithdrawalAmount || 10)}`, 'error');
      return;
    }

    if (numAmount > balanceData.availableBalance) {
      showToast(`Insufficient available balance (${formatCurrency(balanceData.availableBalance)} available)`, 'error');
      return;
    }

    let payloadDetails = '';
    let payloadAddress = '';

    if (method === 'USDT (BEP-20)') {
      if (!walletAddress.trim()) {
        showToast('Please enter your destination USDT wallet address', 'error');
        return;
      }
      payloadAddress = walletAddress.trim();
      payloadDetails = `Network: ${network.trim()}`;
    } else if (method === 'UPI') {
      if (!upiId.trim()) {
        showToast('Please enter a valid UPI ID (VPA)', 'error');
        return;
      }
      payloadAddress = upiId.trim();
      payloadDetails = `UPI ID: ${upiId.trim()}`;
    } else if (method === 'Bank Transfer') {
      if (!bankAccount.trim() || !bankIfsc.trim() || !bankName.trim() || !accountHolder.trim()) {
        showToast('Please fill out all required bank account fields', 'error');
        return;
      }
      payloadAddress = `A/C: ${bankAccount.trim()}`;
      payloadDetails = `Holder: ${accountHolder.trim()}, Bank: ${bankName.trim()}, IFSC: ${bankIfsc.trim()}, A/C: ${bankAccount.trim()}`;
    }

    setSubmitting(true);
    try {
      const response = await withdrawalService.requestWithdrawal({
        amount: numAmount,
        method,
        network: method === 'USDT (BEP-20)' ? network : undefined,
        walletAddress: payloadAddress,
        accountDetails: payloadDetails,
      });

      showToast(response.message || 'Withdrawal request submitted successfully!', 'success');
      setAmount('');
      setWalletAddress('');
      setUpiId('');
      setBankAccount('');
      setBankIfsc('');
      setBankName('');
      setAccountHolder('');

      // Refresh live balance & history
      await fetchWithdrawalData();
    } catch (err) {
      showToast(err.message || 'Failed to submit withdrawal request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Wallet className="w-8 h-8 text-indigo-400" />
            <span>Fund Withdrawal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Request funds directly to your preferred payout method. Balances are calculated dynamically.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          icon={RefreshCw}
          onClick={fetchWithdrawalData}
        >
          Refresh Balance
        </Button>
      </div>

      {/* Balance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Available Balance"
          value={formatCurrency(balanceData.availableBalance)}
          subtitle="Ready for Withdrawal"
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          title="Pending Requests"
          value={formatCurrency(balanceData.totalPendingWithdrawals || 0)}
          subtitle="Awaiting Approval"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Withdrawn"
          value={formatCurrency(balanceData.totalCompletedWithdrawals || 0)}
          subtitle="Lifetime Completed"
          icon={CheckCircle2}
          color="indigo"
        />
        <StatCard
          title="Referral Earnings"
          value={formatCurrency(balanceData.totalRewards || 0)}
          subtitle="Credited to Wallet"
          icon={ArrowUpRight}
          color="purple"
        />
      </div>

      {/* Balance Breakdown Banner & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Request Withdrawal</h3>
              <p className="text-xs text-slate-400">Fill in details to submit a payout request</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Min: {formatCurrency(balanceData.minWithdrawalAmount || 10)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Withdrawal Amount ($)</label>
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(0.5)}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(1.0)}
                    className="px-2 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-500/30 font-bold"
                  >
                    MAX
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl py-3 px-4 text-base font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">USD</span>
              </div>
            </div>

            {/* Payout Method Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Withdrawal Method</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'USDT (BEP-20)', label: 'USDT (BEP-20)', icon: QrCode },
                  { id: 'UPI', label: 'UPI Instant', icon: Send },
                  { id: 'Bank Transfer', label: 'Bank Wire', icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Account Details Fields */}
            {method === 'USDT (BEP-20)' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">USDT Wallet Address (BEP-20)</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Network</label>
                  <input
                    type="text"
                    value={network}
                    disabled
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-xl py-2.5 px-3.5 text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {method === 'UPI' && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300">UPI ID / VPA</label>
                <input
                  type="text"
                  placeholder="e.g. name@upi or mobilenumber@ybl"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {method === 'Bank Transfer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Account Number</label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="indigo"
                className="w-full py-3 text-sm font-bold shadow-lg shadow-indigo-600/30"
                disabled={submitting || balanceData.availableBalance <= 0}
              >
                {submitting ? 'Submitting Request...' : 'Submit Withdrawal Request'}
              </Button>
            </div>
          </form>
        </div>

        {/* Balance Rules & Summary Panel */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" />
              <span>Withdrawal Rules</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">1. Principal Protection Rule</span>
                <p className="text-slate-400 leading-relaxed">
                  Active investment principal remains locked and cannot be withdrawn. Your withdrawable balance consists strictly of uninvested deposits, admin-credited interest, investment bonuses, and referral rewards.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">2. Anti-Double Withdrawal Guard</span>
                <p className="text-slate-400 leading-relaxed">
                  Submitting a request immediately reserves funds. You cannot withdraw the same balance twice while a request is pending.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">3. Rejection Restoration</span>
                <p className="text-slate-400 leading-relaxed">
                  If an admin rejects a request, the reserved amount is automatically unlocked and returned to your available balance.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Ledger Breakdown */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <span>Active Principal</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase">Locked</span>
              </span>
              <span className="font-bold text-amber-400">{formatCurrency(balanceData.totalActivePrincipal || 0)}</span>
            </div>

            {balanceData.uninvestedDeposit > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Uninvested Wallet Deposit:</span>
                <span className="font-bold text-indigo-300">+{formatCurrency(balanceData.uninvestedDeposit)}</span>
              </div>
            )}

            {balanceData.totalEarnedInterest > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Credited Interest:</span>
                <span className="font-bold text-emerald-400">+{formatCurrency(balanceData.totalEarnedInterest)}</span>
              </div>
            )}

            {balanceData.totalBonusAmount > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Investment Bonus:</span>
                <span className="font-bold text-cyan-400">+{formatCurrency(balanceData.totalBonusAmount)}</span>
              </div>
            )}

            {balanceData.totalRewards > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Referral Rewards:</span>
                <span className="font-bold text-purple-400">+{formatCurrency(balanceData.totalRewards)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs border-t border-indigo-500/20 pt-2 font-bold">
              <span className="text-indigo-300">Net Authoritative Available:</span>
              <span className="text-emerald-400 text-sm">{formatCurrency(balanceData.availableBalance || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Withdrawal History</h3>
            <p className="text-xs text-slate-400">Track all your past and current payout requests</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {withdrawals.length} Record(s)
          </span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Clock className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">No withdrawal history found</p>
            <p className="text-xs text-slate-500">Submit your first request above once you have withdrawable balance.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                  <th className="py-3.5 px-4">Withdrawal ID</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Account / Details</th>
                  <th className="py-3.5 px-4">Requested Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                {withdrawals.map((w) => (
                  <tr key={w.id || w.withdrawalId} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {w.withdrawalId || w.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {w.method}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {w.walletAddress || w.accountDetails || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(w.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={w.status}>{w.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs">
                      {w.status === 'REJECTED' && w.rejectionReason ? (
                        <span className="text-rose-400 text-[11px] font-medium block truncate">
                          Reason: {w.rejectionReason}
                        </span>
                      ) : w.status === 'COMPLETED' ? (
                        <span className="text-emerald-400 text-[11px]">Payout Successful</span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">In Progress</span>
                      )}
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

export default Withdraw;
