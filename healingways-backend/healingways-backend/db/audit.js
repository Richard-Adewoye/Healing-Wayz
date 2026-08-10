const { randomUUID } = require('crypto');
const db = require('./connection');

const insertAudit = db.prepare(`
  INSERT INTO audit_log (id, actor_user_id, action, target_type, target_id, metadata)
  VALUES (?, ?, ?, ?, ?, ?)
`);

function audit(actorUserId, action, targetType, targetId, metadata) {
  try {
    insertAudit.run(
      randomUUID(),
      actorUserId || null,
      action,
      targetType || null,
      targetId || null,
      metadata ? JSON.stringify(metadata) : null
    );
  } catch (e) {
    // Auditing must never break the primary request. Log and move on.
    console.error('audit log write failed:', e.message);
  }
}

module.exports = { audit };
