import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "RPP Kurikulum Berbasis Cinta - Mewujudkan cinta dalam ruh pendidikan",
  description: "Aplikasi Generator RPP Deep Learning Berbasis KBC (Karakteristik Berbasis Cinta) untuk guru Madrasah",
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
