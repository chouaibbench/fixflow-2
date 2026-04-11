import React from 'react';
import { cn } from '../../lib/utils';
import { Input } from './Input';
import { Label } from './Label';

export const InputGroupWithLabel = ({ label, description, error, className, ...props }) => (
  <div className={cn('space-y-2', className)}>
    <Label className="text-base">{label}</Label>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <Input {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
