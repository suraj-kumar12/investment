import api from './api';
import { getStoredData, setStoredData } from './mockData';
import { generateShortId } from '../utils/formatters';

export const withdrawalService = {
  // Fetch available balance & breakdown
  async getAvailableBalance() {
    try {
      const res = await api.get('/withdrawals/balance');
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API getAvailableBalance unavailable, falling back to local demo mode calculation');
    }

    const investments = getStoredData('investments', []).filter((i) => i.paymentStatus === 'SUCCESSFUL');
    const totalActivePrincipal = investments.reduce((sum, i) => sum + (i.amount || 0), 0);
    const accruedActiveProfit = investments.reduce((sum, i) => {
      const progressRatio = Math.min(1, Math.max(0, (i.progressPercent ?? 0) / 100));
      return sum + ((i.profit || 0) * progressRatio);
    }, 0);
    const rewards = getStoredData('rewards', []).filter((r) => r.status === 'CREDITED');
    const totalRewards = rewards.reduce((sum, r) => sum + (r.rewardAmount || 0), 0);
    const withdrawals = getStoredData('withdrawals', []).filter((w) =>
      ['PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED'].includes(w.status)
    );
    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);

    const availableBalance = Math.max(0, Math.round((totalActivePrincipal + accruedActiveProfit + totalRewards - totalWithdrawn) * 100) / 100);

    return {
      availableBalance,
      minWithdrawalAmount: 10,
      totalRewards: Math.round(totalRewards * 100) / 100,
      totalActivePrincipal: Math.round(totalActivePrincipal * 100) / 100,
      accruedActiveProfit: Math.round(accruedActiveProfit * 100) / 100,
      totalPendingWithdrawals: withdrawals.filter(w => w.status !== 'COMPLETED').reduce((s, w) => s + w.amount, 0),
      totalCompletedWithdrawals: withdrawals.filter(w => w.status === 'COMPLETED').reduce((s, w) => s + w.amount, 0),
    };
  },

  // Submit a withdrawal request
  async requestWithdrawal(data) {
    try {
      const res = await api.post('/withdrawals', data);
      if (res.data) return res.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      console.warn('Backend API requestWithdrawal error, attempting demo fallback:', err.message);
    }

    const { amount, method, network = 'BEP-20', walletAddress, accountDetails } = data;
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) throw new Error('Withdrawal amount must be greater than 0.');
    if (numAmount < 10) throw new Error('Minimum withdrawal amount is $10.');

    const newId = generateShortId('WTH');
    const newWithdrawal = {
      id: newId,
      withdrawalId: newId,
      amount: numAmount,
      method: method || 'USDT (BEP-20)',
      network,
      token: 'USDT',
      walletAddress: walletAddress || accountDetails || 'Demo Address',
      accountDetails: accountDetails || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const withdrawals = getStoredData('withdrawals', []);
    withdrawals.unshift(newWithdrawal);
    setStoredData('withdrawals', withdrawals);

    return {
      success: true,
      message: 'Withdrawal request submitted successfully! Pending admin approval.',
      withdrawal: newWithdrawal,
    };
  },

  // Get current user's withdrawal history
  async getMyWithdrawals() {
    try {
      const res = await api.get('/withdrawals/my');
      if (res.data) {
        return res.data.map((w) => ({
          ...w,
          id: w.withdrawalId || w._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API getMyWithdrawals unavailable, falling back to demo mode');
    }

    return getStoredData('withdrawals', []);
  },

  // Get withdrawal by ID
  async getWithdrawalById(id) {
    try {
      const res = await api.get(`/withdrawals/${id}`);
      if (res.data) {
        return {
          ...res.data,
          id: res.data.withdrawalId || res.data._id,
        };
      }
    } catch (err) {
      console.warn('Backend API getWithdrawalById error:', err.message);
    }

    const withdrawals = getStoredData('withdrawals', []);
    return withdrawals.find((w) => w.id === id || w.withdrawalId === id || w._id === id);
  },
};

export default withdrawalService;
