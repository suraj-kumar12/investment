import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/common/Skeleton';

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div className="p-8"><Skeleton type="card" /></div>;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
