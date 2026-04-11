import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Toast = ({ id, type, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const variants = {
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
  };

  const Icons = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertCircle };
  const Icon = Icons[type];

  return (
    <div className={cn('flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-300', variants[type])}>
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={() => onClose(id)} className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => (
  <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={onClose} />
    ))}
  </div>
);
