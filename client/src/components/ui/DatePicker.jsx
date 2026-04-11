import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { Popover } from './Popover';

export const DatePicker = ({ date, onDateChange, placeholder = 'Pick a date', className }) => (
  <Popover
    trigger={
      <Button variant="outline" className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-slate-500', className)}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, 'PPP') : <span>{placeholder}</span>}
      </Button>
    }
  >
    <Calendar selected={date} onSelect={(newDate) => onDateChange(newDate)} />
  </Popover>
);
