import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const ForgotPassword = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      showToast('Demo password reset link sent to your email.', 'success');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">Forgot Password</h2>
          <p className="text-sm text-slate-400">Enter your registered email address to receive reset instructions.</p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3">
            <h4 className="text-base font-bold text-emerald-300">Reset Email Sent</h4>
            <p className="text-xs text-slate-300">
              We have dispatched a demo password reset link to <strong className="text-white">{email}</strong>.
            </p>
            <Link to="/login" className="inline-block pt-2">
              <Button variant="secondary" size="sm">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" isLoading={loading} icon={Send} className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link to="/login" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
