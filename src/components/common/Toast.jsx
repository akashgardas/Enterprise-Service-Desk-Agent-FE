
import React, { createContext, useContext, useState, useCallback } from 'react';
import { HiOutlineXMark, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineInformationCircle } from 'react-icons/hi2';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[10003] flex flex-col gap-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const Toast = ({ toast, onClose }) => {
  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-100 dark:border-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          icon: <HiOutlineCheckCircle className="w-6 h-6" />
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-100 dark:border-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          icon: <HiOutlineExclamationCircle className="w-6 h-6" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-100 dark:border-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          icon: <HiOutlineInformationCircle className="w-6 h-6" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.bg} ${styles.border} ${styles.text} p-4 rounded-2xl shadow-xl border flex items-center gap-4 animate-fade-in max-w-sm`}>
      <div className="shrink-0">
        {styles.icon}
      </div>
      <p className="text-sm font-semibold flex-grow">
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity"
      >
        <HiOutlineXMark className="w-5 h-5" />
      </button>
    </div>
  );
};
