import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi2';

const EmptyState = ({ 
  title = 'No data found', 
  message = 'There are no items to display at the moment.',
  icon: Icon = HiOutlineInbox,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-neutral-200 dark:border-slate-700 animate-fade-in">
      <div className="p-4 bg-neutral-100 dark:bg-slate-700 rounded-full mb-4">
        <Icon className="w-12 h-12 text-neutral-500 dark:text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-500 dark:text-slate-400 max-w-md mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
