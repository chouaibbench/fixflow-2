import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export const DropdownMenu = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={cn('absolute z-50 mt-2 w-56 rounded-md border border-slate-200 bg-white p-1 shadow-md animate-in fade-in zoom-in duration-100', align === 'right' ? 'right-0' : 'left-0')}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: (e) => { child.props.onClick?.(e); setIsOpen(false); }
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={cn('relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 disabled:pointer-events-none disabled:opacity-50', className)}>
    {children}
  </button>
);

export const DropdownMenuSeparator = () => <div className="-mx-1 my-1 h-px bg-slate-100" />;

export const DropdownMenuLabel = ({ children, className }) => (
  <div className={cn('px-2 py-1.5 text-sm font-semibold', className)}>{children}</div>
);
