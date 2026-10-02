import React, { useState, useEffect } from 'react';
import { Users, Gift, Copy, Share2, CheckCircle2, ShieldAlert, Sparkles, Layers } from 'lucide-react';
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

  const referralCode = user?.referralCode || '';
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

  const levels = [
    { name: 'Level 1', pct: '5%', key: 'level1', desc: 'Direct Referrals' },
    { name: 'Level 2', pct: '3%', key: 'level2', desc: "2nd Tier (Referrer's Referral)" },
    { name: 'Level 3', pct: '2%', key: 'level3', desc: '3rd Tier Referral' },
    { name: 'Level 4', pct: '1%', key: 'level4', desc: '4th Tier Referral' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Multi-Level Referral Program</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Invite friends using your unique referral code and earn multi-level rewards (5%, 3%, 2%, 1%) upon eligible verified investment payments.
        </p>
      </div>

      {/* Referral Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Direct Referrals"
          value={stats?.directReferrals || 0}
          subtitle="Level 1 Friends"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Network"
          value={stats?.totalReferrals || 0}
          subtitle="Levels 1 - 4 Total"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Successful Referrals"
          value={stats?.successfulReferrals || 0}
          subtitle="Verified Payments"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Referral Earnings"
          value={formatCurrency(stats?.totalRewards || 0)}
          subtitle="Credited Rewards"
          icon={Gift}
          color="purple"
        />
      </div>

      {/* Multi-Level Commission Structure Breakdown */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multi-Level Commission Tiers</h3>
            <p className="text-xs text-slate-400">Earn rewards from your downstream network up to 4 levels deep</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map((lvl) => {
            const data = stats?.levelBreakdown?.[lvl.key] || { count: 0, earnings: 0 };
            return (
              <div key={lvl.key} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{lvl.name}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {lvl.pct} Commission
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{lvl.desc}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Users: <strong className="text-white">{data.count}</strong></span>
                  <span className="font-bold text-emerald-400">{formatCurrency(data.earnings)}</span>
                </div>
              </div>
            );
          })}
        </div>
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
            <strong>Reward Condition Rule:</strong> Registration alone yields <strong>₹0</strong>. Status displays <em>Payment Pending</em> until the referred user completes an eligible investment payment, after which tier commissions (5%, 3%, 2%, 1%) are credited automatically.
          </span>
        </div>
      </div>

      {/* Referrals History Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Direct Referrals Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 uppercase font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4">Investment</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Reward</th>
                <th className="py-3.5 px-4">Reward Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
              {referrals.map((ref) => (
                <tr key={ref.id || ref.referralId} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-bold text-white">{ref.referredName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Level {ref.level || 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{formatDate(ref.registrationDate)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-300">
                    {ref.investmentAmount > 0 ? formatCurrency(ref.investmentAmount) : '₹0'}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={ref.paymentStatus}>{ref.paymentStatus}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    {ref.rewardStatus === 'CREDITED' ? (
                      <span className="text-emerald-400">{formatCurrency(ref.rewardAmount || 0)}</span>
                    ) : (
                      <span className="text-slate-500">₹0</span>
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
