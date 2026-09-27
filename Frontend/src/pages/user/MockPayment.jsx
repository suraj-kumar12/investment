import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, Building2, CheckCircle2, ShieldAlert, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const MockPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useData();
  const { showToast } = useToast();

  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Demo UPI');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInv = async () => {
      setLoading(true);
      try {
        const inv = await investmentService.getInvestmentById(id);
        setInvestment(inv);
      } catch (err) {
        showToast('Investment not found', 'error');
        navigate('/dashboard/investments');
      } finally {
        setLoading(false);
      }
    };
    fetchInv();
  }, [id]);

  const handleProcessPayment = async () => {
    setProcessing(true);
    try {
      const res = await investmentService.processMockPayment(id, { paymentMethod });
      setProcessing(false);
      setSuccess(true);
      refreshData();

      showToast('Payment verified successfully! Investment activated.', 'success');

      if (res.rewardTriggered && res.rewardInfo) {
        showToast(
          `🎉 Referral Reward Triggered! ${res.rewardInfo.referrerName} received ₹100 reward.`,
          'info',
          6000
        );
      }

      setTimeout(() => {
        navigate('/dashboard/investments');
      }, 2000);
    } catch (err) {
      setProcessing(false);
      showToast(err.message || 'Payment simulation failed', 'error');
    }
  };

  if (loading) {
    return <Skeleton type="card" />;
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white">Payment Successful!</h2>
        <p className="text-sm text-slate-300">
          Your demo investment of <strong className="text-white">{formatCurrency(investment.amount)}</strong> is now active.
        </p>
        <p className="text-xs text-slate-400">Redirecting to your investments ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/investments')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Demo Payment Gateway</h1>
          <p className="text-xs text-slate-400">Mock payment options for portfolio demonstration</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Order Summary Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Investment Order Summary</span>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Investment ID:</span>
            <span className="font-mono text-indigo-400 font-bold">{investment.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Plan Tier:</span>
            <span className="text-white font-bold">{investment.planName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Projected Return Rate:</span>
            <span className="text-emerald-400 font-bold">{investment.rate}%</span>
          </div>
          <div className="flex justify-between text-base border-t border-slate-800 pt-3">
            <span className="font-bold text-white">Total Amount Payable:</span>
            <span className="font-black text-2xl text-white">{formatCurrency(investment.amount)}</span>
          </div>
        </div>

        {/* Mock Payment Methods Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Select Mock Payment Method</label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('Demo UPI')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                paymentMethod === 'Demo UPI'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <QrCode className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold">Demo UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Demo Card')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                paymentMethod === 'Demo Card'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold">Demo Debit / Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Demo Net Banking')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                paymentMethod === 'Demo Net Banking'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Building2 className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold">Demo Net Banking</span>
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>No actual money will be deducted. Clicking "Pay Now" simulates a successful payment response.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard/investments')} className="w-1/3">
            Cancel
          </Button>
          <Button variant="emerald" isLoading={processing} onClick={handleProcessPayment} className="w-2/3" icon={Lock}>
            {processing ? 'Processing Payment...' : `Pay ${formatCurrency(investment.amount)} Now`}
          </Button>
        </div>
      </div>
    </div>
  );
};
