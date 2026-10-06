import api from './api';

export const referralService = {
  async getReferrals() {
    const res = await api.get('/referrals');
    if (res.data) {
      return res.data.map((r) => ({
        ...r,
        id: r.referralId || r._id,
      }));
    }
    return [];
  },

  async getReferralStats() {
    const res = await api.get('/referrals/stats');
    return res.data;
  },
};
