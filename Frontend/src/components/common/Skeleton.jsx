import React from 'react';

export const Skeleton = ({ className = '', type = 'box' }) => {
  if (type === 'card') {
    return (
      <div className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-8 bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-slate-800/80 rounded-xl" />
        <div className="h-12 bg-slate-800/40 rounded-xl" />
        <div className="h-12 bg-slate-800/40 rounded-xl" />
        <div className="h-12 bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  return <div className={`bg-slate-800/80 animate-pulse rounded-xl ${className}`} />;
};
