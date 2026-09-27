import api from './api';
import { getStoredData, setStoredData } from './mockData';

export const authService = {
  async register({ fullName, email, mobile, password, referralCode }) {
    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        mobile,
        password,
        referralCode,
      });

      if (res.data && res.data.token) {
        localStorage.setItem('demo_token', res.data.token);
        localStorage.setItem('demo_user_id', res.data.user.id || res.data.user._id);
        return res.data;
      }
    } catch (err) {
      console.warn('Backend API registration unavailable, falling back to local demo mode:', err.message);
    }

    // Local storage demo mode fallback
    const users = getStoredData('users', []);
    const existingEmail = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      throw new Error('An account with this email address already exists.');
    }

    const newUserId = `user-${Date.now()}`;
    const userReferralCode = `${fullName.substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

    const newUser = {
      id: newUserId,
      name: fullName,
      email,
      mobile,
      referralCode: userReferralCode,
      referredBy: referralCode || null,
      role: 'user',
      totalInvestment: 0,
      activeInvestmentsCount: 0,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    };

    users.push(newUser);
    setStoredData('users', users);

    const token = `demo_jwt_token_${newUserId}`;
    localStorage.setItem('demo_token', token);
    localStorage.setItem('demo_user_id', newUserId);

    return { user: newUser, token };
  },

  async login({ email, password }) {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem('demo_token', res.data.token);
        localStorage.setItem('demo_user_id', res.data.user.id || res.data.user._id);
        return res.data;
      }
    } catch (err) {
      console.warn('Backend API login unavailable, falling back to local demo mode:', err.message);
    }

    // Local storage demo mode fallback
    const users = getStoredData('users', []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (user.status === 'BLOCKED') {
      throw new Error('Your account has been suspended. Please contact platform support.');
    }

    const token = `demo_jwt_token_${user.id}`;
    localStorage.setItem('demo_token', token);
    localStorage.setItem('demo_user_id', user.id);

    return { user, token };
  },

  async getCurrentUser() {
    try {
      const res = await api.get('/auth/me');
      if (res.data) {
        return {
          ...res.data,
          id: res.data._id || res.data.id,
        };
      }
    } catch (err) {
      console.warn('Backend API me query unavailable, falling back to local demo mode');
    }

    const currentUserId = localStorage.getItem('demo_user_id') || 'user-1';
    const users = getStoredData('users', []);
    return users.find((u) => u.id === currentUserId || u._id === currentUserId) || users[0];
  },

  async updateProfile(userId, { name, mobile, avatar }) {
    try {
      const res = await api.put('/auth/profile', { name, mobile, avatar });
      if (res.data) return res.data;
    } catch (err) {
      console.warn('Backend API updateProfile unavailable, falling back to local demo mode');
    }

    const users = getStoredData('users', []);
    const index = users.findIndex((u) => u.id === userId || u._id === userId);
    if (index === -1) throw new Error('User not found');

    users[index] = {
      ...users[index],
      name: name || users[index].name,
      mobile: mobile || users[index].mobile,
      avatar: avatar || users[index].avatar,
    };

    setStoredData('users', users);
    return users[index];
  },

  logout() {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('demo_user_id');
  },
};
