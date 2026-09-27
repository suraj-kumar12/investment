import api from './api';
import { getStoredData } from './mockData';

export const transactionService = {
  async getTransactions(userId, { type = 'ALL', status = 'ALL', search = '' } = {}) {
    try {
      const res = await api.get('/transactions', {
        params: { type, status, search },
      });
      if (res.data) {
        return res.data.map((t) => ({
          ...t,
          id: t.transactionId || t._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API getTransactions unavailable, falling back to local demo mode');
    }

    let transactions = getStoredData('transactions', []);

    if (userId) {
      transactions = transactions.filter((t) => t.userId === userId);
    }

    if (type !== 'ALL') {
      transactions = transactions.filter((t) => t.type.toLowerCase() === type.toLowerCase());
    }

    if (status !== 'ALL') {
      transactions = transactions.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          (t.reference && t.reference.toLowerCase().includes(q))
      );
    }

    return transactions;
  },
};
