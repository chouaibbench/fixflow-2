const router = require('express').Router();
const { getDb } = require('../db');

router.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT * FROM machines ORDER BY id ASC').all());
});

router.post('/', (req, res) => {
  const { name, location, last_maintenance } = req.body;
  if (!name || !location) return res.status(422).json({ message: 'Name and location required.' });
  const db = getDb();
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO machines (name, location, last_maintenance) VALUES (?, ?, ?)'
  ).run(name, location, last_maintenance || null);
  res.status(201).json(db.prepare('SELECT * FROM machines WHERE id = ?').get(lastInsertRowid));
});

router.get('/:id', (req, res) => {
  const m = getDb().prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
  if (!m) return res.status(404).json({ message: 'Not found.' });
  res.json(m);
});

router.put('/:id', (req, res) => {
  const db = getDb();
  const m = db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
  if (!m) return res.status(404).json({ message: 'Not found.' });
  db.prepare(
    'UPDATE machines SET name=?, location=?, last_maintenance=?, updated_at=datetime("now") WHERE id=?'
  ).run(req.body.name ?? m.name, req.body.location ?? m.location,
    req.body.last_maintenance !== undefined ? req.body.last_maintenance : m.last_maintenance,
    req.params.id);
  res.json(db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  if (!db.prepare('SELECT id FROM machines WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ message: 'Not found.' });
  }
  db.prepare('DELETE FROM machines WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
