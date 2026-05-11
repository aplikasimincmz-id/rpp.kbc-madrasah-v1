import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseAvailable } from "@/db";
import { rppDocuments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { generateCompleteRPP } from "@/lib/ai-service";

export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database belum dikonfigurasi." }, { status: 503 });
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      namaMadrasah,
      namaGuru,
      nipGuru,
      namaKepala,
      nipKepala,
      mataPelajaran,
      jenjang,
      kelas,
      semester,
      materiPokok,
      alokasiWaktuJp,
      menitPerJp,
      jumlahPertemuan,
      tahunPelajaran,
      nilaiPancaCinta,
      dimensiProfilLulusan,
      modelPembelajaran,
      modelPembelajaranId,
      sintaksModel,
      kota,
    } = body;

    // Validate required fields
    if (
      !namaMadrasah ||
      !namaGuru ||
      !mataPelajaran ||
      !jenjang ||
      !kelas ||
      !semester ||
      !materiPokok ||
      !alokasiWaktuJp ||
      !tahunPelajaran ||
      !nilaiPancaCinta ||
      nilaiPancaCinta.length < 1
    ) {
      return NextResponse.json(
        { error: "Semua field wajib harus diisi dan pilih minimal 1 Topik KBC (Panca Cinta)" },
        { status: 400 }
      );
    }

    // Generate RPP content
    const generatedContent = await generateCompleteRPP({
      mataPelajaran,
      jenjang,
      kelas,
      semester,
      materiPokok,
      nilaiPancaCinta,
      dimensiProfilLulusan: dimensiProfilLulusan || [],
      modelPembelajaran: modelPembelajaran || "",
      modelPembelajaranId: modelPembelajaranId || "",
      sintaksModel: sintaksModel || [],
      alokasiWaktuJp,
      menitPerJp: menitPerJp || 35,
      jumlahPertemuan: jumlahPertemuan || 1,
    });

    // Save to database
    const [newRpp] = await db
      .insert(rppDocuments)
      .values({
        userId: currentUser.userId,
        namaMadrasah,
        namaGuru,
        nipGuru: nipGuru || null,
        namaKepala: namaKepala || null,
        nipKepala: nipKepala || null,
        mataPelajaran,
        jenjang,
        kelas,
        semester,
        materiPokok,
        alokasiWaktuJp,
        menitPerJp: menitPerJp || 35,
        jumlahPertemuan: jumlahPertemuan || 1,
        tahunPelajaran,
        nilaiPancaCinta,
        modelPembelajaran: modelPembelajaran || null,
        kota: kota || null,
        identifikasiKbc: generatedContent.identifikasiKbc,
        desainPembelajaran: generatedContent.desainPembelajaran,
        pengalamanBelajar: generatedContent.pengalamanBelajar,
        asesmen: generatedContent.asesmen,
        lampiran: generatedContent.lampiran,
        isComplete: true,
      })
      .returning();

    return NextResponse.json({
      message: "RPP berhasil di-generate",
      rpp: newRpp,
    });
  } catch (error) {
    console.error("Generate RPP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat generate RPP." },
      { status: 500 }
    );
  }
}
