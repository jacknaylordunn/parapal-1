
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  duration = 3000,
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500 dark:text-green-400" />;
      case 'error':
        return <XCircle size={20} className="text-red-500 dark:text-red-400" />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-500 dark:text-amber-400" />;
      case 'info':
      default:
        return <AlertCircle size={20} className="text-blue-500 dark:text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm transform transition-all duration-300 ease-in-out ${visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
      <div className={`p-4 rounded-md shadow-md border flex items-start ${getBgColor()}`}>
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 mr-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Toast context for app-wide toast management
type ToastContextType = {
  showToast: (type: ToastType, message: string, duration?: number) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{id: number, type: ToastType, message: string, duration?: number}>>([]);
  let toastId = 0;

  const showToast = (type: ToastType, message: string, duration?: number) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
