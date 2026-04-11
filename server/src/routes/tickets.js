const router = require('express').Router();
const { getDb } = require('../db');

const withRelations = (ticket) => {
  if (!ticket) return null;
  const db = getDb();
  const machine = db.prepare('SELECT id, name, location FROM machines WHERE id = ?').get(ticket.machine_id);
  const reporter = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(ticket.reported_by);
  const assignee = ticket.assigned_to
    ? db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(ticket.assigned_to)
    : null;
  return { ...ticket, machine, reporter, assignee };
};

router.get('/', (req, res) => {
  const tickets = getDb().prepare('SELECT * FROM tickets ORDER BY created_at DESC').all();
  res.json(tickets.map(withRelations));
});

router.post('/', (req, res) => {
  const { machine_id, description, priority } = req.body;
  if (!machine_id || !description || !priority) {
    return res.status(422).json({ message: 'machine_id, description and priority are required.' });
  }
  if (!['low', 'medium', 'high', 'critical'].includes(priority)) {
    return res.status(422).json({ message: 'Invalid priority.' });
  }
  const db = getDb();
  const machine = db.prepare('SELECT id, name FROM machines WHERE id = ?').get(machine_id);
  if (!machine) return res.status(422).json({ message: 'Machine not found.' });

  const { lastInsertRowid } = db.prepare(
    'INSERT INTO tickets (machine_id, reported_by, description, priority, status) VALUES (?, ?, ?, ?, ?)'
  ).run(machine_id, req.user.id, description, priority, 'pending');

  db.prepare(
    'INSERT INTO activity_logs (user_id, action, target_type, target_id, description) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, 'created_ticket', 'ticket', lastInsertRowid,
    `${req.user.name} reported an issue on ${machine.name}`);

  res.status(201).json(withRelations(db.prepare('SELECT * FROM tickets WHERE id = ?').get(lastInsertRowid)));
});

router.get('/:id', (req, res) => {
  const ticket = getDb().prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Not found.' });
  res.json(withRelations(ticket));
});

router.put('/:id', (req, res) => {
  const db = getDb();
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Not found.' });

  if (req.body.status && !['pending', 'in-progress', 'resolved'].includes(req.body.status)) {
    return res.status(422).json({ message: 'Invalid status.' });
  }
  if (req.body.priority && !['low', 'medium', 'high', 'critical'].includes(req.body.priority)) {
    return res.status(422).json({ message: 'Invalid priority.' });
  }

  const status = req.body.status ?? ticket.status;
  const priority = req.body.priority ?? ticket.priority;
  const assigned_to = req.body.assigned_to !== undefined ? req.body.assigned_to : ticket.assigned_to;

  db.prepare(
    'UPDATE tickets SET status=?, priority=?, assigned_to=?, updated_at=datetime("now") WHERE id=?'
  ).run(status, priority, assigned_to, req.params.id);

  const changes = [];
  if (req.body.status) changes.push(`status → ${req.body.status}`);
  if (req.body.priority) changes.push(`priority → ${req.body.priority}`);
  if (req.body.assigned_to !== undefined) changes.push(`assigned_to → ${req.body.assigned_to}`);

  db.prepare(
    'INSERT INTO activity_logs (user_id, action, target_type, target_id, description) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.id, 'updated_ticket', 'ticket', ticket.id,
    `${req.user.name} updated ticket #${ticket.id}${changes.length ? ': ' + changes.join(', ') : ''}`);

  res.json(withRelations(db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  if (!db.prepare('SELECT id FROM tickets WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ message: 'Not found.' });
  }
  db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
