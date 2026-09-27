import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('suraj@example.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await login({ email, password });
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password');
    showToast(`Loaded ${demoRole} credentials`, 'info');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">Sign In</h2>
          <p className="text-sm text-slate-400">Access your investment portfolio & referral dashboard.</p>
        </div>

        {/* Quick Demo Login Shortcut Buttons */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuickDemo('suraj@example.com', 'Referrer (Suraj)')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors text-left font-medium"
            >
              • User (Referrer)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('rahul@example.com', 'Referred User (Rahul)')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors text-left font-medium"
            >
              • User (Referred)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin@investment.com', 'Platform Admin')}
              className="col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors text-center font-medium"
            >
              • Platform Administrator
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="suraj@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} icon={ArrowRight} className="w-full mt-2">
            Sign In to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
};
