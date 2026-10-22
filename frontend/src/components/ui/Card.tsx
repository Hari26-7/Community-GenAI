import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
        noPadding ? '' : 'p-5 sm:p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};
