import type {
  IdentifikasiKBC,
  DesainPembelajaran,
  PengalamanBelajar,
  Asesmen,
  Lampiran,
} from "@/db/schema";

interface GenerateRPPInput {
  mataPelajaran: string;
  jenjang: string;
  kelas: number;
  semester: number;
  materiPokok: string;
  nilaiPancaCinta: string[];
  dimensiProfilLulusan: string[];
  modelPembelajaran: string;
  modelPembelajaranId: string;
  sintaksModel: string[];
  alokasiWaktuJp: number;
  menitPerJp: number;
  jumlahPertemuan: number;
}

// Helper: deskripsi per dimensi profil lulusan
const DIMENSI_DESCRIPTIONS: Record<string, (materi: string) => string> = {
  Keimanan: (m) => `Peserta didik memperkuat keimanan dan ketakwaan kepada Allah SWT melalui pembelajaran ${m}, memahami bahwa segala ilmu bersumber dari Allah, dan mengamalkan nilai-nilai agama dalam kehidupan sehari-hari.`,
  Kewargaan: (m) => `Peserta didik mengembangkan sikap kewargaan yang baik melalui pembelajaran ${m}, menghargai keberagaman, mematuhi aturan, dan berkontribusi positif dalam lingkungan madrasah dan masyarakat.`,
  "Penalaran Kritis": (m) => `Peserta didik mengembangkan kemampuan penalaran kritis melalui analisis, evaluasi, dan pemecahan masalah terkait ${m}, serta mampu berpikir logis dan sistematis.`,
  Kreativitas: (m) => `Peserta didik mengembangkan kreativitas melalui kegiatan eksplorasi ide-ide baru terkait ${m}, merancang solusi inovatif, dan mengekspresikan pemahaman melalui berbagai bentuk karya.`,
  Kolaborasi: (m) => `Peserta didik mengembangkan kemampuan kolaborasi melalui kerja kelompok, diskusi bersama, peer teaching, dan proyek kolaboratif yang menuntut kerjasama tim terkait ${m}.`,
  Kemandirian: (m) => `Peserta didik mengembangkan kemandirian belajar melalui inisiatif mencari informasi, mengelola waktu, dan menyelesaikan tugas terkait ${m} secara mandiri dan bertanggung jawab.`,
  Kesehatan: (m) => `Peserta didik mengembangkan kesadaran tentang kesehatan jasmani dan rohani, menjaga kebersihan lingkungan belajar, dan menerapkan pola hidup sehat dalam konteks pembelajaran ${m}.`,
  Komunikasi: (m) => `Peserta didik mengembangkan kemampuan komunikasi melalui presentasi hasil kerja, menyampaikan pendapat dalam diskusi, menulis laporan, dan mengkomunikasikan ide-ide terkait ${m} secara efektif.`,
};

function getDimensiDescription(defaultDimensi: string, input: GenerateRPPInput): string {
  // Jika user memilih dimensi ini, gunakan deskripsi khusus
  const dimensiList = input.dimensiProfilLulusan;
  if (dimensiList.length > 0) {
    // Cek apakah defaultDimensi ada di pilihan user
    if (dimensiList.includes(defaultDimensi)) {
      return (DIMENSI_DESCRIPTIONS[defaultDimensi] || DIMENSI_DESCRIPTIONS["Kreativitas"])(input.materiPokok);
    }
    // Jika tidak, ambil dari pilihan user yang belum dipakai
    const fn = DIMENSI_DESCRIPTIONS[defaultDimensi];
    if (fn) return fn(input.materiPokok);
  }
  // Fallback
  const fn = DIMENSI_DESCRIPTIONS[defaultDimensi];
  return fn ? fn(input.materiPokok) : `Peserta didik mengembangkan kompetensi ${defaultDimensi} melalui berbagai kegiatan pembelajaran terkait ${input.materiPokok}.`;
}

// Generate Identifikasi & KBC (Template-based)
export async function generateIdentifikasiKBC(
  input: GenerateRPPInput
): Promise<IdentifikasiKBC> {
  const levelBahasa = input.jenjang === "MI" ? "sederhana" : input.jenjang === "MTs" ? "menengah" : "akademis";
  
  return {
    kesiapanMurid: {
      pengetahuanAwal: `Peserta didik kelas ${input.kelas} ${input.jenjang} telah memiliki pengetahuan dasar tentang konsep-konsep yang berkaitan dengan ${input.materiPokok}. Mereka sudah mampu memahami materi prasyarat dari pembelajaran sebelumnya dan siap untuk mengembangkan pemahaman yang lebih mendalam tentang topik ini.`,
      gayaBelajar: `Pembelajaran dirancang untuk mengakomodasi berbagai gaya belajar: (1) Visual - melalui penggunaan media gambar, diagram, dan video pembelajaran; (2) Auditori - melalui penjelasan guru, diskusi kelompok, dan presentasi; (3) Kinestetik - melalui aktivitas praktik langsung, simulasi, dan proyek kolaboratif.`,
      minat: `Materi ${input.materiPokok} dikaitkan dengan kehidupan sehari-hari peserta didik dan konteks lingkungan madrasah. Pembelajaran disajikan dengan pendekatan yang menarik dan relevan dengan minat siswa ${input.jenjang} untuk meningkatkan motivasi belajar.`,
    },
    dimensiProfilLulusan: {
      kreativitas: getDimensiDescription(input.dimensiProfilLulusan[0] || "Kreativitas", input),
      kolaborasi: getDimensiDescription(input.dimensiProfilLulusan[1] || "Kolaborasi", input),
      komunikasi: getDimensiDescription(input.dimensiProfilLulusan[2] || "Komunikasi", input),
    },
    topikKbc: input.nilaiPancaCinta.slice(0, 3),
    materiInsersiKbc: `Pembelajaran ${input.materiPokok} diintegrasikan dengan nilai-nilai Panca Cinta sebagai fondasi karakter peserta didik. Nilai ${input.nilaiPancaCinta[0]} ditanamkan melalui pembiasaan berdoa sebelum dan sesudah pembelajaran serta mengaitkan materi dengan kebesaran Allah SWT. Nilai ${input.nilaiPancaCinta[1] || input.nilaiPancaCinta[0]} dikembangkan melalui semangat mencari ilmu dan rasa ingin tahu yang tinggi. Nilai ${input.nilaiPancaCinta[2] || input.nilaiPancaCinta[0]} diwujudkan melalui sikap saling menghargai, kerjasama, dan kepedulian terhadap sesama dalam proses pembelajaran. Integrasi nilai-nilai ini bertujuan membentuk peserta didik yang berakhlak mulia, bertanggung jawab, dan memiliki kesadaran sosial yang tinggi sesuai dengan visi pendidikan madrasah.`,
  };
}

