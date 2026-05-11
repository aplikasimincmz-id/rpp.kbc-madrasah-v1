import { db, isDatabaseAvailable } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return Response.json({ ok: false, error: "DATABASE_URL not configured" }, { status: 503 });
    }
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
