import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const user = await getCurrentUser();
    if (user) {
      redirect("/dashboard");
    }
  } catch {
    // DB not available yet, show landing page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kemenag-green via-kemenag-green-light to-kemenag-green">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-kemenag-green font-bold text-xl">K</span>
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg">RPP Generator KBC</h1>
              <p className="text-green-200 text-xs">Kementerian Agama RI</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/30 transition-all border border-white/30"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-kemenag-gold text-slate-900 rounded-lg font-medium hover:bg-kemenag-gold-light transition-colors shadow-lg"
            >
              Daftar Gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Generate RPP{" "}
            <span className="text-kemenag-gold">Deep Learning</span>
            <br />
            Berbasis KBC Otomatis
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Aplikasi untuk guru-guru Madrasah Ibtidaiyah (MI) hingga Madrasah
            Aliyah (MA) di lingkungan Kementerian Agama RI. Buat RPP lengkap
            dengan AI dalam hitungan menit!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-kemenag-gold text-slate-900 rounded-xl font-bold text-lg hover:bg-kemenag-gold-light transition-all transform hover:scale-105 shadow-lg"
            >
              Mulai Generate RPP →
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-kemenag-green rounded-xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Masuk Sekarang
            </Link>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Generate Cepat"
            description="RPP lengkap dengan Lampiran, Rubrik, LKPD, dan Soal dalam hitungan menit menggunakan teknologi AI"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            title="Berbasis KBC"
            description="Terintegrasi dengan nilai Panca Cinta: Cinta Allah, Cinta Ilmu, Cinta Diri & Sesama, Cinta Alam, Cinta Bangsa"
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Export PDF & DOCX"
            description="Download RPP dalam format PDF atau DOCX siap cetak dengan format resmi sesuai standar Kemenag"
          />
        </div>

        {/* Model LOK-R */}
        <div className="mt-24 bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Model Pembelajaran LOK-R
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LOKRCard letter="L" title="Literasi" description="Membaca & memahami materi" />
            <LOKRCard letter="O" title="Orientasi" description="Mengenali konteks pembelajaran" />
            <LOKRCard letter="K" title="Kolaborasi" description="Bekerja sama dalam kelompok" />
            <LOKRCard letter="R" title="Refleksi" description="Merefleksikan hasil belajar" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-white/20">
        <div className="text-center text-green-200 text-sm">
          <p>© {new Date().getFullYear()} Kementerian Agama Republik Indonesia</p>
          <p className="mt-1">RPP Generator KBC - Deep Learning Berbasis Karakteristik Berbasis Cinta</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-white/20 transition-colors">
      <div className="w-14 h-14 bg-kemenag-gold rounded-lg flex items-center justify-center text-slate-900 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-green-100">{description}</p>
    </div>
  );
}

function LOKRCard({
  letter,
  title,
  description,
}: {
  letter: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 text-center">
      <div className="w-12 h-12 bg-kemenag-green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
        {letter}
      </div>
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </div>
  );
}
