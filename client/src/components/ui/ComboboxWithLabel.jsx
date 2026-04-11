import React from 'react';
import { cn } from '../../lib/utils';
import { Combobox } from './Combobox';
import { Label } from './Label';

export const ComboboxWithLabel = ({ label, options, value, onValueChange, placeholder, emptyMessage, error, className }) => (
  <div className={cn('grid w-full items-center gap-1.5', className)}>
    <Label>{label}</Label>
    <Combobox options={options} value={value} onValueChange={onValueChange} placeholder={placeholder} emptyMessage={emptyMessage} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
