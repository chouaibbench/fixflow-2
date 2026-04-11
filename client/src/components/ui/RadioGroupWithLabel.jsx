import React from 'react';
import { cn } from '../../lib/utils';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import { Label } from './Label';

export const RadioGroupWithLabel = ({ label, description, options, value, onValueChange, disabled, className }) => (
  <div className={cn('space-y-3', className)}>
    <div className="space-y-0.5">
      <Label className="text-base">{label}</Label>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    <RadioGroup value={value} onValueChange={onValueChange} className="grid gap-2">
      {options.map((option) => (
        <RadioGroupItem key={option.value} value={option.value} label={option.label} disabled={disabled} />
      ))}
    </RadioGroup>
  </div>
);
