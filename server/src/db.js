const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const DB_PATH = path.resolve(process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite'));

// Synchronous-style wrapper around sql.js
class DB {
  constructor(sqlDb) {
    this._db = sqlDb;
  }

  _save() {
    const data = this._db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        self._db.run(sql, params);
        const res = self._db.exec('SELECT last_insert_rowid() as id, changes() as c');
        const row = res[0]?.values[0] || [0, 0];
        self._save();
        return { lastInsertRowid: row[0], changes: row[1] };
      },
      get(...params) {
        const result = self._db.exec(sql, params);
        if (!result.length || !result[0].values.length) return undefined;
        const { columns, values } = result[0];
        return Object.fromEntries(columns.map((c, i) => [c, values[0][i]]));
      },
      all(...params) {
        const result = self._db.exec(sql, params);
        if (!result.length) return [];
        const { columns, values } = result[0];
        return values.map(row => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
      },
    };
  }

  exec(sql) {
    this._db.run(sql);
    this._save();
  }
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'worker',
    is_online INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    last_maintenance TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS tikets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_id INTEGER NOT NULL,
    reported_by INTEGER NOT NULL,
    assigned_to INTEGER,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    photo_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id INTEGER,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

let _db = null;

async function initDb() {
  const SQL = await initSqlJs();
  let sqlDb;
  if (fs.existsSync(DB_PATH)) {
    sqlDb = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    sqlDb = new SQL.Database();
  }
  _db = new DB(sqlDb);
  _db._db.run(SCHEMA);
  _db._save();
  return _db;
}

function getDb() {
  if (!_db) throw new Error('DB not initialized. Call initDb() first.');
  return _db;
}

module.exports = { initDb, getDb };
