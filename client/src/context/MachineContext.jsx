import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const MachineContext = createContext(undefined);

export const MachineProvider = ({ children }) => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    api.get('/machines')
      .then((data) => setMachines(data))
      .catch(() => setMachines([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  const addMachine = async (data) => {
    const m = await api.post('/machines', data);
    setMachines((prev) => [...prev, m]);
    return m;
  };

  const updateMachine = async (id, data) => {
    const m = await api.put(`/machines/${id}`, data);
    setMachines((prev) => prev.map((x) => (x.id === id ? m : x)));
    return m;
  };

  const deletMachine = async (id) => {
    await api.delete(`/machines/${id}`);
    setMachines((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <MachineContext.Provider value={{ machines, isLoading, addMachine, updateMachine, deletMachine }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => {
  const context = useContext(MachineContext);
  if (context === undefined) throw new Error('useMachines must be used within a MachineProvider');
  return context;
};
