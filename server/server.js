require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDb, getDb } = require('./src/db');

const app = express();
app.set('trust proxy', 1);
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.FRONTEND_URL || '*';
    if (!origin || allowed === '*' || origin === allowed || origin.endsWith('.fixflow-v2.pages.dev')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

const loginLimiter = rateLimit({ windowMs: 60_000, max: 10, message: { message: 'Too many requests.' } });

initDb().then(() => {
  const auth          = require('./src/middleware/auth');
  const adminMw       = require('./src/middleware/admin');
  const authRoutes    = require('./src/routes/auth');
  const machineRoutes = require('./src/routes/machines');
  const ticketRoutes  = require('./src/routes/tickets');
  const userRoutes    = require('./src/routes/users');
  const adminRoutes   = require('./src/routes/admin');

  // Temp debug route
  app.get('/api/debug-user', async (req, res) => {
    const { rows } = await getDb().query('SELECT id, email, password FROM users WHERE email = $1', ['admin@fixflow.com']);
    res.json(rows[0] || null);
  });

  // Public auth routes
  app.use('/api', loginLimiter, authRoutes);

  // Authenticated routes
  app.use('/api/machines', auth, machineRoutes);
  app.use('/api/tickets',  auth, ticketRoutes);
  app.use('/api/users',    auth, userRoutes);

  // /api/logs — all authenticated users
  app.get('/api/logs', auth, async (req, res) => {
    try {
      const { rows } = await getDb().query(`
        SELECT l.id, l.action, l.description, l.created_at, u.name as user_name
        FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id
        ORDER BY l.created_at DESC LIMIT 50
      `);
      res.json(rows.map(l => ({
        id: l.id, user: l.user_name ?? 'System',
        action: l.action, description: l.description, created_at: l.created_at,
      })));
    } catch { res.status(500).json({ message: 'Server error.' }); }
  });

  // Admin-only routes
  app.use('/api/admin', auth, adminMw, adminRoutes);

  // DELETE /api/tickets/:id — admin only
  app.delete('/api/tickets/:id', auth, adminMw, async (req, res) => {
    try {
      const db = getDb();
      const { rows } = await db.query('SELECT id FROM tickets WHERE id = $1', [req.params.id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found.' });
      await db.query('DELETE FROM tickets WHERE id = $1', [req.params.id]);
      res.json({ message: 'Deleted' });
    } catch { res.status(500).json({ message: 'Server error.' }); }
  });

  // Serve built React client in production
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  if (require('fs').existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`FixFlow running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
