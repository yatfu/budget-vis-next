import { pool } from "@/db/db";
import { authenticate } from "@/lib/auth";
import type { Expense, Budget, Query } from "@/lib/types";

/** */

/** POST: Save changes made on frontend to database
 *
 * Compares new (edited) expenses vs original (loaded on login/registration) expenses, then generates sql based on those differences.
 * Uses id to determine which SQL operation to perform on each change
 * After SQL is generated, sends all in one request
 *
 * Apparently, given the simplicity of my data, diffing at save time is good.
 *
 */

/** POST
 * generic post request that will be used by SAVE function
 */

export async function POST(request: Request) {
  let oldExpenses: Expense[];
  let newExpenses: Expense[];
  let oldBudgets: Budget[];
  let newBudgets: Budget[];
  let userId: number;
  let selectedMonth: number;
  let selectedYear: number;
  // get user id using authenticate app
  try {
    userId = await authenticate();
    if (!userId) {
      return Response.json(
        { error: "Unauthorized, userId is null" },
        { status: 401 }
      );
    }

    // get new data
    try {
      const body = await request.json();
      newExpenses = body.expenses;
      newBudgets = body.budgets;
      selectedMonth = body.selectedMonth;
      selectedYear = body.selectedYear;
      //parse amount as float before validation
      //because amount is decimal value, it gets read as string in request.json()
      newExpenses.forEach((expense) => {
        expense.amount = parseFloat(expense.amount);
      });
      //validate expenses
      if (!Array.isArray(newExpenses) || !newExpenses.every(isNewExpense)) {
        console.error("Invalid request body: expenses", newExpenses);
        return Response.json(
          { error: "Invalid request body: expenses" },
          { status: 400 }
        );
      }
      //validate budgets
      if (!Array.isArray(newBudgets) || !newBudgets.every(isNewBudget)) {
        console.error("Invalid request body: budgets", newBudgets);
        return Response.json(
          { error: "Invalid request body: budgets" },
          { status: 400 }
        );
      }
      //validate month and year
      else if (
        typeof selectedMonth !== "number" ||
        typeof selectedYear !== "number" ||
        selectedMonth < 1 ||
        selectedYear < 1 ||
        selectedMonth > 12
      ) {
        console.error("Invalid request body: selectedMonth or selectedYear");
      }
    } catch (error) {
      console.log("Invalid request body", error);
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    // get old data
    const oldExpensesResult = await pool.query<Expense>(
      `SELECT id, user_id, label, amount, month, year 
      FROM expenses 
      WHERE user_id = $1 
        AND month = $2 
        AND year = $3`,
      [userId, selectedMonth, selectedYear]
    );
    oldExpenses = oldExpensesResult.rows;
    const oldBudgetsResult = await pool.query<Budget>(
      `SELECT id, user_id, amount, month, year
      FROM budgets
      WHERE user_id = $1
      AND month = $2
      AND year = $3`,
      [userId, selectedMonth, selectedYear]
    );
    oldBudgets = oldBudgetsResult.rows;
  } catch (error) {
    console.error("Getting old data from database failed", error);
    return Response.json(
      { error: "Getting old data from database failed" },
      { status: 500 }
    );
  }

  // convert to maps for comparison
  // searching with key in map is constant time vs linear array search
  const oldExpensesMap = new Map(oldExpenses.map((e) => [e.id, e]));
  const newExpensesMap = new Map(newExpenses.map((e) => [e.id, e]));

  const oldBudgetsMap = new Map(oldBudgets.map((e) => [e.id, e]));
  const newBudgetsMap = new Map(newBudgets.map((e) => [e.id, e]));

  // generate arrays of modified expenses through comparison
  let expensesInserts: Expense[] = [];
  let expensesUpdates: Expense[] = [];
  let expensesDeletes: number[] = [];

  let budgetsInserts: Budget[] = [];
  let budgetsUpdates: Budget[] = [];

  for (const [id, expense] of newExpensesMap) {
    // expense inserts
    if (!oldExpensesMap.has(id)) {
      expensesInserts.push(expense);
    }
  }
  for (const [id, newExpense] of newExpensesMap) {
    // expense updates
    const oldExpense = oldExpensesMap.get(id);
    if (
      oldExpense &&
      JSON.stringify(oldExpense) !== JSON.stringify(newExpense)
    ) {
      // cannot use !== because it compares references
      expensesUpdates.push(newExpense);
    }
  }
  for (const [id] of oldExpensesMap) {
    // expense deletes
    if (!newExpensesMap.has(id)) {
      expensesDeletes.push(id);
    }
  }
  for (const [id, budget] of newBudgetsMap) {
    // budget inserts
    if (!oldBudgetsMap.has(id)) {
      budgetsInserts.push(budget);
    }
  }
  for (const [id, newBudget] of newBudgetsMap) {
    // expense updates
    const oldBudget = oldBudgetsMap.get(id);
    if (oldBudget && JSON.stringify(oldBudget) !== JSON.stringify(newBudget)) {
      // cannot use !== because it compares references
      budgetsUpdates.push(newBudget);
    }
  }

  // generate SQL using modified expenses
  // simple loop to convert then push
  let expensesInsertSQL: Query[] = [];
  let expensesUpdateSQL: Query[] = [];
  let expensesDeleteSQL: Query[] = [];

  let budgetsInsertSQL: Query[] = [];
  let budgetsUpdateSQL: Query[] = [];

  for (const insert of expensesInserts) {
    const sql = `
      INSERT INTO expenses (user_id, label, amount, month, year)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `;
    // userId from params
    const { label, amount, month, year } = insert;
    const values = [userId, label, amount, month, year];
    expensesInsertSQL.push({ sql, values });
  }
  for (const update of expensesUpdates) {
    const sql = `
      UPDATE expenses
      SET label = $1,
          amount = $2,
          month = $3,
          year = $4
      WHERE id = $5
      AND user_id = $6
      RETURNING *
      `;
    const { label, amount, month, year, id } = update;
    const values = [label, amount, month, year, id, userId];
    expensesUpdateSQL.push({ sql, values });
  }
  for (const deleted of expensesDeletes) {
    const sql = `
      DELETE FROM expenses
      WHERE id = $1
      AND user_id = $2
      RETURNING *
    `; // both id and user_id are checked to prevent other users from deleting if they know the id
    // id from deletes (array of id: numbers)
    // userId from params
    const values = [deleted, userId];
    expensesDeleteSQL.push({ sql, values });
  }
  for (const insert of budgetsInserts) {
    const sql = `
    INSERT INTO budgets (user_id, amount, month, year)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
    const { amount, month, year } = insert;
    const values = [userId, amount, month, year];
    budgetsInsertSQL.push({ sql, values });
  }
  for (const update of budgetsUpdates) {
    const sql = `
    INSERT INTO budgets (user_id, amount, month, year)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
    const { amount, month, year } = update;
    const values = [userId, amount, month, year];
    budgetsUpdateSQL.push({ sql, values })
  }
  // send queries to database

  let expensesInsertResults = [];
  let expensesUpdateResults = [];
  let expensesDeleteResults = [];

  let budgetsInsertResults = [];
  let budgetsUpdateResults = [];

  // pools connections

  const client = await pool.connect(); // ChatGPT says theres a potential issue with using multiple clients. this prevents that
  try {
    await client.query("BEGIN");
    for (const query of expensesInsertSQL) {
      const result = await client.query(query.sql, query.values);
      expensesInsertResults.push(result);
    }
    for (const query of expensesUpdateSQL) {
      const result = await client.query(query.sql, query.values);
      expensesUpdateResults.push(result);
    }
    for (const query of expensesDeleteSQL) {
      const result = await client.query(query.sql, query.values);
      expensesDeleteResults.push(result);
    }
    for (const query of budgetsInsertSQL) {
      const result = await client.query(query.sql, query.values);
      budgetsInsertResults.push(result);
    }
    for (const query of budgetsUpdateSQL) {
      const result = await client.query(query.sql, query.values);
      budgetsUpdateResults.push(result);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed saving changes", error);
    return Response.json({ error: "Failed saving changes" }, { status: 500 });
  } finally {
    // release client from imprisonment :)
    client.release();
  }

  console.log("Changes saved");

  return Response.json({
    expensesInserted: expensesInsertResults,
    expensesUpdated: expensesUpdateResults,
    expensesDeleted: expensesDeleteResults,
    budgetsInserted: budgetsInsertResults,
    budgetsUpdated: budgetsUpdateResults
  });
}

export async function GET(req: Request) {
  const userId = await authenticate();
  let checkedUserId: number;

  try {
    checkedUserId = checkUserId(userId);
  } catch (error) {
    // validate user id
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }

  const expenseResult = await pool.query(
    // result returns database result object
    "SELECT * FROM expenses WHERE user_id = $1",
    [checkedUserId]
  ); // used parsed user id instead of original because ChatGPT recommended to. SQL will auto-parse strings, and with the integer check it should be fine with original but reduces reliability by depending on SQL auto parse
  const expenses = expenseResult.rows.map((row) => ({
    // convert amount (SQL decimal -> string -> number)
    ...row,
    amount: Number(row.amount),
  }));

  const budgetResult = await pool.query(
    "SELECT * FROM budgets WHERE user_id = $1",
    [checkedUserId]
  ); // convert amount (SQL decimal -> string -> number)
  const budgets = budgetResult.rows.map((row) => ({
    // convert amount (SQL decimal -> string -> number)
    ...row,
    amount: Number(row.amount),
  }));
  console.log(expenses, budgets);
  return Response.json({ expenses, budgets }); // converts result into json, then sends it as http response
}

/** DELETE
 *
 * Deletes all expenses from table that have matching user_id
 * ONLY USED WHEN USER WANTS TO CLEAR THEIR DATA
 *
 */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  let checkedUserId: number;

  try {
    checkedUserId = checkUserId(userId);

    // continue...
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }

  const result = await pool.query(
    // result returns database result object
    "DELETE FROM expenses WHERE user_id = $1",
    [checkedUserId]
  );

  return Response.json({
    success: true,
    message: "Expenses deleted successfully",
    deletedCount: result.rowCount,
  });
}
/**
 * HELPER FUNCTION checks user_id for validity
 */
const checkUserId = (id: any) => {
  if (!id) {
    // error handling: null
    throw new Error("user_id is required");
  }

  const parsedUserId = Number(id); // error handling: is integer
  if (!Number.isInteger(parsedUserId)) {
    throw new Error("user_id is not correct datatype");
  }
  return parsedUserId;
};

function isNewExpense(expense: any): boolean {
  // helper function to check request body for correct type. used in POST function
  return (
    expense &&
    (typeof expense.id === "string" || typeof expense.id === "number") &&
    typeof expense.label === "string" &&
    typeof expense.amount === "number" &&
    typeof expense.month === "number" &&
    typeof expense.year === "number"
  );
}

function isNewBudget(budget: any): boolean {
  // helper function to check request body for correct type. used in POST function
  return (
    budget &&
    (typeof budget.id === "string" || typeof budget.id === "number") &&
    typeof budget.amount === "number" &&
    typeof budget.month === "number" &&
    typeof budget.year === "number"
  );
}
