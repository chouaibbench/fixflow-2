require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const { initDb, getDb } = require('./src/db');

initDb().then(async () => {
  const db = getDb();

  const users = [
    ['J Worker',     'worker@fixflow.com', bcrypt.hashSync('password123', 10), 'worker'],
    ['M Technician', 'tech@fixflow.com',   bcrypt.hashSync('password123', 10), 'technician'],
    ['Admin',        'admin@fixflow.com',  bcrypt.hashSync('admin123', 10),    'admin'],
  ];

  for (const [name, email, password, role] of users) {
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length) {
      await db.query('UPDATE users SET name=$1, role=$2, password=$3 WHERE email=$4', [name, role, password, email]);
    } else {
      await db.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, password, role]);
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
    const { rows } = await db.query('SELECT id FROM machines WHERE name = $1', [name]);
    if (!rows.length) {
      await db.query('INSERT INTO machines (name, location, last_maintenance) VALUES ($1, $2, $3)', [name, location, last_maintenance]);
    }
  }

  console.log('Database seeded successfully.');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
