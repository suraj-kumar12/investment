import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Plans } from './pages/public/Plans';
import { HowItWorks } from './pages/public/HowItWorks';
import { FAQ } from './pages/public/FAQ';
import { Contact } from './pages/public/Contact';

// Auth Pages
import { Register } from './pages/auth/Register';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// User Dashboard Pages
import { UserDashboard } from './pages/user/Dashboard';
import { Investments } from './pages/user/Investments';
import { NewInvestment } from './pages/user/NewInvestment';
import { InvestmentDetails } from './pages/user/InvestmentDetails';
import { MockPayment } from './pages/user/MockPayment';
import { Withdraw } from './pages/user/Withdraw';
import { Referrals } from './pages/user/Referrals';
import { Rewards } from './pages/user/Rewards';
import { Transactions } from './pages/user/Transactions';
import { Profile } from './pages/user/Profile';
import { Settings } from './pages/user/Settings';

// Admin Dashboard Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminInvestments } from './pages/admin/AdminInvestments';
import { AdminWithdrawals } from './pages/admin/AdminWithdrawals';
import { AdminReferrals } from './pages/admin/AdminReferrals';
import { AdminRewards } from './pages/admin/AdminRewards';
import { AdminTransactions } from './pages/admin/AdminTransactions';
import { AdminPlans } from './pages/admin/AdminPlans';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

// Route Guards
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

import { Deposit } from './pages/user/Deposit';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* User Dashboard Routes (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<UserDashboard />} />
                <Route path="investments" element={<Investments />} />
                <Route path="investments/new" element={<NewInvestment />} />
                <Route path="investments/:id" element={<InvestmentDetails />} />
                <Route path="deposit" element={<Deposit />} />
                <Route path="payment/:id" element={<MockPayment />} />
                <Route path="withdraw" element={<Withdraw />} />
                <Route path="plans" element={<Plans />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Admin Dashboard Routes (Protected Admin) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="investments" element={<AdminInvestments />} />
                <Route path="withdrawals" element={<AdminWithdrawals />} />
                <Route path="referrals" element={<AdminReferrals />} />
                <Route path="rewards" element={<AdminRewards />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
