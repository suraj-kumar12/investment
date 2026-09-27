import React, { useState } from 'react';
import { Lock, Bell, Shield, LogOut, Save } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const Settings = () => {
  const { showToast } = useToast();
  const { logout } = useAuth();

  const [notifications, setNotifications] = useState({
    investments: true,
    payments: true,
    referrals: true,
    rewards: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Notification preferences saved!', 'success');
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Configure security settings, alert notifications, and active sessions.</p>
      </div>

      {/* Section 1: Notifications */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          Notification Preferences
        </h3>

        <form onSubmit={handleSaveNotifications} className="space-y-4">
          {[
            { key: 'investments', label: 'Investment Progress Alerts', desc: 'Updates when investments reach 25%, 50%, or maturity.' },
            { key: 'payments', label: 'Payment Verification Alerts', desc: 'Instant alerts on payment success or pending updates.' },
            { key: 'referrals', label: 'New Referral Registration Alerts', desc: 'Notify when someone registers using your code.' },
            { key: 'rewards', label: '₹100 Referral Reward Credit Alerts', desc: 'Get notified as soon as a ₹100 reward is credited.' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">{item.label}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
              />
            </div>
          ))}

          <Button type="submit" variant="primary" isLoading={saving} icon={Save} className="w-full">
            Save Preferences
          </Button>
        </form>
      </div>

      {/* Section 2: Security & Sessions */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          Security & Active Sessions
        </h3>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Current Web Browser Session</span>
            <span className="text-emerald-400 font-semibold">Active Now</span>
          </div>
          <p className="text-xs text-slate-400">Chrome on Windows OS • IP: 192.168.1.1</p>
        </div>

        <Button variant="danger" icon={LogOut} onClick={logout} className="w-full">
          Logout From All Devices
        </Button>
      </div>
    </div>
  );
};
