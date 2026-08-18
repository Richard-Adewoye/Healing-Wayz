const express = require('express');
const { randomUUID } = require('crypto');
const db = require('../db/connection');
const { requireAuth, requireRole } = require('../middleware/auth');
const { audit } = require('../db/audit');

const caseBillingRouter = express.Router({ mergeParams: true });
const billingRouter = express.Router();
const STAFF_ROLES = ['admin', 'coordinator', 'account_officer'];

// Stripe is the reference implementation here because it has the best
// developer experience for wiring this up correctly on the first try, and a
// real test mode you can exercise end-to-end before going live. For your
// specific markets you likely also want Paystack and/or Flutterwave
// (Nigeria/Cameroon) and Razorpay (India) — those all follow the same shape
// (create a hosted checkout session server-side, confirm payment via a
// signature-verified webhook, never trust a client-reported "success").
// This file is the pattern to replicate per processor; ping me when you've
// picked which ones and I'll build the others against it.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

function canAccessCase(user, caseId) {
  if (STAFF_ROLES.includes(user.role)) return true;
  const c = db.prepare('SELECT patient_user_id FROM cases WHERE id = ?').get(caseId);
  return !!c && c.patient_user_id === user.id;
}

// GET /api/cases/:id/billing — list billing items for a case.
caseBillingRouter.get('/:id/billing', requireAuth, (req, res) => {
  if (!canAccessCase(req.user, req.params.id)) {
    return res.status(403).json({ error: 'You do not have access to this case.' });
  }
  const rows = db.prepare('SELECT * FROM billing_items WHERE case_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ billing: rows });
});

// POST /api/cases/:id/billing — staff creates a billable item (e.g. service charge).
caseBillingRouter.post('/:id/billing', requireAuth, requireRole('admin', 'coordinator', 'account_officer'), (req, res) => {
  const { service, description, amountCents, currency } = req.body || {};
  if (!service || !amountCents || amountCents <= 0) {
    return res.status(400).json({ error: 'service and a positive amountCents are required.' });
  }
  const id = randomUUID();
  db.prepare(`
    INSERT INTO billing_items (id, case_id, service, description, amount_cents, currency, status)
    VALUES (?, ?, ?, ?, ?, ?, 'unpaid')
  `).run(id, req.params.id, service, description || null, amountCents, currency || 'USD');

  audit(req.user.id, 'billing.create', 'case', req.params.id, { service, amountCents });
  res.status(201).json({ billingItem: db.prepare('SELECT * FROM billing_items WHERE id = ?').get(id) });
});

// POST /api/billing/:itemId/checkout-session — patient starts a real Stripe
// Checkout session. The frontend redirects the browser to the returned URL;
// Stripe collects the card on ITS OWN hosted page. We never see the card.
billingRouter.post('/checkout-session/:itemId', requireAuth, async (req, res) => {
  const item = db.prepare('SELECT * FROM billing_items WHERE id = ?').get(req.params.itemId);
  if (!item) return res.status(404).json({ error: 'Billing item not found.' });
  if (!canAccessCase(req.user, item.case_id)) {
    return res.status(403).json({ error: 'You do not have access to this billing item.' });
  }
  if (item.status === 'paid') return res.status(409).json({ error: 'This item has already been paid.' });
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(501).json({ error: 'Payments are not yet configured on this server (STRIPE_SECRET_KEY missing).' });
  }

  const successUrl = `${process.env.APP_BASE_URL}/billing?paid=1&item=${item.id}`;
  const cancelUrl = `${process.env.APP_BASE_URL}/billing?canceled=1`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: (item.currency || 'usd').toLowerCase(),
        product_data: { name: item.service, description: item.description || undefined },
        unit_amount: item.amount_cents,
      },
      quantity: 1,
    }],
    metadata: { billing_item_id: item.id, case_id: item.case_id },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  db.prepare('UPDATE billing_items SET status = ?, stripe_checkout_session_id = ? WHERE id = ?')
    .run('processing', session.id, item.id);

  audit(req.user.id, 'billing.checkout_started', 'billing_item', item.id, { sessionId: session.id });
  res.json({ checkoutUrl: session.url });
});

// POST /api/billing/webhook — Stripe calls this. This is the ONLY place a
// billing item is ever marked "paid". The client redirect URL above is just
// UX; it is never trusted to actually confirm payment.
//
// IMPORTANT: this route must receive the RAW request body (not JSON-parsed)
// for signature verification to work — see the express.raw() wiring in
// server.js, which mounts this route before the global express.json().
billingRouter.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const itemId = session.metadata && session.metadata.billing_item_id;
    if (itemId) {
      const receiptId = 'HW-RCPT-' + Math.floor(100000 + Math.random() * 899999);
      db.prepare(`
        UPDATE billing_items
        SET status = 'paid', paid_at = datetime('now'), receipt_id = ?, stripe_payment_intent_id = ?
        WHERE id = ?
      `).run(receiptId, session.payment_intent, itemId);
      audit(null, 'billing.paid', 'billing_item', itemId, { stripeSessionId: session.id });
    }
  }

  res.json({ received: true });
});

module.exports = { caseBillingRouter, billingRouter };
