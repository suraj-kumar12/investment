import React from 'react';

export const Badge = ({ status = 'pending', children, className = '' }) => {
  const normStatus = (status || '').toString().toLowerCase();

  const styles = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    successful: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    credited: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30 shadow-sm shadow-emerald-500/10',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    blocked: 'bg-rose-950 text-rose-300 border-rose-600/40',
    premium: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    growth: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    starter: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  };

  const styleClass = styles[normStatus] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {children || status}
    </span>
  );
};
