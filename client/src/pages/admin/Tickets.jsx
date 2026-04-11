import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTickets } from '../../context/TicketContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';

export const AdminTickets = () => {
  const { tickets, deleteTicket } = useTickets();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = tickets.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const handleDelete = (id) => {
    if (!confirm('Delete this ticket permanently?')) return;
    deleteTicket(id)
      .then(() => toast.success('Ticket deleted'))
      .catch(() => toast.error('Failed to delete ticket'));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tickets</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-slate-500">No tickets found.</p>
        ) : (
          filtered.map(t => (
            <Card key={t.id} className="border-l-4 border-l-indigo-600">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-bold">{t.machineName}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>{t.priority}</Badge>
                  <Badge variant={t.status === 'resolved' ? 'success' : t.status === 'in-progress' ? 'warning' : 'default'}>
                    {t.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">{t.description}</p>
                <p className="text-xs text-slate-400">Reported by: {t.reportedBy}</p>
                <p className="text-xs text-slate-400">Assigned to: {t.assignedTo ?? 'Unassigned'}</p>
                <div className="flex justify-end">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
