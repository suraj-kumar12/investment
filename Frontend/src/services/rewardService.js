import api from './api';
import { getStoredData } from './mockData';

export const rewardService = {
  async getRewards(userId) {
    try {
      const res = await api.get('/rewards');
      if (res.data) {
        return res.data.map((r) => ({
          ...r,
          id: r.rewardId || r._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API getRewards unavailable, falling back to local demo mode');
    }

    const rewards = getStoredData('rewards', []);
    if (!userId) return rewards;
    return rewards.filter((r) => r.referrerId === userId);
  },

  async getRewardStats(userId) {
    try {
      const res = await api.get('/rewards/stats');
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API getRewardStats unavailable, falling back to local demo mode');
    }

    const rewards = getStoredData('rewards', []);
    const userRewards = userId ? rewards.filter((r) => r.referrerId === userId) : rewards;
    const referrals = getStoredData('referrals', []);
    const userRefs = userId ? referrals.filter((r) => r.referrerId === userId) : referrals;

    const creditedRewards = userRewards
      .filter((r) => r.status === 'CREDITED')
      .reduce((sum, r) => sum + r.rewardAmount, 0);

    const pendingCount = userRefs.filter((r) => r.paymentStatus === 'PENDING').length;
    const pendingRewards = pendingCount * 1.20;

    const totalRewards = creditedRewards + pendingRewards;

    return {
      totalRewards: Math.round(totalRewards * 100) / 100,
      pendingRewards: Math.round(pendingRewards * 100) / 100,
      creditedRewards: Math.round(creditedRewards * 100) / 100,
    };
  },
};
