import React from 'react';
import { cn } from '../../lib/utils';

export const PageHeader = ({ title, description, actions, className }) => (
  <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between', className)}>
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="text-lg text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);