// Generate Desain Pembelajaran (Template-based)
export async function generateDesainPembelajaran(
  input: GenerateRPPInput
): Promise<DesainPembelajaran> {
  const lintasDisiplin = getLintasDisiplin(input.mataPelajaran, input.materiPokok);
  
  return {
    capaianPembelajaran: `Pada akhir fase pembelajaran ini, peserta didik mampu memahami, menganalisis, dan mengaplikasikan konsep ${input.materiPokok} dalam konteks kehidupan sehari-hari. Peserta didik dapat mendemonstrasikan pemahaman melalui berbagai bentuk asesmen dan mampu mengaitkan pembelajaran dengan nilai-nilai keislaman serta karakter Panca Cinta. Capaian pembelajaran ini selaras dengan Kurikulum Merdeka dan KMA yang berlaku di lingkungan Kementerian Agama.`,
    lintasDisiplinIlmu: lintasDisiplin,
    tujuanPembelajaran: `Melalui model pembelajaran LOK-R (Literasi, Orientasi, Kolaborasi, Refleksi), peserta didik mampu: (1) Memahami konsep dasar ${input.materiPokok} dengan baik sebagai wujud ${input.nilaiPancaCinta[1] || "Cinta Ilmu"}; (2) Menganalisis dan mengaplikasikan konsep dalam pemecahan masalah sebagai bentuk ${input.nilaiPancaCinta[0]}; (3) Berkolaborasi dengan teman dalam kegiatan kelompok sebagai implementasi ${input.nilaiPancaCinta[2] || "Cinta Diri & Sesama"}; (4) Merefleksikan hasil pembelajaran dan mengaitkannya dengan kehidupan sehari-hari. Pembelajaran ini juga menanamkan sikap bertanggung jawab, jujur, dan peduli terhadap sesama.`,
    praktikPedagogis: [
      {
        metode: "Diskusi Kelompok",
        deskripsi: `Peserta didik berdiskusi dalam kelompok kecil (3-4 orang) untuk mengeksplorasi konsep ${input.materiPokok} dan berbagi pemahaman dengan teman sebaya.`,
      },
      {
        metode: "Studi Kasus",
        deskripsi: `Peserta didik menganalisis kasus/permasalahan nyata yang berkaitan dengan ${input.materiPokok} untuk mengembangkan kemampuan berpikir kritis.`,
      },
      {
        metode: "Presentasi",
        deskripsi: `Setiap kelompok mempresentasikan hasil diskusi dan proyek mereka di depan kelas untuk melatih kemampuan komunikasi.`,
      },
      {
        metode: "Penugasan Proyek",
        deskripsi: `Peserta didik mengerjakan proyek kolaboratif yang mengaplikasikan konsep ${input.materiPokok} dalam konteks nyata.`,
      },
    ],
    kemitraanPembelajaran: [
      "Peer teaching dan kerja kelompok antar peserta didik",
      "Guru sebagai fasilitator dan mentor pembelajaran",
      "Kolaborasi dengan orang tua dalam pendampingan belajar di rumah",
      "Pelibatan narasumber dari lingkungan madrasah jika diperlukan",
    ],
    lingkunganPembelajaran: [
      "Ruang kelas yang kondusif dengan pengaturan tempat duduk fleksibel",
      "Perpustakaan madrasah sebagai sumber referensi tambahan",
      "Lingkungan madrasah untuk kegiatan observasi dan praktik",
      "Media pembelajaran visual (poster, chart, gambar)",
      "Alat tulis dan bahan untuk kegiatan praktik",
    ],
    pemanfaatanDigital: [
      "Video pembelajaran dari platform edukasi (YouTube Edu, Rumah Belajar)",
      "Presentasi PowerPoint/Google Slides untuk visualisasi materi",
      "Aplikasi kuis interaktif (Kahoot, Quizizz) untuk evaluasi",
      "WhatsApp Group untuk koordinasi dan berbagi materi",
      "Google Classroom/LMS Madrasah untuk penugasan online",
    ],
  };
}

