const router = require('express').Router();
const { getDb } = require('../db');

const withRelations = async (ticket) => {
  if (!ticket) return null;
  const db = getDb();
  const [{ rows: [machine] }, { rows: [reporter] }] = await Promise.all([
    db.query('SELECT id, name, location FROM machines WHERE id = $1', [ticket.machine_id]),
    db.query('SELECT id, name, email FROM users WHERE id = $1', [ticket.reported_by]),
  ]);
  const assignee = ticket.assigned_to
    ? (await db.query('SELECT id, name, email FROM users WHERE id = $1', [ticket.assigned_to])).rows[0]
    : null;
  return { ...ticket, machine: machine || null, reporter: reporter || null, assignee: assignee || null };
};

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json(await Promise.all(rows.map(withRelations)));
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { machine_id, description, priority } = req.body;
    if (!machine_id || !description || !priority)
      return res.status(422).json({ message: 'machine_id, description and priority are required.' });
    if (!['low', 'medium', 'high', 'critical'].includes(priority))
      return res.status(422).json({ message: 'Invalid priority.' });

    const db = getDb();
    const { rows: machines } = await db.query('SELECT id, name FROM machines WHERE id = $1', [machine_id]);
    if (!machines.length) return res.status(422).json({ message: 'Machine not found.' });

    const { rows: [ticket] } = await db.query(
      'INSERT INTO tickets (machine_id, reported_by, description, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [machine_id, req.user.id, description, priority, 'pending']
    );
    await db.query(
      'INSERT INTO activity_logs (user_id, action, target_type, target_id, description) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'created_ticket', 'ticket', ticket.id, `${req.user.name} reported an issue on ${machines[0].name}`]
    );
    res.status(201).json(await withRelations(ticket));
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM tickets WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    res.json(await withRelations(rows[0]));
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { rows: existing } = await db.query('SELECT * FROM tickets WHERE id = $1', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Not found.' });
    const ticket = existing[0];

    if (req.body.status && !['pending', 'in-progress', 'resolved'].includes(req.body.status))
      return res.status(422).json({ message: 'Invalid status.' });
    if (req.body.priority && !['low', 'medium', 'high', 'critical'].includes(req.body.priority))
      return res.status(422).json({ message: 'Invalid priority.' });

    const status = req.body.status ?? ticket.status;
    const priority = req.body.priority ?? ticket.priority;
    const assigned_to = req.body.assigned_to !== undefined ? req.body.assigned_to : ticket.assigned_to;

    const { rows: [updated] } = await db.query(
      'UPDATE tickets SET status=$1, priority=$2, assigned_to=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [status, priority, assigned_to, req.params.id]
    );

    const changes = [];
    if (req.body.status) changes.push(`status → ${req.body.status}`);
    if (req.body.priority) changes.push(`priority → ${req.body.priority}`);
    if (req.body.assigned_to !== undefined) changes.push(`assigned_to → ${req.body.assigned_to}`);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, target_type, target_id, description) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'updated_ticket', 'ticket', ticket.id,
       `${req.user.name} updated ticket #${ticket.id}${changes.length ? ': ' + changes.join(', ') : ''}`]
    );
    res.json(await withRelations(updated));
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { rows } = await db.query('SELECT id FROM tickets WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    await db.query('DELETE FROM tickets WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
