import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { db } from "@/db";
import { rppDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import RPPPreview from "@/components/preview/RPPPreview";
import ExportButtons from "@/components/export/ExportButtons";
import PrintButton from "@/components/export/PrintButton";
import DeleteRppButton from "@/components/ui/DeleteRppButton";
import PageNav from "@/components/ui/PageNav";
import Link from "next/link";

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

async function getRpp(userId: string, rppId: string) {
  try {
    const [rpp] = await db
      .select()
      .from(rppDocuments)
      .where(
        and(
          eq(rppDocuments.id, rppId),
          eq(rppDocuments.userId, userId)
        )
      )
      .limit(1);
    return rpp || null;
  } catch (error) {
    console.error("Error fetching RPP:", error);
    return null;
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  const { id } = await params;
  const rpp = await getRpp(payload.userId, id);

  if (!rpp) {
    notFound();
  }

  return (
    <div>
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 no-print">
        <div>
          <Link
            href="/history"
            className="text-sm text-kemenag-green hover:underline flex items-center gap-1 mb-2"
          >
            ← Kembali ke Riwayat
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Preview RPP</h1>
          <p className="text-slate-500 mt-1">
            {rpp.mataPelajaran} - {rpp.materiPokok}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <PrintButton />
          <ExportButtons rpp={rpp} />
          <DeleteRppButton
            rppId={rpp.id}
            rppTitle={`${rpp.mataPelajaran} - ${rpp.materiPokok}`}
          />
        </div>
      </div>

      {/* RPP Content */}
      <RPPPreview rpp={rpp} />

      {/* Navigasi Bawah */}
      <div className="no-print">
        <PageNav
          backHref="/history"
          backLabel="Riwayat RPP"
          nextHref="/generate"
          nextLabel="Buat RPP Baru"
        />
      </div>
    </div>
  );
}
