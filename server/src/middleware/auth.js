const jwt = require('jsonwebtoken');
const { getDb } = require('../db');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthenticated.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = getDb().prepare('SELECT * FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ message: 'Unauthenticated.' });
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthenticated.' });
  }
};
