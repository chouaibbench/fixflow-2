import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { TechnicianTikets } from './pages/technician/Tickets';
import { AdminUsers } from './pages/admin/Users';
import { AdminTickets } from './pages/admin/Tickets';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { MachinesPage} from './pages/technician/Machines'
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { MachineProvider } from './context/MachineContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { WorkerLayout } from './layouts/WorkerLayout';
import { TechnicianLayout } from './layouts/TechnicianLayout';
import { LoginPage } from './pages/LoginPage';
import { WorkerDashboard } from './pages/worker/Dashboard';
import { TechnicianDashboard } from './pages/technician/Dashboard';
import { WorkerTickets } from './pages/worker/Tickets';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

const App = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <TicketProvider>
          <NotificationProvider>
          <MachineProvider>
          <Router>
            <Toaster position="top-right" richColors />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/worker"
                element={
                  <ProtectedRoute allowedRoles={['worker']}>
                    <WorkerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/worker/dashboard" replace />} />
                <Route path="dashboard" element={<WorkerDashboard />} />
                <Route path="machines" element={<div className="p-8 text-center">Worker Machines View (Coming Soon)</div>} />
                <Route path="tickets" element={<WorkerTickets />} />
              </Route>
              <Route
                path="/technician"
                element={
                  <ProtectedRoute allowedRoles={['technician']}>
                    <TechnicianLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/technician/dashboard" replace />} />
                <Route path="dashboard" element={<TechnicianDashboard />} />
                <Route path="machines" element={<MachinesPage />} />
                <Route path="tickets" element={ <TechnicianTikets/>} />
                <Route path="team" element={<div className="p-8 text-center">Technician Team View (Coming Soon)</div>} />
                <Route path="settings" element={<div className="p-8 text-center">Technician Settings View (Coming Soon)</div>} />
              </Route>
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="tickets" element={<AdminTickets />} />
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
          </MachineProvider>
          </NotificationProvider>
        </TicketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
