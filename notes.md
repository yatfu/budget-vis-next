next, supabase



NOTES -----
neon for db hosting
prisma to easily 

https://www.db-fiddle.com/f/aoPZ2MRWZxeJ3SJg6rP4Je/9

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE CHECK (length(username) > 0),
  password VARCHAR(100) NOT NULL CHECK (length(password) > 0)
);


CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  -- user_id INTEGER NOT NULL REFERENCES users(id), -- commented out until auth is added
  name VARCHAR(100) NOT NULL CHECK (length(name) > 0),
  amount NUMERIC(10, 2) NOT NULL,
  
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 1900),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- for debugging/analytics
);

schema.prisma
      ↓
prisma generate
      ↓
generated Prisma Client
      ↓
your Next.js app uses prisma.user.findMany()
      ↓
Prisma converts to SQL
      ↓
Neon/Postgres executes query