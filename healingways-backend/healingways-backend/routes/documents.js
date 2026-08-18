const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const { audit } = require('../db/audit');

const caseDocumentsRouter = express.Router({ mergeParams: true });
const documentsRouter = express.Router();
const STAFF_ROLES = ['admin', 'coordinator', 'account_officer'];

// Storage today: local disk, one file per case in its own folder, saved
// under a random name (never trust/execute the original filename).
// Swap point for later: replace this `storage` object with
// multer-s3 (or upload to S3 after multer.memoryStorage()) and change
// `storage_key` below to the S3 object key instead of a local path.
// Nothing else in this file needs to change.
const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOAD_ROOT, req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).slice(0, 10); // cap absurd extensions
    cb(null, `${randomUUID()}${ext}`);
  }
});

const ALLOWED_MIME = new Set([
  'application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB per file
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('Unsupported file type. Please upload a PDF, Word document, or image.'));
    }
    cb(null, true);
  }
});

function canAccessCase(user, caseId) {
  if (STAFF_ROLES.includes(user.role)) return true;
  const c = db.prepare('SELECT patient_user_id FROM cases WHERE id = ?').get(caseId);
  return !!c && c.patient_user_id === user.id;
}

// POST /api/cases/:id/documents  (multipart/form-data, field name "file")
caseDocumentsRouter.post('/:id/documents', requireAuth, (req, res) => {
  if (!canAccessCase(req.user, req.params.id)) {
    return res.status(403).json({ error: 'You do not have access to this case.' });
  }
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file was uploaded.' });

    const id = randomUUID();
    db.prepare(`
      INSERT INTO documents (id, case_id, uploaded_by_user_id, original_filename, storage_key, mime_type, size_bytes, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Uploaded')
    `).run(
      id, req.params.id, req.user.id,
      req.file.originalname, req.file.path, req.file.mimetype, req.file.size,
      req.body.category || 'Other'
    );

    audit(req.user.id, 'document.upload', 'case', req.params.id, { filename: req.file.originalname });
    res.status(201).json({ document: db.prepare('SELECT * FROM documents WHERE id = ?').get(id) });
  });
});

// GET /api/cases/:id/documents — list (metadata only, not file bytes)
caseDocumentsRouter.get('/:id/documents', requireAuth, (req, res) => {
  if (!canAccessCase(req.user, req.params.id)) {
    return res.status(403).json({ error: 'You do not have access to this case.' });
  }
  const rows = db.prepare(`
    SELECT id, case_id, original_filename, mime_type, size_bytes, category, status, feedback, created_at
    FROM documents WHERE case_id = ? ORDER BY created_at DESC
  `).all(req.params.id);
  res.json({ documents: rows });
});

// GET /api/documents/:docId/download — streams the file, ownership-checked.
documentsRouter.get('/download/:docId', requireAuth, (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.docId);
  if (!doc) return res.status(404).json({ error: 'Document not found.' });
  if (!canAccessCase(req.user, doc.case_id)) {
    return res.status(403).json({ error: 'You do not have access to this document.' });
  }
  if (!fs.existsSync(doc.storage_key)) return res.status(410).json({ error: 'File no longer available.' });

  audit(req.user.id, 'document.download', 'document', doc.id, null);
  res.download(doc.storage_key, doc.original_filename);
});

// PATCH /api/documents/:docId — staff-only: accept / request update.
documentsRouter.patch('/status/:docId', requireAuth, (req, res) => {
  if (!STAFF_ROLES.includes(req.user.role)) {
    return res.status(403).json({ error: 'Only staff can change document status.' });
  }
  const { status, feedback } = req.body || {};
  if (!['Accepted', 'Requires Update', 'Under Review'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  const result = db.prepare('UPDATE documents SET status = ?, feedback = ? WHERE id = ?')
    .run(status, feedback || null, req.params.docId);
  if (result.changes === 0) return res.status(404).json({ error: 'Document not found.' });

  audit(req.user.id, 'document.status_change', 'document', req.params.docId, { status });
  res.json({ ok: true });
});

module.exports = { caseDocumentsRouter, documentsRouter };
