import React from 'react';
import { cn } from '../../lib/utils';
import { Combobox } from './Combobox';
import { Label } from './Label';

export const ComboboxGroupWithLabel = ({ label, description, options, value, onValueChange, placeholder, emptyMessage, error, className }) => (
  <div className={cn('space-y-2', className)}>
    <Label className="text-base">{label}</Label>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <Combobox options={options} value={value} onValueChange={onValueChange} placeholder={placeholder} emptyMessage={emptyMessage} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
