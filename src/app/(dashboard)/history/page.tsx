import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { db } from "@/db";
import { rppDocuments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DeleteRppButton from "@/components/ui/DeleteRppButton";
import PageNav from "@/components/ui/PageNav";

async function getUserRpps(userId: string) {
  try {
    return await db
      .select()
      .from(rppDocuments)
      .where(eq(rppDocuments.userId, userId))
      .orderBy(desc(rppDocuments.createdAt));
  } catch (error) {
    console.error("Error fetching RPPs:", error);
    return [];
  }
}

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  const rpps = await getUserRpps(payload.userId);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Riwayat RPP
          </h1>
          <p className="text-slate-500 mt-1">
            {rpps.length} RPP telah dibuat
          </p>
        </div>
        <Link href="/generate">
          <Button>+ Buat RPP Baru</Button>
        </Link>
      </div>

      {rpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rpps.map((rpp) => (
            <Card key={rpp.id} className="hover:shadow-md hover:border-kemenag-green/30 transition-all h-full flex flex-col">
              {/* Header: jenjang + tanggal + hapus */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-kemenag-green/10 text-kemenag-green text-xs font-medium rounded">
                  {rpp.jenjang}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {new Date(rpp.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <DeleteRppButton
                    rppId={rpp.id}
                    rppTitle={`${rpp.mataPelajaran} - ${rpp.materiPokok}`}
                  />
                </div>
              </div>

              {/* Konten klik untuk preview */}
              <Link href={`/preview/${rpp.id}`} className="flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 mb-1">
                  {rpp.mataPelajaran}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {rpp.materiPokok}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Kelas {rpp.kelas}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {rpp.alokasiWaktuJp} JP
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <p className="text-xs text-slate-500 truncate">
                    📍 {rpp.namaMadrasah}
                  </p>
                  <span className="text-xs text-kemenag-green font-medium flex items-center gap-1">
                    Lihat
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Belum Ada RPP
          </h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Anda belum membuat RPP apapun. Mulai buat RPP Deep Learning
            Berbasis KBC pertama Anda sekarang!
          </p>
          <Link href="/generate">
            <Button size="lg">+ Buat RPP Pertama</Button>
          </Link>
        </Card>
      )}

      {/* Navigasi Bawah */}
      <PageNav
        backHref="/dashboard"
        backLabel="Dashboard"
        nextHref="/generate"
        nextLabel="Buat RPP"
      />
    </div>
  );
}
