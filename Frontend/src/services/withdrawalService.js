import api from './api';

export const withdrawalService = {
  // Fetch available balance & breakdown strictly from backend API
  async getAvailableBalance() {
    const res = await api.get('/withdrawals/balance');
    return res.data;
  },

  // Submit a withdrawal request
  async requestWithdrawal(data) {
    const res = await api.post('/withdrawals', data);
    return res.data;
  },

  // Get current user's withdrawal history
  async getMyWithdrawals() {
    const res = await api.get('/withdrawals/my');
    if (res.data) {
      return res.data.map((w) => ({
        ...w,
        id: w.withdrawalId || w._id,
      }));
    }
    return [];
  },

  // Get withdrawal by ID
  async getWithdrawalById(id) {
    const res = await api.get(`/withdrawals/${id}`);
    if (res.data) {
      return {
        ...res.data,
        id: res.data.withdrawalId || res.data._id,
      };
    }
    throw new Error('Withdrawal record not found');
  },
};

export default withdrawalService;
