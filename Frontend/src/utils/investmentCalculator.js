/**
 * Frontend Investment Calculator Rules:
 * - 4% simple interest on the 1st and 15th of every month
 * - 8% total scheduled monthly rate
 * 
 * @param {number} amount - Investment amount in USD
 * @returns {object} { rate, monthlyRate, profit, maturityValue, planName, isValid, error }
 */
export function calculateInvestment(amount) {
  const numAmount = Number(amount) || 0;

  if (numAmount < 12) {
    return {
      rate: 4,
      monthlyRate: 8,
      profit: 0,
      maturityValue: numAmount,
      planName: 'Standard Investment',
      isValid: false,
      error: 'Minimum investment is $12.',
    };
  }

  return {
    rate: 4, // 4% per payout cycle (1st & 15th)
    monthlyRate: 8, // 8% monthly
    profit: 0,
    maturityValue: numAmount,
    planName: 'Standard Investment',
    isValid: true,
    error: null,
  };
}

export const INVESTMENT_PLANS = [
  {
    id: 'standard',
    name: 'Standard Investment',
    minAmount: 12,
    maxAmount: 10000,
    rate: 4, // 4% per payout cycle (1st & 15th)
    monthlyRate: 8, // 8% monthly
    schedule: '1st and 15th of every month',
    duration: 'Ongoing Payouts',
    description: 'Earn 4% simple interest on the 1st & 15th of every month (8% monthly rate).',
    recommendedFor: 'All Investors',
    badge: '4% Every 1st & 15th',
    isPopular: true,
  },
];
