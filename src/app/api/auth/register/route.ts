import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, generateToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database belum dikonfigurasi. Pastikan DATABASE_URL sudah di-set." }, { status: 503 });
    }

    const body = await request.json();
    const { email, password, namaGuru, nip, namaMadrasah, namaKepala, nipKepala, kota } = body;

    // Validate required fields
    if (!email || !password || !namaGuru) {
      return NextResponse.json(
        { error: "Email, password, dan nama guru harus diisi" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        namaGuru,
        nip: nip || null,
        namaMadrasah: namaMadrasah || null,
        namaKepala: namaKepala || null,
        nipKepala: nipKepala || null,
        kota: kota || null,
      })
      .returning();

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      message: "Registrasi berhasil",
      user: {
        id: newUser.id,
        email: newUser.email,
        namaGuru: newUser.namaGuru,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
