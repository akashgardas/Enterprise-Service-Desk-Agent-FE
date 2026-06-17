import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi2';

const EmptyState = ({ 
  title = 'No data found', 
  message = 'There are no items to display at the moment.',
  icon: Icon = HiOutlineInbox,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-bg-card rounded-xl border border-dashed border-border-color animate-fade-in">
      <div className="p-4 bg-bg-secondary rounded-full mb-4">
        <Icon className="w-12 h-12 text-text-secondary" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mb-6">{message}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
