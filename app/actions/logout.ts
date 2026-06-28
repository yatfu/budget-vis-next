"use server";

import { cookies } from "next/headers";
import { pool } from "@/db/db";

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    await pool.query(
      `DELETE FROM sessions
       WHERE id = $1`,
      [sessionId]
    );
  }

  cookieStore.delete("session");
}