import React from 'react';
import { cn } from '../../lib/utils';
import { Switch } from './Switch';
import { Label } from './Label';

export const SwitchWithLabel = ({ label, checked, onCheckedChange, disabled, className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    <Label>{label}</Label>
  </div>
);
