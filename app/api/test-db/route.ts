import { testDb } from "@/db/db";

export async function GET() {
  const result = await testDb();
  return Response.json(result);
}