import React from 'react';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../constants';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

export const PriorityBadge = ({ priority, className }) => (
  <Badge variant="outline" className={cn('capitalize font-medium', PRIORITY_COLORS[priority], className)}>
    {PRIORITY_LABELS[priority]}
  </Badge>
);
