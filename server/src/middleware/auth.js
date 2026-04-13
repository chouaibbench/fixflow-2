const jwt = require('jsonwebtoken');
const { getDb } = require('../db');

module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthenticated.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await getDb().query('SELECT * FROM users WHERE id = $1', [payload.id]);
    if (!rows.length) return res.status(401).json({ message: 'Unauthenticated.' });
    const { password, ...safeUser } = rows[0];
    req.user = safeUser;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthenticated.' });
  }
};
