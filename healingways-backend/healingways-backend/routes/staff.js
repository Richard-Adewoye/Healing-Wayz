const express = require('express');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const db = require('../db/connection');
const { requireAuth, requireRole } = require('../middleware/auth');
const { audit } = require('../db/audit');

const router = express.Router();
const STAFF_ROLES = ['admin', 'coordinator', 'account_officer'];

// POST /api/staff — create a staff account. Admin-only.
// This is the ONLY way a coordinator/account_officer/admin account gets
// created — there is no public "sign up as staff" path anywhere in the API.
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { email, password, name, role } = req.body || {};

  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${STAFF_ROLES.join(', ')}` });
  }
  if (!email || !password || password.length < 10 || !name) {
    return res.status(400).json({ error: 'email, name, and a password of 10+ characters are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

  const password_hash = await bcrypt.hash(password, 12);
  const id = randomUUID();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email.toLowerCase(), password_hash, name.trim(), role);

  audit(req.user.id, 'staff.create', 'user', id, { role });
  res.status(201).json({ id, email: email.toLowerCase(), name, role });
});

// GET /api/staff — list staff accounts. Admin-only.
router.get('/', requireAuth, requireRole('admin'), (req, res) => {
  const staff = db.prepare(`
    SELECT id, email, name, role, is_active, created_at FROM users
    WHERE role IN ('admin','coordinator','account_officer')
    ORDER BY created_at DESC
  `).all();
  res.json({ staff });
});

// PATCH /api/staff/:id/deactivate — admin-only, revokes access without deleting history.
router.patch('/:id/deactivate', requireAuth, requireRole('admin'), (req, res) => {
  const result = db.prepare('UPDATE users SET is_active = 0 WHERE id = ? AND role != \'patient\'').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Staff account not found.' });
  audit(req.user.id, 'staff.deactivate', 'user', req.params.id, null);
  res.json({ ok: true });
});

module.exports = router;
