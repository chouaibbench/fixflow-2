import React from 'react';
import { cn } from '../../lib/utils';
import { Textarea } from './Input';
import { Label } from './Label';

export const TextareaWithLabel = ({ label, error, className, ...props }) => (
  <div className={cn('grid w-full items-center gap-1.5', className)}>
    <Label>{label}</Label>
    <Textarea {...props} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
