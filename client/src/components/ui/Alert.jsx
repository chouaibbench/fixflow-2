import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Alert = ({ className, variant = 'default', title, children, ...props }) => {
  const variants = {
    default: 'bg-slate-50 text-slate-900 border-slate-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
  };

  const Icons = { default: Info, destructive: XCircle, success: CheckCircle2, info: Info, warning: AlertCircle };
  const Icon = Icons[variant];

  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950', variants[variant], className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  );
};
