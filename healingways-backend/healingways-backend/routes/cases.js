const express = require('express');
const { randomUUID } = require('crypto');
const db = require('../db/connection');
const { requireAuth, requireRole } = require('../middleware/auth');
const { audit } = require('../db/audit');

const router = express.Router();
const STAFF_ROLES = ['admin', 'coordinator', 'account_officer'];

/** Loads a case and enforces that the requester is allowed to see it.
 *  This single check is what makes data isolation real: it runs on the
 *  server for every request, so it can't be bypassed by editing the page. */
function loadCaseOrForbid(req, res, caseId) {
  const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId);
  if (!c) { res.status(404).json({ error: 'Case not found.' }); return null; }

  const isOwner = req.user.role === 'patient' && c.patient_user_id === req.user.id;
  const isStaff = STAFF_ROLES.includes(req.user.role);
  if (!isOwner && !isStaff) {
    res.status(403).json({ error: 'You do not have access to this case.' });
    return null;
  }
  return c;
}

// GET /api/cases — patients get only their own; staff get everyone's.
router.get('/', requireAuth, (req, res) => {
  const rows = req.user.role === 'patient'
    ? db.prepare('SELECT * FROM cases WHERE patient_user_id = ? ORDER BY created_at DESC').all(req.user.id)
    : db.prepare('SELECT * FROM cases ORDER BY created_at DESC').all();
  res.json({ cases: rows });
});

// GET /api/cases/:id — single case, ownership-checked.
router.get('/:id', requireAuth, (req, res) => {
  const c = loadCaseOrForbid(req, res, req.params.id);
  if (!c) return; // response already sent
  res.json({ case: c });
});

// POST /api/cases — a patient opens a new case for themselves (e.g. after
// submitting the consultation form). Staff can also open one on a patient's behalf.
router.post('/', requireAuth, (req, res) => {
  const { need, patientUserId } = req.body || {};
  const isStaff = STAFF_ROLES.includes(req.user.role);
  const ownerId = isStaff && patientUserId ? patientUserId : req.user.id;

  if (!isStaff && req.user.role !== 'patient') {
    return res.status(403).json({ error: 'Only patients or staff can open a case.' });
  }

  const id = 'HW-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 899999);
  db.prepare(`
    INSERT INTO cases (id, patient_user_id, need, status, priority, stage_index)
    VALUES (?, ?, ?, 'New', 'Normal', 0)
  `).run(id, ownerId, need || 'General Healthcare Consultation');

  audit(req.user.id, 'case.create', 'case', id, { need });
  const created = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);
  res.status(201).json({ case: created });
});

// PATCH /api/cases/:id — staff-only mutation of status/priority/stage/coordinator.
// Patients never get write access to their own case's operational fields —
// that mirrors the original app's intent (patients act via specific endpoints
// like accepting a recommendation, not by directly editing case state).
router.patch('/:id', requireAuth, requireRole('admin', 'coordinator'), (req, res) => {
  const c = db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found.' });

  const fields = ['status', 'priority', 'stage_index', 'coordinator_user_id', 'need'];
  const updates = [];
  const values = [];
  for (const f of fields) {
    if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
  }
  if (!updates.length) return res.status(400).json({ error: 'No valid fields to update.' });

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);
  db.prepare(`UPDATE cases SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  audit(req.user.id, 'case.update', 'case', req.params.id, req.body);
  res.json({ case: db.prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id) });
});

// ---- Messages (nested under a case, same ownership check) ----

router.get('/:id/messages', requireAuth, (req, res) => {
  const c = loadCaseOrForbid(req, res, req.params.id);
  if (!c) return;
  const rows = db.prepare('SELECT * FROM messages WHERE case_id = ? ORDER BY created_at ASC').all(req.params.id);
  res.json({ messages: rows });
});

router.post('/:id/messages', requireAuth, (req, res) => {
  const c = loadCaseOrForbid(req, res, req.params.id);
  if (!c) return;
  const { body } = req.body || {};
  if (!body || !body.trim()) return res.status(400).json({ error: 'Message body is required.' });

  const id = randomUUID();
  db.prepare(`
    INSERT INTO messages (id, case_id, sender_user_id, sender_role, body)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, req.params.id, req.user.id, req.user.role, body.trim());

  audit(req.user.id, 'message.send', 'case', req.params.id, null);
  res.status(201).json({ message: db.prepare('SELECT * FROM messages WHERE id = ?').get(id) });
});

module.exports = router;
