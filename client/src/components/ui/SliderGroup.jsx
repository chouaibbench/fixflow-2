import React from 'react';
import { cn } from '../../lib/utils';
import { Slider } from './Slider';
import { Label } from './Label';

export const SliderGroup = ({ label, description, value, onValueChange, min, max, step, disabled, className }) => (
  <div className={cn('space-y-2', className)}>
    <div className="flex items-center justify-between">
      <Label className="text-base">{label}</Label>
      <span className="text-sm font-medium text-slate-500">{value}</span>
    </div>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <Slider value={value} onValueChange={onValueChange} min={min} max={max} step={step} disabled={disabled} />
  </div>
);
