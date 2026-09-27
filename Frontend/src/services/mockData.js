// Mock data store with local storage synchronization using converted USD ($) figures

const INITIAL_USERS = [];

const INITIAL_INVESTMENTS = [];
const INITIAL_REFERRALS = [];
const INITIAL_REWARDS = [];
const INITIAL_TRANSACTIONS = [];

// LocalStorage helpers to simulate database state
export const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(`demo_platform_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(`demo_platform_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to store demo data', e);
  }
};

export const initMockStorage = () => {
  // Reset demo storage to update to converted USD figures
  localStorage.removeItem('demo_platform_users');
  localStorage.removeItem('demo_platform_investments');
  localStorage.removeItem('demo_platform_referrals');
  localStorage.removeItem('demo_platform_rewards');
  localStorage.removeItem('demo_platform_transactions');

  setStoredData('users', INITIAL_USERS);
  setStoredData('investments', INITIAL_INVESTMENTS);
  setStoredData('referrals', INITIAL_REFERRALS);
  setStoredData('rewards', INITIAL_REWARDS);
  setStoredData('transactions', INITIAL_TRANSACTIONS);
};
