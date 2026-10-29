-- InsurIQ lead store (Neon / Vercel Postgres)
-- Only sealed ciphertext is stored — the database never sees PII in the clear.
-- Apply with: npm run leads:migrate

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  sealed TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);

-- Shared rate-limit counters for the lead endpoints. key = scope + HMAC of the
-- client IP (the raw IP is never stored).
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at TIMESTAMPTZ NOT NULL
);