// Sintaks kegiatan inti per model pembelajaran
const MODEL_INTI_KEGIATAN: Record<string, (m: string, kbc: string[]) => { memahami: string[]; mengaplikasi: string[]; merefleksi: string[] }> = {
  "pjbl": (m, kbc) => ({
    memahami: [
      `[Penentuan Pertanyaan Mendasar] Guru menyajikan pertanyaan esensial: "Bagaimana kita dapat mengaplikasikan ${m} dalam kehidupan nyata?" (${kbc[1] || "Cinta Ilmu"})`,
      `[Mendesain Perencanaan Proyek] Peserta didik bersama guru merancang proyek terkait ${m}: menentukan produk, jadwal, dan pembagian tugas`,
    ],
    mengaplikasi: [
      `[Menyusun Jadwal] Setiap kelompok menyusun timeline pengerjaan proyek ${m}`,
      `[Memonitor Peserta Didik] Guru memantau proses pengerjaan proyek, memberikan bimbingan dan arahan`,
      `Peserta didik berkolaborasi mengerjakan proyek sesuai pembagian tugas (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Menguji Hasil] Setiap kelompok mempresentasikan dan mendemonstrasikan hasil proyek di depan kelas`,
    ],
    merefleksi: [
      `[Mengevaluasi Pengalaman] Peserta didik merefleksikan proses pengerjaan proyek: tantangan, solusi, dan pembelajaran`,
      `Guru dan peserta didik bersama-sama mengevaluasi kualitas proyek dan proses kerja kelompok`,
    ],
  }),
  "pbl": (m, kbc) => ({
    memahami: [
      `[Orientasi Masalah] Guru menyajikan permasalahan nyata terkait ${m} yang harus dipecahkan peserta didik (${kbc[1] || "Cinta Ilmu"})`,
      `[Mengorganisasi Peserta Didik] Guru membagi kelompok dan mengarahkan peserta didik untuk menganalisis masalah`,
    ],
    mengaplikasi: [
      `[Membimbing Penyelidikan] Peserta didik melakukan investigasi untuk mengumpulkan data dan informasi terkait masalah ${m}`,
      `Guru membimbing peserta didik dalam proses penyelidikan dan diskusi kelompok (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Mengembangkan dan Menyajikan Hasil] Setiap kelompok menyusun solusi dan mempresentasikan hasil pemecahan masalah`,
    ],
    merefleksi: [
      `[Menganalisis dan Mengevaluasi] Peserta didik bersama guru menganalisis proses pemecahan masalah dan mengevaluasi solusi yang diajukan`,
      `Refleksi tentang strategi yang efektif dan pelajaran yang didapat dari proses pemecahan masalah`,
    ],
  }),
  "inquiry": (m, kbc) => ({
    memahami: [
      `[Orientasi] Guru memperkenalkan topik ${m} dan membangkitkan rasa ingin tahu peserta didik (${kbc[1] || "Cinta Ilmu"})`,
      `[Merumuskan Masalah] Peserta didik mengidentifikasi dan merumuskan pertanyaan penelitian terkait ${m}`,
      `[Merumuskan Hipotesis] Peserta didik menyusun hipotesis/dugaan sementara berdasarkan pengetahuan awal`,
    ],
    mengaplikasi: [
      `[Mengumpulkan Data] Peserta didik melakukan pengamatan, eksperimen, atau studi literatur untuk mengumpulkan data (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Menguji Hipotesis] Peserta didik menganalisis data dan menguji hipotesis yang telah dirumuskan`,
      `Guru membimbing proses inkuiri dan memfasilitasi diskusi antar kelompok`,
    ],
    merefleksi: [
      `[Merumuskan Kesimpulan] Peserta didik menyusun kesimpulan berdasarkan hasil pengujian hipotesis`,
      `Presentasi hasil inkuiri dan diskusi kelas tentang temuan`,
    ],
  }),
  "discovery": (m, kbc) => ({
    memahami: [
      `[Stimulasi] Guru memberikan stimulus berupa gambar, video, atau cerita terkait ${m} untuk memancing rasa ingin tahu (${kbc[1] || "Cinta Ilmu"})`,
      `[Identifikasi Masalah] Peserta didik mengidentifikasi masalah atau pertanyaan dari stimulus yang diberikan`,
    ],
    mengaplikasi: [
      `[Pengumpulan Data] Peserta didik mengumpulkan informasi dari berbagai sumber terkait ${m}`,
      `[Pengolahan Data] Peserta didik mengolah dan menganalisis data yang diperoleh secara berkelompok (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Pembuktian] Peserta didik membuktikan temuan dengan membandingkan hasil analisis dengan teori/konsep`,
    ],
    merefleksi: [
      `[Generalisasi] Peserta didik menarik kesimpulan umum dan mempresentasikan hasil penemuan`,
      `Guru memberikan penguatan dan klarifikasi terhadap konsep yang ditemukan peserta didik`,
    ],
  }),
  "cooperative": (m, kbc) => ({
    memahami: [
      `[Menyampaikan Tujuan & Motivasi] Guru menyampaikan tujuan pembelajaran dan memotivasi peserta didik tentang pentingnya ${m} (${kbc[1] || "Cinta Ilmu"})`,
      `[Menyajikan Informasi] Guru menyajikan materi ${m} melalui demonstrasi atau bacaan`,
    ],
    mengaplikasi: [
      `[Mengorganisasikan Kelompok] Guru membentuk kelompok heterogen (3-4 orang) dan memberikan tugas kooperatif`,
      `[Membimbing Kelompok Bekerja] Peserta didik bekerja sama dalam kelompok, saling mengajarkan dan berdiskusi (${kbc[2] || "Cinta Diri & Sesama"})`,
      `Guru berkeliling membimbing dan memastikan setiap anggota kelompok berkontribusi aktif`,
      `[Evaluasi] Setiap kelompok mempresentasikan hasil kerja dan dilakukan evaluasi bersama`,
    ],
    merefleksi: [
      `[Memberikan Penghargaan] Guru memberikan penghargaan kepada kelompok terbaik dan individu yang aktif`,
      `Refleksi tentang proses kerjasama dan nilai-nilai yang dipelajari selama bekerja kelompok`,
    ],
  }),
  "ctl": (m, kbc) => ({
    memahami: [
      `[Konstruktivisme] Peserta didik membangun pemahaman sendiri tentang ${m} melalui pengalaman nyata (${kbc[1] || "Cinta Ilmu"})`,
      `[Inkuiri] Peserta didik menemukan sendiri konsep-konsep ${m} melalui proses bertanya dan menyelidiki`,
      `[Bertanya] Guru memfasilitasi proses bertanya untuk menggali pemahaman peserta didik`,
    ],
    mengaplikasi: [
      `[Masyarakat Belajar] Peserta didik belajar secara berkelompok, berbagi pengetahuan dan pengalaman (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Pemodelan] Guru atau peserta didik mendemonstrasikan contoh penerapan ${m} dalam kehidupan sehari-hari`,
    ],
    merefleksi: [
      `[Refleksi] Peserta didik merenungkan apa yang telah dipelajari dan bagaimana mengaitkannya dengan kehidupan nyata`,
      `[Penilaian Autentik] Guru melakukan penilaian proses melalui pengamatan, produk, dan refleksi peserta didik`,
    ],
  }),
  "differentiated": (m, kbc) => ({
    memahami: [
      `[Asesmen Diagnostik] Guru melakukan asesmen awal untuk mengetahui kesiapan belajar, minat, dan profil belajar peserta didik terkait ${m} (${kbc[1] || "Cinta Ilmu"})`,
      `[Diferensiasi Konten] Guru menyajikan materi ${m} dalam berbagai format sesuai kebutuhan peserta didik (teks, visual, audio)`,
    ],
    mengaplikasi: [
      `[Diferensiasi Proses] Peserta didik mengerjakan aktivitas yang disesuaikan dengan tingkat kemampuan masing-masing`,
      `Guru menyediakan scaffolding dan tantangan berbeda untuk setiap kelompok kemampuan (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Diferensiasi Produk] Peserta didik menunjukkan pemahaman melalui produk yang dipilih sendiri (poster, presentasi, tulisan, drama)`,
    ],
    merefleksi: [
      `[Refleksi & Evaluasi] Peserta didik merefleksikan proses belajar dan mengevaluasi produk yang dihasilkan`,
      `Guru memberikan umpan balik personal sesuai kebutuhan setiap peserta didik`,
    ],
  }),
  "role-playing": (m, kbc) => ({
    memahami: [
      `[Pemanasan] Guru memperkenalkan skenario bermain peran terkait ${m} dan menghangatkan suasana kelas (${kbc[1] || "Cinta Ilmu"})`,
      `[Memilih Pemain] Guru bersama peserta didik memilih pemeran dan membahas karakter yang akan dimainkan`,
      `[Menyiapkan Pengamat] Guru memberi panduan observasi kepada peserta didik yang menjadi pengamat`,
    ],
    mengaplikasi: [
      `[Memainkan Peran] Peserta didik memainkan peran sesuai skenario ${m} di depan kelas (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Diskusi & Evaluasi] Kelas mendiskusikan penampilan, pesan moral, dan kaitan dengan konsep ${m}`,
      `[Memainkan Peran Ulang] Kelompok lain memainkan peran dengan variasi/perbaikan berdasarkan diskusi`,
    ],
    merefleksi: [
      `[Berbagi Pengalaman & Generalisasi] Peserta didik berbagi pengalaman dari bermain peran dan menarik pelajaran umum`,
      `Guru membantu peserta didik menghubungkan pengalaman bermain peran dengan nilai-nilai kehidupan nyata`,
    ],
  }),
  "stem": (m, kbc) => ({
    memahami: [
      `[Identifikasi Masalah] Guru menyajikan masalah dunia nyata yang berkaitan dengan ${m} dan membutuhkan pendekatan STEAM (${kbc[1] || "Cinta Ilmu"})`,
      `[Eksplorasi & Riset] Peserta didik meneliti dan mengeksplorasi konsep sains, teknologi, teknik, seni, dan matematika yang terkait`,
    ],
    mengaplikasi: [
      `[Merancang Solusi] Peserta didik merancang solusi inovatif untuk masalah yang diberikan secara berkelompok (${kbc[2] || "Cinta Diri & Sesama"})`,
      `[Membuat Prototipe] Peserta didik membuat prototipe/model dari solusi yang dirancang`,
      `[Menguji & Evaluasi] Peserta didik menguji prototipe, mengumpulkan data, dan mengevaluasi efektivitas solusi`,
    ],
    merefleksi: [
      `[Presentasi & Refleksi] Setiap kelompok mempresentasikan prototipe dan temuan, lalu merefleksikan proses desain`,
      `Guru dan peserta didik bersama-sama mengevaluasi solusi dan mendiskusikan perbaikan`,
    ],
  }),
  "learning-cycle": (m, kbc) => ({
    memahami: [
      `[Engagement] Guru membangkitkan minat dan rasa ingin tahu peserta didik tentang ${m} melalui demonstrasi atau pertanyaan provokatif (${kbc[1] || "Cinta Ilmu"})`,
      `[Exploration] Peserta didik melakukan eksplorasi mandiri dan berkelompok untuk menggali konsep ${m}`,
    ],
    mengaplikasi: [
      `[Explanation] Peserta didik menjelaskan pemahaman mereka dan guru memberikan klarifikasi konsep ${m}`,
      `[Elaboration] Peserta didik mengaplikasikan konsep ke dalam situasi baru dan konteks yang lebih luas (${kbc[2] || "Cinta Diri & Sesama"})`,
      `Guru memberikan tantangan tambahan untuk memperdalam pemahaman`,
    ],
    merefleksi: [
      `[Evaluation] Guru dan peserta didik mengevaluasi pemahaman melalui kuis, presentasi, atau penilaian produk`,
      `Refleksi tentang proses belajar dan rencana tindak lanjut`,
    ],
  }),
};

