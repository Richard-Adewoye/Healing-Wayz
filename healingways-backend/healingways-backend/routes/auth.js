const express = require('express');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const db = require('../db/connection');
const { signToken, requireAuth } = require('../middleware/auth');
const { audit } = require('../db/audit');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SELF_SIGNUP_ROLES = ['patient']; // staff accounts are provisioned by an admin, never self-registered

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, phone: u.phone, country: u.country };
}

// POST /api/auth/register  { email, password, name, phone?, country? }
// Patient self-registration only. Staff accounts (admin/coordinator/account_officer)
// must be created by an existing admin via POST /api/staff (see routes/staff.js),
// never through this public endpoint — that's exactly the kind of privilege
// escalation hole a public register-as-any-role endpoint would open.
router.post('/register', async (req, res) => {
  const { email, password, name, phone, country } = req.body || {};

  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'A valid email is required.' });
  if (!password || password.length < 10) return res.status(400).json({ error: 'Password must be at least 10 characters.' });
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

  const password_hash = await bcrypt.hash(password, 12);
  const id = randomUUID();

  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, phone, country)
    VALUES (?, ?, ?, ?, 'patient', ?, ?)
  `).run(id, email.toLowerCase(), password_hash, name.trim(), phone || null, country || null);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  audit(id, 'user.register', 'user', id, { role: 'patient' });

  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase());

  // Deliberately generic error for both "no such user" and "wrong password" —
  // distinguishing them lets an attacker enumerate valid accounts.
  const genericError = () => res.status(401).json({ error: 'Invalid email or password.' });

  if (!user || !user.is_active) return genericError();

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    audit(user.id, 'user.login_failed', 'user', user.id, null);
    return genericError();
  }

  audit(user.id, 'user.login', 'user', user.id, null);
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me — used by the frontend to restore a session on page load
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user || !user.is_active) return res.status(401).json({ error: 'Session no longer valid.' });
  res.json({ user: publicUser(user) });
});

module.exports = router;
