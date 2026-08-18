// Schema for the HealingWays backend.
//
// Uses SQLite (via better-sqlite3) by default: zero external services to
// stand up, a single file on disk, fully ACID. This is a genuinely
// reasonable choice for an initial production launch at this scale.
// When/if you outgrow it, the SQL here is close enough to standard that
// migrating to Postgres is a schema port, not a rewrite — swap the driver
// in db/connection.js and re-run equivalent CREATE TABLE statements.

const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'healingways.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('patient','admin','coordinator','account_officer')),
  phone TEXT,
  country TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  patient_user_id TEXT NOT NULL REFERENCES users(id),
  need TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  priority TEXT NOT NULL DEFAULT 'Normal',
  stage_index INTEGER NOT NULL DEFAULT 0,
  coordinator_user_id TEXT REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id),
  uploaded_by_user_id TEXT NOT NULL REFERENCES users(id),
  original_filename TEXT NOT NULL,
  storage_key TEXT NOT NULL,        -- local path today; S3 object key later
  mime_type TEXT,
  size_bytes INTEGER,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'Uploaded',
  feedback TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id),
  sender_user_id TEXT NOT NULL REFERENCES users(id),
  sender_role TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS billing_items (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id),
  service TEXT NOT NULL,
  description TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'unpaid',   -- unpaid | paid | processing
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  receipt_id TEXT,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cases_patient ON cases(patient_user_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_case ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_billing_case ON billing_items(case_id);
`);

console.log('Migration complete:', DB_PATH);
module.exports = db;
