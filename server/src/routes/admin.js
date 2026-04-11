const router = require('express').Router();
const { getDb } = require('../db');

router.get('/stats', (req, res) => {
  const db = getDb();
  res.json({
    total_users:       db.prepare('SELECT COUNT(*) as c FROM users').get().c,
    total_workers:     db.prepare("SELECT COUNT(*) as c FROM users WHERE role='worker'").get().c,
    total_technicians: db.prepare("SELECT COUNT(*) as c FROM users WHERE role='technician'").get().c,
    total_machines:    db.prepare('SELECT COUNT(*) as c FROM machines').get().c,
    total_tickets:     db.prepare('SELECT COUNT(*) as c FROM tikets').get().c,
    open_tickets:      db.prepare("SELECT COUNT(*) as c FROM tikets WHERE status != 'resolved'").get().c,
    resolved_tickets:  db.prepare("SELECT COUNT(*) as c FROM tikets WHERE status = 'resolved'").get().c,
  });
});

router.get('/logs', (req, res) => {
  const logs = getDb().prepare(`
    SELECT l.id, l.action, l.description, l.created_at, u.name as user_name
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC
    LIMIT 50
  `).all();
  res.json(logs.map(l => ({ id: l.id, user: l.user_name ?? 'System', action: l.action, description: l.description, created_at: l.created_at })));
});

module.exports = router;
