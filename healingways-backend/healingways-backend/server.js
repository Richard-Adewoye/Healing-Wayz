require('dotenv').config();
require('./db/migrate'); // ensures tables exist on startup — safe to run every time (CREATE TABLE IF NOT EXISTS)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const caseRoutes = require('./routes/cases');
const { caseDocumentsRouter, documentsRouter } = require('./routes/documents');
const { caseBillingRouter, billingRouter } = require('./routes/billing');

const app = express();
const PORT = process.env.PORT || 4000;
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5173';

app.set('trust proxy', 1); // needed for correct rate-limiting/logging behind a real load balancer

app.use(helmet());
app.use(cors({
  origin: APP_BASE_URL,
  credentials: true,
}));

// The Stripe webhook needs the RAW request body to verify the signature, so
// it must be exempted from the global JSON body parser below. This is the
// standard, documented way to do that with Express.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/billing/webhook') return next();
  express.json({ limit: '2mb' })(req, res, next);
});

// Brute-force protection on auth endpoints specifically — the highest-value
// target for automated credential stuffing / password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/cases', caseDocumentsRouter); // /api/cases/:id/documents
app.use('/api/cases', caseBillingRouter);   // /api/cases/:id/billing
app.use('/api/documents', documentsRouter); // /api/documents/download/:docId, /api/documents/status/:docId
app.use('/api/billing', billingRouter);     // /api/billing/checkout-session/:itemId, /api/billing/webhook

app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

// Centralized error handler — never leak stack traces to the client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`HealingWays backend listening on http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${APP_BASE_URL}`);
});
