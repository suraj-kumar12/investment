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
        return {
          ...res.data,
          id: res.data.investmentId || res.data._id,
        };
      }
    } catch (err) {
      console.warn('Backend API createInvestment unavailable, falling back to local demo mode');
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
