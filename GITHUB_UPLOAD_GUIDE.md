# 📦 PANDUAN UPLOAD FILE KE GITHUB

## Struktur Folder Lengkap

Buat repository baru di GitHub, lalu upload semua file dengan struktur berikut:

```
rpp-generator-kbc/
│
│── .env.example
│── .gitignore
│── DEPLOY_VERCEL.md
│── drizzle.config.json
│── eslint.config.mjs
│── next-env.d.ts
│── next.config.ts
│── package.json
│── postcss.config.mjs
│── tsconfig.json
│── vercel.json
│
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── not-found.tsx
    │   ├── page.tsx
    │   │
    │   ├── (auth)/
    │   │   ├── layout.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── register/
    │   │       └── page.tsx
    │   │
    │   ├── (dashboard)/
    │   │   ├── layout.tsx
    │   │   ├── loading.tsx
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   ├── generate/
    │   │   │   └── page.tsx
    │   │   ├── history/
    │   │   │   └── page.tsx
    │   │   └── preview/
    │   │       └── [id]/
    │   │           └── page.tsx
    │   │
    │   └── api/
    │       ├── health/
    │       │   └── route.ts
    │       ├── auth/
    │       │   ├── login/
    │       │   │   └── route.ts
    │       │   ├── logout/
    │       │   │   └── route.ts
    │       │   ├── me/
    │       │   │   └── route.ts
    │       │   └── register/
    │       │       └── route.ts
    │       └── rpp/
    │           ├── route.ts
    │           ├── generate/
    │           │   └── route.ts
    │           ├── stats/
    │           │   └── route.ts
    │           └── [id]/
    │               └── route.ts
    │
    ├── components/
    │   ├── export/
    │   │   ├── ExportButtons.tsx
    │   │   └── PrintButton.tsx
    │   ├── forms/
    │   │   └── RPPForm.tsx
    │   ├── layout/
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   ├── preview/
    │   │   └── RPPPreview.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Checkbox.tsx
    │       ├── DeleteRppButton.tsx
    │       ├── Input.tsx
    │       ├── PageNav.tsx
    │       ├── Select.tsx
    │       ├── Textarea.tsx
    │       └── Toast.tsx
    │
    ├── db/
    │   ├── index.ts
    │   └── schema.ts
    │
    └── lib/
        ├── ai-service.ts
        ├── auth.ts
        ├── constants.ts
        └── rpp-format.ts
```

## ⛔ JANGAN UPLOAD

- `node_modules/` — akan diinstall otomatis
- `.next/` — hasil build otomatis
- `.env` — berisi secret, diset di Vercel
- `package-lock.json` — opsional (akan di-generate otomatis)

## 🚀 Cara Upload via Git Terminal

```bash
cd rpp-generator-kbc
git init
git add .
git commit -m "RPP Generator KBC - Kemenag RI"
git remote add origin https://github.com/USERNAME/rpp-generator-kbc.git
git branch -M main
git push -u origin main
```

## 🚀 Cara Upload via GitHub Web (Manual)

1. Buka github.com → New Repository → beri nama "rpp-generator-kbc"
2. Klik "uploading an existing file"
3. Upload semua file sesuai struktur di atas
4. Commit

## 🔧 Setelah Upload, Deploy di Vercel

1. Buka vercel.com → New Project → Import dari GitHub
2. Tambahkan Environment Variables:
   - DATABASE_URL = (connection string PostgreSQL Anda)
   - JWT_SECRET = (string acak min 32 karakter)
3. Deploy
4. Buat tabel database (lihat DEPLOY_VERCEL.md)
```
