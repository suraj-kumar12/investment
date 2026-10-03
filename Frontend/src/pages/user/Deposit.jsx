import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  Coins,
  QrCode,
  Building2,
  Copy,
  Check,
  Upload,
  AlertCircle,
  ArrowLeft,
  FileCheck,
  Lock,
  PlusCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Deposit = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: ENTER_AMOUNT, 2: PAYMENT_PROOF, 3: SUBMITTED
  const [amount, setAmount] = useState('100');
  const [paymentMethod, setPaymentMethod] = useState('USDT (BEP-20)');

  const [paymentId, setPaymentId] = useState('');
  const [receivingAddress, setReceivingAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txHashError, setTxHashError] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotError, setScreenshotError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [copiedType, setCopiedType] = useState('');

  const numAmount = Number(amount) || 0;
  const upiId = 'apexinvest@upi';
  const upiAmountINR = Math.round(numAmount * 88);
  const upiQrString = `upi://pay?pa=${upiId}&pn=ApexInvest&am=${upiAmountINR}&cu=INR`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`${type} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedType(''), 2500);
  };

  const handleInitiateDeposit = async (e) => {
    e.preventDefault();
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid deposit amount greater than $0', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await investmentService.createWalletDeposit({
        amount: numAmount,
        paymentMethod,
      });

      const pm = response.payment;
      setPaymentId(pm.paymentId || pm.id);
      setReceivingAddress(pm.receivingAddress || '0xA845c0673FF693da2E64Ff10d91c97B63eB8ae2f');
      setStep(2);
      showToast('Deposit request created! Please transfer funds and upload proof.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to create deposit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(file.type.toLowerCase()) && !allowedExts.includes(ext)) {
        const msg = 'Please upload a JPG, JPEG, PNG, or WEBP image.';
        setScreenshotError(msg);
        showToast(msg, 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        const msg = 'Screenshot must be 5 MB or smaller.';
        setScreenshotError(msg);
        showToast(msg, 'error');
        return;
      }

      setScreenshotError('');
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    setTxHashError('');
    setScreenshotError('');

    const cleanTxHash = txHash ? txHash.trim() : '';

    if (!cleanTxHash) {
      const msg = 'Transaction Hash / UTR / Reference No. is required.';
      setTxHashError(msg);
      showToast(msg, 'error');
      return;
    }

    if (!screenshotFile) {
      const msg = 'Payment screenshot proof is required.';
      setScreenshotError(msg);
      showToast(msg, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('paymentId', paymentId);
      formData.append('investmentId', 'WALLET_DEPOSIT');
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionHash', cleanTxHash);
      formData.append('screenshot', screenshotFile);

      await investmentService.submitPaymentProof(formData);

      setSubmitting(false);
      setStep(3);
      if (refreshUser) refreshUser();
      showToast('Deposit proof submitted! Waiting for admin review & wallet credit.', 'success');
    } catch (err) {
      setSubmitting(false);
      showToast(err.message || 'Failed to submit proof', 'error');
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <FileCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
              Pending Admin Verification
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">Deposit Proof Submitted!</h2>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
              Your deposit receipt screenshot has been uploaded. Once Admin verifies the transfer, your wallet balance will be credited with exact confirmed amount.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Deposit Payment ID:</span>
              <span className="font-mono text-indigo-400 font-bold">{paymentId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Deposit Amount:</span>
              <span className="text-white font-bold">{formatCurrency(numAmount)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Payment Channel:</span>
              <span className="text-amber-300 font-semibold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reference / TxHash:</span>
              <span className="font-mono text-slate-200 font-semibold truncate max-w-[200px]">{txHash}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button variant="emerald" onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-400" />
            <span>Add Money to Wallet</span>
          </h1>
          <p className="text-xs text-slate-400">Deposit funds into your verified platform wallet balance</p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {step === 1 && (
          <form onSubmit={handleInitiateDeposit} className="space-y-6">
            <Input
              label="Deposit Amount ($)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              helperText={`Current Wallet Balance: ${formatCurrency(user?.walletBalance || 0)}`}
            />

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                Select Deposit Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'USDT (BEP-20)', label: 'USDT Crypto', icon: Coins },
                  { id: 'UPI Payment', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'Bank Transfer', label: 'Bank Wire', icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                        isSel
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSel ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" variant="emerald" size="lg" isLoading={submitting} className="w-full font-bold">
              Proceed to Deposit Instructions
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex justify-between items-center text-xs">
              <span className="text-slate-300">Deposit Amount Requested:</span>
              <span className="text-base font-black text-emerald-400">{formatCurrency(numAmount)}</span>
            </div>

            {/* Deposit Instructions Display */}
            {paymentMethod === 'USDT (BEP-20)' && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Scan USDT BEP-20 QR Code
                </span>
                <div className="p-3 bg-white rounded-2xl inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(receivingAddress)}`}
                    alt="QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="truncate">{receivingAddress}</span>
                  <button type="button" onClick={() => handleCopy(receivingAddress, 'Address')} className="text-indigo-400 text-xs font-bold shrink-0 ml-2">
                    Copy
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'UPI Payment' && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Scan UPI QR Code (₹{upiAmountINR} INR)
                </span>
                <div className="p-3 bg-white rounded-2xl inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiQrString)}`}
                    alt="UPI QR Code"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                </div>
                <div className="text-xs text-slate-300 font-mono flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span>{upiId}</span>
                  <button type="button" onClick={() => handleCopy(upiId, 'UPI ID')} className="text-indigo-400 text-xs font-bold shrink-0">
                    Copy
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'Bank Transfer' && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Bank Transfer Details</span>
                <div className="flex justify-between"><span className="text-slate-400">Bank:</span><span className="font-bold text-white">HDFC Bank Ltd.</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Account:</span><span className="font-mono font-bold text-emerald-400">50200088991234</span></div>
                <div className="flex justify-between"><span className="text-slate-400">IFSC:</span><span className="font-mono font-bold text-slate-200">HDFC0001234</span></div>
              </div>
            )}

            {/* Proof Submission Form */}
            <form onSubmit={handleSubmitProof} className="space-y-4 pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Transaction Hash / UTR / Ref No. *</label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter transaction reference / UTR number"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs text-white"
                />
                {txHashError && <span className="text-rose-400 text-[11px] block">{txHashError}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Upload Payment Receipt Screenshot *</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-2"
                />
                {screenshotError && <span className="text-rose-400 text-[11px] block">{screenshotError}</span>}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} className="w-1/3">
                  Back
                </Button>
                <Button type="submit" variant="emerald" isLoading={submitting} disabled={submitting} className="w-2/3 font-bold" icon={Lock}>
                  Submit Deposit Proof
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;
