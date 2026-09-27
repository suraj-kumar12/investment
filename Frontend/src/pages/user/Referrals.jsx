import React, { useState, useEffect } from 'react';
import { Users, Gift, Copy, Share2, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { referralService } from '../../services/referralService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const Referrals = () => {
  const { user } = useAuth();
  const { refreshTrigger } = useData();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = user?.referralCode || 'SUR123';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const refs = await referralService.getReferrals(user?.id);
        const rStats = await referralService.getReferralStats(user?.id);
        setReferrals(refs);
        setStats(rStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, refreshTrigger]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast(`Referral code ${referralCode} copied!`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join ApexInvest',
        text: `Register using my referral code ${referralCode} to start investing!`,
        url: referralLink,
      });
    } else {
      handleCopyLink();
    }
  };

  if (loading) return <Skeleton type="table" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Referral Program</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Invite friends using your unique referral code and earn $1.20 upon eligible referred payment verification.
        </p>
      </div>

      {/* Referral Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Referrals"
          value={stats?.totalReferrals || 12}
          subtitle="Registered Friends"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Successful Referrals"
          value={stats?.successfulReferrals || 8}
          subtitle="Verified Payments"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Referrals"
          value={stats?.pendingReferrals || 3}
          subtitle="Payment Pending ($0)"
          icon={ShieldAlert}
          color="amber"
        />
        <StatCard
          title="Total Referral Rewards"
          value={formatCurrency(stats?.totalRewards || 9.60)}
          subtitle="Credited Rewards"
          icon={Gift}
          color="purple"
        />
      </div>

      {/* Referral Code & Sharing Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your Referral Share Tools</h3>
            <p className="text-xs text-slate-400">Share your link directly or copy your referral code</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">Your Referral Code</span>
            <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
              <span className="text-xl font-mono font-bold text-indigo-400">{referralCode}</span>
              <Button variant="secondary" size="sm" icon={Copy} onClick={handleCopyCode}>
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">Your Referral Link</span>
            <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
              <span className="text-xs font-mono text-slate-300 truncate">{referralLink}</span>
              <div className="flex items-center gap-2">
                <Button variant="emerald" size="sm" icon={Copy} onClick={handleCopyLink}>
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button variant="outline" size="sm" icon={Share2} onClick={handleShare} />
              </div>
            </div>
          </div>
        </div>

        {/* Rule Reminder */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Reward Condition Rule:</strong> Registration alone yields <strong>$0</strong>. Status displays <em>Payment Pending</em> until the referred friend completes an eligible payment, after which <strong>$1.20</strong> is automatically credited.
          </span>
        </div>
      </div>

      {/* Referrals History Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Referral Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4">Investment</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Reward</th>
                <th className="py-3.5 px-4">Reward Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{ref.referredName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{formatDate(ref.registrationDate)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-300">
                    {ref.investmentAmount > 0 ? formatCurrency(ref.investmentAmount) : '$0 (No investment)'}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={ref.paymentStatus}>{ref.paymentStatus}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    {ref.rewardStatus === 'CREDITED' ? (
                      <span className="text-emerald-400">$1.20</span>
                    ) : (
                      <span className="text-slate-500">$0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={ref.rewardStatus}>{ref.rewardStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
