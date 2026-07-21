  import HistoryChart from "@/app/components/HistoryChart";
  import { Expense, Budget } from "@/lib/types";
  import { authenticate } from "@/lib/auth";
  import { pool } from "@/db/db";

  export default async function HistoryPage() {
    const userId = await authenticate();
    const expensesResult = await pool.query(`SELECT amount, month, year FROM expenses WHERE user_id = $1`, [userId]);
    const budgetsResult = await pool.query(`SELECT amount, month, year FROM budgets WHERE user_id = $1`, [userId]);
    const expenses=  expensesResult.rows;
    const budgets = budgetsResult.rows;

    //filter data by year
    //convert filtered data into correct data type
    //pass as props to chart
    return (
      <div className="flex flex-col gap-1">
        <HistoryChart expenses={expenses} budget={budgets} />
      </div>
    );
  }
