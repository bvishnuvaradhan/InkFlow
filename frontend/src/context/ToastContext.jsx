import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    setToast({ message, type, id: Date.now() });
    
    setTimeout(() => {
      setToast(prev => prev && prev.id === prev.id ? null : prev);
    }, duration);
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border glassmorphism transition-all duration-300 transform translate-y-0 max-w-sm
            ${toast.type === 'success' ? 'border-emerald-500/30 text-emerald-800 dark:text-emerald-300' : ''}
            ${toast.type === 'error' ? 'border-rose-500/30 text-rose-800 dark:text-rose-300' : ''}
            ${toast.type === 'info' ? 'border-sky-500/30 text-sky-800 dark:text-sky-300' : ''}
          `}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-500 shrink-0" />}
            
            <p className="text-sm font-medium pr-2">{toast.message}</p>
            
            <button 
              onClick={closeToast} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
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
