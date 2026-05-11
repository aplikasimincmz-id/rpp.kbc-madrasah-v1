import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        namaGuru: users.namaGuru,
        nip: users.nip,
        namaMadrasah: users.namaMadrasah,
        namaKepala: users.namaKepala,
        nipKepala: users.nipKepala,
        kota: users.kota,
      })
      .from(users)
      .where(eq(users.id, currentUser.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
