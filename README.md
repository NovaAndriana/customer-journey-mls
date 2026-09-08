# Customer Journey Management System — Motor Listrik

Sistem manajemen perjalanan customer (customer journey) untuk perusahaan penjualan motor listrik. Membantu salesperson memantau customer dari kontak pertama hingga closing (Deal) atau gugur (Reject), lengkap dengan riwayat interaksi, tracking unit motor, dan dashboard analytics.

**Dibuat oleh:** Nova Andriana
**Repository:** https://github.com/NovaAndriana/customer-journey-mls

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui (Base UI), TanStack Query, Recharts |
| Backend | NestJS 12, TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma 6.19.0 |
| Infrastruktur Lokal | Docker Compose |
| Monorepo | pnpm workspaces |

---

## Prasyarat

Pastikan sudah terinstall di komputer kamu:

- **Node.js** ≥ 20
- **pnpm** ≥ 10 (`npm install -g pnpm` jika belum ada)
- **Docker Desktop** (untuk menjalankan PostgreSQL)

---

## Cara Menjalankan (Setup < 5 Menit)

### 1. Clone Repository

```bash
git clone https://github.com/NovaAndriana/customer-journey-mls.git
cd customer-journey-mls
```

### 2. Install Semua Dependency

```bash
pnpm install
```

### 3. Siapkan Environment Variable

Backend:
```bash
cp apps/api/.env.example apps/api/.env
```

Frontend:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

> Nilai default di file `.env.example` sudah dikonfigurasi untuk berjalan langsung dengan Docker Compose di bawah — tidak perlu diubah untuk menjalankan secara lokal.

### 4. Jalankan PostgreSQL via Docker

```bash
pnpm db:up
```

Cek statusnya sudah `healthy` sebelum lanjut:
```bash
docker compose ps
```

