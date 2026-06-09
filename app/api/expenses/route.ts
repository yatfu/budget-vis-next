import { pool } from '@/db/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // parses url into URL format to extract id
  const userId = searchParams.get("userId");

  if (!userId) { // error handling
    return Response.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  const result = await pool.query( // result returns database result object
    "SELECT * FROM expenses WHERE user_id = $1",
    [userId]
  );

  return Response.json(result.rows); // converts result into json, then sends it as http response
}