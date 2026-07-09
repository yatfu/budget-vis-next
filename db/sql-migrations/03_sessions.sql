CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
)

`INSERT INTO sessions (id, user_id, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`