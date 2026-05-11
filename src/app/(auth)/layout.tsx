import { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kemenag-green via-kemenag-green-light to-kemenag-green flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-kemenag-green font-bold text-lg">K</span>
          </div>
          <div className="text-white">
            <h1 className="font-bold">RPP Generator KBC</h1>
            <p className="text-green-200 text-xs">Kementerian Agama RI</p>
          </div>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-green-200 text-sm">
        <p>© {new Date().getFullYear()} Kementerian Agama Republik Indonesia</p>
      </footer>
    </div>
  );
}
