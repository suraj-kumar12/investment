import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
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
  const { user } = useAuth();
  const { showToast } = useToast();

  const paramAmount = searchParams.get('amount');
  const paramPlan = searchParams.get('plan');
  const defaultInitialAmount = paramAmount || (paramPlan === 'starter' ? '12' : paramPlan === 'growth' ? '60' : paramPlan === 'premium' ? '120' : '120');

  const [amount, setAmount] = useState(defaultInitialAmount);
  const [duration, setDuration] = useState('1 Year');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calc = calculateInvestment(amount);
  const estimatedMaturityDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!calc.isValid) {
      showToast(calc.error || 'Invalid investment amount', 'error');
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmCreate = async () => {
    setSubmitting(true);
    try {
      const inv = await investmentService.createPendingInvestment({
        userId: user.id,
        userName: user.name,
        amount: Number(amount),
        planId: calc.planName.toLowerCase(),
        duration,
      });

      showToast('Investment plan selected! Proceeding to payment.', 'success');
      setConfirmModalOpen(false);
      navigate(`/dashboard/payment/${inv.id}`);
    } catch (err) {
      showToast(err.message || 'Failed to create investment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Investment Plan</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select an investment amount to calculate demo returns and proceed to payment simulation.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
        <form onSubmit={handleOpenConfirm} className="space-y-6">
          <Input
            label="Investment Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 120"
            error={!calc.isValid ? calc.error : null}
            helperText="Minimum investment amount is $12"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Investment Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="1 Year">1 Year (Default Demo Term)</option>
            </select>
          </div>

          {/* Dynamic Return Calculation Display Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Live Demo Return Breakdown
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {calc.planName} Tier
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Applicable Rate</span>
                <span className="text-lg font-bold text-emerald-400">{calc.rate}% Demo Annual</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Projected 1-Yr Profit</span>
                <span className="text-lg font-bold text-indigo-300">+{formatCurrency(calc.profit)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Projected Maturity</span>
                <span className="text-xl font-black text-white">{formatCurrency(calc.maturityValue)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Estimated Maturity Date</span>
                <span className="text-sm font-semibold text-slate-300">{formatDate(estimatedMaturityDate)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Labelled as <strong>Demo / Projected Return</strong>. Returns are calculated based on tier parameters.</span>
            </div>
          </div>

          <Button type="submit" variant="emerald" size="lg" icon={ArrowRight} className="w-full">
            Review & Proceed to Payment
          </Button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} title="Confirm Investment Setup">
        <div className="space-y-6">
          <p className="text-sm text-slate-300">
            Please verify your demo investment parameters before proceeding to the mock payment gateway.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-slate-400">Investor:</span><span className="text-white font-bold">{user?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Plan Tier:</span><span className="text-indigo-400 font-bold">{calc.planName}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Investment Amount:</span><span className="text-white font-bold">{formatCurrency(amount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Demo Return Rate:</span><span className="text-emerald-400 font-bold">{calc.rate}%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Projected Profit:</span><span className="text-indigo-300 font-bold">+{formatCurrency(calc.profit)}</span></div>
            <div className="flex justify-between border-t border-slate-800 pt-2 text-sm"><span className="font-bold text-white">Maturity Amount:</span><span className="font-black text-emerald-400">{formatCurrency(calc.maturityValue)}</span></div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button variant="emerald" isLoading={submitting} onClick={handleConfirmCreate} className="w-1/2">
              Confirm & Pay
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
