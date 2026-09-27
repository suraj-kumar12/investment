import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Search,
  Shield,
  UserCheck,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const UserLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, isAdmin, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleToggleAdminMode = async () => {
    if (isAdmin) {
      await switchDemoRole('user');
      showToast('Switched to User Mode (Suraj Kumar)', 'info');
      navigate('/dashboard');
    } else {
      await switchDemoRole('admin');
      showToast('Switched to Admin Console Mode', 'info');
      navigate('/admin');
    }
  };

  const sampleNotifications = [
    { id: 1, title: 'Referral Reward Unlocked!', text: 'Rahul Sharma completed payment. ₹100 credited.', time: '10m ago' },
    { id: 2, title: 'Investment Active', text: 'INV-1001 Premium plan activated successfully.', time: '1h ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed top-0 bottom-0 left-0 w-64 z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs h-full bg-slate-950 shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-20 glass-panel border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Global Search Bar */}
            <div className="hidden sm:flex items-center relative w-64">
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search investments, referrals..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Demo Mode Toggle Switch */}
            <button
              onClick={handleToggleAdminMode}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isAdmin
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900/60'
                  : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Switch to User View' : 'Switch to Admin View'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 relative border border-slate-800"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-4 shadow-2xl border border-slate-800 space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] text-indigo-400 font-semibold">2 New</span>
                  </div>
                  <div className="space-y-2">
                    {sampleNotifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Thumbnail */}
            {user && (
              <div className="flex items-center gap-3 pl-2">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
                />
                <div className="hidden md:flex flex-col">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{user.referralCode}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
