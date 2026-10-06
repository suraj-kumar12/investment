import api from './api';

export const rewardService = {
  async getRewards() {
    const res = await api.get('/rewards');
    if (res.data) {
      return res.data.map((r) => ({
        ...r,
        id: r.rewardId || r._id,
      }));
    }
    return [];
  },

  async getRewardStats() {
    const res = await api.get('/rewards/stats');
    return res.data;
  },
};
