import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const TicketContext = createContext(undefined);

const normalize = (t) => ({
  ...t,
  machineName:     t.machine?.name    ?? t.machineName     ?? '',
  reportedBy:      t.reporter?.name   ?? t.reportedBy      ?? '',
  reportedByEmail: t.reporter?.email  ?? t.reportedByEmail ?? '',
  assignedTo:      t.assignee?.name   ?? t.assignedTo      ?? null,
  createdAt:       t.created_at       ?? t.createdAt,
});

export const TicketProvider = ({ children }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const data = await api.get('/tickets');
      setTickets(data.map(normalize));
    } catch (_) {}
  };

  useEffect(() => {
    if (!user) return;
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const addTicket = async (ticketData) => {
    const newTicket = await api.post('/tickets', ticketData);
    setTickets((prev) => [normalize(newTicket), ...prev]);
    return newTicket;
  };

  const updateTicketStatus = async (ticketId, status) => {
    const updated = await api.put(`/tickets/${ticketId}`, { status });
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? normalize(updated) : t)));
  };

  const assignTicket = async (ticketId, technician) => {
    const updated = await api.put(`/tickets/${ticketId}`, { assigned_to: technician });
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? normalize(updated) : t)));
  };

  const deleteTicket = async (ticketId) => {
    await api.delete(`/tickets/${ticketId}`);
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, assignTicket, deleteTicket, fetchTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) throw new Error('useTickets must be used within a TicketProvider');
  return context;
};
