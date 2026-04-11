import React, { useState, useEffect } from 'react';
import { Users, Wrench, Ticket, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { api } from '../../lib/api';
import { getExpiryMessage } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/stats').then(setStats).catch(() => {});
    api.get('/admin/logs').then(setLogs).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <p className="text-slate-500">System overview and activity logs.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total_users}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Workers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total_workers}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Technicians</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total_technicians}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Machines</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total_machines}</div></CardContent></Card>
          <Card className="bg-indigo-600 text-white"><CardHeader className="pb-2"><CardTitle className="text-sm opacity-80">Total Tickets</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.total_tickets}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Open Tickets</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-500">{stats.open_tickets}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-500">Resolved</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-500">{stats.resolved_tickets}</div></CardContent></Card>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">Activity Logs</h3>
        <Card>
          <CardContent className="pt-6">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <div>
                      <p className="text-sm">{log.description}</p>
                      <p className="text-xs text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
                      <p className="text-xs text-amber-500">{getExpiryMessage(log.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
