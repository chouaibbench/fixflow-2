import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export const Popover = ({ trigger, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>
      {isOpen && (
        <div className={cn('absolute z-50 mt-2 w-72 rounded-md border border-slate-200 bg-white p-4 shadow-md animate-in fade-in zoom-in duration-200', className)}>
          {children}
        </div>
      )}
    </div>
  );
};
