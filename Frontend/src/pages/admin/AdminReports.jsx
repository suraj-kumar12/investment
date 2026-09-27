import React from 'react';
import { FileBarChart, Download } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminReports = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">System Reports & Export</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Generate platform financial summaries and referral distribution logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <FileBarChart className="w-8 h-8 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Monthly Financial Report</h3>
          <p className="text-xs text-slate-400">Includes total capital deposits, projected returns breakdown, and active user metrics.</p>
          <Button variant="primary" icon={Download} size="sm">Export CSV</Button>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <FileBarChart className="w-8 h-8 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Referral Audit Ledger</h3>
          <p className="text-xs text-slate-400">Complete log of all referral invitations, payment verifications, and ₹100 reward credits.</p>
          <Button variant="emerald" icon={Download} size="sm">Export Audit Log</Button>
        </div>
      </div>
    </div>
  );
};
