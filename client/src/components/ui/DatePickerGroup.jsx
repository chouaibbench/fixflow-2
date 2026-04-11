import React from 'react';
import { cn } from '../../lib/utils';
import { DatePicker } from './DatePicker';
import { Label } from './Label';

export const DatePickerGroup = ({ label, description, date, onDateChange, placeholder, error, className }) => (
  <div className={cn('space-y-2', className)}>
    <Label className="text-base">{label}</Label>
    {description && <p className="text-sm text-slate-500">{description}</p>}
    <DatePicker date={date} onDateChange={onDateChange} placeholder={placeholder} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
