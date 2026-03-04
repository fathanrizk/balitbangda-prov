# Dokumentasi Set Up Backend (API)
Ini adalah panduan untuk mengenal kembali struktur Backend Anda yang di rancang dengan *ExpressJS*, *DrizzleORM*, *PostgreSQL*, dan *Better-Auth*, agar setiap komponen bersinergi ketika proses develop berlangsung.

## Stack dan Alat

*   **API Framework**: `ExpressJS` (dengan Typescript via `tsx`)
*   **Database**: PostgreSQL
*   **ORM**: `Drizzle ORM`
*   **Authentication**: `better-auth`
*   **Tipe Relasi Skema**: Di atur via module `drizzle-orm/pg-core`

---

## 0. Persiapan Environment & Instalasi

Sebelum mulai mengutak-atik backend, pastikan mesin / laptop Anda telah terpasang perangkat lunak pendukung sebagai berikut:

**1. Install Lingkungan JavaScript (Node.js)**
*   Pastikan Anda telah menginstal **Node.js** (Versi 20 LTS keatas sangat disarankan). Anda dapat mengunduhnya dari [nodejs.org](https://nodejs.org/).
*   Node.js secara otomatis membawa manajer paket NPM (`npm`) yang akan kita gunakan untuk menjalankan berbagai skrip dan menginstal dependensi.

**2. Install Database System (PostgreSQL)**
*   Unduh dan instal sistem basis data **PostgreSQL** melalui [postgresql.org/download/](https://www.postgresql.org/download/). Tersedia untuk Windows, Mac, maupun Linux.
*   Selama instalasi, Anda akan diminta memasukkan **Password** untuk _super user_ bernama `postgres`. **Ingat baik-baik password ini** karena ini adalah akses utama ke Database Anda.
*   Disarankan juga menginstal **pgAdmin 4** (biasanya disertakan dalam paket bundle PostgreSQL) sebagai aplikasi pembantu berbasis grafik (GUI) untuk mengelola Postgres Anda.

**3. Buat Database Kosong**
Setelah menginstal PostgreSQL:
1. Buka aplikasi **pgAdmin 4**. Anda akan diminta memasukkan Password utama Postgres yang telah diatur (pada langkah di atas).
2. Lihat bilah menu sebelah kiri. Klik panah pada _Servers_ > _PostgreSQL_.
3. Klik Kanan pada _Databases_ > _Create_ > _Database..._
4. Pada kolom Database Name, isi dengan nama proyek Anda, contoh: `balitbangda_db`. Lalu klik _Save_.
5. Pembuatan selesai, biarkan ia kosong karena tabel-tabel akan digenerate otomatis menggunakan Drizzle.

**4. Konfigurasi `DATABASE_URL` di Aplikasi**
1. Masuk ke folder Backend API (yakni terminal berada di dalam direktori `apps/api/`).
2. Duplikat file `.env.example` dan ubah namanya menjadi **`.env`**.
3. Cari properti koneksi ini:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/namadatabase
   ```
4. Ubah menjadi kredensial Anda yang sebenarnya. Misalnya Anda menggunakan user Postgres default "postgres", password saat install "123456", dan membuat nama DB "balitbangda_db", maka isiannya menjadi:
   ```env
   DATABASE_URL=postgresql://postgres:123456@localhost:5432/balitbangda_db
   ```
5. Install *library/packages* pada backend dengan memastikan Anda sudah berada di folder `apps/api`:
   ```bash
   npm install
   ```

Setelah 4 langkah krusial di atas, Anda telah siap menjalankan instruksi teknis dan arsitektural proyek pada panduan di bawah ini!

---

## 1. Arsitektur Folder Backend (`apps/api`)

Project disusun menggunakan pendekatan arsitektur berlapis untuk pemisahan fokus kerja *(Separation of Concerns)*:

*   **`src/db/`** (Data Layer)
    *   `schema.ts`: Tempat mendefinisikan seluruh struktur tabel beserta kolom database secara TypeScript.
    *   `index.ts`: File di mana koneksi database diinisialisasi melalui `drizzle` client.
*   **`src/routes/`** (Presentation Layer)
    *   Memuat rute-rute HTTP (Contoh: `document.routes.ts`, `unitKerja.routes.ts`) yang menggunakan router `express`. *Route* hanya berfungsi mendefinisikan endpoints URL dan memanggil file `services`.
*   **`src/services/`** (Business Logic Layer)
    *   Setiap operasi ke database dijalankan secara spesifik di sini (Akan memanggil `src/db/`).
*   **`src/auth/`**
    *   `index.ts`: Tempat di mana Better-Auth terkonfigurasi. Database auth ini *ter-adapter* pada Drizzle via skema auth default.
*   **`src/middleware/`**
    *   Memuat segala pelapis proteksi di level *router* (Misal autentikasi token sebelum mengambil route admin).
*   **`src/index.ts`**
    *   Aplikasi *Express* terinstansiasi di sini; Tempat semua rute-rute bergabung dengan *middleware* dan mendengarkan (listen) port.

---

## 2. Mengenal Drizzle ORM

Drizzle berbeda dengan Prisma yang mana *Drizzle* tidak menggunakan file *.drizzle* khusus, melainkan semua skema diekspor di `schema.ts`.

### a) Konfigurasi Database
File root `drizzle.config.ts` membaca variabel `DATABASE_URL` dari `.env` dan memerintahkan Drizzle ke mana output dan tipe dialect (postgres) yang dituju.

### b) Mendefinisikan Skema Baru
Jika Anda ingin mengubah atau membuat tabel, sunting di `src/db/schema.ts`. Contoh skema:
```typescript
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const contohTabel = pgTable("contoh_tabel", {
    id: uuid("id").defaultRandom().primaryKey(),
    nama: varchar("nama", { length: 50 }).notNull(),
});
```

---

## 3. Langkah Migrasi Database (Workflow)

Setiap merubah isi pada `schema.ts`, Anda harus memberitahu PostgreSQL mengenai perubahannya menggunakan tool **`drizzle-kit`**.

### a. Menyelaraskan (Push/Migrate)
Jika tahap Development (Pengembangan):
```bash
npm run db:push
```
Perintah ini akan menyamakan skema Postgres Anda dengan `.ts` Anda secara *Live.* 

**Atau**, menghasilkan file riwayat migrasi terlebih dahulu:
```bash
npm run db:generate
# lalu...
npm run db:migrate 
```

### b. Database Studio (Melihat Data)
Untuk melihat isian data melalui UI Web tanpa software DBeaver/PgAdmin, cukup jalankan:
```bash
npm run db:studio
```

---

## 4. Cara Menjalankan Backend-nya

Pastikan Anda mengubah `DATABASE_URL` pada file `.env` ke string koneksi PostgreSQL lokal/host Anda, lalu perhatikan cara menjalankannya:

**1. Mode Development (Restart Otomatis)**
```bash
npm run dev
```
Perintah ini menjalankan proses `tsx watch src/index.ts`. Apabila Anda mengubah sesuatu (termasuk routes, schema), API otomatis me-restart pada `PORT` 3001.

**2. Endpoint Uji Coba Health Check**
Jika sukses menyala:
[http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 5. Ringkasan Sinkronisasi

1. **Authentication**: *Better-Auth* menangkap Endpoint secara eksklusif ke `/api/auth/*`  dan meng-handle tabel session *Sendiri* dengan bantuan DrizzleAdapter.
2. **CORS**: Sudah diatur agar dapat berjalan pada domain vite `http://localhost:5173` dalam mode web / SPA development.
3. Selalu perhatikan bahwa Rute Express di `src/routes/` harus menggunakan skema database dari `db/schema.ts` yang disatukan menggunakan layer modul.
