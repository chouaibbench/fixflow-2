import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Checkbox = ({ checked, onCheckedChange, disabled, className, label }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-indigo-600 text-white' : 'bg-white'
      )}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
    {label && (
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" onClick={() => onCheckedChange(!checked)}>
        {label}
      </label>
    )}
  </div>
);
