// Jenjang Pendidikan
export const JENJANG = ["MI", "MTs", "MA"] as const;
export type Jenjang = (typeof JENJANG)[number];

// Kelas per Jenjang
export const KELAS_PER_JENJANG: Record<Jenjang, number[]> = {
  MI: [1, 2, 3, 4, 5, 6],
  MTs: [7, 8, 9],
  MA: [10, 11, 12],
};

// Semester
export const SEMESTER = [
  { value: 1, label: "1 (Ganjil)" },
  { value: 2, label: "2 (Genap)" },
] as const;

// Tahun Pelajaran (generate dinamis)
export const generateTahunPelajaran = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = -1; i <= 2; i++) {
    years.push(`${currentYear + i}/${currentYear + i + 1}`);
  }
  return years;
};

// Mata Pelajaran per Jenjang
export const MATA_PELAJARAN: Record<Jenjang, string[]> = {
  MI: [
    "Al-Qur'an Hadis",
    "Akidah Akhlak",
    "Fikih",
    "Sejarah Kebudayaan Islam (SKI)",
    "Bahasa Arab",
    "Pendidikan Pancasila",
    "Bahasa Indonesia",
    "Matematika",
    "Ilmu Pengetahuan Alam (IPA)",
    "Ilmu Pengetahuan Sosial (IPS)",
    "Seni Budaya dan Prakarya (SBdP)",
    "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)",
    "Bahasa Inggris",
    "Muatan Lokal",
  ],
  MTs: [
    "Al-Qur'an Hadis",
    "Akidah Akhlak",
    "Fikih",
    "Sejarah Kebudayaan Islam (SKI)",
    "Bahasa Arab",
    "Pendidikan Pancasila",
    "Bahasa Indonesia",
    "Matematika",
    "Ilmu Pengetahuan Alam (IPA)",
    "Ilmu Pengetahuan Sosial (IPS)",
    "Bahasa Inggris",
    "Seni Budaya",
    "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)",
    "Prakarya",
    "Informatika",
    "Muatan Lokal",
  ],
  MA: [
    "Al-Qur'an Hadis",
    "Akidah Akhlak",
    "Fikih",
    "Sejarah Kebudayaan Islam (SKI)",
    "Bahasa Arab",
    "Ilmu Kalam",
    "Ilmu Tafsir",
    "Ilmu Hadis",
    "Ushul Fikih",
    "Pendidikan Pancasila",
    "Bahasa Indonesia",
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Sejarah",
    "Geografi",
    "Ekonomi",
    "Sosiologi",
    "Bahasa Inggris",
    "Seni Budaya",
    "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)",
    "Prakarya dan Kewirausahaan",
    "Informatika",
    "Bahasa Jepang",
    "Bahasa Mandarin",
    "Muatan Lokal",
  ],
};

// Nilai Panca Cinta
export const NILAI_PANCA_CINTA = [
  {
    id: "cinta-allah",
    label: "Cinta Allah & Rasul",
    shortLabel: "Cinta Allah & Rasul",
  },
  {
    id: "cinta-ilmu",
    label: "Cinta Ilmu",
    shortLabel: "Cinta Ilmu",
  },
  {
    id: "cinta-lingkungan",
    label: "Cinta Lingkungan",
    shortLabel: "Cinta Lingkungan",
  },
  {
    id: "cinta-diri-sesama",
    label: "Cinta Diri & Sesama",
    shortLabel: "Cinta Diri & Sesama",
  },
  {
    id: "cinta-tanah-air",
    label: "Cinta Tanah Air",
    shortLabel: "Cinta Tanah Air",
  },
] as const;

export type NilaiPancaCinta = (typeof NILAI_PANCA_CINTA)[number]["id"];

// Dimensi Profil Lulusan
export const DIMENSI_PROFIL_LULUSAN = [
  { id: "keimanan", label: "Keimanan" },
  { id: "kewargaan", label: "Kewargaan" },
  { id: "penalaran-kritis", label: "Penalaran Kritis" },
  { id: "kreativitas", label: "Kreativitas" },
  { id: "kolaborasi", label: "Kolaborasi" },
  { id: "kemandirian", label: "Kemandirian" },
  { id: "kesehatan", label: "Kesehatan" },
  { id: "komunikasi", label: "Komunikasi" },
] as const;

// Model Pembelajaran
export const MODEL_PEMBELAJARAN_DEFAULT = "LOK-R (Literasi, Orientasi, Kolaborasi, Refleksi)";

