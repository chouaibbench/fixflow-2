import React from 'react';
import { cn } from '../../lib/utils';
import { DatePicker } from './DatePicker';
import { Label } from './Label';

export const DatePickerWithLabel = ({ label, date, onDateChange, placeholder, error, className }) => (
  <div className={cn('grid w-full items-center gap-1.5', className)}>
    <Label>{label}</Label>
    <DatePicker date={date} onDateChange={onDateChange} placeholder={placeholder} />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
