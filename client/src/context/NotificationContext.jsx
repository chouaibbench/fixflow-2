import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useTickets } from './TicketContext';

const NotificationContext = createContext(undefined);

const STORAGE_KEY = 'workerNotifications';

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [notifications, setNotifications] = useState(load);
  const prevTickets = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'worker') return;

    // First run — seed previous state, no notifications
    if (prevTickets.current === null) {
      prevTickets.current = tickets.reduce((acc, t) => {
        acc[t.id] = { status: t.status, assignedTo: t.assignedTo };
        return acc;
      }, {});
      return;
    }

    const myTickets = tickets.filter(t => t.reported_by === user.id || t.reporter?.id === user.id);
    const newNotifs = [];

    myTickets.forEach(t => {
      const prev = prevTickets.current[t.id];
      if (!prev) {
        // Brand new ticket — no notification needed (worker just created it)
        prevTickets.current[t.id] = { status: t.status, assignedTo: t.assignedTo };
        return;
      }
      if (prev.status !== t.status) {
        if (t.status === 'in-progress') {
          newNotifs.push({ id: Date.now() + Math.random(), ticketId: t.id, machine: t.machineName, message: `A technician started working on your ticket for ${t.machineName}`, time: new Date().toISOString(), read: false });
        } else if (t.status === 'resolved') {
          newNotifs.push({ id: Date.now() + Math.random(), ticketId: t.id, machine: t.machineName, message: `Your ticket for ${t.machineName} has been resolved`, time: new Date().toISOString(), read: false });
        }
      }
      if (!prev.assignedTo && t.assignedTo) {
        newNotifs.push({ id: Date.now() + Math.random(), ticketId: t.id, machine: t.machineName, message: `${t.assignedTo} was assigned to your ticket for ${t.machineName}`, time: new Date().toISOString(), read: false });
      }
      prevTickets.current[t.id] = { status: t.status, assignedTo: t.assignedTo };
    });

    if (newNotifs.length > 0) {
      setNotifications(prev => {
        const updated = [...newNotifs, ...prev].slice(0, 50);
        save(updated);
        return updated;
      });
    }
  }, [tickets]);

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      save(updated);
      return updated;
    });
  };

  const clearAll = () => { setNotifications([]); save([]); };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