// Generate Pengalaman Belajar (Template-based, adaptif terhadap model)
export async function generatePengalamanBelajar(
  input: GenerateRPPInput
): Promise<PengalamanBelajar[]> {
  const totalMenit = input.alokasiWaktuJp * input.menitPerJp;
  const menitPerPertemuan = Math.floor(totalMenit / input.jumlahPertemuan);
  
  const pendahuluanMenit = Math.round(menitPerPertemuan * 0.15);
  const intiMenit = Math.round(menitPerPertemuan * 0.70);
  const penutupMenit = menitPerPertemuan - pendahuluanMenit - intiMenit;
  
  const memahamiMenit = Math.round(intiMenit * 0.35);
  const mengaplikasiMenit = Math.round(intiMenit * 0.45);
  const merefleksiMenit = intiMenit - memahamiMenit - mengaplikasiMenit;

  // Ambil kegiatan inti sesuai model, atau default LOK-R
  const modelId = input.modelPembelajaranId || "lok-r";
  const modelKbc = input.nilaiPancaCinta;
  const modelName = input.modelPembelajaran || "LOK-R (Literasi, Orientasi, Kolaborasi, Refleksi)";

  const getIntiKegiatan = MODEL_INTI_KEGIATAN[modelId];
  const intiKegiatan = getIntiKegiatan
    ? getIntiKegiatan(input.materiPokok, modelKbc)
    : {
        memahami: [
          `[Literasi & Orientasi] Guru menjelaskan konsep dasar ${input.materiPokok} menggunakan media pembelajaran yang menarik`,
          "Peserta didik mengamati dan menyimak penjelasan guru dengan seksama",
          `Guru menampilkan contoh-contoh konkret yang berkaitan dengan ${input.materiPokok}`,
          "Peserta didik mengidentifikasi unsur-unsur penting dari materi yang dipelajari",
          "Tanya jawab interaktif antara guru dan peserta didik untuk memastikan pemahaman",
        ],
        mengaplikasi: [
          `[Kolaborasi] Guru membagi peserta didik ke dalam kelompok kecil (3-4 orang)`,
          `Setiap kelompok mendiskusikan dan mengerjakan tugas terkait ${input.materiPokok}`,
          "Peserta didik berkolaborasi dengan menerapkan nilai kerjasama dan saling menghargai",
          "Guru berkeliling memantau dan memberikan bimbingan kepada setiap kelompok",
          "Setiap kelompok mempresentasikan hasil kerja mereka di depan kelas",
        ],
        merefleksi: [
          "[Refleksi] Setiap kelompok menyampaikan tantangan yang dihadapi selama mengerjakan tugas",
          "Peserta didik berbagi hal-hal menarik yang mereka pelajari hari ini",
          "Guru memberikan umpan balik konstruktif terhadap hasil kerja peserta didik",
          "Peserta didik merefleksikan apa yang sudah dipahami dan yang masih perlu dipelajari",
        ],
      };

  const pertemuan: PengalamanBelajar[] = [];
  
  for (let i = 1; i <= input.jumlahPertemuan; i++) {
    pertemuan.push({
      pertemuanKe: i,
      jumlahJp: Math.ceil(input.alokasiWaktuJp / input.jumlahPertemuan),
      totalMenit: menitPerPertemuan,
      pendahuluan: {
        durasiMenit: pendahuluanMenit,
        kegiatan: [
          `Guru membuka pembelajaran dengan salam dan mengajak peserta didik berdoa bersama (${input.nilaiPancaCinta[0]})`,
          "Guru mengecek kehadiran peserta didik dan menanyakan kabar",
          `Apersepsi: Guru mengajukan pertanyaan pemantik terkait ${input.materiPokok} untuk menggali pengetahuan awal peserta didik`,
          `Motivasi: Guru menjelaskan pentingnya mempelajari ${input.materiPokok} dan manfaatnya dalam kehidupan sehari-hari sebagai wujud ${input.nilaiPancaCinta[1] || "Cinta Ilmu"}`,
          `Guru menyampaikan tujuan pembelajaran dan model yang digunakan: ${modelName}`,
        ],
        penguatanKbc: `Pada bagian pendahuluan, guru menanamkan nilai ${input.nilaiPancaCinta[0]} melalui pembiasaan berdoa sebelum belajar. Guru juga menanamkan ${input.nilaiPancaCinta[1] || "Cinta Ilmu"} dengan memotivasi peserta didik untuk bersemangat dalam belajar dan ${input.nilaiPancaCinta[2] || "Cinta Diri & Sesama"} melalui sikap saling menghormati saat pembelajaran dimulai.`,
      },
      inti: {
        durasiMenit: intiMenit,
        memahami: {
          durasiMenit: memahamiMenit,
          kegiatan: intiKegiatan.memahami,
        },
        mengaplikasi: {
          durasiMenit: mengaplikasiMenit,
          kegiatan: intiKegiatan.mengaplikasi,
        },
        merefleksi: {
          durasiMenit: merefleksiMenit,
          kegiatan: intiKegiatan.merefleksi,
        },
        penguatanKbc: `Pada kegiatan inti dengan model ${modelName}, nilai ${input.nilaiPancaCinta[1] || "Cinta Ilmu"} ditanamkan melalui semangat peserta didik dalam memahami materi dan aktif bertanya. Nilai ${input.nilaiPancaCinta[2] || "Cinta Diri & Sesama"} dikembangkan melalui kerja kelompok yang mengutamakan kerjasama dan menghargai pendapat teman. Guru juga mengingatkan bahwa ilmu yang bermanfaat adalah wujud ${input.nilaiPancaCinta[0]}.`,
      },
      penutup: {
        durasiMenit: penutupMenit,
        kegiatan: [
          "Guru bersama peserta didik menyimpulkan materi pembelajaran hari ini",
          "Peserta didik menyampaikan refleksi tentang pembelajaran yang telah dilakukan",
          "Guru memberikan penguatan dan apresiasi atas partisipasi peserta didik",
          "Guru menyampaikan tugas/tindak lanjut untuk pertemuan berikutnya",
          "Guru menutup pembelajaran dengan doa dan salam",
        ],
        penguatanKbc: `Pada bagian penutup, guru memperkuat nilai ${input.nilaiPancaCinta[0]} dengan mengajak peserta didik bersyukur dan berdoa bersama. Nilai ${input.nilaiPancaCinta[1] || "Cinta Ilmu"} ditanamkan melalui motivasi untuk terus belajar. Nilai ${input.nilaiPancaCinta[2] || "Cinta Diri & Sesama"} diingatkan agar peserta didik mengamalkan ilmu untuk kebaikan diri sendiri dan orang lain.`,
      },
    });
  }

  return pertemuan;
}

