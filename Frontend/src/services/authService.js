import api from './api';

export const authService = {
  async register({ fullName, email, mobile, password, referralCode }) {
    const res = await api.post('/auth/register', {
      fullName,
      email,
      mobile,
      password,
      referralCode,
    });
    return res.data;
  },

  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('demo_token', res.data.token);
      localStorage.setItem('demo_user_id', res.data.user.id || res.data.user._id);
      return res.data;
    }
    throw new Error('Login failed: Token not received.');
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    if (res.data) {
      return {
        ...res.data,
        id: res.data._id || res.data.id,
      };
    }
    return null;
  },

  async updateProfile(userId, { name, mobile, avatar }) {
    const res = await api.put('/auth/profile', { name, mobile, avatar });
    if (res.data) {
      return {
        ...res.data,
        id: res.data._id || res.data.id,
      };
    }
    throw new Error('Profile update failed');
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Backend API logout notification failed:', err.message);
    } finally {
      localStorage.removeItem('demo_token');
      localStorage.removeItem('demo_user_id');
    }
  },
};
