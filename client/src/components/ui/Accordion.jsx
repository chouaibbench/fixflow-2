import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const AccordionContext = React.createContext({ openValues: [], toggleValue: () => {} });

export const Accordion = ({ type = 'single', children, className }) => {
  const [openValues, setOpenValues] = useState([]);

  const toggleValue = (value) => {
    if (type === 'single') {
      setOpenValues(openValues.includes(value) ? [] : [value]);
    } else {
      setOpenValues(openValues.includes(value) ? openValues.filter((v) => v !== value) : [...openValues, value]);
    }
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue }}>
      <div className={cn('w-full border-b border-slate-200', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = ({ value, children, className }) => {
  const { openValues, toggleValue } = React.useContext(AccordionContext);
  const isOpen = openValues.includes(value);

  return (
    <div className={cn('border-b border-slate-200', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, onClick: () => toggleValue(value) });
        }
        return child;
      })}
    </div>
  );
};

export const AccordionTrigger = ({ children, className, isOpen, onClick }) => (
  <button
    onClick={onClick}
    className={cn('flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline', className)}
    data-state={isOpen ? 'open' : 'closed'}
  >
    {children}
    <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
  </button>
);

export const AccordionContent = ({ children, className, isOpen }) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden text-sm"
      >
        <div className={cn('pb-4 pt-0', className)}>{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);
