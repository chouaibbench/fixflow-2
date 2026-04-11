import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

const RadioGroupContext = createContext(undefined);

export const RadioGroup = ({ value, onValueChange, children, className }) => (
  <RadioGroupContext.Provider value={{ value, onValueChange }}>
    <div className={cn('grid gap-2', className)} role="radiogroup">
      {children}
    </div>
  </RadioGroupContext.Provider>
);

export const RadioGroupItem = ({ value, label, disabled, className }) => {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within a RadioGroup');
  const checked = context.value === value;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => context.onValueChange(value)}
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-slate-200 text-indigo-600 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white'
        )}
      >
        {checked && (
          <div className="flex h-full w-full items-center justify-center rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        )}
      </button>
      <Label
        className={cn('font-normal cursor-pointer', disabled && 'cursor-not-allowed opacity-50')}
        onClick={() => !disabled && context.onValueChange(value)}
      >
        {label}
      </Label>
    </div>
  );
};
