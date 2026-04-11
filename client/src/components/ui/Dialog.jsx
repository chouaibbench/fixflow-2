import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Dialog = ({ isOpen, onClose, title, description, children, className }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn('relative w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg pointer-events-auto', className)}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-between">
                {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
                <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
              {description && <p className="text-sm text-slate-500">{description}</p>}
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);
