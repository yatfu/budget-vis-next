import { cookies } from "next/headers";
import { pool } from "@/db/db";

export async function authenticate() {
  try {
    const sessionId = (await cookies()).get("session")?.value;
    console.log(sessionId)

    if (!sessionId) {
      console.log("No session cookie found");
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
  } catch (error) {
    console.error("Auth error", error);
    return null;
  }
}
