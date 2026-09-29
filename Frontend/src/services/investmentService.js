import api from './api';
import { getStoredData, setStoredData } from './mockData';
import { calculateInvestment } from '../utils/investmentCalculator';
import { generateShortId } from '../utils/formatters';

export const investmentService = {
  async getInvestments(userId) {
    try {
      const res = await api.get('/investments');
      if (res.data) {
        return res.data.map((inv) => ({
          ...inv,
          id: inv.investmentId || inv._id,
        }));
      }
    } catch (err) {
      console.warn('Backend API getInvestments unavailable, falling back to local demo mode');
    }

    const all = getStoredData('investments', []);
    if (!userId) return all;
    return all.filter((inv) => inv.userId === userId);
  },

  async getInvestmentById(id) {
    try {
      const res = await api.get(`/investments/${id}`);
      if (res.data) {
        return {
          ...res.data,
          id: res.data.investmentId || res.data._id,
        };
      }
    } catch (err) {
      console.warn('Backend API getInvestmentById unavailable, falling back to local demo mode');
    }

    const all = getStoredData('investments', []);
    const found = all.find((inv) => inv.id === id || inv._id === id || inv.investmentId === id);
    if (!found) throw new Error('Investment not found');
    return found;
  },

  async createPendingInvestment({ userId, userName, amount, planId, duration = '1 Year' }) {
    try {
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
    } catch (err) {
      console.warn('Backend API createInvestment error:', err.message);
    }

    const calc = calculateInvestment(amount);
    if (!calc.isValid) {
      throw new Error(calc.error);
    }

    const newInvId = generateShortId('INV');
    const newInv = {
      id: newInvId,
      investmentId: newInvId,
      userId,
      userName,
      planId: calc.planName.toLowerCase(),
      planName: calc.planName,
      amount: Number(amount),
      rate: calc.rate,
      duration,
      profit: calc.profit,
      maturityValue: calc.maturityValue,
      startDate: new Date().toISOString().split('T')[0],
      maturityDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      progressPercent: 0,
    };

    const investments = getStoredData('investments', []);
    investments.unshift(newInv);
    setStoredData('investments', investments);

    return newInv;
  },

  // -------------------------------------------------------------
  // USDT (BEP-20) CRYPTO PAYMENT FLOW
  // -------------------------------------------------------------
  async createPayment(investmentId) {
    try {
      const res = await api.post('/payments/create', { investmentId });
      if (res.data && res.data.success) {
        return res.data.payment;
      }
    } catch (err) {
      console.warn('Backend API createPayment unavailable, generating fallback payment details');
    }

    return {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      paymentId: `PAY-${Date.now().toString().slice(-6)}`,
      investmentId,
      token: 'USDT',
      network: 'BSC',
      receivingAddress: '0xA845c0673FF693da2E64Ff10d91c97B63eB8ae2f',
      expectedAmount: 12,
      status: 'PENDING',
    };
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
    try {
      const res = await api.get(`/payments/${id}`);
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API getPaymentById error:', err.message);
    }
    return null;
  },

  async getMyPayments() {
    try {
      const res = await api.get('/payments/my-payments');
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API getMyPayments error:', err.message);
    }
    return [];
  },

  // Retain processMockPayment for demo options
  async processMockPayment(investmentId, { paymentMethod }) {
    try {
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
    } catch (err) {
      console.warn('Backend API processMockPayment unavailable, falling back to local demo mode');
    }

    const investments = getStoredData('investments', []);
    const invIndex = investments.findIndex(
      (i) => i.id === investmentId || i.investmentId === investmentId || i._id === investmentId
    );
    if (invIndex === -1) throw new Error('Investment record not found');

    const inv = investments[invIndex];
    inv.paymentStatus = 'SUCCESSFUL';
    inv.status = 'ACTIVE';
    inv.paymentMethod = paymentMethod || 'Demo Payment';
    inv.progressPercent = 5;

    investments[invIndex] = inv;
    setStoredData('investments', investments);

    return {
      investment: inv,
      rewardTriggered: false,
      rewardInfo: null,
    };
  },
};
