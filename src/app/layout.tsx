import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RPP Generator KBC - Kemenag RI",
  description: "Aplikasi Generator RPP Deep Learning Berbasis KBC (Karakteristik Berbasis Cinta) untuk Madrasah di lingkungan Kementerian Agama RI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
