import api from './api';

export const investmentService = {
  async getDashboardSummary() {
    const res = await api.get('/dashboard/summary');
    return res.data;
  },

  async getInvestments(userId) {
    const res = await api.get('/investments');
    if (res.data) {
      return res.data.map((inv) => ({
        ...inv,
        id: inv.investmentId || inv._id,
      }));
    }
    return [];
  },

  async getInvestmentById(id) {
    const res = await api.get(`/investments/${id}`);
    if (res.data) {
      return {
        ...res.data,
        id: res.data.investmentId || res.data._id,
      };
    }
    throw new Error('Investment not found');
  },

  async createPendingInvestment({ amount, duration = '1 Year' }) {
    const res = await api.post('/investments', { amount, duration });
    if (res.data) {
      const invData = res.data.investment || res.data;
      const invId = invData.investmentId || res.data.investmentId || invData.id || invData._id;
      return {
        ...res.data,
        investment: {
          ...invData,
          id: invId,
        },
        investmentId: invId,
        id: invId,
        _id: invData._id || res.data._id,
      };
    }
    throw new Error('Failed to create investment record');
  },

  async createWalletDeposit({ amount, paymentMethod = 'USDT (BEP-20)' }) {
    const res = await api.post('/payments/deposit', { amount, paymentMethod });
    return res.data;
  },

  async getPaymentConfig() {
    const res = await api.get('/payments/config');
    return res.data;
  },

  async createPayment(investmentId) {
    const res = await api.post('/payments/create', { investmentId });
    if (res.data && res.data.success) {
      return res.data.payment;
    }
    throw new Error(res.data?.message || 'Failed to initialize payment');
  },

  async verifyPayment({ paymentId, investmentId, transactionHash }) {
    const res = await api.post('/payments/verify', {
      paymentId,
      investmentId,
      transactionHash,
    });
    return res.data;
  },

  async submitPaymentProof(formData) {
    const res = await api.post('/payments/submit-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getPaymentById(id) {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },

  async getMyPayments() {
    const res = await api.get('/payments/my-payments');
    return res.data || [];
  },

  async processMockPayment(investmentId, { paymentMethod }) {
    const res = await api.post('/payments/demo', { investmentId, paymentMethod });
    if (res.data) {
      return {
        investment: {
          ...res.data.investment,
          id: res.data.investment.investmentId || res.data.investment._id,
        },
        rewardTriggered: res.data.rewardTriggered,
        rewardInfo: res.data.rewardInfo,
      };
    }
    throw new Error('Payment processing failed');
  },
};
