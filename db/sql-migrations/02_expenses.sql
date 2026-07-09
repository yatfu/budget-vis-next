CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  label VARCHAR(100) NOT NULL CHECK (length(label) > 0),
  amount NUMERIC(10, 2) NOT NULL,
  
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- for debugging/analytics
);