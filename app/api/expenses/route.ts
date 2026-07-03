import { pool } from '@/db/db'
import { authenticate } from '@/lib/auth';
import type { Expense, Query } from "@/lib/types";

/** */
const PLACEHOLDER_QUERY = `INSERT INTO expenses (user_id, label, amount, month, year)
VALUES
-- January 2026
(1, 'Rent', 1200.00, 1, 2026),
(1, 'Groceries', 300.50, 1, 2026),
(1, 'Transport', 75.00, 1, 2026),
(1, 'Internet', 60.00, 1, 2026),

-- February 2026
(1, 'Rent', 1200.00, 2, 2026),
(1, 'Groceries', 280.00, 2, 2026),
(1, 'Dining Out', 150.25, 2, 2026),
(1, 'Transport', 90.00, 2, 2026),

-- March 2026
(1, 'Rent', 1200.00, 3, 2026),
(1, 'Groceries', 320.00, 3, 2026),
(1, 'Subscription', 15.99, 3, 2026),
(1, 'Entertainment', 100.00, 3, 2026),

-- April 2026
(1, 'Rent', 1200.00, 4, 2026),
(1, 'Groceries', 310.00, 4, 2026),
(1, 'Utilities', 180.75, 4, 2026),
(1, 'Transport', 85.00, 4, 2026),

-- May 2026
(1, 'Rent', 1200.00, 5, 2026),
(1, 'Groceries', 290.00, 5, 2026),
(1, 'Dining Out', 130.00, 5, 2026),
(1, 'Internet', 60.00, 5, 2026),

-- June 2026
(1, 'Rent', 1200.00, 6, 2026),
(1, 'Groceries', 310.00, 6, 2026),
(1, 'Transport', 95.00, 6, 2026),
(1, 'Entertainment', 120.00, 6, 2026);`;

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
  let newExpenses: unknown;
  let userId: number;
  // get user id using authenticate app
  try {
    userId = await authenticate();
    if (!userId) {
      return Response.json(
        { error: "Unauthorized, userId is null" },
        { status: 401 }
      );
    }
    // get old data
    const result = await pool.query<Expense>(
      "SELECT id, user_id, label, amount, month, year FROM expenses WHERE user_id = $1",
      [userId]
    );

    oldExpenses = result.rows;
  } catch (error) {
    console.error("Getting old expenses from database failed", error);
    return Response.json(
      { error: "Getting old expenses from database failed" },
      { status: 500 }
    );
  }
  // get new data
  try {
    newExpenses = await request.json();
    if (!Array.isArray(newExpenses) || !newExpenses.every(isExpense)) {
      console.error("Invalid request body", newExpenses);
      return Response.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Invalid request body", error);
    return Response.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // convert to maps for comparison
  // searching with key in map is constant time vs linear array search
  const oldMap = new Map(oldExpenses.map((e) => [e.id, e]));
  const newMap = new Map(newExpenses.map((e) => [e.id, e]));

  // generate arrays of modified expenses through comparison
  let inserts: Expense[] = [];
  let updates: Expense[] = [];
  let deletes: number[] = [];

  for (const [id, expense] of newMap) {
    // inserts
    if (!oldMap.has(id)) {
      inserts.push(expense);
    }
  }
  for (const [id, newExpense] of newMap) {
    // updates
    const oldExpense = oldMap.get(id);
    if (
      oldExpense &&
      JSON.stringify(oldExpense) !== JSON.stringify(newExpense)
    ) {
      // cannot use !== because it compares references
      updates.push(newExpense);
    }
  }
  for (const [id] of oldMap) {
    // deletes
    if (!newMap.has(id)) {
      deletes.push(id);
    }
  }
  // generate SQL using modified expenses
  // simple loop to convert then push
  let insertSQL: Query[] = [];
  let updateSQL: Query[] = [];
  let deleteSQL: Query[] = [];

  for (const insert of inserts) {
    const sql = `
      INSERT INTO expenses (user_id, label, amount, month, year)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `;
    // userId from params
    const { label, amount, month, year } = insert;
    const values = [userId, label, amount, month, year];
    insertSQL.push({ sql, values });
  }
  for (const update of updates) {
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
    updateSQL.push({ sql, values });
  }
  for (const deleted of deletes) {
    const sql = `
      DELETE FROM expenses
      WHERE id = $1
      AND user_id = $2
      RETURNING *
    `; // both id and user_id are checked to prevent other users from deleting if they know the id
    // id from deletes (array of id: numbers)
    // userId from params
    const values = [deleted, userId];
    deleteSQL.push({ sql, values });
  }
  // send queries to database

  let insertResults = [];
  let updateResults = [];
  let deleteResults = [];

  // pools connections

  const client = await pool.connect(); // ChatGPT says theres a potential issue with using multiple clients. this prevents that
  try {
    await client.query("BEGIN");
    for (const query of insertSQL) {
      const insertResult = await client.query(query.sql, query.values);
      insertResults.push(insertResult);
    }
    for (const query of updateSQL) {
      const updateResult = await client.query(query.sql, query.values);
      updateResults.push(updateResult);
    }
    for (const query of deleteSQL) {
      const deleteResult = await client.query(query.sql, query.values);
      deleteResults.push(deleteResult);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed saving expenses", error);
    return Response.json({ error: "Failed saving expenses" }, { status: 500 });
  } finally {
    // release client from imprisonment :)
    client.release();
  }

  return Response.json({
    inserted: insertResults,
    updated: updateResults,
    deleted: deleteResults,
  });
}

export async function GET(req: Request) {
  const userId = await authenticate();
  console.log(userId);
  let checkedUserId: number;

  try { checkedUserId = checkUserId(userId); } // validate user id
  catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }

  const result = await pool.query( // result returns database result object
    "SELECT * FROM expenses WHERE user_id = $1",
    [checkedUserId]) // used parsed user id instead of original because ChatGPT recommended to. SQL will auto-parse strings, and with the integer check it should be fine with original but reduces reliability by depending on SQL auto parse

  return Response.json(result.rows); // converts result into json, then sends it as http response
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
    return Response.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }

  const result = await pool.query( // result returns database result object
    "DELETE FROM expenses WHERE user_id = $1",
    [checkedUserId]);

  return Response.json({
    success: true,
    message: "Expenses deleted successfully",
    deletedCount: result.rowCount
  });

}
/**
 * HELPER FUNCTION checks user_id for validity
 */
const checkUserId = (id: any) => {
  if (!id) { // error handling: null
    throw new Error("user_id is required");
  }

  const parsedUserId = Number(id) // error handling: is integer
  if (!Number.isInteger(parsedUserId)) {
    throw new Error("user_id is not correct datatype");
  }
  return parsedUserId;
}

function isExpense(expense: any): boolean { // helper function to check request body for correct type. used in POST function
  return (
    expense &&
    typeof expense.id === "string" &&
    typeof expense.label === "string" &&
    typeof expense.amount === "number" &&
    typeof expense.month === "number" &&
    typeof expense.year === "number"
  );
}