import React from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

const ErrorState = ({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 animate-fade-in">
      <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
        <HiOutlineExclamationTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">{title}</h3>
      <p className="text-red-600/80 dark:text-red-400/80 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
