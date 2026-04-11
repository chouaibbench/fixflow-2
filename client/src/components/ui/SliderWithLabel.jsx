import React from 'react';
import { cn } from '../../lib/utils';
import { Slider } from './Slider';
import { Label } from './Label';

export const SliderWithLabel = ({ label, value, onValueChange, min, max, step, disabled, className }) => (
  <div className={cn('grid w-full items-center gap-1.5', className)}>
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <span className="text-sm font-medium text-slate-500">{value}</span>
    </div>
    <Slider value={value} onValueChange={onValueChange} min={min} max={max} step={step} disabled={disabled} />
  </div>
);
