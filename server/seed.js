require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const { initDb, getDb } = require('./src/db');

initDb().then(() => {
  const db = getDb();

  const users = [
    ['J Worker',     'worker@fixflow.com', bcrypt.hashSync('password123', 10), 'worker'],
    ['M Technician', 'tech@fixflow.com',   bcrypt.hashSync('password123', 10), 'technician'],
    ['Admin',        'admin@fixflow.com',  bcrypt.hashSync('admin123', 10),    'admin'],
  ];

  for (const [name, email, password, role] of users) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      db.prepare('UPDATE users SET name=?, role=? WHERE email=?').run(name, role, email);
    } else {
      db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, role);
    }
  }

  const machines = [
    ['CNC Machine A1',     'Workshop Floor 1', '2026-03-01'],
    ['Hydraulic Press B2', 'Workshop Floor 2', '2026-02-15'],
    ['Conveyor Belt C3',   'Assembly Line 1',  '2026-01-20'],
    ['Welding Robot D4',   'Assembly Line 2',  '2026-03-10'],
    ['Lathe Machine E5',   'Workshop Floor 1', null],
  ];

  for (const [name, location, last_maintenance] of machines) {
    if (!db.prepare('SELECT id FROM machines WHERE name = ?').get(name)) {
      db.prepare('INSERT INTO machines (name, location, last_maintenance) VALUES (?, ?, ?)').run(name, location, last_maintenance);
    }
  }

  console.log('Database seeded successfully.');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
