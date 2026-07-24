# Budget Vis

A small tool for tracking what you spend against what you've budgeted, month by month. Enter your expenses and a budget number; it turns that into a chart showing exactly where you stand — no categories to configure, no bank account to link, nothing syncing in the background.

## Features

- **Dashboard** — pick a month/year, add expenses (label + amount), set a budget for that month. A doughnut chart shows spent vs. remaining budget, shifting from blue → orange → red as you approach or cross your budget.
- **History** — a year-at-a-time view: a grouped bar chart of budget vs. expenses per month, and a diverging bar chart of savings (budget − expenses) centered on zero.
- **Accounts** — username/password registration and login, session-based auth via a `sessions` table (cookie holds an opaque session ID, not the user ID itself).

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS v4, plain HTML elements styled via shared constants in `lib/utils.ts` (see `docs/design.md`)
- [Chart.js](https://www.chartjs.org/) via `react-chartjs-2` for the doughnut and bar charts
- [PostgreSQL](https://www.postgresql.org/) via `pg` (raw SQL, no ORM)
- [lucide-react](https://lucide.dev/) for icons

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up a PostgreSQL database and point `DATABASE_URL` at it in a `.env` file:
   ```
   DATABASE_URL=postgres://user:password@host:port/dbname
   ```
3. Run the SQL files in `db/sql-migrations/` against that database, in order (`01_users.sql`, `02_expenses.sql`, `03_sessions.sql`, `04_budgets.sql`, `05_budgets_unique_constraint.sql`) — there's no migration runner yet, so apply them manually (e.g. via `psql`).
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/page.tsx` — landing page
- `app/login`, `app/register` — auth pages
- `app/(protected)/dashboard`, `app/(protected)/history` — the two main app pages, gated by `app/(protected)/layout.tsx`
- `app/api/expenses/route.ts` — GET/POST/DELETE for expenses and budgets, diffed against existing DB rows on save
- `app/components/` — UI components (`Expenses`, `ExpensesChart`, `ExpensesForm`, `HistoryChart`, `YearStepper`, etc.)
- `lib/` — shared types (`types.ts`), auth helper (`auth.ts`), style constants and utilities (`utils.ts`)
- `db/` — the Postgres connection pool (`db.ts`) and raw SQL migration files (`sql-migrations/`)
