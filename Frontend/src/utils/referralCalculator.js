/**
 * Calculates referral reward status and amount in converted USD ($1.20 USD equivalent to ₹100 INR).
 * 
 * Condition for $1.20 reward:
 * - Payment Status is "SUCCESSFUL" or "SUCCESS"
 * - Referral is marked as Eligible (isEligible === true)
 * - Reward is not already processed or cancelled
 * 
 * Reward Conditions:
 * - Registration alone → $0
 * - Payment Pending → $0 (Status: Pending)
 * - Payment Failed → $0 (Status: Failed)
 * - Payment Cancelled → $0 (Status: Cancelled)
 * - Payment Successful → $1.20 (Status: Credited)
 * 
 * @param {boolean} isEligible - Whether this referral is eligible for reward
 * @param {string} paymentStatus - 'PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED'
 * @param {string} rewardStatus - 'PENDING', 'CREDITED', 'NONE'
 * @returns {object} { rewardAmount, statusLabel, isCredited, rewardStatus }
 */
export function calculateReferralReward(isEligible = true, paymentStatus = 'PENDING', rewardStatus = 'PENDING') {
  const normPayment = (paymentStatus || '').toUpperCase();
  const normReward = (rewardStatus || '').toUpperCase();

  const REWARD_AMOUNT_USD = 1.20; // $1.20 USD equivalent to ₹100 INR

  if (normReward === 'CREDITED') {
    return {
      rewardAmount: REWARD_AMOUNT_USD,
      statusLabel: 'Reward Credited',
      badgeStatus: 'credited',
      isCredited: true,
      rewardStatus: 'CREDITED',
    };
  }

  if (isEligible && (normPayment === 'SUCCESSFUL' || normPayment === 'SUCCESS')) {
    return {
      rewardAmount: REWARD_AMOUNT_USD,
      statusLabel: 'Reward Credited',
      badgeStatus: 'credited',
      isCredited: true,
      rewardStatus: 'CREDITED',
    };
  }

  if (normPayment === 'FAILED') {
    return {
      rewardAmount: 0,
      statusLabel: 'Payment Failed',
      badgeStatus: 'failed',
      isCredited: false,
      rewardStatus: 'FAILED',
    };
  }

  if (normPayment === 'CANCELLED') {
    return {
      rewardAmount: 0,
      statusLabel: 'Payment Cancelled',
      badgeStatus: 'failed',
      isCredited: false,
      rewardStatus: 'CANCELLED',
    };
  }

  // Default: Pending
  return {
    rewardAmount: 0,
    statusLabel: 'Payment Pending',
    badgeStatus: 'pending',
    isCredited: false,
    rewardStatus: 'PENDING',
  };
}
