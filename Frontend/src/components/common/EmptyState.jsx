import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is no data to display right now.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-slate-800/80 text-indigo-400 mb-4 border border-slate-700/50">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
