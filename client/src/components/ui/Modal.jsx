import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Modal = ({ isOpen, onClose, title, children, footer, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn('relative z-50 w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in duration-200', className)}>
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6">{footer}</div>
        )}
      </div>
    </div>
  );
};
