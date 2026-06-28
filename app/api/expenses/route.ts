import { pool } from '@/db/db'

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

/** SAVE
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

export async function POST(req: Request) {
  const body = await req.json(); // handle input, parses it to javascript

  const { searchParams } = new URL(req.url); // parses url into URL format to extract id
  const userId = searchParams.get("user_id");
  let checkedUserId: number;

  try { checkedUserId = checkUserId(userId); }
  catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }

  const result = await pool.query(PLACEHOLDER_QUERY)
  return Response.json(result.rows, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // parses url into URL format to extract id
  const userId = searchParams.get("user_id");
  let checkedUserId: number;

  try { checkedUserId = checkUserId(userId); }
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