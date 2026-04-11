import React, { useState } from 'react';
import { Scan, Search, Ticket as TicketIcon, Factory, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { QRScanner } from '../../components/QRScanner';
import { MachineCard } from '../../components/MachineCard';
import { TicketForm } from '../../components/TicketForm';
import { Dialog } from '../../components/ui/Dialog';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { useMachines } from '../../context/MachineContext';

import { useLanguage } from '../../context/LanguageContext';

export const WorkerDashboard = () => {
  const { user } = useAuth();
  const { tickets, addTicket } = useTickets();
  const { machines } = useMachines();
  const { t } = useLanguage();
  const machinesWithIssues = new Set(tickets.filter(t => t.status !== 'resolved').map(t => t.machine_id));
  const machinesOnline = machines.length - machinesWithIssues.size;
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMachines = machines.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(m.id).includes(searchQuery) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScan = (decodedText) => {
    const machine = machines.find((m) => m.id === decodedText);
    if (machine) {
      setSelectedMachine(machine);
      setIsScannerOpen(false);
      setIsTicketFormOpen(true);
      toast.success(`Machine found: ${machine.name}`);
    } else {
      toast.error('Machine not found. Please try again.');
    }
  };

  const handleReportIssue = (machine) => {
    setSelectedMachine(machine);
    setIsTicketFormOpen(true);
  };

  const handleSubmitTicket = (data) => {
    if (!selectedMachine) return;
    addTicket({
      machine_id:  selectedMachine.id,
      description: data.description,
      priority:    data.priority,
    });
    setIsTicketFormOpen(false);
    setSelectedMachine(null);
    toast.success('Ticket submitted successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('reportAnIssue')}</h2>
          <p className="text-slate-500">{t('reportAnIssueDesc')}</p>
        </div>
        <Button size="lg" className="h-14 gap-2 bg-indigo-600 px-8 text-lg font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-700" onClick={() => setIsScannerOpen(true)}>
          <Scan className="h-6 w-6" />
          {t('scanMachineQR')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">{t('myReportedTickets')}</CardTitle>
            <TicketIcon className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs opacity-70">{t('totalSubmitted')}</p>
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
            <CardTitle className="text-sm font-medium text-slate-500">{t('avgResponseTime')}</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45 mins</div>
            <p className="text-xs text-emerald-500">-10% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{t('allMachines')}</h3>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchMachines')}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} onReport={handleReportIssue} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isScannerOpen && (
          <QRScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />
        )}
      </AnimatePresence>

      <Dialog
        isOpen={isTicketFormOpen}
        onClose={() => setIsTicketFormOpen(false)}
        title={t('reportMachineIssue')}
        description={t('provideDetails')}
      >
        {selectedMachine && (
          <TicketForm
            machine={selectedMachine}
            onSubmit={handleSubmitTicket}
            onCancel={() => setIsTicketFormOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
};
