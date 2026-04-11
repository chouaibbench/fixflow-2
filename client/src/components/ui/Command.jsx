import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './Input';

export const Command = ({ children, className }) => (
  <div className={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950', className)}>
    {children}
  </div>
);

export const CommandInput = ({ placeholder = 'Search...', value, onValueChange, className }) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn('flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50', className)}
    />
  </div>
);

export const CommandList = ({ children, className }) => (
  <div className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}>{children}</div>
);

export const CommandEmpty = ({ children, className }) => (
  <div className={cn('py-6 text-center text-sm', className)}>{children}</div>
);

export const CommandGroup = ({ heading, children, className }) => (
  <div className={cn('overflow-hidden p-1 text-slate-950', className)}>
    {heading && <div className="px-2 py-1.5 text-xs font-medium text-slate-500">{heading}</div>}
    {children}
  </div>
);

export const CommandItem = ({ children, onSelect, className }) => (
  <div
    onClick={onSelect}
    className={cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100', className)}
  >
    {children}
  </div>
);
