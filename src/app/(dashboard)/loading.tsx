export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-kemenag-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Memuat...</p>
      </div>
    </div>
  );
}
