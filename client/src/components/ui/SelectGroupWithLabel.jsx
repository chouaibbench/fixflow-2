import React from 'react';
import { cn } from '../../lib/utils';
import { Select } from './Input';
import { Label } from './Label';

export const SelectGroupWithLabel = ({ label, description, error, className, children, ...props }) => (
  <div className={cn('space-y-2', className)}>
    <Label className="text-base">{label}</Label>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <Select {...props}>{children}</Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
