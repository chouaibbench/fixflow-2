const router = require('express').Router();
const { getDb } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM machines ORDER BY id ASC');
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, location, last_maintenance } = req.body;
    if (!name || !location) return res.status(422).json({ message: 'Name and location required.' });
    const { rows } = await getDb().query(
      'INSERT INTO machines (name, location, last_maintenance) VALUES ($1, $2, $3) RETURNING *',
      [name, location, last_maintenance || null]
    );
    res.status(201).json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM machines WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    res.json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { rows: existing } = await db.query('SELECT * FROM machines WHERE id = $1', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Not found.' });
    const m = existing[0];
    const { rows } = await db.query(
      'UPDATE machines SET name=$1, location=$2, last_maintenance=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [req.body.name ?? m.name, req.body.location ?? m.location,
       req.body.last_maintenance !== undefined ? req.body.last_maintenance : m.last_maintenance,
       req.params.id]
    );
    res.json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { rows } = await db.query('SELECT id FROM machines WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    await db.query('DELETE FROM machines WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
