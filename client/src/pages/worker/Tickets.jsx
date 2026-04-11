import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTickets } from '../../context/TicketContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const WorkerTickets = () => {
    const { user } = useAuth();
    const { tickets } = useTickets();

    // Filter by user ID — more reliable than name comparison
    const myTickets = tickets.filter(t => t.reported_by === user?.id || t.reporter?.id === user?.id);

    const getStatusIcon = (status) => {
        if (status === 'resolved') return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
        if (status === 'in_progress' || status === 'in-progress') return <Clock className="h-4 w-4 text-amber-500" />;
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    };

    const getPriorityVariant = (priority) => {
        if (priority === 'critical') return 'destructive';
        if (priority === 'high') return 'warning';
        return 'secondary';
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">My Tickets</h2>
            {myTickets.length === 0 ? (
                <p className="text-slate-500">You haven't reported any issues yet.</p>
            ) : (
                <div className="space-y-4">
                    {myTickets.map((t) => (
                        <Card key={t.id} className="border-l-4 border-l-indigo-600">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-bold">{t.machineName}</CardTitle>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(t.status)}
                                    <span className="text-sm capitalize">{t.status?.replace('_', ' ')}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-slate-600 dark:text-slate-300">{t.description}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <Badge variant={getPriorityVariant(t.priority)}>{t.priority}</Badge>
                                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
