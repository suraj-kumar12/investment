import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calculator, ArrowRight, ShieldCheck, Wallet, AlertCircle, PlusCircle } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { calculateInvestment } from '../../utils/investmentCalculator';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const NewInvestment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const paramAmount = searchParams.get('amount');
  const paramPlan = searchParams.get('plan');
  const defaultInitialAmount = paramAmount || (paramPlan === 'starter' ? '12' : paramPlan === 'growth' ? '60' : paramPlan === 'premium' ? '120' : '120');

  const [amount, setAmount] = useState(defaultInitialAmount);
  const [duration, setDuration] = useState('1 Year');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const numAmount = Number(amount) || 0;
  const walletBalance = Number(user?.walletBalance) || 0;
  const isInsufficient = numAmount > walletBalance;
  const remainingWalletBalance = Math.max(0, walletBalance - numAmount);

  const calc = calculateInvestment(amount);
  const estimatedMaturityDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    if (refreshUser) refreshUser();
  }, []);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!calc.isValid) {
      showToast(calc.error || 'Invalid investment amount', 'error');
      return;
    }
    if (isInsufficient) {
      showToast('Insufficient wallet balance. Please add money to your wallet first.', 'error');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await investmentService.createPendingInvestment({
        userId: user?.id || user?._id,
        userName: user?.name,
        amount: numAmount,
        planId: calc.planName.toLowerCase(),
        duration,
      });

      showToast('Investment created successfully using wallet balance!', 'success');
      setConfirmModalOpen(false);
      if (refreshUser) await refreshUser();
      navigate('/dashboard/investments');
    } catch (err) {
      showToast(err.message || 'Failed to create investment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Investment Plan</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Invest directly from your verified wallet balance.
          </p>
        </div>

        {/* Live Wallet Balance Badge */}
        <div className="glass-card px-4 py-2.5 rounded-2xl border border-indigo-500/30 flex items-center gap-3">
          <Wallet className="w-5 h-5 text-indigo-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Wallet Balance</span>
            <span className="text-base font-black text-emerald-400">{formatCurrency(walletBalance)}</span>
          </div>
        </div>
      </div>

      {/* Insufficient Balance Banner */}
      {isInsufficient && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              <strong>Insufficient wallet balance.</strong> Please add money to your wallet before investing.
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/dashboard/deposit')}
            className="bg-rose-500/20 text-rose-200 border border-rose-500/30 hover:bg-rose-500/30 font-bold shrink-0"
          >
            Add Money to Wallet
          </Button>
        </div>
      )}

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        <form onSubmit={handleOpenConfirm} className="space-y-6">
          <Input
            label="Investment Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 120"
            error={!calc.isValid ? calc.error : isInsufficient ? 'Amount exceeds available wallet balance' : null}
            helperText={`Minimum investment amount is $12 (Available Wallet: ${formatCurrency(walletBalance)})`}
          />

          {/* Wallet Impact Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Current Wallet Balance:</span>
              <span className="text-sm font-bold text-white">{formatCurrency(walletBalance)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Investment Amount:</span>
              <span className="text-sm font-bold text-indigo-400">-{formatCurrency(numAmount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Remaining Wallet Balance:</span>
              <span className={`text-sm font-bold ${isInsufficient ? 'text-rose-400' : 'text-emerald-400'}`}>
                {formatCurrency(remainingWalletBalance)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Investment Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="1 Year">1 Year Term</option>
            </select>
          </div>

          {/* Return Calculation Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Scheduled Payout Overview
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                4% Every 1st & 15th
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Interest Rate</span>
                <span className="text-lg font-bold text-emerald-400">4% per payout cycle</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Payout Schedule</span>
                <span className="text-sm font-semibold text-indigo-300">1st & 15th of every month</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Cycle Payout Amount</span>
                <span className="text-xl font-black text-white">{formatCurrency(numAmount * 0.04)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Scheduled Monthly Rate</span>
                <span className="text-sm font-semibold text-emerald-400">8% Monthly ({formatCurrency(numAmount * 0.08)})</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="emerald"
            size="lg"
            icon={ArrowRight}
            className="w-full font-bold py-3.5 shadow-lg shadow-emerald-600/20"
            disabled={!calc.isValid || isInsufficient || submitting}
          >
            {isInsufficient ? 'Insufficient Wallet Balance' : 'Confirm & Create Investment'}
          </Button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} title="Confirm Wallet Investment">
        <div className="space-y-6">
          <p className="text-sm text-slate-300">
            Confirm investment creation. Your wallet balance will be deducted atomically by {formatCurrency(numAmount)}.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Investor:</span><span className="text-white font-bold">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Investment Amount:</span><span className="text-white font-bold">{formatCurrency(numAmount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Interest Rate:</span><span className="text-emerald-400 font-bold">4% per payout cycle (1st & 15th)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Current Wallet Balance:</span><span className="text-emerald-400 font-bold">{formatCurrency(walletBalance)}</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2"><span className="text-slate-400 font-bold">Wallet Balance After:</span><span className="text-emerald-400 font-bold">{formatCurrency(remainingWalletBalance)}</span></div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button variant="emerald" isLoading={submitting} disabled={submitting} onClick={handleConfirmCreate} className="w-1/2 font-bold">
              Confirm & Deduct Wallet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewInvestment;
