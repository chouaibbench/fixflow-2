import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Loading = ({ className, size = 24, text }) => (
  <div className={cn('flex flex-col items-center justify-center gap-2 p-8', className)}>
    <Loader2 className="animate-spin text-indigo-600" size={size} />
    {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
  </div>
);

export const LoadingOverlay = ({ className, ...props }) => (
  <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm', className)}>
    <Loading size={40} {...props} />
  </div>
);
