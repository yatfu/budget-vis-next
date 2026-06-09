import { pool } from '@/db/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // parses url into URL format to extract id
  const userId = searchParams.get("userId");

  if (!userId) { // error handling: null
    return Response.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  const parsedUserId = Number(userId) // error handling: is integer
  if (!Number.isInteger(parsedUserId)) {
    return Response.json(
      { error: "user_id not correct datatype"},
      { status: 400 }
    )
  }

  const result = await pool.query( // result returns database result object
    "SELECT * FROM expenses WHERE user_id = $1",
    [parsedUserId]) // used parsed user id instead of original because ChatGPT recommended to. SQL will auto-parse strings, and with the integer check it should be fine with original but reduces reliability by depending on SQL auto parse



  return Response.json(result.rows); // converts result into json, then sends it as http response
}