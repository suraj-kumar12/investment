import React from 'react';

export const Input = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  readOnly = false,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          readOnly={readOnly}
          className={`w-full bg-slate-900/80 border ${
            error
              ? 'border-rose-500/80 focus:ring-rose-500/30'
              : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
          } ${readOnly ? 'bg-slate-950/60 text-slate-400 cursor-not-allowed border-dashed' : 'text-slate-100'} 
          rounded-xl py-2.5 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  );
};
