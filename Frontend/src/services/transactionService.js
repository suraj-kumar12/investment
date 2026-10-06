import api from './api';

export const transactionService = {
  async getTransactions(arg1 = {}, arg2 = {}) {
    // Flexibly support getTransactions(filters) or getTransactions(userId, filters)
    const filters = typeof arg1 === 'object' && arg1 !== null ? arg1 : (typeof arg2 === 'object' && arg2 !== null ? arg2 : {});
    const { type = 'ALL', status = 'ALL', search = '' } = filters;

    const res = await api.get('/transactions', {
      params: { type, status, search },
    });

    if (Array.isArray(res.data)) {
      return res.data.map((t) => ({
        ...t,
        id: t.transactionId || t._id,
      }));
    } else if (res.data?.transactions && Array.isArray(res.data.transactions)) {
      return res.data.transactions.map((t) => ({
        ...t,
        id: t.transactionId || t._id,
      }));
    }

    return [];
  },
};
