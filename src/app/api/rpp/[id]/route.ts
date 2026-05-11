import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rppDocuments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// Get single RPP by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [rpp] = await db
      .select()
      .from(rppDocuments)
      .where(
        and(
          eq(rppDocuments.id, id),
          eq(rppDocuments.userId, currentUser.userId)
        )
      )
      .limit(1);

    if (!rpp) {
      return NextResponse.json(
        { error: "RPP tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rpp });
  } catch (error) {
    console.error("Get RPP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// Update RPP
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if RPP exists and belongs to user
    const [existingRpp] = await db
      .select()
      .from(rppDocuments)
      .where(
        and(
          eq(rppDocuments.id, id),
          eq(rppDocuments.userId, currentUser.userId)
        )
      )
      .limit(1);

    if (!existingRpp) {
      return NextResponse.json(
        { error: "RPP tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update RPP
    const [updatedRpp] = await db
      .update(rppDocuments)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(rppDocuments.id, id))
      .returning();

    return NextResponse.json({
      message: "RPP berhasil diperbarui",
      rpp: updatedRpp,
    });
  } catch (error) {
    console.error("Update RPP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// Delete RPP
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if RPP exists and belongs to user
    const [existingRpp] = await db
      .select()
      .from(rppDocuments)
      .where(
        and(
          eq(rppDocuments.id, id),
          eq(rppDocuments.userId, currentUser.userId)
        )
      )
      .limit(1);

    if (!existingRpp) {
      return NextResponse.json(
        { error: "RPP tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(rppDocuments).where(eq(rppDocuments.id, id));

    return NextResponse.json({ message: "RPP berhasil dihapus" });
  } catch (error) {
    console.error("Delete RPP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