// Generate Asesmen (Template-based)
export async function generateAsesmen(
  input: GenerateRPPInput
): Promise<Asesmen> {
  return {
    diagnostik: [
      `Apa yang kalian ketahui tentang ${input.materiPokok}?`,
      `Pernahkah kalian menemui hal yang berkaitan dengan ${input.materiPokok} dalam kehidupan sehari-hari?`,
      `Menurut kalian, mengapa kita perlu mempelajari ${input.materiPokok}?`,
      "Ceritakan pengalaman kalian yang berkaitan dengan topik ini!",
      "Apa harapan kalian setelah mempelajari materi ini?",
    ],
    formatif: {
      observasi: `Guru mengamati: (1) Keaktifan peserta didik dalam diskusi dan tanya jawab; (2) Kemampuan bekerjasama dalam kelompok; (3) Sikap menghargai pendapat teman; (4) Kedisiplinan dan tanggung jawab dalam mengerjakan tugas; (5) Pemahaman konsep yang ditunjukkan melalui respons lisan.`,
      unjukKerja: `Penilaian unjuk kerja meliputi: (1) Kemampuan mempresentasikan hasil kerja dengan jelas dan percaya diri; (2) Ketepatan dalam menjelaskan konsep ${input.materiPokok}; (3) Kemampuan menjawab pertanyaan dari teman dan guru; (4) Kreativitas dalam menyajikan hasil kerja.`,
      penilaianProduk: `Penilaian produk mencakup: (1) Kelengkapan dan kedalaman isi sesuai dengan konsep ${input.materiPokok}; (2) Kerapian dan estetika penyajian; (3) Orisinalitas dan kreativitas; (4) Ketepatan waktu pengumpulan.`,
    },
    sumatif: `Penilaian akhir dilakukan melalui: (1) Tes tertulis berupa soal pilihan ganda dan uraian untuk mengukur pemahaman konsep ${input.materiPokok}; (2) Penilaian proyek/produk akhir yang menunjukkan kemampuan aplikasi konsep; (3) Penilaian portofolio yang mencakup seluruh hasil kerja selama pembelajaran. Nilai akhir merupakan gabungan dari ketiga komponen dengan bobot yang proporsional.`,
  };
}

