const router = require('express').Router();
const { getDb } = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const db = getDb();
    const [users, workers, technicians, machines, total, open, resolved] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query("SELECT COUNT(*) FROM users WHERE role='worker'"),
      db.query("SELECT COUNT(*) FROM users WHERE role='technician'"),
      db.query('SELECT COUNT(*) FROM machines'),
      db.query('SELECT COUNT(*) FROM tickets'),
      db.query("SELECT COUNT(*) FROM tickets WHERE status != 'resolved'"),
      db.query("SELECT COUNT(*) FROM tickets WHERE status = 'resolved'"),
    ]);
    res.json({
      total_users:       parseInt(users.rows[0].count),
      total_workers:     parseInt(workers.rows[0].count),
      total_technicians: parseInt(technicians.rows[0].count),
      total_machines:    parseInt(machines.rows[0].count),
      total_tickets:     parseInt(total.rows[0].count),
      open_tickets:      parseInt(open.rows[0].count),
      resolved_tickets:  parseInt(resolved.rows[0].count),
    });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.get('/logs', async (req, res) => {
  try {
    const { rows } = await getDb().query(`
      SELECT l.id, l.action, l.description, l.created_at, u.name as user_name
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 50
    `);
    res.json(rows.map(l => ({ id: l.id, user: l.user_name ?? 'System', action: l.action, description: l.description, created_at: l.created_at })));
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
