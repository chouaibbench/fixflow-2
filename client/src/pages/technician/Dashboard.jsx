import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Factory, Clock, AlertTriangle, CheckCircle2, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useMachines } from '../../context/MachineContext';
import { api } from '../../lib/api';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { TicketList } from '../../components/TicketList';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { cn, getExpiryMessage } from '../../lib/utils';
import { useTickets } from '../../context/TicketContext';
import { useLanguage } from '../../context/LanguageContext';

export const TechnicianDashboard = () => {
  const { machines } = useMachines();
  const { tickets, updateTicketStatus, assignTicket } = useTickets();
  const { t } = useLanguage();
  const machinesWithIssues = new Set(tickets.filter(t => t.status !== 'resolved').map(t => t.machine_id));
  const machinesOnline = machines.length - machinesWithIssues.size;
  const [activeTab, setActiveTab] = useState('all');
  const [activityLogs, setActivityLogs] = useState([]);
  const [showAllLogs, setShowAllLogs] = useState(false);

  useEffect(() => {
    api.get('/logs')
      .then(setActivityLogs)
      .catch(() => {});
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const handleUpdateTicketStatus = (ticketId, status) => {
    updateTicketStatus(ticketId, status);
    toast.info(`Ticket ${ticketId} updated to ${status}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('maintenanceDashboard')}</h2>
        <p className="text-slate-500">{t('maintenanceDashboardDesc')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">{t('activeTickets')}</CardTitle>
            <TicketIcon className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter((t) => t.status !== 'resolved').length}</div>
            <p className="text-xs opacity-70">{t('updatedRealTime')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('machinesOnline')}</CardTitle>
            <Factory className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machinesOnline} / {machines.length}</div>
            <p className="text-xs text-slate-500">{machines.length > 0 ? Math.round((machinesOnline / machines.length) * 100) : 0}% operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('avgResolution')}</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 hrs</div>
            <p className="text-xs text-emerald-500">{t('basedOnResolved')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{t('criticalIssues')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{tickets.filter((t) => t.priority === 'critical').length}</div>
            <p className="text-xs text-slate-500">{t('requiresAction')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t('maintenanceTickets')}</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="bg-slate-100 dark:bg-slate-900">
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="pending">{t('pending')}</TabsTrigger>
                <TabsTrigger value="in-progress">{t('active')}</TabsTrigger>
                <TabsTrigger value="resolved">{t('resolved')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <TicketList tickets={filteredTickets} onUpdateStatus={handleUpdateTicketStatus} onAssign={assignTicket} readonly />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('recentActivity')}</CardTitle>
              <CardDescription>{t('latestUpdates')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(showAllLogs ? activityLogs : activityLogs.slice(0, 5)).map((log) => (
                <div key={log.id} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 text-indigo-500">
                    <Clock className="h-4 w-4 "/>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{log.description}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-amber-500">{getExpiryMessage(log.created_at)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-xs text-indigo-600 dark:text-indigo-400" onClick={() => setShowAllLogs(prev => !prev)}>
                {showAllLogs ? t('showLess') : t('viewAllActivity')}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg">{t('needHelp')}</CardTitle>
              <CardDescription className="text-indigo-100">{t('contactSupervisor')}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Robert" fallback="RB" className="h-12 w-12 border-2 border-white/20" />
              <div>
                <p className="font-bold">Robert Brown</p>
                <p className="text-xs text-indigo-100">Shift Supervisor • Ext. 402</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">{t('callSupervisor')}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
