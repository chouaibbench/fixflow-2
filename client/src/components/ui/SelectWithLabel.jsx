import React from 'react';
import { cn } from '../../lib/utils';
import { Select } from './Input';
import { Label } from './Label';

export const SelectWithLabel = ({ label, error, className, children, ...props }) => (
  <div className={cn('grid w-full items-center gap-1.5', className)}>
    <Label>{label}</Label>
    <Select {...props}>{children}</Select>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
