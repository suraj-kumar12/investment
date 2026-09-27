import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Share2,
  Gift,
  Receipt,
  PieChart,
  FileBarChart,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ onCloseMobile }) => {
  const { logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Investments', path: '/admin/investments', icon: TrendingUp },
    { name: 'Referrals', path: '/admin/referrals', icon: Share2 },
    { name: 'Rewards', path: '/admin/rewards', icon: Gift },
    { name: 'Transactions', path: '/admin/transactions', icon: Receipt },
    { name: 'Investment Plans', path: '/admin/plans', icon: PieChart },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 selection:bg-purple-500 selection:text-white">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-800/80 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white tracking-tight">
              Apex<span className="text-purple-400">Admin</span>
            </span>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <button
          onClick={async () => {
            await switchDemoRole('user');
            navigate('/dashboard');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Switch to User View</span>
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  );
};
