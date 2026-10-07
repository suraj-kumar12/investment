import api from './api';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getPayoutInfo() {
    const res = await api.get('/admin/payouts/info');
    return res.data;
  },

  async processInterestPayout() {
    const res = await api.post('/admin/payouts/process');
    return res.data;
  },

  async getUsers() {
    const res = await api.get('/admin/users');
    return (res.data || []).map((u) => ({
      ...u,
      id: u._id || u.id,
    }));
  },

  async toggleUserBlockStatus(userId) {
    const res = await api.put(`/admin/users/${userId}/toggle-block`);
    return {
      ...res.data,
      id: res.data._id || res.data.id,
    };
  },

  async getAllInvestments(params) {
    const res = await api.get('/admin/investments', { params });
    const rawData = res.data;
    const rawList = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.investments)
      ? rawData.investments
      : Array.isArray(rawData?.data)
      ? rawData.data
      : [];

    const normalized = rawList.map((i) => ({
      ...i,
      id: i.investmentId || i._id,
    }));

    if (rawData && rawData.pagination) {
      return {
        investments: normalized,
        pagination: rawData.pagination,
      };
    }

    return normalized;
  },

  async getAllPayments() {
    const res = await api.get('/admin/payments');
    const rawData = res.data;
    const rawList = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.payments)
      ? rawData.payments
      : Array.isArray(rawData?.data)
      ? rawData.data
      : [];

    return rawList.map((p) => ({
      ...p,
      id: p.paymentId || p._id,
    }));
  },

  async getAllReferrals() {
    const res = await api.get('/admin/referrals');
    return (res.data || []).map((r) => ({
      ...r,
      id: r.referralId || r._id,
    }));
  },

  async getAllRewards() {
    const res = await api.get('/admin/rewards');
    return (res.data || []).map((r) => ({
      ...r,
      id: r.rewardId || r._id,
    }));
  },

  async getAllTransactions() {
    const res = await api.get('/admin/transactions');
    return (res.data || []).map((t) => ({
      ...t,
      id: t.transactionId || t._id,
    }));
  },

  async approvePayment(paymentId) {
    const res = await api.put(`/admin/payments/${paymentId}/approve`);
    return res.data;
  },

  async rejectPayment(paymentId, rejectionReason) {
    const res = await api.put(`/admin/payments/${paymentId}/reject`, { rejectionReason });
    return res.data;
  },

  async getAllWithdrawals() {
    const res = await api.get('/admin/withdrawals');
    return (res.data || []).map((w) => ({
      ...w,
      id: w.withdrawalId || w._id,
    }));
  },

  async approveWithdrawal(withdrawalId) {
    const res = await api.put(`/admin/withdrawals/${withdrawalId}/approve`);
    return res.data;
  },

  async processWithdrawal(withdrawalId) {
    const res = await api.put(`/admin/withdrawals/${withdrawalId}/processing`);
    return res.data;
  },

  async completeWithdrawal(withdrawalId) {
    const res = await api.put(`/admin/withdrawals/${withdrawalId}/complete`);
    return res.data;
  },

  async rejectWithdrawal(withdrawalId, rejectionReason) {
    const res = await api.put(`/admin/withdrawals/${withdrawalId}/reject`, { rejectionReason });
    return res.data;
  },
};
