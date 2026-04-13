const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(422).json({ message: 'All fields required.' });
    if (!['worker', 'technician'].includes(role)) return res.status(422).json({ message: 'Invalid role.' });
    if (password.length < 8) return res.status(422).json({ message: 'Password must be at least 8 characters.' });

    const db = getDb();
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) return res.status(422).json({ message: 'Email already taken.' });

    const { rows } = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, is_online, created_at',
      [name, email, bcrypt.hashSync(password, 10), role]
    );
    const user = rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ message: 'Email and password required.' });

    const { rows } = await getDb().query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...safeUser } = user;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/logout', auth, (req, res) => res.json({ message: 'Logged out' }));

router.get('/me', auth, (req, res) => res.json(req.user));

module.exports = router;
