import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('demo_token');
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error', err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    if (!user) return;
    const updated = await authService.updateProfile(user.id, data);
    setUser(updated);
    return updated;
  };

  // Quick switch for demo testing between user and admin
  const switchDemoRole = async (targetRole = 'admin') => {
    if (targetRole === 'admin') {
      const adminUser = await authService.login({ email: 'admin@investment.com', password: 'password' });
      return adminUser;
    } else {
      const normalUser = await authService.login({ email: 'suraj@example.com', password: 'password' });
      return normalUser;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
