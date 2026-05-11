import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rppDocuments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

// Get all RPPs for current user
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const rpps = await db
      .select()
      .from(rppDocuments)
      .where(eq(rppDocuments.userId, currentUser.userId))
      .orderBy(desc(rppDocuments.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ rpps });
  } catch (error) {
    console.error("Get RPPs error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
