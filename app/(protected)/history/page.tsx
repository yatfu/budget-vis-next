import HistoryChart from "@/app/components/HistoryChart";
import { authenticate } from "@/lib/auth";
import { pool } from "@/db/db";

export default async function HistoryPage() {
  // get data from db
  const userId = await authenticate();
  const expensesResult = await pool.query(
    // data is reduced by month within db, should result in months only having one instance, allowing it to be used as a key
    `SELECT year, month, SUM(amount)::float AS total
     FROM expenses 
     WHERE user_id = $1
     GROUP BY year, month
     ORDER BY year, month`,
    [userId]
  );
  const budgetsResult = await pool.query(
    `SELECT year, month, amount
       FROM budgets
       WHERE user_id = $1`,
    [userId]
  );
  const expenses = expensesResult.rows;
  const budgets = budgetsResult.rows;


  return (
    <div className="flex flex-col gap-1">
      <HistoryChart expenses={expenses} budgets={budgets} />
    </div>
  );
}
