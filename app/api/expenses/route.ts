import { pool } from '@/db/db'



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // parses url into URL format to extract id
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