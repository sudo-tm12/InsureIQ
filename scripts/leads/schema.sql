-- InsurIQ lead store (Neon / Vercel Postgres)
-- Only sealed ciphertext is stored — the database never sees PII in the clear.
-- Apply with: npm run leads:migrate

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  sealed TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);
