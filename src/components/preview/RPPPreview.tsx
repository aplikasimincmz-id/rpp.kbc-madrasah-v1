"use client";

import { RppDocument } from "@/db/schema";
import {
  formatSemester,
  formatAlokasiWaktu,
  formatTanggalIndonesia,
  MODEL_PEMBELAJARAN_DEFAULT,
} from "@/lib/constants";
import { splitNumberedPoints } from "@/lib/rpp-format";

interface RPPPreviewProps {
  rpp: RppDocument;
}

export default function RPPPreview({ rpp }: RPPPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto print:shadow-none print:border-none">
      {/* Header/Judul */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wide">
          PERENCANAAN PEMBELAJARAN KBC
        </h1>
        <p className="text-lg font-semibold italic mt-2">
          Materi: {rpp.materiPokok}
        </p>
      </div>

      {/* A. Identitas Modul */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 bg-kemenag-green text-white px-4 py-2 rounded">
          A. IDENTITAS MODUL
        </h2>
        <table className="w-full border-collapse">
          <tbody>
            <TableRow label="Madrasah" value={rpp.namaMadrasah} />
            <TableRow
              label="Guru"
              value={`${rpp.namaGuru}${rpp.nipGuru ? ` (NIP: ${rpp.nipGuru})` : ""}`}
            />
            <TableRow label="Mata Pelajaran" value={rpp.mataPelajaran} />
            <TableRow
              label="Kelas / Semester"
              value={formatSemester(rpp.kelas, rpp.semester)}
            />
            <TableRow label="Materi Pokok" value={rpp.materiPokok} />
            <TableRow
              label="Alokasi Waktu"
              value={formatAlokasiWaktu(
                rpp.alokasiWaktuJp,
                rpp.menitPerJp,
                rpp.jumlahPertemuan
              )}
            />
            <TableRow label="Tahun Pelajaran" value={rpp.tahunPelajaran} />
            <TableRow label="Model Pembelajaran" value={(rpp as Record<string, unknown>).modelPembelajaran as string || MODEL_PEMBELAJARAN_DEFAULT} />
          </tbody>
        </table>
      </section>

      {/* B. Identifikasi & KBC */}
      {rpp.identifikasiKbc && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-kemenag-green text-white px-4 py-2 rounded">
            B. IDENTIFIKASI & KBC (Karakteristik Berbasis Cinta)
          </h2>

          <div className="space-y-6">
            {/* Kesiapan Murid */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">1. Kesiapan Murid:</h3>
              <div className="pl-4 space-y-2">
                <p>
                  <span className="font-semibold">Pengetahuan Awal:</span>{" "}
                  {rpp.identifikasiKbc.kesiapanMurid.pengetahuanAwal}
                </p>
                <p>
                  <span className="font-semibold">Gaya Belajar:</span>{" "}
                  {rpp.identifikasiKbc.kesiapanMurid.gayaBelajar}
                </p>
                <p>
                  <span className="font-semibold">Minat:</span>{" "}
                  {rpp.identifikasiKbc.kesiapanMurid.minat}
                </p>
              </div>
            </div>

            {/* Dimensi Profil Lulusan */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                2. Dimensi Profil Lulusan:
              </h3>
              <div className="pl-4 space-y-2">
                {rpp.identifikasiKbc.dimensiProfilLulusan.kreativitas && (
                  <p>
                    <span className="font-semibold">•</span>{" "}
                    {rpp.identifikasiKbc.dimensiProfilLulusan.kreativitas}
                  </p>
                )}
                {rpp.identifikasiKbc.dimensiProfilLulusan.kolaborasi && (
                  <p>
                    <span className="font-semibold">•</span>{" "}
                    {rpp.identifikasiKbc.dimensiProfilLulusan.kolaborasi}
                  </p>
                )}
                {rpp.identifikasiKbc.dimensiProfilLulusan.komunikasi && (
                  <p>
                    <span className="font-semibold">•</span>{" "}
                    {rpp.identifikasiKbc.dimensiProfilLulusan.komunikasi}
                  </p>
                )}
              </div>
            </div>

            {/* Topik KBC */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                3. Topik KBC (Panca Cinta):
              </h3>
              <ul className="pl-4 list-disc list-inside">
                {rpp.identifikasiKbc.topikKbc.map((topik, idx) => (
                  <li key={idx} className="font-semibold text-kemenag-green">
                    {topik}
                  </li>
                ))}
              </ul>
            </div>

            {/* Materi Insersi KBC */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                4. Materi Insersi KBC:
              </h3>
              <p className="pl-4 text-justify">
                {rpp.identifikasiKbc.materiInsersiKbc}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* C. Desain Pembelajaran */}
      {rpp.desainPembelajaran && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-kemenag-green text-white px-4 py-2 rounded">
            C. DESAIN PEMBELAJARAN
          </h2>

          <div className="space-y-6">
            {/* Capaian Pembelajaran */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                1. Capaian Pembelajaran (CP):
              </h3>
              <p className="pl-4 text-justify">
                {rpp.desainPembelajaran.capaianPembelajaran}
              </p>
            </div>

            {/* Lintas Disiplin Ilmu */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                2. Lintas Disiplin Ilmu:
              </h3>
              <div className="pl-4 space-y-2">
                {rpp.desainPembelajaran.lintasDisiplinIlmu.map((item, idx) => (
                  <p key={idx}>
                    <span className="font-semibold">{item.mapel}:</span>{" "}
                    {item.deskripsi}
                  </p>
                ))}
              </div>
            </div>

            {/* Tujuan Pembelajaran */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                3. Tujuan Pembelajaran:
              </h3>
              {splitNumberedPoints(rpp.desainPembelajaran.tujuanPembelajaran).length > 1 ? (
                <ol className="pl-8 list-decimal space-y-2">
                  {splitNumberedPoints(rpp.desainPembelajaran.tujuanPembelajaran).map((item, idx) => {
                    const cleaned = item.replace(/^\d+\.\s*/, "");
                    return (
                      <li key={idx} className="text-justify">
                        {cleaned}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="pl-4 text-justify">
                  {rpp.desainPembelajaran.tujuanPembelajaran}
                </p>
              )}
            </div>

            {/* Praktik Pedagogis */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                4. Praktik Pedagogis:
              </h3>
              <div className="pl-4 space-y-2">
                {rpp.desainPembelajaran.praktikPedagogis.map((item, idx) => (
                  <p key={idx}>
                    <span className="font-semibold">{item.metode}:</span>{" "}
                    {item.deskripsi}
                  </p>
                ))}
              </div>
            </div>

            {/* Kemitraan Pembelajaran */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                5. Kemitraan Pembelajaran:
              </h3>
              <ul className="pl-4 list-disc list-inside">
                {rpp.desainPembelajaran.kemitraanPembelajaran.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Lingkungan Pembelajaran */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                6. Lingkungan Pembelajaran:
              </h3>
              <ul className="pl-4 list-disc list-inside">
                {rpp.desainPembelajaran.lingkunganPembelajaran.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Pemanfaatan Digital */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                7. Pemanfaatan Digital:
              </h3>
              <ul className="pl-4 list-disc list-inside">
                {rpp.desainPembelajaran.pemanfaatanDigital.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* D. Pengalaman Belajar (Deep Learning) */}
      {rpp.pengalamanBelajar && rpp.pengalamanBelajar.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-kemenag-green text-white px-4 py-2 rounded">
            D. PENGALAMAN BELAJAR (Deep Learning)
          </h2>

          {rpp.pengalamanBelajar.map((pertemuan, idx) => (
            <div key={idx} className="mb-8 border border-slate-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-kemenag-green mb-4">
                Pertemuan {pertemuan.pertemuanKe} ({pertemuan.jumlahJp} JP ={" "}
                {pertemuan.totalMenit} menit)
              </h3>

              {/* Pendahuluan */}
              <div className="mb-4">
                <h4 className="font-bold bg-slate-100 px-3 py-2 rounded">
                  1. PENDAHULUAN (±{pertemuan.pendahuluan.durasiMenit} menit)
                </h4>
                <ul className="pl-6 mt-2 list-disc space-y-1">
                  {pertemuan.pendahuluan.kegiatan.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
                <div className="mt-3 bg-kemenag-gold/10 p-3 rounded border-l-4 border-kemenag-gold">
                  <p className="font-semibold text-sm">
                    Penguatan Nilai KBC (Panca Cinta):
                  </p>
                  <p className="text-sm mt-1">{pertemuan.pendahuluan.penguatanKbc}</p>
                </div>
              </div>

              {/* Inti */}
              <div className="mb-4">
                <h4 className="font-bold bg-slate-100 px-3 py-2 rounded">
                  2. INTI (±{pertemuan.inti.durasiMenit} menit)
                </h4>

                {/* Memahami */}
                <div className="pl-4 mt-3">
                  <h5 className="font-semibold text-kemenag-green">
                    a. Memahami (Literasi &amp; Orientasi) (±
                    {pertemuan.inti.memahami.durasiMenit} menit)
                  </h5>
                  <ul className="pl-6 mt-1 list-disc space-y-1">
                    {pertemuan.inti.memahami.kegiatan.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>

                {/* Mengaplikasi */}
                <div className="pl-4 mt-3">
                  <h5 className="font-semibold text-kemenag-green">
                    b. Mengaplikasi (Kolaborasi) (±
                    {pertemuan.inti.mengaplikasi.durasiMenit} menit)
                  </h5>
                  <ul className="pl-6 mt-1 list-disc space-y-1">
                    {pertemuan.inti.mengaplikasi.kegiatan.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>

                {/* Merefleksi */}
                <div className="pl-4 mt-3">
                  <h5 className="font-semibold text-kemenag-green">
                    c. Merefleksi (Refleksi) (±{pertemuan.inti.merefleksi.durasiMenit}{" "}
                    menit)
                  </h5>
                  <ul className="pl-6 mt-1 list-disc space-y-1">
                    {pertemuan.inti.merefleksi.kegiatan.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 bg-kemenag-gold/10 p-3 rounded border-l-4 border-kemenag-gold">
                  <p className="font-semibold text-sm">
                    Penguatan Nilai KBC (Panca Cinta):
                  </p>
                  <p className="text-sm mt-1">{pertemuan.inti.penguatanKbc}</p>
                </div>
              </div>

              {/* Penutup */}
              <div>
                <h4 className="font-bold bg-slate-100 px-3 py-2 rounded">
                  3. PENUTUP (±{pertemuan.penutup.durasiMenit} menit)
                </h4>
                <ul className="pl-6 mt-2 list-disc space-y-1">
                  {pertemuan.penutup.kegiatan.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
                <div className="mt-3 bg-kemenag-gold/10 p-3 rounded border-l-4 border-kemenag-gold">
                  <p className="font-semibold text-sm">
                    Penguatan Nilai KBC (Panca Cinta):
                  </p>
                  <p className="text-sm mt-1">{pertemuan.penutup.penguatanKbc}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* E. Asesmen */}
      {rpp.asesmen && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-kemenag-green text-white px-4 py-2 rounded">
            E. ASESMEN
          </h2>

          <div className="space-y-4">
            {/* Diagnostik */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                1. Asesmen Awal (Diagnostik):
              </h3>
              <ul className="pl-4 list-disc list-inside">
                {rpp.asesmen.diagnostik.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Formatif */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                2. Asesmen Proses (Formatif):
              </h3>
              <div className="pl-4 space-y-2">
                <p>
                  <span className="font-semibold">Observasi:</span>{" "}
                  {rpp.asesmen.formatif.observasi}
                </p>
                <p>
                  <span className="font-semibold">Penilaian Unjuk Kerja:</span>{" "}
                  {rpp.asesmen.formatif.unjukKerja}
                </p>
                <p>
                  <span className="font-semibold">Penilaian Produk:</span>{" "}
                  {rpp.asesmen.formatif.penilaianProduk}
                </p>
              </div>
            </div>

            {/* Sumatif */}
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                3. Asesmen Akhir (Sumatif):
              </h3>
              <p className="pl-4">{rpp.asesmen.sumatif}</p>
            </div>
          </div>
        </section>
      )}

      {/* Tanda Tangan */}
      <section className="mb-8 print:break-before-page">
        <div className="flex justify-end mb-4">
          <p>
            {rpp.kota || ".................."}, {formatTanggalIndonesia()}
          </p>
        </div>

        <div className="flex justify-between mt-8">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-semibold">Kepala Madrasah</p>
            <div className="h-20"></div>
            <p className="font-semibold underline">
              {rpp.namaKepala || "................................"}
            </p>
            <p>NIP: {rpp.nipKepala || "................................"}</p>
          </div>

          <div className="text-center">
            <p>&nbsp;</p>
            <p className="font-semibold">Guru Kelas {rpp.kelas}</p>
            <div className="h-20"></div>
            <p className="font-semibold underline">{rpp.namaGuru}</p>
            <p>NIP: {rpp.nipGuru || "................................"}</p>
          </div>
        </div>
      </section>

      {/* Lampiran */}
      {rpp.lampiran && (
        <section className="print:break-before-page">
          <h2 className="text-lg font-bold mb-4 bg-kemenag-green text-white px-4 py-2 rounded">
            LAMPIRAN
          </h2>

          {/* Rubrik Holistik */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-3">
              1. Rubrik Penilaian {rpp.lampiran.rubrikHolistik.aspek} (Holistik)
            </h3>
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-3 py-2 text-left w-20">
                    Skor
                  </th>
                  <th className="border border-slate-300 px-3 py-2 text-left">
                    Kriteria
                  </th>
                </tr>
              </thead>
              <tbody>
                {rpp.lampiran.rubrikHolistik.kriteria.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 px-3 py-2 text-center font-bold">
                      {item.skor}
                    </td>
                    <td className="border border-slate-300 px-3 py-2">
                      {item.deskripsi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rubrik Analitik */}
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-3">2. Rubrik Penilaian (Analitik)</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-2 py-2">No</th>
                    <th className="border border-slate-300 px-2 py-2">Aspek Penilaian</th>
                    <th className="border border-slate-300 px-2 py-2">Skor 1</th>
                    <th className="border border-slate-300 px-2 py-2">Skor 2</th>
                    <th className="border border-slate-300 px-2 py-2">Skor 3</th>
                    <th className="border border-slate-300 px-2 py-2">Skor 4</th>
                  </tr>
                </thead>
                <tbody>
                  {rpp.lampiran.rubrikAnalitik.aspekPenilaian.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-slate-300 px-2 py-2 text-center">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 px-2 py-2">
                        <span className="font-semibold">{item.aspek}</span>
                        <br />
                        <span className="text-xs text-kemenag-green">({item.nilaiKbc})</span>
                      </td>
                      <td className="border border-slate-300 px-2 py-2">{item.skor1}</td>
                      <td className="border border-slate-300 px-2 py-2">{item.skor2}</td>
                      <td className="border border-slate-300 px-2 py-2">{item.skor3}</td>
                      <td className="border border-slate-300 px-2 py-2">{item.skor4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              <strong>Rumus Nilai Akhir:</strong> Nilai Akhir = (Total Skor / Skor Maksimal) x 100
            </p>
          </div>

          {/* LKPD */}
          <div className="mb-8 print:break-before-page">
            <h3 className="font-bold text-slate-900 mb-3">
              3. Lembar Kerja Peserta Didik (LKPD)
            </h3>
            <div className="border border-slate-300 rounded-lg p-4">
              <div className="text-center mb-4">
                <h4 className="font-bold text-lg">{rpp.lampiran.lkpd.judul}</h4>
                <p className="text-sm text-slate-600">Materi: {rpp.materiPokok}</p>
              </div>
              <div className="mb-4">
                <p>Nama Kelompok: ................................</p>
                <p>Anggota: 1. ............ 2. ............ 3. ............ 4. ............</p>
              </div>
              {rpp.lampiran.lkpd.bagian.map((bagian, idx) => (
                <div key={idx} className="mb-4">
                  <h5 className="font-semibold">
                    {bagian.judulBagian}{" "}
                    <span className="text-sm text-kemenag-green">({bagian.nilaiKbc})</span>
                  </h5>
                  <ul className="pl-4 mt-2 space-y-1">
                    {bagian.instruksi.map((instruksi, i) => (
                      <li key={i}>{instruksi}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Instrumen Asesmen */}
          <div className="print:break-before-page">
            <h3 className="font-bold text-slate-900 mb-3">
              4. Instrumen Asesmen (Pilihan Ganda)
            </h3>

            {/* Kisi-kisi */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">a. Kisi-kisi Soal</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 px-2 py-2">No</th>
                      <th className="border border-slate-300 px-2 py-2">Kompetensi Dasar</th>
                      <th className="border border-slate-300 px-2 py-2">Materi</th>
                      <th className="border border-slate-300 px-2 py-2">Indikator Soal</th>
                      <th className="border border-slate-300 px-2 py-2">No. Soal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rpp.lampiran.instrumenAsesmen.kisiKisi.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-300 px-2 py-2 text-center">
                          {idx + 1}
                        </td>
                        <td className="border border-slate-300 px-2 py-2">
                          {item.kompetensiDasar}
                        </td>
                        <td className="border border-slate-300 px-2 py-2">{item.materi}</td>
                        <td className="border border-slate-300 px-2 py-2">
                          {item.indikatorSoal}
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center">
                          PG / {item.nomorSoal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Naskah Soal */}
            <div>
              <h4 className="font-semibold mb-2">b. Naskah Soal Pilihan Ganda</h4>
              <p className="text-sm italic mb-3">Petunjuk: Pilihlah jawaban yang paling tepat!</p>
              <div className="space-y-4">
                {rpp.lampiran.instrumenAsesmen.soalPilgan.map((soal) => (
                  <div key={soal.nomor} className="border-b border-slate-200 pb-3">
                    <p className="font-medium">
                      {soal.nomor}. {soal.soal}{" "}
                      <span className="text-kemenag-green font-semibold">({soal.nilaiKbc})</span>
                    </p>
                    <div className="pl-4 mt-1 space-y-1 text-sm">
                      <p>a. {soal.opsiA}</p>
                      <p>b. {soal.opsiB}</p>
                      <p>c. {soal.opsiC}</p>
                      <p>d. {soal.opsiD}</p>
                    </div>
                    <p className="mt-1 text-sm">
                      <strong>Kunci Jawaban:</strong> {soal.kunciJawaban.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="border border-slate-300 px-3 py-2 font-semibold w-48">{label}</td>
      <td className="border border-slate-300 px-3 py-2">: {value}</td>
    </tr>
  );
}
