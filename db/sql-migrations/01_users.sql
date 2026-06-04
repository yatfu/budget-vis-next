CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE CHECK (length(username) > 0),
  password VARCHAR(100) NOT NULL CHECK (length(password) > 0)
);
