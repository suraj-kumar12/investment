import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Users,
  Gift,
  Receipt,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ onCloseMobile }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Investments', path: '/dashboard/investments', icon: TrendingUp },
    { name: 'Investment Plans', path: '/dashboard/plans', icon: PieChart },
    { name: 'Withdraw Funds', path: '/dashboard/withdraw', icon: Wallet },
    { name: 'Referrals', path: '/dashboard/referrals', icon: Users },
    { name: 'Rewards', path: '/dashboard/rewards', icon: Gift },
    { name: 'Transactions', path: '/dashboard/transactions', icon: Receipt },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between p-4 selection:bg-indigo-500 selection:text-white">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white tracking-tight">
              Apex<span className="text-indigo-400">Invest</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              {isAdmin ? 'Admin Console' : 'Investor Portal'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
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

      {/* User Info & Logout Footer */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/30 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
