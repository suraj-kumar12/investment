/**
 * Calculates investment returns based on demo tier rules (Converted USD values from INR):
 * - Starter: $12 – $60 (Equivalent to ₹1,000 – ₹4,999) → 8% Demo Annual Return
 * - Growth:  $60 – $120 (Equivalent to ₹5,000 – ₹9,999) → 10% Demo Annual Return
 * - Premium: $120+ (Equivalent to ₹10,000+)             → 12% Demo Annual Return
 * 
 * @param {number} amount - Investment amount in USD
 * @returns {object} { rate, profit, maturityValue, planName, isValid, error }
 */
export function calculateInvestment(amount) {
  const numAmount = Number(amount) || 0;

  if (numAmount < 12) {
    return {
      rate: 0,
      profit: 0,
      maturityValue: numAmount,
      planName: 'Below Minimum',
      isValid: false,
      error: 'Minimum investment is $12 (equivalent to ₹1,000)',
    };
  }

  let rate = 8;
  let planName = 'Starter';

  if (numAmount >= 120) {
    rate = 12;
    planName = 'Premium';
  } else if (numAmount >= 60) {
    rate = 10;
    planName = 'Growth';
  }

  const profit = Math.round((numAmount * rate) / 100 * 100) / 100;
  const maturityValue = Math.round((numAmount + profit) * 100) / 100;

  return {
    rate,
    profit,
    maturityValue,
    planName,
    isValid: true,
    error: null,
  };
}

export const INVESTMENT_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    minAmount: 12,
    maxAmount: 60,
    rate: 8,
    duration: '1 Year',
    description: 'Perfect for beginners starting their investment journey.',
    recommendedFor: 'First-time investors',
    badge: 'Popular for Beginners',
  },
  {
    id: 'growth',
    name: 'Growth',
    minAmount: 60,
    maxAmount: 120,
    rate: 10,
    duration: '1 Year',
    description: 'Accelerate portfolio expansion with balanced high yields.',
    recommendedFor: 'Growing portfolios',
    badge: 'Most Popular',
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    minAmount: 120,
    maxAmount: 10000,
    rate: 12,
    duration: '1 Year',
    description: 'Maximum demo returns for serious high-volume investors.',
    recommendedFor: 'High net-worth demo investors',
    badge: 'Best Value',
  },
];
