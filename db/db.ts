import 'server-only'
import { Pool } from "pg";

/** 
 *keep singleton pool to prevent too many connections from nextjs dev mode
 */

declare global { // so typescript doesnt complain
  var pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL; // ChatGPT recommended to check env variable because pg errors aren't obvious
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const pool =
  global.pgPool ??
  new Pool({
    connectionString,
    max: 10, // concurrent connection max
    idleTimeoutMillis: 50_000,
  });

if (process.env.NODE_ENV !== "production") { // only need this feature in dev mode
  global.pgPool = pool;
}

export async function testDb() {
  const result = await pool.query("SELECT NOW()");
  return result.rows[0];
}

