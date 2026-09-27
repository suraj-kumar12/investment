import { INVESTMENT_PLANS } from '../utils/investmentCalculator';

export const planService = {
  async getPlans() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return INVESTMENT_PLANS;
  },

  async getPlanById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return INVESTMENT_PLANS.find((p) => p.id === id) || INVESTMENT_PLANS[0];
  }
};
