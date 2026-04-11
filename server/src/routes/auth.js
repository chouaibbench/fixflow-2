const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const auth = require('../middleware/auth');

router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(422).json({ message: 'All fields required.' });
  if (!['worker', 'technician'].includes(role)) return res.status(422).json({ message: 'Invalid role.' });
  if (password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' });

  const db = getDb();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
    return res.status(422).json({ message: 'Email already taken.' });
  }

  const { lastInsertRowid } = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, bcrypt.hashSync(password, 10), role);

  const user = db.prepare('SELECT id, name, email, role, is_online, created_at FROM users WHERE id = ?').get(lastInsertRowid);
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ user, token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(422).json({ message: 'Email and password required.' });

  const user = getDb().prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const { password: _, ...safeUser } = user;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ user: safeUser, token });
});

router.post('/logout', auth, (req, res) => res.json({ message: 'Logged out' }));

router.get('/me', auth, (req, res) => res.json(req.user));

module.exports = router;
