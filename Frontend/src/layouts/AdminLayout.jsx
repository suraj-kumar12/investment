import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Shield, Bell, Search, UserCheck } from 'lucide-react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, switchDemoRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* Fixed Admin Sidebar */}
      <div className="hidden lg:block fixed top-0 bottom-0 left-0 w-64 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-64 max-w-xs h-full bg-slate-950 shadow-2xl">
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 h-20 glass-panel border-b border-purple-500/20 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                await switchDemoRole('user');
                showToast('Switched to User Mode (Suraj Kumar)', 'info');
                navigate('/dashboard');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to User View</span>
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                />
                <span className="hidden sm:block text-xs font-bold text-white">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
