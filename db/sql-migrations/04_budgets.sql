CREATE TABLE IF NOT EXISTS budgets (
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),

  amount NUMERIC(10, 2) NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 0)

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- for debugging/analytics
)