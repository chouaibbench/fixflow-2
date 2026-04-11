import React from 'react';
import { Clock, AlertCircle, CheckCircle2, User, Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useLanguage } from '../context/LanguageContext';

export const TicketList = ({ tickets, onUpdateStatus, onAssign, readonly = false }) => {
  const { t } = useLanguage();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-amber-500 animate-pulse" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'resolved') return t('resolved');
    if (status === 'in-progress') return t('active');
    if (status === 'pending') return t('pending');
    return status;
  };

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12 dark:border-slate-800">
          <CheckCircle2 className="mb-4 h-12 w-12 text-slate-200 dark:text-slate-800" />
          <p className="text-lg font-medium text-slate-500">{t('noActiveTickets')}</p>
          <p className="text-sm text-slate-400">{t('everythingSmooth')}</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket.id} className="overflow-hidden border-l-4 border-l-indigo-600 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold">{ticket.machineName}</CardTitle>
                  <Badge variant={ticket.priority === 'critical' ? 'destructive' : ticket.priority === 'high' ? 'warning' : 'secondary'}>
                    {ticket.priority}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t('reported')} {new Date(ticket.createdAt).toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <span className="text-sm font-medium capitalize">{getStatusLabel(ticket.status)}</span>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">{ticket.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {ticket.reportedBy}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {ticket.reportedByEmail}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-slate-50 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">{t('assignedTo')}:</span>
                <span className="font-medium">{ticket.assignedTo || t('unassigned')}</span>
              </div>
              {!readonly && (
                <div className="flex gap-2">
                  {ticket.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(ticket.id, 'in-progress')}>
                      {t('startWork')}
                    </Button>
                  )}
                  {ticket.status === 'in-progress' && (
                    <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => onUpdateStatus(ticket.id, 'resolved')}>
                      {t('resolve')}
                    </Button>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};
