import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export const EmptyState = ({ icon: Icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-12 text-center', className)}>
    {Icon && <Icon className="mb-4 h-12 w-12 text-slate-300" />}
    <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
    {description && <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <Button onClick={action.onClick} variant="outline">{action.label}</Button>}
  </div>
);
