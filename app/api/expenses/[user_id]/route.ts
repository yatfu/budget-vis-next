import { pool } from "@/db/db";
import type { Expense, Query } from "@/lib/types";
import { authenticate } from "@/lib/auth";
/**
 * SAVE FUNCTION
 * gets old data through api request
 * gets new data through front end upon save button click
 * compares the two tables, keeping track of the changes
 *      saves each newly created expense into "inserted" array
 *      saves each newly updated expense into "updated" array
 *      saves THE ID of each newly deleted expense into "deleted" array
 * converts each array into SQL queries, then runs them INDIVIDUALLY*
 *      current implementation causes multiple queries, improvement can be made
 *      to batch them into singular/fewer queries
 */

export async function POST(request: Request) {
  // get old data
  let oldExpenses: Expense[];
  let newExpenses: Expense[];
  let userId: number;
  try {
    const authenticated = await authenticate();
    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized, userId is null" },
        { status: 401 }
      );
    }
    userId = authenticated;
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
    console.error("Failed saving expenses to DB", error);
    return Response.json({ error: "Failed saving expenses to DB" }, { status: 500 });
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

/** 
 * export type Expense = {
  id: number;
  user_id: number;
  label: string;
  amount: number;
  month: number;
  year: number;
};
 */
