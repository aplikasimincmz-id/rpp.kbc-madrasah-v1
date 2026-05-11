import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kemenag-green via-kemenag-green-light to-kemenag-green flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <img src="https://freeimghost.com/images/2026/05/08/logo-kemenag60fceb73d13a9d39.png" alt="Logo Kemenag" className="w-10 h-10 object-contain" />
          <div className="text-white">
            <h1 className="font-bold">RPP Kurikulum Berbasis Cinta</h1>
            <p className="text-green-200 text-xs">"Madrasah Maju, Ramah, dan Terintegrasi"</p>
          </div>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-green-200 text-sm">
        <p>© {new Date().getFullYear()} Agus Arifien @ min1ciamis</p>
      </footer>
    </div>
  );
}
