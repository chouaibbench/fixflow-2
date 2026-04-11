import React from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

export const StatusBadge = ({ status, className }) => (
  <Badge variant="outline" className={cn('capitalize font-medium', STATUS_COLORS[status], className)}>
    {STATUS_LABELS[status]}
  </Badge>
);
