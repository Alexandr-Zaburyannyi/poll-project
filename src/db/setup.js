/** @format */
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

const dbPath = process.env.DB_PATH;
const dbDir = path.dirname(dbPath);

// 🔽 Create folder if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER,
    text TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    option_id INTEGER,
    voter_id TEXT,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
    FOREIGN KEY (voter_id) REFERENCES users(id)
  );
`);

module.exports = db;
