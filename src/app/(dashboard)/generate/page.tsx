import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import RPPForm from "@/components/forms/RPPForm";
import PageNav from "@/components/ui/PageNav";

async function getUserData(userId: string) {
  try {
    const [userData] = await db
      .select({
        namaGuru: users.namaGuru,
        nip: users.nip,
        namaMadrasah: users.namaMadrasah,
        namaKepala: users.namaKepala,
        nipKepala: users.nipKepala,
        kota: users.kota,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return userData || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function GeneratePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  const userData = await getUserData(payload.userId);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Generate RPP Deep Learning KBC
        </h1>
        <p className="text-slate-500 mt-2">
          Isi form berikut untuk generate RPP lengkap dengan AI
        </p>
      </div>

      <RPPForm
        userData={{
          namaGuru: userData?.namaGuru || undefined,
          nip: userData?.nip || undefined,
          namaMadrasah: userData?.namaMadrasah || undefined,
          namaKepala: userData?.namaKepala || undefined,
          nipKepala: userData?.nipKepala || undefined,
          kota: userData?.kota || undefined,
        }}
      />

      {/* Navigasi Bawah */}
      <PageNav
        backHref="/dashboard"
        backLabel="Dashboard"
        nextHref="/history"
        nextLabel="Riwayat RPP"
      />
    </div>
  );
}