// Generate Lampiran (Template-based)
export async function generateLampiran(
  input: GenerateRPPInput
): Promise<Lampiran> {
  return {
    rubrikHolistik: {
      aspek: `Pemahaman ${input.materiPokok}`,
      kriteria: [
        {
          skor: 4,
          deskripsi: `Sangat Baik: Peserta didik menunjukkan pemahaman yang sangat mendalam tentang ${input.materiPokok}, mampu menjelaskan dengan detail, memberikan contoh yang tepat dan beragam, serta dapat mengaplikasikan dalam situasi baru dengan sangat baik.`,
        },
        {
          skor: 3,
          deskripsi: `Baik: Peserta didik menunjukkan pemahaman yang baik tentang ${input.materiPokok}, mampu menjelaskan konsep dengan benar, memberikan contoh yang tepat, dan dapat mengaplikasikan dalam situasi sederhana.`,
        },
        {
          skor: 2,
          deskripsi: `Cukup: Peserta didik menunjukkan pemahaman dasar tentang ${input.materiPokok}, mampu menjelaskan sebagian konsep, memberikan contoh dengan bantuan, dan memerlukan bimbingan dalam aplikasi.`,
        },
        {
          skor: 1,
          deskripsi: `Perlu Bimbingan: Peserta didik belum menunjukkan pemahaman tentang ${input.materiPokok}, kesulitan menjelaskan konsep, belum mampu memberikan contoh, dan memerlukan bimbingan intensif.`,
        },
      ],
    },
    rubrikAnalitik: {
      aspekPenilaian: [
        {
          aspek: "Pemahaman Konsep",
          nilaiKbc: input.nilaiPancaCinta[1] || "Cinta Ilmu",
          skor1: "Tidak memahami konsep dasar",
          skor2: "Memahami sebagian konsep dengan bantuan",
          skor3: "Memahami konsep dengan baik",
          skor4: "Memahami konsep secara mendalam dan dapat menjelaskan",
        },
        {
          aspek: "Kerjasama Kelompok",
          nilaiKbc: input.nilaiPancaCinta[2] || "Cinta Diri & Sesama",
          skor1: "Tidak berpartisipasi dalam kelompok",
          skor2: "Berpartisipasi pasif dalam kelompok",
          skor3: "Berpartisipasi aktif dan bekerjasama dengan baik",
          skor4: "Memimpin dan memfasilitasi kerjasama kelompok dengan sangat baik",
        },
        {
          aspek: "Kemampuan Presentasi",
          nilaiKbc: input.nilaiPancaCinta[1] || "Cinta Ilmu",
          skor1: "Tidak mampu mempresentasikan",
          skor2: "Mempresentasikan dengan bantuan",
          skor3: "Mempresentasikan dengan jelas dan percaya diri",
          skor4: "Mempresentasikan dengan sangat baik, menarik, dan interaktif",
        },
        {
          aspek: "Sikap dan Akhlak",
          nilaiKbc: input.nilaiPancaCinta[0],
          skor1: "Sikap kurang baik selama pembelajaran",
          skor2: "Sikap cukup baik dengan beberapa pengingatan",
          skor3: "Sikap baik dan sopan selama pembelajaran",
          skor4: "Sikap sangat baik, sopan, dan menjadi teladan",
        },
        {
          aspek: "Kreativitas",
          nilaiKbc: input.nilaiPancaCinta[1] || "Cinta Ilmu",
          skor1: "Tidak menunjukkan kreativitas",
          skor2: "Menunjukkan sedikit kreativitas dengan bantuan",
          skor3: "Menunjukkan kreativitas dalam mengerjakan tugas",
          skor4: "Sangat kreatif dan inovatif dalam setiap tugas",
        },
      ],
    },
    lkpd: {
      judul: `LKPD ${input.mataPelajaran.toUpperCase()} KELAS ${input.kelas}`,
      bagian: [
        {
          judulBagian: "A. Mengamati dan Memahami",
          nilaiKbc: `${input.nilaiPancaCinta[1] || "Cinta Ilmu"}`,
          instruksi: [
            `Bacalah materi tentang ${input.materiPokok} dengan seksama!`,
            "Tuliskan 3 hal penting yang kalian temukan dari materi tersebut:",
            "1. .............................................",
            "2. .............................................",
            "3. .............................................",
            "Diskusikan dengan teman sekelompokmu tentang hal-hal yang belum dipahami.",
          ],
        },
        {
          judulBagian: "B. Berdiskusi dan Berkolaborasi",
          nilaiKbc: `${input.nilaiPancaCinta[2] || "Cinta Diri & Sesama"}`,
          instruksi: [
            `Diskusikan pertanyaan berikut bersama kelompokmu tentang ${input.materiPokok}:`,
            "Pertanyaan 1: .............................................",
            "Jawaban: .............................................",
            ".............................................",
            "Pertanyaan 2: .............................................",
            "Jawaban: .............................................",
            ".............................................",
            "Ingat! Hargai pendapat setiap anggota kelompok dan bekerjasamalah dengan baik.",
          ],
        },
        {
          judulBagian: "C. Mengaplikasikan",
          nilaiKbc: `${input.nilaiPancaCinta[0]} & ${input.nilaiPancaCinta[1] || "Cinta Ilmu"}`,
          instruksi: [
            `Buatlah contoh penerapan ${input.materiPokok} dalam kehidupan sehari-hari:`,
            "Contoh 1: .............................................",
            "Penjelasan: .............................................",
            "Contoh 2: .............................................",
            "Penjelasan: .............................................",
            `Bagaimana ${input.materiPokok} dapat membantu kita menjadi pribadi yang lebih baik?`,
            "Jawaban: .............................................",
            ".............................................",
          ],
        },
        {
          judulBagian: "D. Refleksi",
          nilaiKbc: `${input.nilaiPancaCinta[0]}`,
          instruksi: [
            "Tuliskan refleksi pembelajaran hari ini:",
            "Apa yang sudah saya pahami? .............................................",
            "Apa yang masih perlu saya pelajari? .............................................",
            "Apa manfaat materi ini bagi kehidupan saya? .............................................",
            "Doa: Ya Allah, berkahilah ilmu yang telah kami pelajari dan jadikanlah ilmu ini bermanfaat. Aamiin.",
          ],
        },
      ],
    },
    instrumenAsesmen: {
      kisiKisi: [
        {
          kompetensiDasar: `Memahami konsep dasar ${input.materiPokok}`,
          materi: input.materiPokok,
          indikatorSoal: `Peserta didik dapat menjelaskan pengertian ${input.materiPokok}`,
          nomorSoal: 1,
        },
        {
          kompetensiDasar: `Mengidentifikasi unsur-unsur ${input.materiPokok}`,
          materi: input.materiPokok,
          indikatorSoal: `Peserta didik dapat menyebutkan unsur-unsur ${input.materiPokok}`,
          nomorSoal: 2,
        },
        {
          kompetensiDasar: `Menganalisis ${input.materiPokok}`,
          materi: input.materiPokok,
          indikatorSoal: `Peserta didik dapat menganalisis contoh ${input.materiPokok}`,
          nomorSoal: 3,
        },
        {
          kompetensiDasar: `Mengaplikasikan konsep ${input.materiPokok}`,
          materi: input.materiPokok,
          indikatorSoal: `Peserta didik dapat menerapkan ${input.materiPokok} dalam contoh`,
          nomorSoal: 4,
        },
        {
          kompetensiDasar: `Mengevaluasi ${input.materiPokok}`,
          materi: input.materiPokok,
          indikatorSoal: `Peserta didik dapat menilai penerapan ${input.materiPokok}`,
          nomorSoal: 5,
        },
      ],
      soalPilgan: [
        {
          nomor: 1,
          soal: `Apa yang dimaksud dengan ${input.materiPokok}? Sebagai seorang muslim yang ${input.nilaiPancaCinta[1] || "Cinta Ilmu"}, kita harus memahami konsep ini dengan baik.`,
          nilaiKbc: input.nilaiPancaCinta[1] || "Cinta Ilmu",
          opsiA: `Definisi pertama tentang ${input.materiPokok}`,
          opsiB: `Definisi kedua tentang ${input.materiPokok}`,
          opsiC: `Definisi ketiga tentang ${input.materiPokok}`,
          opsiD: `Definisi keempat tentang ${input.materiPokok}`,
          kunciJawaban: "a",
        },
        {
          nomor: 2,
          soal: `Berikut ini yang merupakan unsur-unsur ${input.materiPokok} adalah... Memahami unsur-unsur ini adalah wujud ${input.nilaiPancaCinta[1] || "Cinta Ilmu"} kita.`,
          nilaiKbc: input.nilaiPancaCinta[1] || "Cinta Ilmu",
          opsiA: "Unsur A, B, dan C",
          opsiB: "Unsur D, E, dan F",
          opsiC: "Unsur A, D, dan G",
          opsiD: "Unsur B, E, dan H",
          kunciJawaban: "a",
        },
        {
          nomor: 3,
          soal: `Perhatikan contoh berikut! Contoh tersebut menunjukkan penerapan ${input.materiPokok} yang baik karena... Sikap ini mencerminkan ${input.nilaiPancaCinta[2] || "Cinta Diri dan Sesama"}.`,
          nilaiKbc: input.nilaiPancaCinta[2] || "Cinta Diri dan Sesama",
          opsiA: "Alasan pertama yang tepat",
          opsiB: "Alasan kedua yang kurang tepat",
          opsiC: "Alasan ketiga yang salah",
          opsiD: "Alasan keempat yang tidak relevan",
          kunciJawaban: "a",
        },
        {
          nomor: 4,
          soal: `Dalam kehidupan sehari-hari, ${input.materiPokok} dapat diterapkan dengan cara... Penerapan ini adalah wujud ${input.nilaiPancaCinta[0]}.`,
          nilaiKbc: input.nilaiPancaCinta[0],
          opsiA: "Cara penerapan yang benar dan sesuai",
          opsiB: "Cara penerapan yang kurang sesuai",
          opsiC: "Cara penerapan yang salah",
          opsiD: "Cara penerapan yang tidak tepat",
          kunciJawaban: "a",
        },
        {
          nomor: 5,
          soal: `Hikmah mempelajari ${input.materiPokok} bagi seorang muslim adalah... Hal ini sesuai dengan nilai ${input.nilaiPancaCinta[0]} yang kita amalkan.`,
          nilaiKbc: input.nilaiPancaCinta[0],
          opsiA: "Hikmah pertama yang paling tepat",
          opsiB: "Hikmah kedua",
          opsiC: "Hikmah ketiga",
          opsiD: "Hikmah keempat",
          kunciJawaban: "a",
        },
      ],
    },
  };
}

