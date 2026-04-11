import React from 'react';
import { cn } from '../../lib/utils';

export const Avatar = ({ src, alt, fallback, className }) => (
  <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100', className)}>
    {src ? (
      <img src={src} alt={alt} referrerPolicy="no-referrer" className="aspect-square h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-500">
        {fallback || alt?.charAt(0).toUpperCase() || '?'}
      </div>
    )}
  </div>
);
