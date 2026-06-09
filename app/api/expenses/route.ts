import { pool } from '@/db/db'

export async function GET(req: Request) {
  const result = await pool.query("SELECT * FROM expenses");
  return Response.json(result.rows);
}