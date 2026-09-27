import React from 'react';
import { Save } from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const { showToast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform admin settings updated!', 'success');
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Configure global referral rules, currency defaults, and system thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <Input label="Platform Title" defaultValue="ApexInvest Demo Platform" />
        <Input label="Default Referral Reward Amount ($)" defaultValue="1.20" readOnly helperText="Locked at $1.20 (equivalent to ₹100 INR) per verified payment" />
        <Input label="Minimum Investment Threshold ($)" defaultValue="12" helperText="Equivalent to ₹1,000 INR" />
        <Button type="submit" variant="emerald" icon={Save} className="w-full">
          Save Settings
        </Button>
      </form>
    </div>
  );
};
