CREATE TABLE IF NOT EXISTS visits (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  language TEXT NOT NULL,
  device TEXT NOT NULL,
  referrer_host TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS visits_created_at_idx ON visits (created_at);
