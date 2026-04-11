import React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent } from './Card';

export const StatCard = ({ title, value, icon: Icon, description, trend, className }) => (
  <Card className={cn('overflow-hidden', className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
        {trend && (
          <span className={cn('text-xs font-medium', trend.isPositive ? 'text-emerald-600' : 'text-red-600')}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
    </CardContent>
  </Card>
);
