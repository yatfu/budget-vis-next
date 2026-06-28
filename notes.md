UI BRAINSTORM -----
dashboard: i want the user to see the doughnut chart of their current month's spending first, along with a form underneath it only to add to it. The reason why i want only add functionality is to keep the dashboard simple, and allow the user to update their spending with the least friction possible, which means as soon as they open the app. MAYBE next to the add form, add ... icon leading to the actual page (could be redundant with nav bar icons)

Reducing friction is key for a budgeting app, where users will enter data multiple times a day.
I want the nav bar to be relatively the same on web and mobile, but nav icons positioned on the bottom for mobile.  There will be three buttons: dashboard (home), budget editor (pie chart), budget statistics (line graph). Sign in/profile will be its own icon on top right of window.

SHADCN COMPONENTS:
button, card, 



NOTES -----
neon for db hosting
prisma to easily 

https://www.db-fiddle.com/f/aoPZ2MRWZxeJ3SJg6rP4Je/9

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE CHECK (length(username) > 0),
  password VARCHAR(100) NOT NULL CHECK (length(password) > 0)
);


CREATE TABLE expenses (
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