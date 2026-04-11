import React, {useState} from 'react';
import { toast } from 'sonner';
import { useTickets } from '../../context/TicketContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { useAuth } from '../../context/AuthContext';

export const TechnicianTikets = () => {
    const { tickets, updateTicketStatus, assignTicket } = useTickets();
    const [ activeTab, setActiveTab ] = useState('all');
    const { user } = useAuth();

    const filtered = tickets.filter(t => {
        if (activeTab === 'all') return true;
        return t.status ===activeTab;
    });

    return (
        <div>
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
            </div>
            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <p className="text-slate-500">No tickets found.</p>
                ) : (
                    filtered.map(t => (
                    <Card key={t.id} className="border-l-4 border-l-indigo-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-bold">{t.machineName}</CardTitle>
                        <Badge>{t.priority}</Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">{t.description}</p>
                        <p className="text-xs text-slate-400">Reported by: {t.reportedBy}</p>
                        <p className="text-xs text-slate-400">Assigned to: {t.assignedTo ?? 'Unassigned'}</p>
                        <div className="flex gap-2 flex-wrap">
                            {!t.assignedTo && (
                            <Button size="sm" variant="outline" onClick={() => {
                                assignTicket(t.id, user.id);
                                toast.success('Ticket assigned to you');
                            }}>
                                Assign to me
                            </Button>
                            )}
                            {t.status !== 'in-progress' && t.status !== 'resolved' && (
                            <Button size="sm" onClick={() => {
                                updateTicketStatus(t.id, 'in-progress');
                                toast.info('Ticket marked as in progress');
                            }}>
                                Start
                            </Button>
                            )}
                            {t.status !== 'resolved' && (
                            <Button size="sm" variant="outline" onClick={() => {
                                updateTicketStatus(t.id, 'resolved');
                                toast.success('Ticket resolved');
                            }}>
                                Resolve
                            </Button>
                            )}
                        </div>
                        </CardContent>
                    </Card>
                    ))
                )}
            </div>

       </div> 
    )
}
