# 🚀 Panduan Deploy ke Vercel

## Prasyarat

1. Akun [Vercel](https://vercel.com) (gratis)
2. Akun [GitHub](https://github.com) untuk push source code
3. Database PostgreSQL online (pilih salah satu):
   - **[Neon](https://neon.tech)** ← Rekomendasi (gratis, mudah)
   - **[Supabase](https://supabase.com)** (gratis)
   - **[Railway](https://railway.app)**
   - **[Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)**

---

## Langkah 1: Siapkan Database PostgreSQL

### Opsi A: Menggunakan Neon (Rekomendasi)

1. Buka [https://neon.tech](https://neon.tech) → **Sign Up** (gratis)
2. Klik **New Project** → beri nama (misal: `rpp-generator`)
3. Pilih region **Southeast Asia** (terdekat)
4. Setelah project dibuat, copy **Connection String**:
   ```
   postgresql://username:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Simpan connection string ini untuk langkah berikutnya

### Opsi B: Menggunakan Supabase

1. Buka [https://supabase.com](https://supabase.com) → **Start Project**
2. Buat project baru
3. Masuk ke **Settings → Database → Connection String → URI**
4. Copy connection string

---

## Langkah 2: Push Code ke GitHub

```bash
# Inisialisasi Git (jika belum)
git init

# Buat file .gitignore (pastikan .env tidak ikut ter-push!)
# File .gitignore sudah ada, pastikan berisi:
# node_modules
# .next
# .env
# .env.local

# Tambahkan semua file
git add .

# Commit
git commit -m "RPP Generator KBC - Initial Deploy"

# Buat repository di GitHub, lalu:
git remote add origin https://github.com/USERNAME/rpp-generator-kbc.git
git branch -M main
git push -u origin main
```

---

## Langkah 3: Deploy ke Vercel

1. Buka [https://vercel.com](https://vercel.com) → Login
2. Klik **"Add New..."** → **Project**
3. Pilih **Import Git Repository** → pilih repo `rpp-generator-kbc`
4. Pada halaman konfigurasi:

   **Framework Preset:** `Next.js` (otomatis terdeteksi)

   **Environment Variables** — Tambahkan variabel berikut:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgresql://username:password@host/database?sslmode=require` ← dari Langkah 1 |
   | `JWT_SECRET` | `masukkan-string-rahasia-anda-minimal-32-karakter` |

   > ⚠️ **PENTING:** Ganti `DATABASE_URL` dengan connection string dari Neon/Supabase Anda.
   > 
   > ⚠️ **PENTING:** `JWT_SECRET` harus string acak yang kuat. Contoh generate:
   > ```bash
   > openssl rand -base64 32
   > ```

5. Klik **Deploy**
6. Tunggu proses build selesai (~2-3 menit)

---

## Langkah 4: Buat Tabel Database

Setelah deploy berhasil, jalankan migrasi untuk membuat tabel di database:

### Cara 1: Via Terminal Lokal

```bash
# Set DATABASE_URL ke database online Anda
export DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Push schema ke database
npx drizzle-kit push
```

### Cara 2: Via SQL Manual di Neon/Supabase

Masuk ke dashboard Neon/Supabase → **SQL Editor** → jalankan SQL berikut:

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nama_guru VARCHAR(255) NOT NULL,
  nip VARCHAR(50),
  nama_madrasah VARCHAR(255),
  nama_kepala VARCHAR(255),
  nip_kepala VARCHAR(50),
  kota VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS rpp_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  nama_madrasah VARCHAR(255) NOT NULL,
  nama_guru VARCHAR(255) NOT NULL,
  nip_guru VARCHAR(50),
  nama_kepala VARCHAR(255),
  nip_kepala VARCHAR(50),
  mata_pelajaran VARCHAR(100) NOT NULL,
  jenjang VARCHAR(10) NOT NULL,
  kelas INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  materi_pokok TEXT NOT NULL,
  alokasi_waktu_jp INTEGER NOT NULL,
  menit_per_jp INTEGER NOT NULL DEFAULT 35,
  jumlah_pertemuan INTEGER NOT NULL DEFAULT 1,
  tahun_pelajaran VARCHAR(20) NOT NULL,
  kota VARCHAR(100),
  model_pembelajaran VARCHAR(255),
  nilai_panca_cinta JSONB NOT NULL,
  identifikasi_kbc JSONB,
  desain_pembelajaran JSONB,
  pengalaman_belajar JSONB,
  asesmen JSONB,
  lampiran JSONB,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

## Langkah 5: Verifikasi

1. Buka URL Vercel Anda: `https://rpp-generator-kbc.vercel.app`
2. Klik **"Daftar Gratis"** → buat akun
3. Login → Buat RPP Baru
4. Test semua fitur: Generate, Preview, Export PDF/DOCX

---

## 🔧 Troubleshooting

### Build Error: "DATABASE_URL is required"
→ Pastikan Environment Variable `DATABASE_URL` sudah ditambahkan di Vercel Settings

### Error koneksi database
→ Pastikan connection string benar dan database bisa diakses publik
→ Jika pakai Neon, pastikan ada `?sslmode=require` di akhir URL

### Halaman kosong setelah deploy
→ Pastikan tabel database sudah dibuat (Langkah 4)

### Redeploy setelah update code
```bash
git add .
git commit -m "Update fitur"
git push origin main
# Vercel akan otomatis redeploy
```

---

## 📋 Ringkasan Environment Variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL |
| `JWT_SECRET` | ✅ | Secret key untuk JWT authentication |

---

## 🌐 Custom Domain (Opsional)

1. Di Vercel Dashboard → Project → **Settings** → **Domains**
2. Tambahkan domain Anda (misal: `rpp.madrasah.sch.id`)
3. Ikuti instruksi DNS yang diberikan Vercel
