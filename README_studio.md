# 🎨 StarLive Talent, Upload, Display, Interactive Outlet

[![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?logo=githubpages&logoColor=white)](https://pages.github.com)

---

## Daftar Isi

- [Overview](#overview)
- [Features & Tech Stack](#features--tech-stack)
- [System Workflow](#system-workflow)
- [User Guide](#user-guide)
  - [Equipment](#equipment)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)
  - [Struktur File](#struktur-file)
  - [Security](#security)
  - [Limitations](#limitations)
  - [Future Development](#future-development)
- [Author](#author)

---

## Overview

**STUDIO** adalah website portfolio kreatif multimedia untuk seniman independen — menampilkan galeri karya, pemutar musik sungguhan, profil artis, dan sistem pesan langsung dalam satu platform, dengan dashboard admin penuh yang terintegrasi **Supabase**.

Cocok untuk ilustrator, musisi independen, atau siapa pun yang membutuhkan portfolio kreatif tanpa biaya hosting berbayar — seluruhnya berjalan di atas HTML, CSS, dan Vanilla JavaScript, dapat di-deploy gratis ke **GitHub Pages** tanpa proses build apapun.

> **📝 Notes**
> <!-- Tambahkan catatan tambahan, konteks proyek, atau informasi relevan lainnya di sini -->
> <!-- Contoh: link demo aktif, versi rilis, atau kondisi khusus yang perlu diketahui -->

---

## Features & Tech Stack

### Features

**Untuk Pengunjung**

| Fitur | Deskripsi |
|---|---|
| **Galeri karya** | Filter berdasarkan kategori (ilustrasi, musik, merchandise), lihat detail tiap karya |
| **Pemutar musik** | Playback sungguhan via HTML5 Audio dengan progress bar dan kontrol volume |
| **Profil artis** | Halaman detail tiap kreator dengan tautan sosial media |
| **Form kontak** | Kirim pesan langsung ke admin |
| **Notifikasi pengumuman** | Banner otomatis muncul saat admin mempublikasikan info baru |
| **Kustomisasi tampilan** | Ganti tema warna, musim (season), dan background |

**Untuk Admin**

| Fitur | Deskripsi |
|---|---|
| **Login aman** | Autentikasi dengan hash SHA-256 + rate limiting anti brute-force |
| **Dashboard analytics** | Jumlah pengunjung, unique IP, log aktivitas klik |
| **Kelola pesan** | Baca, tandai terbaca, balas langsung ke email pengirim |
| **Kelola galeri** | Tambah/hapus karya dengan upload gambar langsung |
| **Kelola musik** | Upload file audio (MP3/WAV/OGG/FLAC/AAC) ke tracklist |
| **Kelola pengumuman** | Publikasikan, aktifkan/nonaktifkan, riwayat lengkap |

### Tech Stack

| Komponen | Teknologi |
|---|---|
| Markup & Styling | HTML5, CSS3, Vanilla JavaScript ES6+ |
| Pemutar Musik | HTML5 Audio API |
| Animasi Latar | Canvas API |
| Database & REST API | Supabase (PostgreSQL) |
| Autentikasi | Web Crypto API (SHA-256) |
| Hosting | GitHub Pages (gratis) |
| Build | — (zero build step, zero dependencies) |

---

## System Workflow

### Flowchart

```
┌─────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Buka index.html    │     │  Inisialisasi        │     │  Cek Supabase        │
│  di browser         │────▶│  config.js →         │────▶│  credentials         │
│                     │     │  background.js →     │     │  di config.js        │
│                     │     │  app.js              │     │                      │
└─────────────────────┘     └──────────────────────┘     └──────────┬───────────┘
                                                                      │
                                                       ┌──────────────┴──────────────┐
                                                       ▼                             ▼
                                            ┌──────────────────┐     ┌──────────────────────┐
                                            │  Mode Demo       │     │  Mode Penuh          │
                                            │  (sessionStorage)│     │  (Supabase aktif)    │
                                            │  data hilang     │     │  data persisten      │
                                            │  saat tab tutup  │     │  lintas sesi         │
                                            └────────┬─────────┘     └──────────┬───────────┘
                                                     │                           │
┌─────────────────────┐     ┌────────────────────────▼───────────────────────────▼───────────┐
│  Admin Dashboard    │◀────│                   Render Halaman                               │
│  (login SHA-256)    │     │     Galeri · Musik · Profil · Kontak · Pengumuman              │
└─────────────────────┘     └────────────────────────────────────────────────────────────────┘
```

### Penjelasan

| Langkah | Proses | Keterangan |
|---|---|---|
| 1 | Buka `index.html` | Tidak perlu server — buka langsung atau via `http.server` |
| 2 | Inisialisasi script | Urutan wajib: `config.js` → `background.js` → `app.js` |
| 3 | Cek credentials | Jika `SUPA_URL` & `SUPA_KEY` terisi → mode penuh; jika kosong → mode demo |
| 4 | Render halaman | Galeri, musik, profil artis, form kontak, dan pengumuman dimuat |
| 5 | Admin login | SHA-256 hash dicocokkan dengan tabel `admins` di Supabase |

---

## User Guide

### Equipment

Pastikan hal berikut tersedia sebelum memulai:

- Browser modern: **Chrome 110+**, Firefox 110+, Edge 110+, atau Safari 16+
- Akun [Supabase](https://supabase.com) *(gratis — untuk penyimpanan permanen)*
- Akun [GitHub](https://github.com) *(gratis — untuk deployment ke GitHub Pages)*
- Tidak memerlukan Node.js, Python, atau dependensi eksternal apapun

---

### Installation

#### 1. Download Proyek

```bash
git clone https://github.com/username/studio.git
cd studio
```

Atau download ZIP dan ekstrak — pertahankan struktur folder `css/` dan `js/`.

#### 2. Jalankan Secara Lokal

**Langsung buka file:**
Klik dua kali `index.html` di file explorer.

**Via local server (direkomendasikan):**
```bash
cd studio
python3 -m http.server 8000
# Buka http://localhost:8000
```

> Tanpa konfigurasi Supabase, website berjalan dalam **mode demo** — data tersimpan sementara di `sessionStorage` dan hilang saat tab ditutup.

---

#### 3. Setup Supabase

**3.1 — Buat Project**

1. Daftar di [supabase.com](https://supabase.com) → **New Project**
2. Isi nama project, password database, pilih region terdekat
3. Tunggu ±2 menit hingga status **Active**

**3.2 — Ambil Credentials**

Buka **Project Settings → API**, catat:
- **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

> ⚠️ Hanya gunakan `anon` key — jangan pernah pasang `service_role` key di frontend.

**3.3 — Buat Tabel Database**

Di **SQL Editor**, jalankan:

```sql
-- Tabel pesan dari Contact form
create table if not exists messages (
  id            uuid primary key default gen_random_uuid(),
  sender_name   text not null,
  sender_email  text not null,
  subject       text not null,
  body          text not null,
  is_read       boolean default false,
  reply_body    text,
  replied_at    timestamptz,
  created_at    timestamptz default now()
);

-- Tabel galeri karya
create table if not exists gallery_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  artist        text not null,
  category      text,
  cat           text,
  emoji         text,
  bg_color      text,
  description   text,
  image_data    text,
  date_updated  timestamptz default now()
);

-- Tabel pengumuman
create table if not exists announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  message       text not null,
  active        boolean default false,
  published_at  timestamptz default now()
);

-- Tabel admin
create table if not exists admins (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  password_hash text not null
);
```

**3.4 — Generate Hash Password Admin**

Buka browser → `F12` → tab **Console** → jalankan:

```javascript
const pw = 'PASSWORD_PILIHANMU';
const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join(''));
```

Copy hasil hash (64 karakter), lalu jalankan di **SQL Editor**:

```sql
insert into admins (username, password_hash)
values ('admin', 'HASIL_HASH_64_KARAKTER_DI_SINI');
```

**3.5 — Aktifkan Row Level Security (RLS)**

```sql
alter table messages      enable row level security;
alter table gallery_items enable row level security;
alter table announcements enable row level security;
alter table admins        enable row level security;

create policy "Visitor kirim pesan"   on messages      for insert to anon with check (true);
create policy "Baca semua pesan"      on messages      for select to anon using (true);
create policy "Update pesan"          on messages      for update to anon using (true);

create policy "Lihat galeri"          on gallery_items for select to anon using (true);
create policy "Kelola galeri insert"  on gallery_items for insert to anon with check (true);
create policy "Kelola galeri delete"  on gallery_items for delete to anon using (true);

create policy "Baca pengumuman"       on announcements for select to anon using (true);
create policy "Kelola pengumuman ins" on announcements for insert to anon with check (true);
create policy "Kelola pengumuman upd" on announcements for update to anon using (true);
create policy "Kelola pengumuman del" on announcements for delete to anon using (true);

create policy "Cek login admin"       on admins        for select to anon using (true);
```

**3.6 — Pasang Credentials ke Kode**

Buka `js/config.js`, ganti:

```javascript
const SUPA_URL = 'YOUR_SUPABASE_URL';
const SUPA_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

**3.7 (Opsional) — Musik Permanen via Supabase Storage**

1. Supabase → **Storage** → **New Bucket** → nama `music`, set **Public**
2. Upload file MP3/WAV ke bucket → klik file → **Get URL** → copy Public URL
3. Gunakan URL tersebut saat menambah lagu di dashboard admin

---

#### 4. Deploy ke GitHub Pages

1. Buat repository **Public** di [github.com](https://github.com)
2. Upload seluruh folder (pertahankan struktur `css/` dan `js/`):

```bash
git init
git add .
git commit -m "Initial deploy"
git remote add origin https://github.com/USERNAME/studio.git
git push -u origin main
```

3. Buka **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main** → Folder: **/(root)**
4. Klik **Save**, tunggu 1–3 menit
5. Website live di: `https://USERNAME.github.io/studio/`

> File harus bernama tepat `index.html` (huruf kecil) agar GitHub Pages otomatis mengenalinya.

---

### Configuration

**Login Admin:**

| Field | Nilai |
|---|---|
| Username | Sesuai yang diisi di langkah 3.4 |
| Password | Password yang di-hash di langkah 3.4 |

**Mengelola Galeri:**
- Dashboard → tab **Gallery** → *Add Artwork* → isi judul, artis, kategori, upload gambar (maks 5 MB, format JPG/PNG/WebP/GIF)
- Hapus karya: klik tombol 🗑 pada kartu karya di dashboard

**Mengelola Musik:**
- Settings (⚙️) → tab **Music** → upload file audio (maks 50 MB, format MP3/WAV/OGG/FLAC/AAC)

**Membalas Pesan:**
- Dashboard → tab **Messages** → klik pesan → tulis balasan → klik **Kirim via Email**
- Browser membuka klien email default dengan balasan siap kirim

**Membuat Pengumuman:**
- Dashboard → tab **Announcement** → isi judul & pesan → **Publish**
- Banner otomatis muncul ke semua pengunjung baru

---

### Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Halaman blank setelah deploy | Nama file bukan `index.html` atau GitHub Pages belum aktif | Cek nama file, cek **Settings → Pages** |
| Login admin gagal | Hash password salah atau tabel `admins` kosong | Ulangi langkah 3.4, cek isi tabel di Supabase Table Editor |
| Data tidak tersimpan permanen | `SUPA_URL`/`SUPA_KEY` salah atau RLS belum diatur | Cek `js/config.js`, ulangi langkah 3.5 |
| Gambar tidak muncul setelah refresh | Ukuran base64 terlalu besar | Kompres gambar di [squoosh.app](https://squoosh.app) sebelum upload |
| Musik hilang setelah refresh | File audio hanya tersimpan di memori sesi aktif | Gunakan Supabase Storage (langkah 3.7) |
| Error: `Cannot read property of null` | Urutan `<script>` di `index.html` tertukar | Pastikan urutan: `config.js` → `background.js` → `app.js` |

---

## Development Notes

### Struktur File

```
studio/
├── index.html          # Struktur HTML utama + semua modal
├── css/
│   └── style.css       # Seluruh styling, tema warna, animasi
└── js/
    ├── config.js       # Kredensial Supabase + helper API (wajib diedit sebelum deploy)
    ├── background.js   # Animasi canvas & efek partikel musiman
    └── app.js          # Seluruh logika aplikasi (musik, galeri, auth, dashboard, dll.)
```

| File | Kapan Perlu Diedit |
|---|---|
| `index.html` | Saat ubah teks statis atau tambah section baru |
| `css/style.css` | Saat ubah warna, ukuran, atau layout |
| `js/config.js` | **Wajib** sebelum deploy — isi URL & API key Supabase |
| `js/background.js` | Jarang — hanya jika ubah efek visual |
| `js/app.js` | Saat tambah atau ubah fungsi (musik, galeri, auth, dll.) |

> Urutan pemuatan script **harus** tetap: `config.js` → `background.js` → `app.js`. Mengubah urutan menyebabkan error karena `app.js` bergantung pada variabel di dua file sebelumnya.

---

### Security

| Aspek | Implementasi |
|---|---|
| Password admin | Hash SHA-256 — tidak pernah dikirim atau disimpan plaintext |
| Brute-force login | Dikunci 60 detik setelah 5 kali percobaan gagal |
| Upload gambar | Validasi MIME type + batas ukuran 5 MB |
| Upload audio | Validasi MIME type + batas ukuran 50 MB |
| Input form | Dibatasi panjang karakter, di-escape sebelum ditampilkan (anti-XSS) |
| Background kustom | Divalidasi format hex/named color (anti CSS-injection) |
| Supabase API key | Hanya `anon` key di frontend — read-only sesuai RLS |

> **Jangan pernah** menambahkan `service_role` key di file apapun yang di-upload ke repository publik.

---

### Limitations

| Komponen | Batasan |
|---|---|
| Penyimpanan gambar | Disimpan sebagai base64 di database — tidak efisien untuk gambar berukuran besar |
| Multi-device | Tanpa Supabase aktif, data tidak tersinkronisasi antar perangkat |
| Audio | File audio hanya persisten jika menggunakan Supabase Storage (langkah 3.7) |
| Admin | Hanya mendukung satu role admin — belum ada pembagian role |
| Skalabilitas | Arsitektur single-file cocok untuk traffic personal/portfolio, bukan skala enterprise |

### Future Development

Beberapa pengembangan yang dapat dilakukan ke depan:

- [ ] **Migrasi gambar ke Supabase Storage** — gantikan base64 dengan URL storage agar database lebih ringan
- [ ] **Multi-admin dengan role** — super admin vs editor dengan akses berbeda
- [ ] **Pencarian galeri** — filter dan search berdasarkan judul, artis, atau kategori
- [ ] **Notifikasi email otomatis** — kirim email ke admin saat ada pesan baru via Supabase Edge Functions
- [ ] **Statistik musik** — tracking lagu paling sering diputar per pengunjung

---

## Author

Proyek personal — bebas dimodifikasi sesuai kebutuhan. Tidak ada dependensi eksternal berbayar selain Supabase (tier gratis cukup untuk traffic skala personal/portfolio).

Dikembangkan oleh tim **StarLive SAINT**

| Nama |
|---|
| Danny Aulia |
| Said Hasan Hanafiah |
| Noah Von Nobelius |
| Arvian Raveindra Pradana |

---

<p align="center"><em>Dibuat dengan ❤️ untuk kreator yang ingin karya mereka punya rumah sendiri di internet.</em></p>
<p align="center"><i>StarLive Group — Internal Platform</i></p>
