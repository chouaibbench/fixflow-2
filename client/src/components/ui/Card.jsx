import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className }) => (
  <div className={cn('rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm', className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>{children}</h3>
);

export const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-slate-500', className)}>{children}</p>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={cn('flex items-center p-6 pt-0', className)}>{children}</div>
);
