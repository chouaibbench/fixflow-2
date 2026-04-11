import React from 'react';
import { cn } from '../../lib/utils';

export const Slider = ({ value, onValueChange, min = 0, max = 100, step = 1, disabled, className }) => (
  <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      disabled={disabled}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-indigo-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);
