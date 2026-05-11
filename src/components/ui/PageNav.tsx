"use client";

import Link from "next/link";

interface PageNavProps {
  backHref?: string;
  backLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

export default function PageNav({ backHref, backLabel, nextHref, nextLabel }: PageNavProps) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel || "Kembali"}
        </Link>
      ) : (
        <div />
      )}
      {nextHref ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-kemenag-green text-white rounded-lg font-medium hover:bg-kemenag-green-light transition-colors"
        >
          {nextLabel || "Lanjut"}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
