import api from './api';
import { getStoredData } from './mockData';

export const referralService = {
  async getReferrals(userId) {
    try {
      const res = await api.get('/referrals');
      if (res.data) {
        return res.data.map((r) => ({
          ...r,
          id: r.referralId || r._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API getReferrals unavailable, falling back to local fallback');
    }

    const referrals = getStoredData('referrals', []);
    if (!userId) return referrals;
    return referrals.filter((r) => r.referrerId === userId);
  },

  async getReferralStats(userId) {
    try {
      const res = await api.get('/referrals/stats');
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API getReferralStats unavailable, falling back to local fallback');
    }

    const referrals = getStoredData('referrals', []);
    const userRefs = userId ? referrals.filter((r) => r.referrerId === userId) : referrals;

    const totalReferrals = userRefs.length;
    const successfulReferrals = userRefs.filter((r) => r.paymentStatus === 'SUCCESSFUL').length;
    const pendingReferrals = userRefs.filter((r) => r.paymentStatus === 'PENDING').length;
    const totalRewards = userRefs
      .filter((r) => r.rewardStatus === 'CREDITED')
      .reduce((sum, r) => sum + (r.rewardAmount || 1.20), 0);

    return {
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      totalRewards: Math.round(totalRewards * 100) / 100,
    };
  },
};