export const MODEL_PEMBELAJARAN_OPTIONS = [
  {
    id: "lok-r",
    label: "LOK-R (Literasi, Orientasi, Kolaborasi, Refleksi)",
    sintaks: ["Literasi", "Orientasi", "Kolaborasi", "Refleksi"],
  },
  {
    id: "pjbl",
    label: "Project Based Learning (PjBL)",
    sintaks: ["Penentuan Pertanyaan Mendasar", "Mendesain Perencanaan Proyek", "Menyusun Jadwal", "Memonitor Peserta Didik", "Menguji Hasil", "Mengevaluasi Pengalaman"],
  },
  {
    id: "pbl",
    label: "Problem Based Learning (PBL)",
    sintaks: ["Orientasi Masalah", "Mengorganisasi Peserta Didik", "Membimbing Penyelidikan", "Mengembangkan dan Menyajikan Hasil", "Menganalisis dan Mengevaluasi"],
  },
  {
    id: "inquiry",
    label: "Inquiry Based Learning",
    sintaks: ["Orientasi", "Merumuskan Masalah", "Merumuskan Hipotesis", "Mengumpulkan Data", "Menguji Hipotesis", "Merumuskan Kesimpulan"],
  },
  {
    id: "discovery",
    label: "Discovery Learning",
    sintaks: ["Stimulasi", "Identifikasi Masalah", "Pengumpulan Data", "Pengolahan Data", "Pembuktian", "Generalisasi"],
  },
  {
    id: "cooperative",
    label: "Cooperative Learning",
    sintaks: ["Menyampaikan Tujuan & Motivasi", "Menyajikan Informasi", "Mengorganisasikan Kelompok", "Membimbing Kelompok Bekerja", "Evaluasi", "Memberikan Penghargaan"],
  },
  {
    id: "ctl",
    label: "Contextual Teaching and Learning (CTL)",
    sintaks: ["Konstruktivisme", "Inkuiri", "Bertanya", "Masyarakat Belajar", "Pemodelan", "Refleksi", "Penilaian Autentik"],
  },
  {
    id: "differentiated",
    label: "Differentiated Learning",
    sintaks: ["Asesmen Diagnostik", "Diferensiasi Konten", "Diferensiasi Proses", "Diferensiasi Produk", "Refleksi & Evaluasi"],
  },
  {
    id: "role-playing",
    label: "Role Playing (Bermain Peran)",
    sintaks: ["Pemanasan", "Memilih Pemain", "Menyiapkan Pengamat", "Memainkan Peran", "Diskusi & Evaluasi", "Memainkan Peran Ulang", "Berbagi Pengalaman & Generalisasi"],
  },
  {
    id: "stem",
    label: "STEM (Science, Technology, Engineering, Art, and Mathematics)",
    sintaks: ["Identifikasi Masalah", "Eksplorasi & Riset", "Merancang Solusi", "Membuat Prototipe", "Menguji & Evaluasi", "Presentasi & Refleksi"],
  },
  {
    id: "learning-cycle",
    label: "Learning Cycle (Siklus Belajar)",
    sintaks: ["Engagement (Keterlibatan)", "Exploration (Eksplorasi)", "Explanation (Penjelasan)", "Elaboration (Elaborasi)", "Evaluation (Evaluasi)"],
  },
] as const;

export type ModelPembelajaranId = (typeof MODEL_PEMBELAJARAN_OPTIONS)[number]["id"];

// Lintas Disiplin Ilmu yang umum
export const LINTAS_DISIPLIN_COMMON = [
  "Akidah Akhlak",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "IPA",
  "IPS",
  "Seni Budaya",
  "Bahasa Arab",
  "Al-Qur'an Hadis",
  "Fikih",
];

// Praktik Pedagogis
export const PRAKTIK_PEDAGOGIS_OPTIONS = [
  "Diskusi Kelompok",
  "Studi Kasus",
  "Simulasi/Peragaan",
  "Penulisan Kreatif",
  "Presentasi",
  "Proyek Kolaboratif",
  "Pembelajaran Berbasis Masalah",
  "Tanya Jawab Interaktif",
  "Role Playing",
  "Gallery Walk",
];

// Durasi default per bagian (dalam persentase)
export const DURASI_DEFAULT = {
  pendahuluan: 0.15, // 15% dari total waktu
  inti: 0.70, // 70% dari total waktu
  penutup: 0.15, // 15% dari total waktu
};

// Durasi Deep Learning dalam bagian Inti (dalam persentase dari waktu inti)
export const DURASI_DEEP_LEARNING = {
  memahami: 0.40, // 40% dari waktu inti
  mengaplikasi: 0.40, // 40% dari waktu inti
  merefleksi: 0.20, // 20% dari waktu inti
};

// Bulan dalam Bahasa Indonesia
export const BULAN_INDONESIA = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Helper function untuk format tanggal Indonesia
export const formatTanggalIndonesia = (date: Date = new Date()): string => {
  const day = date.getDate();
  const month = BULAN_INDONESIA[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Format semester untuk display
export const formatSemester = (kelas: number, semester: number): string => {
  return `${kelas} / ${semester} (${semester === 1 ? "Ganjil" : "Genap"})`;
};

// Format alokasi waktu
export const formatAlokasiWaktu = (
  jp: number,
  menitPerJp: number,
  pertemuan: number
): string => {
  return `${jp} x ${menitPerJp} Menit (${pertemuan} Pertemuan)`;
};
