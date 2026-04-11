import React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './Label';

export const FormItem = ({ label, error, description, children, className }) => (
  <div className={cn('space-y-2', className)}>
    {label && <Label>{label}</Label>}
    {children}
    {description && <p className="text-[0.8rem] text-slate-500">{description}</p>}
    {error && <p className="text-[0.8rem] font-medium text-red-500">{error}</p>}
  </div>
);

export const Form = ({ children, className, ...props }) => (
  <form className={cn('space-y-6', className)} {...props}>{children}</form>
);
