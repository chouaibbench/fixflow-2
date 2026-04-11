import React from 'react';
import { cn } from '../../lib/utils';

export const ScrollArea = ({ children, className, ...props }) => (
  <div className={cn('relative overflow-hidden', className)} {...props}>
    <div className="h-full w-full overflow-auto scrollbar-hide">
      {children}
    </div>
  </div>
);