// Generate complete RPP content
export async function generateCompleteRPP(input: GenerateRPPInput) {
  const [identifikasiKbc, desainPembelajaran, pengalamanBelajar, asesmen, lampiran] =
    await Promise.all([
      generateIdentifikasiKBC(input),
      generateDesainPembelajaran(input),
      generatePengalamanBelajar(input),
      generateAsesmen(input),
      generateLampiran(input),
    ]);

  return {
    identifikasiKbc,
    desainPembelajaran,
    pengalamanBelajar,
    asesmen,
    lampiran,
  };
}

// Helper function untuk lintas disiplin ilmu
function getLintasDisiplin(mataPelajaran: string, materiPokok: string) {
  const baseLintas = [
    {
      mapel: "Akidah Akhlak",
      deskripsi: `Pembelajaran ${materiPokok} dikaitkan dengan nilai-nilai akhlak mulia dan keyakinan kepada Allah SWT. Peserta didik diajak untuk menyadari bahwa segala ilmu berasal dari Allah dan harus diamalkan dengan akhlak yang baik.`,
    },
    {
      mapel: "Pendidikan Pancasila",
      deskripsi: `Materi ${materiPokok} diintegrasikan dengan nilai-nilai Pancasila, terutama dalam aspek gotong royong, keadilan, dan tanggung jawab sebagai warga negara yang baik.`,
    },
  ];

  // Tambahkan mapel lain berdasarkan mapel utama
  if (!mataPelajaran.includes("Bahasa Indonesia")) {
    baseLintas.push({
      mapel: "Bahasa Indonesia",
      deskripsi: `Kemampuan berbahasa Indonesia dikembangkan melalui kegiatan membaca, menulis, dan presentasi terkait ${materiPokok}. Peserta didik berlatih menyusun kalimat dan paragraf yang baik.`,
    });
  }

  if (!mataPelajaran.includes("Matematika") && !mataPelajaran.includes("Bahasa")) {
    baseLintas.push({
      mapel: "Matematika",
      deskripsi: `Konsep matematika seperti pengukuran, perhitungan, atau logika dapat diterapkan dalam memahami aspek-aspek kuantitatif dari ${materiPokok}.`,
    });
  }

  return baseLintas.slice(0, 3);
}
