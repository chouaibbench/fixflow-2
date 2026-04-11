import React from 'react';
import { cn } from '../../lib/utils';
import { Input } from './Input';
import { Label } from './Label';

export const InputWithLabel = ({ label, error, className, ...props }) => (
  <div className={cn('grid w-full items-center gap-1.5', className)}>
    <Label>{label}</Label>
    <Input {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
