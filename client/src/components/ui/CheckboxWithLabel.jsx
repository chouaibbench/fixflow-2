import React from 'react';
import { cn } from '../../lib/utils';
import { Checkbox } from './Checkbox';
import { Label } from './Label';

export const CheckboxWithLabel = ({ label, checked, onCheckedChange, disabled, className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <Checkbox checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    <Label>{label}</Label>
  </div>
);
