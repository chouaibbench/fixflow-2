import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, LogOut, Bell, LayoutDashboard, Factory, Ticket as TicketIcon, Users, Settings, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export const TechnicianLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { t, toggleLang, lang } = useLanguage();
  const [isOnline, setIsOnline] = React.useState(false);
  const [needsAudioUnlock, setNeedsAudioUnlock] = React.useState(false);

  const prevTicketIds = React.useRef(null);
  const audioRef = React.useRef(null);

  // ── helpers ───────────────────────────────────────────────────────────────
  const getAlertingTickets = () => {
    try { return new Set(JSON.parse(localStorage.getItem('alertingTickets') || '[]')); }
    catch { return new Set(); }
  };
  const saveAlertingTickets = (set) => {
    localStorage.setItem('alertingTickets', JSON.stringify([...set]));
  };

  // Create audio element once
  React.useEffect(() => {
    const audio = new Audio('/alert.mp3');
    audio.loop = true;
    audioRef.current = audio;
    audio.addEventListener('canplaythrough', () => console.log('[Audio] ready to play'));
    audio.addEventListener('error', (e) => console.error('[Audio] load error', e));
    return () => { audio.pause(); };
  }, []);

  // Sync online state from user; show banner if not yet unlocked
  React.useEffect(() => {
    if (user?.is_online) {
      setIsOnline(true);
      if (localStorage.getItem('audioUnlocked') !== 'true') {
        setNeedsAudioUnlock(true);
      }
    }
  }, [user]);

  // ── audio helpers ─────────────────────────────────────────────────────────
  const stopAlert = () => {
    console.log('[Audio] stopAlert called');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startAlert = () => {
    console.log('[Audio] startAlert called, audio:', audioRef.current, 'paused:', audioRef.current?.paused);
    if (!audioRef.current) return;
    if (!audioRef.current.paused) return;
    audioRef.current.play()
      .then(() => console.log('[Audio] playing'))
      .catch(e => console.error('[Audio] play() rejected:', e));
  };

  const unlockAudio = () => {
    console.log('[Audio] unlockAudio clicked');
    localStorage.setItem('audioUnlocked', 'true');
    setNeedsAudioUnlock(false);
    if (getAlertingTickets().size > 0) startAlert();
  };

  // ── online toggle ─────────────────────────────────────────────────────────
  const toggleOnline = async () => {
    try {
      const res = await api.post('/users/toggle-online');
      setIsOnline(res.is_online);
      if (!res.is_online) {
        stopAlert();
        saveAlertingTickets(new Set());
      } else {
        // Just went online — check for existing unassigned tickets immediately
        // This runs inside a user gesture so play() is allowed
        try {
          const data = await api.get('/tickets');
          const unassigned = data.filter(t => !t.assigned_to);
          if (unassigned.size > 0 || unassigned.length > 0) {
            const alerting = new Set(unassigned.map(t => t.id));
            saveAlertingTickets(alerting);
            startAlert();
          }
        } catch {}
      }
      setNeedsAudioUnlock(false);
      toast.success(res.is_online ? 'You are now Online' : 'You are now Offline');
    } catch { toast.error('Failed to update status'); }
  };

  // ── polling ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isOnline) { prevTicketIds.current = null; stopAlert(); return; }

    const poll = async () => {
      try {
        const data = await api.get('/tickets');
        const alerting = getAlertingTickets();

        // First poll — seed prevTicketIds but don't alert for existing tickets
        if (prevTicketIds.current === null) {
          prevTicketIds.current = new Set(data.map(t => t.id));
          // Still restore alert for any persisted unassigned tickets from before refresh
          data.forEach(t => { if (!t.assigned_to && alerting.has(t.id)) {} }); // already in set
          // Remove assigned ones from persisted set
          data.forEach(t => { if (t.assigned_to) alerting.delete(t.id); });
          // Remove deleted ones
          const ids = new Set(data.map(t => t.id));
          alerting.forEach(id => { if (!ids.has(id)) alerting.delete(id); });
          saveAlertingTickets(alerting);
          console.log('[Poll] first poll, alerting set:', [...alerting], 'audioUnlocked:', localStorage.getItem('audioUnlocked'));
          if (alerting.size > 0 && localStorage.getItem('audioUnlocked') === 'true') startAlert();
          return;
        }

        // Subsequent polls — detect brand new tickets
        const newOnes = data.filter(t => !prevTicketIds.current.has(t.id) && !t.assigned_to);
        newOnes.forEach(t => {
          alerting.add(t.id);
          prevTicketIds.current.add(t.id);
          toast.warning(`New ticket: ${t.title || `#${t.id}`}`);
        });

        // Remove assigned/deleted tickets from alerting set
        data.forEach(t => { if (t.assigned_to) alerting.delete(t.id); });
        const ids = new Set(data.map(t => t.id));
        alerting.forEach(id => { if (!ids.has(id)) alerting.delete(id); });
        // Track all current ids
        data.forEach(t => prevTicketIds.current.add(t.id));

        saveAlertingTickets(alerting);

        if (alerting.size > 0 && localStorage.getItem('audioUnlocked') === 'true') {
          console.log('[Poll] alerting tickets:', [...alerting], '— calling startAlert');
          startAlert();
        } else if (alerting.size === 0) {
          stopAlert();
        } else {
          console.log('[Poll] alerting tickets exist but audioUnlocked is not set');
        }
      } catch {}
    };

    poll();
    const interval = setInterval(poll, 10000);
    return () => { clearInterval(interval); stopAlert(); };
  }, [isOnline]);

  const handleLogout = () => {
    if (isOnline) api.post('/users/toggle-online').catch(() => {});
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: t('dashboard'), path: '/technician/dashboard', icon: LayoutDashboard },
    { name: t('machines'), path: '/technician/machines', icon: Factory },
    { name: t('tickets'), path: '/technician/tickets', icon: TicketIcon },
    { name: t('technicians'), path: '/technician/team', icon: Users },
    { name: t('settings'), path: '/technician/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">FixFlow</h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Technician Portal</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="space-y-2">
              <button
                onClick={toggleOnline}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer',
                  isOnline
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
                {isOnline ? 'Online — On Duty' : 'Offline — Go Online'}
              </button>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} fallback="T" className="h-10 w-10 border-2 border-indigo-500/20" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <button onClick={toggleLang} className="px-2 py-1 text-xs font-bold rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {lang === 'en' ? 'ع' : 'EN'}
                </button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-5 w-5 text-slate-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 lg:hidden">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="font-bold">FixFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleOnline}
            className={cn(
              'rounded-lg px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1.5',
              isOnline
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
            {isOnline ? 'Online' : 'Offline'}
          </button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} fallback="T" className="h-8 w-8" />
        </div>
      </header>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex w-64 flex-col bg-white dark:bg-slate-900">
            <div className="flex h-16 items-center justify-between px-6 border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-indigo-600" />
                <span className="font-bold">FixFlow</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                    location.pathname === item.path
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t dark:border-slate-800 space-y-2">
              <button
                onClick={toggleOnline}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2',
                  isOnline
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
                {isOnline ? 'Online — On Duty' : 'Offline — Go Online'}
              </button>
              <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        {needsAudioUnlock && (
          <div className="bg-amber-500 text-white text-sm px-4 py-2 flex items-center justify-between">
            <span>🔔 Click to enable alert sounds for new tickets</span>
            <button onClick={unlockAudio} className="ml-4 bg-white text-amber-600 font-bold px-3 py-1 rounded cursor-pointer">
              Enable Sound
            </button>
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
