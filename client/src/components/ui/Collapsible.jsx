import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Collapsible = ({ title, children, defaultOpen = false, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('w-full rounded-lg border border-slate-200 bg-white overflow-hidden', className)}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-slate-50">
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      {isOpen && (
        <div className="border-t border-slate-200 p-4 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
