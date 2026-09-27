import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'indigo', className = '' }) => {
  const colorStyles = {
    indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    amber: 'from-amber-500/10 to-amber-500/5 text-amber-400 border-amber-500/20',
    purple: 'from-purple-500/10 to-purple-500/5 text-purple-400 border-purple-500/20',
    cyan: 'from-cyan-500/10 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
  };

  const activeColor = colorStyles[color] || colorStyles.indigo;

  return (
    <div className={`glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-slate-600 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">{title}</span>
          <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">{value}</span>
          {subtitle && <span className="text-xs text-slate-400 mt-1">{subtitle}</span>}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-400">
              <span>{trend}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br border ${activeColor} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
