import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sheet = ({ isOpen, onClose, title, description, children, side = 'right', className }) => {
  if (!isOpen) return null;

  const sides = {
    left: 'left-0 h-full w-3/4 border-r sm:max-w-sm animate-in slide-in-from-left duration-300',
    right: 'right-0 h-full w-3/4 border-l sm:max-w-sm animate-in slide-in-from-right duration-300',
    top: 'top-0 w-full border-b animate-in slide-in-from-top duration-300',
    bottom: 'bottom-0 w-full border-t animate-in slide-in-from-bottom duration-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn('fixed z-50 bg-white p-6 shadow-lg transition ease-in-out', sides[side], className)}>
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between">
            {title && <h2 className="text-lg font-semibold text-slate-950">{title}</h2>}
            <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        <div className="mt-4 h-full overflow-y-auto pb-12">{children}</div>
      </div>
    </div>
  );
};
