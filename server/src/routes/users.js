const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');
const admin = require('../middleware/admin');

const safe = (u) => { if (!u) return null; const { password, ...r } = u; return r; };

router.get('/', (req, res) => {
  res.json(getDb().prepare('SELECT id, name, email, role, is_online, created_at FROM users').all());
});

router.post('/', admin, (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(422).json({ message: 'All fields required.' });
  if (!['worker', 'technician', 'admin'].includes(role)) return res.status(422).json({ message: 'Invalid role.' });
  if (password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' });

  const db = getDb();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
    return res.status(422).json({ message: 'Email already taken.' });
  }
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, bcrypt.hashSync(password, 10), role);
  res.status(201).json(db.prepare('SELECT id, name, email, role, is_online, created_at FROM users WHERE id = ?').get(lastInsertRowid));
});

router.put('/:id', admin, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (req.body.email && req.body.email !== user.email) {
    if (db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(req.body.email, user.id)) {
      return res.status(422).json({ message: 'Email already taken.' });
    }
  }

  let password = user.password;
  if (req.body.password) {
    if (req.body.password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' });
    password = bcrypt.hashSync(req.body.password, 10);
  }

  db.prepare('UPDATE users SET name=?, email=?, role=?, password=?, updated_at=datetime("now") WHERE id=?')
    .run(req.body.name ?? user.name, req.body.email ?? user.email, req.body.role ?? user.role, password, req.params.id);

  res.json(safe(db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', admin, (req, res) => {
  const db = getDb();
  if (!db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id)) {
    return res.status(404).json({ message: 'User not found.' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'User deleted' });
});

// POST /users/toggle-online
router.post('/toggle-online', (req, res) => {
  const db = getDb();
  const current = db.prepare('SELECT is_online FROM users WHERE id = ?').get(req.user.id);
  const newVal = current.is_online ? 0 : 1;
  db.prepare('UPDATE users SET is_online=?, updated_at=datetime("now") WHERE id=?').run(newVal, req.user.id);
  res.json({ is_online: newVal === 1 });
});

module.exports = router;
