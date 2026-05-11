import { NextResponse } from "next/server";
import { db } from "@/db";
import { rppDocuments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, count, desc } from "drizzle-orm";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(rppDocuments)
      .where(eq(rppDocuments.userId, currentUser.userId));

    // Get recent RPPs
    const recentRpps = await db
      .select({
        id: rppDocuments.id,
        mataPelajaran: rppDocuments.mataPelajaran,
        materiPokok: rppDocuments.materiPokok,
        jenjang: rppDocuments.jenjang,
        kelas: rppDocuments.kelas,
        createdAt: rppDocuments.createdAt,
      })
      .from(rppDocuments)
      .where(eq(rppDocuments.userId, currentUser.userId))
      .orderBy(desc(rppDocuments.createdAt))
      .limit(5);

    return NextResponse.json({
      stats: {
        totalRpp: totalCount,
      },
      recentRpps,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
