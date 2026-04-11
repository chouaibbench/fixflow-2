import React from 'react';
import { cn } from '../../lib/utils';
import { Switch } from './Switch';
import { Label } from './Label';

export const SwitchGroup = ({ label, description, checked, onCheckedChange, disabled, className }) => (
  <div className={cn('flex items-center justify-between rounded-lg border border-slate-200 p-4', className)}>
    <div className="space-y-0.5">
      <Label className="text-base">{label}</Label>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
  </div>
);
