// Mock data store with local storage synchronization using converted USD ($) figures

const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Suraj Kumar',
    email: 'suraj@example.com',
    mobile: '+1 (555) 987-6543',
    referralCode: 'SUR123',
    referredBy: null,
    role: 'user',
    totalInvestment: 300, // $300 USD (equivalent to ₹25,000 INR)
    activeInvestmentsCount: 2,
    createdAt: '2026-01-15T10:00:00.000Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-2',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    mobile: '+1 (555) 456-7890',
    referralCode: 'RAH456',
    referredBy: 'SUR123',
    role: 'user',
    totalInvestment: 120, // $120 USD (equivalent to ₹10,000 INR)
    activeInvestmentsCount: 1,
    createdAt: '2026-09-20T14:30:00.000Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-3',
    name: 'Amit Verma',
    email: 'amit@example.com',
    mobile: '+1 (555) 111-2233',
    referralCode: 'AMI789',
    referredBy: 'SUR123',
    role: 'user',
    totalInvestment: 60, // $60 USD (equivalent to ₹5,000 INR)
    activeInvestmentsCount: 1,
    createdAt: '2026-09-21T09:15:00.000Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-4',
    name: 'Priya Singh',
    email: 'priya@example.com',
    mobile: '+1 (555) 888-7766',
    referralCode: 'PRI111',
    referredBy: 'SUR123',
    role: 'user',
    totalInvestment: 0,
    activeInvestmentsCount: 0,
    createdAt: '2026-09-25T11:20:00.000Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-admin',
    name: 'FinTech Admin',
    email: 'admin@investment.com',
    mobile: '+1 (555) 000-9999',
    referralCode: 'ADM000',
    referredBy: null,
    role: 'admin',
    totalInvestment: 0,
    activeInvestmentsCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  }
];

const INITIAL_INVESTMENTS = [
  {
    id: 'INV-1001',
    userId: 'user-1',
    userName: 'Suraj Kumar',
    planId: 'premium',
    planName: 'Premium',
    amount: 180, // $180 USD (equivalent to ₹15,000 INR)
    rate: 12,
    duration: '1 Year',
    profit: 21.60,
    maturityValue: 201.60,
    startDate: '2026-02-01',
    maturityDate: '2027-02-01',
    status: 'ACTIVE',
    paymentStatus: 'SUCCESSFUL',
    paymentMethod: 'Demo ACH',
    progressPercent: 60,
  },
  {
    id: 'INV-1002',
    userId: 'user-1',
    userName: 'Suraj Kumar',
    planId: 'growth',
    planName: 'Growth',
    amount: 120, // $120 USD (equivalent to ₹10,000 INR)
    rate: 10,
    duration: '1 Year',
    profit: 12.00,
    maturityValue: 132.00,
    startDate: '2026-05-15',
    maturityDate: '2027-05-15',
    status: 'ACTIVE',
    paymentStatus: 'SUCCESSFUL',
    paymentMethod: 'Demo Visa',
    progressPercent: 35,
  },
  {
    id: 'INV-1003',
    userId: 'user-2',
    userName: 'Rahul Sharma',
    planId: 'premium',
    planName: 'Premium',
    amount: 120, // $120 USD (equivalent to ₹10,000 INR)
    rate: 12,
    duration: '1 Year',
    profit: 14.40,
    maturityValue: 134.40,
    startDate: '2026-09-20',
    maturityDate: '2027-09-20',
    status: 'ACTIVE',
    paymentStatus: 'SUCCESSFUL',
    paymentMethod: 'Demo Bank Transfer',
    progressPercent: 10,
  },
  {
    id: 'INV-1004',
    userId: 'user-3',
    userName: 'Amit Verma',
    planId: 'growth',
    planName: 'Growth',
    amount: 60, // $60 USD (equivalent to ₹5,000 INR)
    rate: 10,
    duration: '1 Year',
    profit: 6.00,
    maturityValue: 66.00,
    startDate: '2026-09-21',
    maturityDate: '2027-09-21',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'Demo ACH',
    progressPercent: 0,
  }
];

const INITIAL_REFERRALS = [
  {
    id: 'REF-1',
    referrerId: 'user-1',
    referrerName: 'Suraj Kumar',
    referrerCode: 'SUR123',
    referredUserId: 'user-2',
    referredName: 'Rahul Sharma',
    registrationDate: '2026-09-20',
    investmentAmount: 120, // $120 USD
    paymentStatus: 'SUCCESSFUL',
    rewardAmount: 1.20, // $1.20 USD (equivalent to ₹100 INR)
    rewardStatus: 'CREDITED',
    isEligible: true,
  },
  {
    id: 'REF-2',
    referrerId: 'user-1',
    referrerName: 'Suraj Kumar',
    referrerCode: 'SUR123',
    referredUserId: 'user-3',
    referredName: 'Amit Verma',
    registrationDate: '2026-09-21',
    investmentAmount: 60, // $60 USD
    paymentStatus: 'PENDING',
    rewardAmount: 0,
    rewardStatus: 'PENDING',
    isEligible: true,
  },
  {
    id: 'REF-3',
    referrerId: 'user-1',
    referrerName: 'Suraj Kumar',
    referrerCode: 'SUR123',
    referredUserId: 'user-4',
    referredName: 'Priya Singh',
    registrationDate: '2026-09-25',
    investmentAmount: 0,
    paymentStatus: 'PENDING',
    rewardAmount: 0,
    rewardStatus: 'PENDING',
    isEligible: true,
  }
];

const INITIAL_REWARDS = [
  {
    id: 'RWD-501',
    referrerId: 'user-1',
    referrerName: 'Suraj Kumar',
    referredName: 'Rahul Sharma',
    eligiblePaymentId: 'INV-1003',
    rewardAmount: 1.20, // $1.20 USD
    status: 'CREDITED',
    date: '2026-09-20',
  },
  {
    id: 'RWD-502',
    referrerId: 'user-1',
    referrerName: 'Suraj Kumar',
    referredName: 'Ankit Mehta',
    eligiblePaymentId: 'INV-998',
    rewardAmount: 1.20,
    status: 'CREDITED',
    date: '2026-08-10',
  },
  {
    id: 'RWD-503',
    referrerId: 'user-1',
    referrerName: 'Suraj Kumar',
    referredName: 'Sneha Patel',
    eligiblePaymentId: 'INV-980',
    rewardAmount: 1.20,
    status: 'CREDITED',
    date: '2026-07-04',
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-901',
    userId: 'user-1',
    type: 'Investment',
    amount: 180, // $180 USD
    date: '2026-02-01',
    status: 'Successful',
    paymentMethod: 'Demo ACH',
    reference: 'INV-1001',
  },
  {
    id: 'TXN-902',
    userId: 'user-1',
    type: 'Investment',
    amount: 120, // $120 USD
    date: '2026-05-15',
    status: 'Successful',
    paymentMethod: 'Demo Visa',
    reference: 'INV-1002',
  },
  {
    id: 'TXN-903',
    userId: 'user-1',
    type: 'Referral Reward',
    amount: 1.20, // $1.20 USD
    date: '2026-09-20',
    status: 'Successful',
    paymentMethod: 'Wallet Credit',
    reference: 'REF-1',
  },
  {
    id: 'TXN-904',
    userId: 'user-2',
    type: 'Investment',
    amount: 120, // $120 USD
    date: '2026-09-20',
    status: 'Successful',
    paymentMethod: 'Demo Bank Transfer',
    reference: 'INV-1003',
  }
];

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
