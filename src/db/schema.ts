import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  integer,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";

// Users table for teacher authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  namaGuru: varchar("nama_guru", { length: 255 }).notNull(),
  nip: varchar("nip", { length: 50 }),
  namaMadrasah: varchar("nama_madrasah", { length: 255 }),
  namaKepala: varchar("nama_kepala", { length: 255 }),
  nipKepala: varchar("nip_kepala", { length: 50 }),
  kota: varchar("kota", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// RPP documents table
export const rppDocuments = pgTable("rpp_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Identitas Modul
  namaMadrasah: varchar("nama_madrasah", { length: 255 }).notNull(),
  namaGuru: varchar("nama_guru", { length: 255 }).notNull(),
  nipGuru: varchar("nip_guru", { length: 50 }),
  namaKepala: varchar("nama_kepala", { length: 255 }),
  nipKepala: varchar("nip_kepala", { length: 50 }),
  mataPelajaran: varchar("mata_pelajaran", { length: 100 }).notNull(),
  jenjang: varchar("jenjang", { length: 10 }).notNull(), // MI, MTs, MA
  kelas: integer("kelas").notNull(),
  semester: integer("semester").notNull(), // 1 or 2
  materiPokok: text("materi_pokok").notNull(),
  alokasiWaktuJp: integer("alokasi_waktu_jp").notNull(),
  menitPerJp: integer("menit_per_jp").notNull().default(35),
  jumlahPertemuan: integer("jumlah_pertemuan").notNull().default(1),
  tahunPelajaran: varchar("tahun_pelajaran", { length: 20 }).notNull(),
  kota: varchar("kota", { length: 100 }),
  modelPembelajaran: varchar("model_pembelajaran", { length: 255 }),
  
  // Nilai Panca Cinta yang dipilih
  nilaiPancaCinta: jsonb("nilai_panca_cinta").$type<string[]>().notNull(),
  
  // Generated content (stored as JSON)
  identifikasiKbc: jsonb("identifikasi_kbc").$type<IdentifikasiKBC>(),
  desainPembelajaran: jsonb("desain_pembelajaran").$type<DesainPembelajaran>(),
  pengalamanBelajar: jsonb("pengalaman_belajar").$type<PengalamanBelajar[]>(),
  asesmen: jsonb("asesmen").$type<Asesmen>(),
  lampiran: jsonb("lampiran").$type<Lampiran>(),
  
  // Metadata
  isComplete: boolean("is_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type definitions for JSONB fields
export interface IdentifikasiKBC {
  kesiapanMurid: {
    pengetahuanAwal: string;
    gayaBelajar: string;
    minat: string;
  };
  dimensiProfilLulusan: {
    kreativitas: string;
    kolaborasi: string;
    komunikasi: string;
  };
  topikKbc: string[];
  materiInsersiKbc: string;
}

export interface DesainPembelajaran {
  capaianPembelajaran: string;
  lintasDisiplinIlmu: Array<{
    mapel: string;
    deskripsi: string;
  }>;
  tujuanPembelajaran: string;
  praktikPedagogis: Array<{
    metode: string;
    deskripsi: string;
  }>;
  kemitraanPembelajaran: string[];
  lingkunganPembelajaran: string[];
  pemanfaatanDigital: string[];
}

export interface PengalamanBelajar {
  pertemuanKe: number;
  jumlahJp: number;
  totalMenit: number;
  pendahuluan: {
    durasiMenit: number;
    kegiatan: string[];
    penguatanKbc: string;
  };
  inti: {
    durasiMenit: number;
    memahami: {
      durasiMenit: number;
      kegiatan: string[];
    };
    mengaplikasi: {
      durasiMenit: number;
      kegiatan: string[];
    };
    merefleksi: {
      durasiMenit: number;
      kegiatan: string[];
    };
    penguatanKbc: string;
  };
  penutup: {
    durasiMenit: number;
    kegiatan: string[];
    penguatanKbc: string;
  };
}

export interface Asesmen {
  diagnostik: string[];
  formatif: {
    observasi: string;
    unjukKerja: string;
    penilaianProduk: string;
  };
  sumatif: string;
}

export interface Lampiran {
  rubrikHolistik: {
    aspek: string;
    kriteria: Array<{
      skor: number;
      deskripsi: string;
    }>;
  };
  rubrikAnalitik: {
    aspekPenilaian: Array<{
      aspek: string;
      nilaiKbc: string;
      skor1: string;
      skor2: string;
      skor3: string;
      skor4: string;
    }>;
  };
  lkpd: {
    judul: string;
    bagian: Array<{
      judulBagian: string;
      nilaiKbc: string;
      instruksi: string[];
    }>;
  };
  instrumenAsesmen: {
    kisiKisi: Array<{
      kompetensiDasar: string;
      materi: string;
      indikatorSoal: string;
      nomorSoal: number;
    }>;
    soalPilgan: Array<{
      nomor: number;
      soal: string;
      nilaiKbc: string;
      opsiA: string;
      opsiB: string;
      opsiC: string;
      opsiD: string;
      kunciJawaban: string;
    }>;
  };
}

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type RppDocument = typeof rppDocuments.$inferSelect;
export type NewRppDocument = typeof rppDocuments.$inferInsert;
