import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Wrench, LogOut, Bell, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

export const WorkerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, toggleLang, lang } = useLanguage();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const toggleNotifs = () => {
    setShowNotifs(prev => !prev);
    if (!showNotifs) markAllRead();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          <Link to="/worker/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">FixFlow</h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Worker Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleLang} className="px-2 py-1 text-xs font-bold rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              {lang === 'en' ? 'ع' : 'EN'}
            </button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative" onClick={toggleNotifs}>
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {showNotifs && (
              <div className="absolute right-4 top-16 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <span className="font-semibold text-sm">Notifications</span>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-500">Clear all</button>
                    )}
                    <button onClick={() => setShowNotifs(false)}><X className="h-4 w-4 text-slate-400" /></button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications yet</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`border-b border-slate-50 px-4 py-3 text-sm dark:border-slate-800 ${!n.read ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}>
                        <p className="text-slate-800 dark:text-slate-200">{n.message}</p>
                        <p className="mt-1 text-xs text-slate-400">{new Date(n.time).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</p>
              </div>
              <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} fallback="W" className="h-9 w-9 border-2 border-indigo-500/20" />
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6 lg:px-8">
          <NavLink to="/worker/dashboard" className={({ isActive }) => `px-4 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-400'}`}>{t('dashboard')}</NavLink>
          <NavLink to="/worker/tickets" className={({ isActive }) => `px-4 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-400'}`}>{t('myTickets')}</NavLink>
          <NavLink to="/worker/machines" className={({ isActive }) => `px-4 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-600 dark:text-slate-400'}`}>{t('machines')}</NavLink>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold">FixFlow</span>
            </div>
            <p className="text-xs text-slate-500">© 2024 FixFlow Maintenance Systems. Worker Portal.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
