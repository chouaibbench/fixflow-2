import React from 'react';
import { cn } from '../../lib/utils';

export const Progress = ({ value, max = 100, className, indicatorClassName }) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full w-full flex-1 bg-indigo-600 transition-all duration-300 ease-in-out', indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
};
