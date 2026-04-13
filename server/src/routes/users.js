const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT id, name, email, role, is_online, created_at FROM users');
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/', admin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(422).json({ message: 'All fields required.' });
    if (!['worker', 'technician', 'admin'].includes(role)) return res.status(422).json({ message: 'Invalid role.' });
    if (password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' });

    const db = getDb();
    const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length) return res.status(422).json({ message: 'Email already taken.' });

    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, is_online, created_at',
      [name, email, bcrypt.hashSync(password, 10), role]
    );
    res.status(201).json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:id', admin, async (req, res) => {
  try {
    const db = getDb();
    const { rows: existing } = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'User not found.' });
    const user = existing[0];

    if (req.body.email && req.body.email !== user.email) {
      const { rows: taken } = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [req.body.email, user.id]);
      if (taken.length) return res.status(422).json({ message: 'Email already taken.' });
    }

    let password = user.password;
    if (req.body.password) {
      if (req.body.password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' });
      password = bcrypt.hashSync(req.body.password, 10);
    }

    const { rows } = await db.query(
      'UPDATE users SET name=$1, email=$2, role=$3, password=$4, updated_at=NOW() WHERE id=$5 RETURNING id, name, email, role, is_online, created_at',
      [req.body.name ?? user.name, req.body.email ?? user.email, req.body.role ?? user.role, password, req.params.id]
    );
    res.json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.delete('/:id', admin, async (req, res) => {
  try {
    const db = getDb();
    const { rows } = await db.query('SELECT id FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found.' });
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/toggle-online', async (req, res) => {
  try {
    const db = getDb();
    const { rows } = await db.query('SELECT is_online FROM users WHERE id = $1', [req.user.id]);
    const newVal = rows[0].is_online ? 0 : 1;
    await db.query('UPDATE users SET is_online=$1, updated_at=NOW() WHERE id=$2', [newVal, req.user.id]);
    res.json({ is_online: newVal === 1 });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
