import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  Coins,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  X,
  FileCheck,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, getImageUrl } from '../../utils/formatters';
import { investmentService } from '../../services/investmentService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const MockPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshData } = useData();
  const { showToast } = useToast();

  const [investment, setInvestment] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active payment channel: 'USDT (BEP-20)' | 'UPI Payment' | 'Bank Transfer'
  const [paymentMethod, setPaymentMethod] = useState('USDT (BEP-20)');

  // Form states
  const [txHash, setTxHash] = useState('');
  const [txHashError, setTxHashError] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotError, setScreenshotError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Copy status indicators
  const [copiedType, setCopiedType] = useState('');

  // Submission state: 'FORM' | 'SUBMITTED'
  const [submissionState, setSubmissionState] = useState('FORM');

  useEffect(() => {
    const fetchInvAndPayment = async () => {
      setLoading(true);
      try {
        const inv = await investmentService.getInvestmentById(id);
        setInvestment(inv);

        if (inv) {
          const pm = await investmentService.createPayment(inv.id);
          setPaymentDetails(pm);
          if (pm?.screenshotUrl) {
            setSubmissionState('SUBMITTED');
            setScreenshotPreview(getImageUrl(pm.screenshotUrl));
          } else {
            setSubmissionState('FORM');
          }
        }
      } catch (err) {
        showToast('Investment record not found', 'error');
        navigate('/dashboard/investments');
      } finally {
        setLoading(false);
      }
    };
    fetchInvAndPayment();
  }, [id]);

  const receivingAddress = paymentDetails?.receivingAddress || '';
  const usdtAmount = paymentDetails?.expectedAmount || investment?.amount || 0;
  
  // UPI QR Code payment string
  const upiId = 'apexinvest@upi';
  const upiAmountINR = Math.round(usdtAmount * 88); // Approx 88 INR/USDT exchange rate
  const upiQrString = `upi://pay?pa=${upiId}&pn=ApexInvest&am=${upiAmountINR}&cu=INR`;

  // Copy helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`${type} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedType(''), 2500);
  };

  // Image upload preview & format/size validation handler
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
        setScreenshotFile(null);
        setScreenshotPreview(null);
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        const msg = 'Payment screenshot must be 5 MB or smaller.';
        setScreenshotError(msg);
        showToast(msg, 'error');
        setScreenshotFile(null);
        setScreenshotPreview(null);
        e.target.value = '';
        return;
      }

      setScreenshotError('');
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setScreenshotFile(null);
    if (screenshotPreview && !screenshotPreview.startsWith('http')) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotPreview(null);
    setScreenshotError('');
  };

  // Submit proof handler with complete frontend validation
  const handleSubmitProof = async (e) => {
    e.preventDefault();

    setTxHashError('');
    setScreenshotError('');

    const cleanTxHash = txHash ? txHash.trim() : '';

    // Step 1: Validate Reference No / TxHash
    if (!cleanTxHash) {
      const msg = 'Transaction Hash / UTR / Reference No. is required.';
      setTxHashError(msg);
      showToast(msg, 'error');
      return;
    }

    // Step 2: Validate Screenshot presence
    if (!screenshotFile && !screenshotPreview) {
      const msg = 'Payment screenshot is required.';
      setScreenshotError(msg);
      showToast(msg, 'error');
      return;
    }

    // Step 3: Validate Screenshot type if new file selected
    if (screenshotFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
      const ext = screenshotFile.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(screenshotFile.type.toLowerCase()) && !allowedExts.includes(ext)) {
        const msg = 'Please upload a JPG, JPEG, PNG, or WEBP image.';
        setScreenshotError(msg);
        showToast(msg, 'error');
        return;
      }

      // Step 4: Validate Screenshot size (<= 5MB)
      if (screenshotFile.size > 5 * 1024 * 1024) {
        const msg = 'Payment screenshot must be 5 MB or smaller.';
        setScreenshotError(msg);
        showToast(msg, 'error');
        return;
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('investmentId', investment.id);
      formData.append('paymentId', paymentDetails?.id || paymentDetails?.paymentId || '');
      formData.append('paymentMethod', paymentMethod);
      formData.append('transactionHash', cleanTxHash);
      if (screenshotFile) {
        formData.append('screenshot', screenshotFile);
      }

      const res = await investmentService.submitPaymentProof(formData);

      setSubmitting(false);
      setSubmissionState('SUBMITTED');
      if (res.payment?.screenshotUrl) {
        setScreenshotPreview(getImageUrl(res.payment.screenshotUrl));
      }
      refreshData();
      showToast('Payment proof submitted successfully! Waiting for Admin verification.', 'success');
    } catch (err) {
      setSubmitting(false);
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit payment proof';
      showToast(errMsg, 'error');
    }
  };

  if (loading) {
    return <Skeleton type="card" />;
  }

  // View shown after proof has been submitted
  if (submissionState === 'SUBMITTED') {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div className="glass-card p-8 rounded-3xl border border-amber-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
            <FileCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
              Payment Under Admin Review
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">Proof Submitted!</h2>
            <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
              Your payment receipt screenshot and transaction reference have been uploaded. Our admin will verify the receipt and activate your investment portfolio.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Investment ID:</span>
              <span className="font-mono text-indigo-400 font-bold">{investment?.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Plan Tier:</span>
              <span className="text-emerald-400 font-bold">{investment?.planName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Amount Paid:</span>
              <span className="text-white font-bold">{usdtAmount} USDT (${formatCurrency(investment?.amount)})</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Payment Channel:</span>
              <span className="text-amber-300 font-semibold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reference / TxHash:</span>
              <span className="font-mono text-slate-200 font-semibold truncate max-w-[200px]" title={txHash}>
                {txHash || 'Submitted'}
              </span>
            </div>
          </div>

          {screenshotPreview && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Uploaded Receipt Screenshot:
              </span>
              <img
                src={screenshotPreview}
                alt="Payment Proof Screenshot"
                className="w-full max-h-48 object-contain rounded-xl border border-slate-800 bg-black"
              />
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSubmissionState('FORM')}
              icon={RefreshCw}
              className="w-full sm:w-1/2"
            >
              Update / Re-upload Proof
            </Button>
            <Button
              type="button"
              variant="emerald"
              onClick={() => navigate('/dashboard/investments')}
              className="w-full sm:w-1/2"
            >
              View My Portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/investments')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Real Payment Gateway</h1>
          <p className="text-xs text-slate-400">Make payment & upload screenshot receipt for admin verification</p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Order Summary Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Investment Order Summary
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {investment.planName} Tier
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Investment ID:</span>
            <span className="font-mono text-indigo-400 font-bold">{investment.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Annual Return Rate:</span>
            <span className="text-emerald-400 font-bold">{investment.rate}%</span>
          </div>
          <div className="flex justify-between text-base border-t border-slate-800 pt-3">
            <span className="font-bold text-white">Amount Payable:</span>
            <div className="text-right">
              <span className="font-black text-2xl text-emerald-400 block">{usdtAmount} USDT</span>
              <span className="text-[11px] text-slate-400 block">($ {formatCurrency(investment.amount)} / Approx ₹{upiAmountINR})</span>
            </div>
          </div>
        </div>

        {/* Payment Channel Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Step 1: Select Payment Method
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('USDT (BEP-20)')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                paymentMethod === 'USDT (BEP-20)'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Coins className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold block">USDT (BEP-20)</span>
                <span className="text-[10px] text-slate-400">Crypto Wallet QR</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('UPI Payment')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                paymentMethod === 'UPI Payment'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <QrCode className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-bold block">UPI / QR Code</span>
                <span className="text-[10px] text-slate-400">GPay / PhonePe / Paytm</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Bank Transfer')}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                paymentMethod === 'Bank Transfer'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold block">Bank Transfer</span>
                <span className="text-[10px] text-slate-400">IMPS / NEFT Details</span>
              </div>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAYMENT INSTRUCTIONS & QR CODE DISPLAY */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
          {paymentMethod === 'USDT (BEP-20)' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Scan USDT BEP-20 QR Code
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Scan with Trust Wallet, Binance, MetaMask, OKX, or any BEP-20 wallet
                </span>
              </div>

              {/* Official Binance BSC QR Code Image */}
              <div className="p-4 rounded-2xl bg-white shadow-xl shadow-amber-500/10 inline-block">
                <img
                  src="/binance-bsc-qr.jpg"
                  onError={(e) => {
                    e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(receivingAddress)}`;
                  }}
                  alt="USDT BSC Receiving Address QR Code"
                  className="w-48 h-48 object-contain mx-auto rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Transfer Exact Amount:</span>
                <div className="text-2xl font-black text-amber-400">{usdtAmount} USDT</div>
              </div>

              <div className="w-full space-y-1 text-left">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Receiving Wallet Address (BSC):
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-mono text-xs text-slate-200 truncate flex-1">
                    {receivingAddress}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(receivingAddress, 'Wallet Address')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
                  >
                    {copiedType === 'Wallet Address' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === 'Wallet Address' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'UPI Payment' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Scan UPI QR Code
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white shadow-xl shadow-indigo-500/10 inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiQrString)}`}
                  alt="UPI Payment QR Code"
                  className="w-44 h-44 object-contain mx-auto"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Payable Amount:</span>
                <div className="text-2xl font-black text-indigo-400">₹{upiAmountINR} INR</div>
                <span className="text-[10px] text-slate-500 block">Equivalent to {usdtAmount} USDT</span>
              </div>

              <div className="w-full space-y-1 text-left">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Platform UPI ID:
                </label>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-mono text-xs text-slate-200 flex-1 font-bold">
                    {upiId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(upiId, 'UPI ID')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
                  >
                    {copiedType === 'UPI ID' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === 'UPI ID' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'Bank Transfer' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Direct Bank Account Transfer
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Execute IMPS / NEFT transfer via your netbanking app
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Bank Name:</span>
                  <span className="font-bold text-white block">HDFC Bank Ltd.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Account Holder:</span>
                  <span className="font-bold text-white block">ApexInvest Capital</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px]">Account Number:</span>
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-emerald-400 text-sm">50200088991234</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('50200088991234', 'Account No')}
                      className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px]">IFSC Code:</span>
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-slate-200 text-sm">HDFC0001234</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('HDFC0001234', 'IFSC Code')}
                      className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PROOF SUBMISSION FORM */}
        {/* ------------------------------------------------------------- */}
        <form onSubmit={handleSubmitProof} className="space-y-5 pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
            Step 2: Upload Payment Proof & Reference
          </label>

          {/* Reference / TxHash Input */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">
              Transaction Hash / UTR / Reference No. <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => {
                setTxHash(e.target.value);
                if (txHashError) setTxHashError('');
              }}
              placeholder={
                paymentMethod === 'USDT (BEP-20)'
                  ? 'e.g. 0x1234567890abcdef1234567890abcdef...'
                  : 'e.g. UTR 426719823019 or Ref No.'
              }
              disabled={submitting}
              className={`w-full bg-slate-900 border rounded-xl py-3 px-4 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50 ${
                txHashError ? 'border-red-500/80 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'
              }`}
            />
            {txHashError && (
              <span className="text-[11px] text-red-400 font-semibold block flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                {txHashError}
              </span>
            )}
          </div>

          {/* Image File Picker & Drag-and-Drop */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">
              Upload Payment Receipt Screenshot Proof <span className="text-red-400">*</span>
            </label>

            {!screenshotPreview ? (
              <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all text-center space-y-2 group ${
                screenshotError ? 'border-red-500/80 hover:border-red-500' : 'border-slate-700 hover:border-amber-500/60'
              }`}>
                <div className="p-3 rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  Click to select payment screenshot receipt
                </span>
                <span className="text-[10px] text-slate-500">
                  Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={submitting}
                />
              </label>
            ) : (
              <div className="relative p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                <img
                  src={screenshotPreview}
                  alt="Proof Preview"
                  className="w-16 h-16 object-cover rounded-xl border border-slate-700 bg-black shrink-0"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <span className="font-bold text-white truncate block">
                    {screenshotFile?.name || 'Uploaded Screenshot'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {screenshotFile?.size ? `${(screenshotFile.size / 1024).toFixed(1)} KB` : 'Ready to submit'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={submitting}
                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {screenshotError && (
              <span className="text-[11px] text-red-400 font-semibold block flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                {screenshotError}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard/investments')}
              disabled={submitting}
              className="w-1/3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              isLoading={submitting}
              disabled={submitting}
              className="w-2/3"
              icon={Lock}
            >
              {submitting ? 'Uploading Proof...' : 'Submit Payment Proof'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