> **Jika port 5432 di komputer kamu sudah dipakai** (misal ada PostgreSQL lain terinstall), lihat bagian [Troubleshooting](#troubleshooting) di bawah untuk mengganti port.

### 5. Migrate & Seed Database

```bash
pnpm db:migrate
pnpm db:seed
```

Perintah ini akan membuat seluruh struktur tabel dan mengisi data dummy realistis: 4 user (1 admin, 3 salesperson), 6 motor model, dan 20 customer dengan berbagai posisi di pipeline (termasuk beberapa yang sudah Deal dan Rejected), lengkap dengan riwayat interaksi dan histori perpindahan stage.

**Referensi data user seed** (password dummy untuk semua: `password123`):

| Nama | Email |
|---|---|
| Nova Andriana | nova.andriana@cjms.id |
| Siti Nurhaliza | siti.nurhaliza@cjms.id |
| Andi Wijaya | andi.wijaya@cjms.id |
| Rina Marlina | rina.marlina@cjms.id |

> Catatan: sistem ini fokus pada business logic customer journey (bukan modul auth), sehingga tidak ada halaman login. Aksi-aksi di UI (misalnya "dicatat oleh") menggunakan salesperson yang dipilih langsung dari dropdown yang datanya bersumber dari tabel `User` di atas.

### 6. Jalankan Aplikasi

Dari root project, backend dan frontend bisa dijalankan bersamaan dalam satu perintah:

```bash
pnpm dev
```

Atau, jika ingin melihat log masing-masing secara terpisah, jalankan di dua terminal berbeda:

**Terminal 1:**
```bash
pnpm dev:api
```

**Terminal 2:**
```bash
pnpm dev:web
```

### 7. Akses Aplikasi

| Layanan | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api/v1 |
| Prisma Studio (opsional, GUI database) | `pnpm db:studio` |

---

## Fitur Utama

### Pipeline Kanban (Halaman `/`)
- Board 6 kolom: New → Contacted → Followed Up → Presented → Deal, plus Rejected
- Pindah stage langsung dari dropdown aksi pada tiap card, dengan validasi transisi (tidak bisa lompat sembarang stage)
- Log interaksi dan tutup deal langsung dari card
- Tambah customer baru dari tombol di header

### Manajemen Customer (Halaman `/customers`)
- Tabel dengan filter (stage, sumber, salesperson) dan pencarian (nama/HP/email)
- Pagination
- Detail customer (`/customers/:id`) menampilkan riwayat interaksi lengkap (timeline) dan riwayat perpindahan stage (audit trail)

### Business Logic Inti
- **Validasi transisi stage**: tidak bisa memindahkan customer ke stage yang tidak valid dari posisinya saat ini (contoh: dari `NEW` tidak bisa langsung ke `DEAL`)
- **Closing deal sebagai transaksi atomik**: saat deal ditutup, sistem otomatis mengurangi stok motor, mengubah stage customer ke `DEAL`, mencatat histori stage, dan membuat record deal — semuanya dalam satu database transaction (kalau salah satu langkah gagal, semuanya dibatalkan)
- **Reminder follow-up**: interaksi bisa dijadwalkan dengan tanggal follow-up, dan sistem menyediakan endpoint untuk melihat follow-up yang jatuh tempo

### Motor Models (Halaman `/motor-models`)
- CRUD lengkap (create, read, update, delete) katalog unit motor listrik dan stoknya
- Badge warna stok (merah/kuning/hijau) sesuai ketersediaan
- Validasi: motor yang masih direferensikan oleh customer tidak bisa dihapus begitu saja (foreign key constraint)

### Analytics Dashboard (Halaman `/analytics`)
- Ringkasan: total customer, conversion rate, total revenue, unit terjual
- Grafik distribusi pipeline per stage
- Peringkat top salesperson berdasarkan jumlah deal

---

## Struktur Project

```
customer-journey-mls/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Skema database
│   │   │   └── seed.ts         # Seeder data dummy
│   │   └── src/
│   │       ├── common/         # DTO & helper bersama (pagination, dll)
│   │       ├── modules/        # Feature modules (users, customers, motor-models, interactions, analytics)
│   │       └── prisma/         # PrismaService (koneksi database)
│   └── web/                    # Frontend Next.js
│       └── src/
│           ├── app/            # Routing (App Router)
│           ├── components/     # Komponen UI per fitur
│           ├── hooks/          # React Query hooks
│           ├── lib/            # API client, formatter, config
│           └── types/          # TypeScript types (kontrak dengan backend)
├── docs/
│   └── ERD.md                  # Entity Relationship Diagram (Mermaid)
├── docker-compose.yml          # PostgreSQL container
└── package.json                # Root workspace scripts
```

---

## Entity Relationship Diagram

Lihat [`docs/ERD.md`](./docs/ERD.md) untuk diagram lengkap (Mermaid, otomatis ter-render di GitHub).

**Ringkasan entitas:**
- **User** — salesperson/admin yang mengelola customer
- **MotorModel** — katalog unit motor listrik beserta stok
- **Customer** — data customer, termasuk stage terkini di pipeline
- **Interaction** — log setiap kontak/aktivitas dengan customer (call, WA, presentasi, dll)
- **StageHistory** — audit trail perpindahan stage customer
- **Deal** — record transaksi saat customer closing

---

## API Endpoints (Ringkasan)

Base URL: `http://localhost:4000/api/v1`

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/users` | Daftar user/salesperson |
| GET/POST/PATCH/DELETE | `/motor-models` | CRUD motor model |
| GET/POST/PATCH/DELETE | `/customers` | CRUD customer (dengan filter & pagination) |
| PATCH | `/customers/:id/stage` | Pindah stage customer (dengan validasi transisi) |
| POST | `/customers/:id/deal` | Tutup deal (transaksi atomik: stage + stok + record deal) |
| GET/POST | `/customers/:id/interactions` | Riwayat & catat interaksi baru |
| GET | `/interactions/follow-ups` | Daftar follow-up yang jatuh tempo |
| GET | `/analytics/summary` | Ringkasan metrik (total customer, revenue, conversion rate, dll) |
| GET | `/analytics/pipeline` | Distribusi customer per stage |

Semua response mengikuti format wrapper standar:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": [...],
  "meta": { "total": 20, "page": 1, "limit": 10, "totalPages": 2 },
  "timestamp": "2026-09-08T...",
  "path": "/api/v1/customers"
}
```

Error response:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validasi input gagal",
  "errors": [{ "field": "phone", "constraints": ["phone should not be empty"] }],
  "timestamp": "2026-09-08T...",
  "path": "/api/v1/customers"
}
```

---

## Troubleshooting

### Port 5432 (PostgreSQL) sudah dipakai proses lain
Jika `docker compose up -d` gagal, atau backend gagal konek ke database dengan pesan error otentikasi, kemungkinan ada PostgreSQL lain di komputer kamu yang memakai port 5432. Solusi: ubah port mapping di `docker-compose.yml` bagian `ports` dari `"5432:5432"` menjadi `"5433:5432"`, lalu update `DATABASE_URL` di `apps/api/.env` menjadi `...@localhost:5433/...`.

### Port 4000 atau 3000 sudah dipakai (EADDRINUSE)
Kemungkinan ada proses Node.js lama yang masih berjalan di background. Matikan semua proses Node:
```bash
# Windows
taskkill /F /IM node.exe
# macOS/Linux
pkill -f node
```
Lalu jalankan ulang `pnpm dev`.

### Error otentikasi database setelah mengubah kredensial di `docker-compose.yml`
PostgreSQL hanya menerapkan `POSTGRES_USER`/`POSTGRES_PASSWORD` sekali saat volume data pertama kali dibuat. Jika kredensial pernah diubah setelah volume ada, reset total:
```bash
docker compose down -v
docker compose up -d
pnpm db:migrate
pnpm db:seed
```

---

## Scripts Referensi

Dijalankan dari root project:

| Command | Fungsi |
|---|---|
| `pnpm dev` | Jalankan backend + frontend bersamaan |
| `pnpm dev:api` | Jalankan backend saja |
| `pnpm dev:web` | Jalankan frontend saja |
| `pnpm build` | Build production kedua app |
| `pnpm db:up` / `pnpm db:down` | Nyalakan/matikan PostgreSQL |
| `pnpm db:migrate` | Jalankan migration Prisma |
| `pnpm db:seed` | Isi ulang data dummy |
| `pnpm db:studio` | Buka Prisma Studio (GUI database) |
