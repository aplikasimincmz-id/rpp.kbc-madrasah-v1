import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kemenag-green via-kemenag-green-light to-kemenag-green flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl">📄</span>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-green-100 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan.
        </p>
        <Link href="/">
          <Button variant="secondary" size="lg">
            ← Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
