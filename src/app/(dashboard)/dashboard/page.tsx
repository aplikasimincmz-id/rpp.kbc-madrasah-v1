import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { db } from "@/db";
import { users, rppDocuments } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import Link from "next/link";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageNav from "@/components/ui/PageNav";

async function getDashboardData(userId: string) {
  try {
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const [stats] = await db
      .select({ totalCount: count() })
      .from(rppDocuments)
      .where(eq(rppDocuments.userId, userId));

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
      .where(eq(rppDocuments.userId, userId))
      .orderBy(desc(rppDocuments.createdAt))
      .limit(5);

    return {
      userData,
      totalCount: stats?.totalCount || 0,
      recentRpps,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      userData: null,
      totalCount: 0,
      recentRpps: [],
    };
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  const { userData, totalCount, recentRpps } = await getDashboardData(payload.userId);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-kemenag-green to-kemenag-green-light rounded-2xl p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Selamat Datang, {userData?.namaGuru || "Guru"}! 👋
        </h1>
        <p className="text-green-100 mb-6">
          Siap untuk membuat RPP Deep Learning Berbasis KBC hari ini?
        </p>
        <Link href="/generate">
          <Button variant="secondary" size="lg">
            + Buat RPP Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-kemenag-green/10 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-kemenag-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total RPP</p>
              <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-kemenag-gold/10 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-kemenag-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Model Pembelajaran</p>
              <p className="text-lg font-bold text-slate-900">LOK-R / KBC</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Madrasah</p>
              <p className="text-lg font-bold text-slate-900 truncate">
                {userData?.namaMadrasah || "Belum diatur"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent RPPs */}
      <Card>
        <CardHeader
          title="RPP Terbaru"
          subtitle="Daftar RPP yang baru saja Anda buat"
          action={
            <Link href="/history">
              <Button variant="ghost" size="sm">
                Lihat Semua →
              </Button>
            </Link>
          }
        />

        {recentRpps.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentRpps.map((rpp) => (
              <Link
                key={rpp.id}
                href={`/preview/${rpp.id}`}
                className="flex items-center justify-between py-4 hover:bg-slate-50 -mx-6 px-6 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">{rpp.mataPelajaran}</h3>
                  <p className="text-sm text-slate-500">
                    {rpp.materiPokok} • Kelas {rpp.kelas} {rpp.jenjang}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    {new Date(rpp.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <svg
                    className="w-5 h-5 text-slate-400 ml-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Belum ada RPP</h3>
            <p className="text-slate-500 mb-4">Mulai buat RPP pertama Anda sekarang!</p>
            <Link href="/generate">
              <Button>+ Buat RPP Baru</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Quick Guide */}
      <Card className="bg-gradient-to-br from-kemenag-gold/10 to-kemenag-gold/5 border-kemenag-gold/20">
        <h3 className="font-bold text-lg text-slate-900 mb-4">
          Panduan Cepat Membuat RPP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-kemenag-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">Isi Identitas</p>
              <p className="text-sm text-slate-600">Data madrasah dan guru</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-kemenag-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">Pilih Materi</p>
              <p className="text-sm text-slate-600">Mapel, kelas, dan materi pokok</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-kemenag-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">Pilih Nilai KBC</p>
              <p className="text-sm text-slate-600">Minimal 3 nilai Panca Cinta</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-kemenag-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-semibold text-slate-900">Generate & Export</p>
              <p className="text-sm text-slate-600">Download PDF atau DOCX</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigasi Bawah */}
      <PageNav
        nextHref="/generate"
        nextLabel="Buat RPP Baru"
      />
    </div>
  );
}
