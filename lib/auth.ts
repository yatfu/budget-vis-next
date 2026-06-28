import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "@/db/db";

export async function authenticate() {
  const sessionId = (await cookies()).get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const result = await pool.query(
    `SELECT user_id
     FROM sessions
     WHERE id = $1
       AND expires_at > NOW()`,
    [sessionId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].user_id;
}