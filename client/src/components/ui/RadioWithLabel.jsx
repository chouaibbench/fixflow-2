import React from 'react';
import { cn } from '../../lib/utils';
import { RadioGroupItem } from './RadioGroup';

export const RadioWithLabel = ({ value, label, checked, onCheckedChange, disabled, className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <RadioGroupItem value={value} label={label} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
  </div>
);
