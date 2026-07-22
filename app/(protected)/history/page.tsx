import HistoryChart from "@/app/components/HistoryChart";
import { Expense, Budget } from "@/lib/types";
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

  const expensesByMonth = new Map(expenses.map((e) => [e.month, e.total]));
  const budgetsByMonth = new Map(budgets.map((b) => [b.month, b.amount]));

  console.log(expensesByMonth)

  const monthNumbers = Array.from({ length: 12 }, (_, i) => i + 1); // [1..12], we need the entire array from 1-12 to fill out the chart, instead of only including months that have expenses and budgets
  const expensesByMonthArray: number[] = [];
  const budgetsByMonthArray: number[] = [];

  for (let i = 1; i < 13; i++) {
    let amount: number | undefined = expensesByMonth.get(i);
    if (amount) { // null = 0 in this case, but it's okay because the data is only used for display
      expensesByMonthArray.push(amount)
    }
    else {
      expensesByMonthArray.push(0);
    }
  } 

  for (let i = 1; i < 13; i++) {
    let amount: number | undefined = budgetsByMonth.get(i);
    if (amount) { // null = 0 in this case, but it's okay because the data is only used for display
      budgetsByMonthArray.push(amount)
    }
    else {
      budgetsByMonthArray.push(0);
    }
  } 

  const differences: number[] = budgetsByMonthArray.map(
    (b, i) => b - expensesByMonthArray[i]
  );

  return (
    <div className="flex flex-col gap-1">
      <HistoryChart expenses={expensesByMonthArray} budgets={budgetsByMonthArray} differences={differences} />
    </div>
  );
}
