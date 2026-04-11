import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fixflow_token');
    if (!token) { setIsLoading(false); return; }

    api.get('/me')
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem('fixflow_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/login', { email, password });
    localStorage.setItem('fixflow_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try { await api.post('/logout'); } catch (_) {}
    localStorage.removeItem('fixflow_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
