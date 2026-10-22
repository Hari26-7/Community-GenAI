import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({ rows = 3, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex gap-4 items-center">
          <div className="w-8 h-8 rounded bg-slate-200 dark:bg-slate-800 shrink-0"></div>
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-850 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
