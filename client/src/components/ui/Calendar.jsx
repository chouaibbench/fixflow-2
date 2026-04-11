import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export const Calendar = ({ selected, onSelect, className }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => (
    <div className="flex items-center justify-between px-2 py-2">
      <h2 className="text-sm font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
      <div className="flex space-x-1">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 mb-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
        <div key={i} className="text-center text-[0.8rem] font-medium text-slate-500">{day}</div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day.toString()}
            className={cn(
              'relative h-9 w-9 cursor-pointer rounded-md text-center text-sm transition-colors hover:bg-slate-100 flex items-center justify-center',
              !isSameMonth(day, monthStart) ? 'text-slate-400' : 'text-slate-900',
              selected && isSameDay(day, selected) ? 'bg-indigo-600 text-white hover:bg-indigo-600' : ''
            )}
            onClick={() => onSelect?.(cloneDay)}
          >
            <span>{format(day, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  return (
    <div className={cn('w-64 rounded-md border border-slate-200 bg-white p-3 shadow-sm', className)}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
