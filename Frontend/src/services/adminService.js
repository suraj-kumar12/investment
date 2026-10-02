import api from './api';
import { getStoredData, setStoredData } from './mockData';

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API admin getDashboardStats unavailable, falling back to local demo mode');
    }

    const users = getStoredData('users', []).filter((u) => u.role !== 'admin');
    const investments = getStoredData('investments', []);
    const rewards = getStoredData('rewards', []);

    const totalUsers = users.length;
    const totalInvestments = investments.length;
    const totalInvestmentAmount = investments
      .filter((i) => i.paymentStatus === 'SUCCESSFUL')
      .reduce((sum, i) => sum + i.amount, 0);
    const successfulPayments = investments.filter((i) => i.paymentStatus === 'SUCCESSFUL').length;
    const totalReferralRewards = rewards
      .filter((r) => r.status === 'CREDITED')
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    const activeInvestments = investments.filter((i) => i.status === 'ACTIVE').length;
    const maturedInvestments = investments.filter((i) => i.status === 'MATURED').length;

    return {
      totalUsers,
      totalInvestments,
      totalInvestmentAmount: Math.round(totalInvestmentAmount * 100) / 100,
      successfulPayments,
      totalReferralRewards: Math.round(totalReferralRewards * 100) / 100,
      activeInvestments,
      maturedInvestments,
    };
  },

  async getUsers() {
    try {
      const res = await api.get('/admin/users');
      if (res.data) {
        return res.data.map((u) => ({
          ...u,
          id: u._id || u.id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getUsers unavailable, falling back to local demo mode');
    }

    return getStoredData('users', []).filter((u) => u.role !== 'admin');
  },

  async toggleUserBlockStatus(userId) {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-block`);
      if (res.data) {
        return {
          ...res.data,
          id: res.data._id || res.data.id,
        };
      }
    } catch (err) {
      console.warn('Backend API admin toggleUserBlockStatus unavailable, falling back to local demo mode');
    }

    const users = getStoredData('users', []);
    const index = users.findIndex((u) => u.id === userId || u._id === userId);
    if (index === -1) throw new Error('User not found');

    const current = users[index].status;
    users[index].status = current === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    setStoredData('users', users);
    return users[index];
  },

  async getAllInvestments() {
    try {
      const res = await api.get('/admin/investments');
      if (res.data) {
        return res.data.map((i) => ({
          ...i,
          id: i.investmentId || i._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getAllInvestments unavailable, falling back to local demo mode');
    }

    return getStoredData('investments', []);
  },

  async getAllPayments() {
    try {
      const res = await api.get('/admin/payments');
      if (res.data) {
        return res.data.map((p) => ({
          ...p,
          id: p.paymentId || p._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getAllPayments unavailable, falling back to local demo mode');
    }

    return getStoredData('payments', []);
  },

  async getAllReferrals() {
    try {
      const res = await api.get('/admin/referrals');
      if (res.data) {
        return res.data.map((r) => ({
          ...r,
          id: r.referralId || r._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getAllReferrals unavailable, falling back to local demo mode');
    }

    return getStoredData('referrals', []);
  },

  async getAllRewards() {
    try {
      const res = await api.get('/admin/rewards');
      if (res.data) {
        return res.data.map((r) => ({
          ...r,
          id: r.rewardId || r._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getAllRewards unavailable, falling back to local demo mode');
    }

    return getStoredData('rewards', []);
  },

  async getAllTransactions() {
    try {
      const res = await api.get('/admin/transactions');
      if (res.data) {
        return res.data.map((t) => ({
          ...t,
          id: t.transactionId || t._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getAllTransactions unavailable, falling back to local demo mode');
    }

    return getStoredData('transactions', []);
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
    try {
      const res = await api.get('/admin/withdrawals');
      if (res.data) {
        return res.data.map((w) => ({
          ...w,
          id: w.withdrawalId || w._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API admin getAllWithdrawals unavailable, falling back to local demo mode');
    }

    return getStoredData('withdrawals', []);
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
