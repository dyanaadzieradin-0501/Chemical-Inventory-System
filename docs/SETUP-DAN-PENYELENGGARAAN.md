# Panduan Pemasangan & Penyelenggaraan (Setup & Maintenance Guide)
## Chemical Inventory System (CIS) — Versi 1.0

Dokumen teknikal ini disediakan untuk pembangun perisian, pentadbir sistem maklumat (IT), atau sesiapa yang ingin memuat turun dan menjalankan kod sumber aplikasi ini pada komputer tempatan (*localhost*) atau pelayan web institusi.

---

## 1. Keperluan Sistem (Prerequisites)

Sebelum memulakan, pastikan komputer anda telah dipasang dengan perisian berikut:

- **Node.js**: Versi 18.0.0 atau lebih baharu (disyorkan Node.js 20 LTS atau 22).  
  *(Semak versi dengan arahan: `node -v`)*
- **Pengurus Pakej npm**: Versi 9.0.0 atau lebih baharu.  
  *(Semak versi dengan arahan: `npm -v`)*
- **Pelayar Web Moden**: Google Chrome, Microsoft Edge, Mozilla Firefox, atau Apple Safari.
- **Peranti Kamera Web (Webcam)**: Diperlukan sekiranya ingin menguji fungsi pengimbasan kod QR secara langsung.

---

## 2. Langkah Pemasangan Tempatan (Local Setup)

### Langkah 1: Dapatkan Kod Sumber Projek
Sekiranya menggunakan Git:
```bash
git clone https://github.com/<username>/chemical-inventory-system-cis.git
cd chemical-inventory-system-cis
```
Atau ekstrak fail arkib `.zip` projek ke dalam folder pilihan anda dan buka terminal dalam folder tersebut.

### Langkah 2: Pasang Pakej Ketergantungan (Install Dependencies)
Jalankan arahan berikut di terminal untuk memasang semua pustaka yang diperlukan (`node_modules`):
```bash
npm install
```

### Langkah 3: Sediakan Fail Persekitaran (Environment Variables)
Salin fail `.env.example` kepada `.env`:
```bash
cp .env.example .env
```
*(Nota: Untuk Fasa 1, aplikasi beroperasi sepenuhnya di bahagian pelanggan / client-side menggunakan localStorage; tiada kunci API rahsia mandatori diperlukan untuk menjalankan fungsi teras inventori).*

---

## 3. Menjalankan Aplikasi

### Mod Pembangunan (Development Server)
Untuk memulakan pelayan pembangunan tempatan:
```bash
npm run dev
```
Aplikasi akan dimulakan dan boleh diakses melalui pelayar di alamat:
```
http://localhost:3000
```

### Menyemak Integriti Kod (TypeScript Lint Check)
Untuk mengesahkan tiada sebarang ralat jenis data atau sintaks kod:
```bash
npm run lint
```

### Membina Versi Pengeluaran (Production Build)
Untuk menjana fail statik yang dioptimumkan untuk penggunaan sebenar di pelayan web:
```bash
npm run build
```
Fail output pengeluaran akan disimpan di dalam folder `dist/`.

### Menguji Pratonton Versi Pengeluaran (Preview Build)
```bash
npm run preview
```

---

## 4. Struktur Folder & Fail Projek

```
├── docs/                                  # Dokumentasi lengkap sistem
│   ├── PANDUAN-PENGGUNA.md               # Manual pengguna langkah demi langkah
│   ├── KEPERLUAN-PRODUK.md               # Ringkasan PRD rasmi v1.0
│   ├── STATUS-DAN-ROADMAP.md             # Status fungsi & perancangan Fasa 2
│   ├── DATA-DAN-PRIVASI.md               # Polisi simpanan data & privasi
│   └── SETUP-DAN-PENYELENGGARAAN.md      # Panduan pemasangan teknikal ini
├── public/                                # Aset statik awam
│   └── assets/aistudio/                  # Fail PDF PRD asal makmal
├── src/                                   # Kod sumber utama aplikasi
│   ├── components/                       # Komponen antaramuka React
│   │   ├── BottleDetailModal.tsx         # Lembaran data profil botol & audit trail
│   │   ├── Dashboard.tsx                 # Konsol pemantauan metrik KPI & amaran
│   │   ├── DisposalManagement.tsx        # Modul pengurusan sisa berjadual 2 langkah
│   │   ├── DisposalModal.tsx             # Dialog tindakan pelupusan
│   │   ├── GHSBadge.tsx                  # Lencana piawai klasifikasi bahaya GHS
│   │   ├── InventoryList.tsx             # Katalog inventori & toolbar penapis
│   │   ├── MoveLocationModal.tsx         # Dialog pemindahan lokasi botol
│   │   ├── Navbar.tsx                    # Bar atas dengan penukar peranan aktif
│   │   ├── Navigation.tsx                # Sidebar desktop & navigasi mudah alih
│   │   ├── QRModal.tsx                   # Format cetakan label pelekat makmal (70x35mm)
│   │   ├── QRScannerModal.tsx            # Pengimbas QR kamera web & input manual
│   │   ├── ReportsAndSettings.tsx        # Eksport CSV, pengurusan lokasi & sandaran
│   │   ├── StatusBadge.tsx               # Lencana status kitaran & status luput
│   │   ├── StockInForm.tsx               # Borang pendaftaran stok masuk botol
│   │   └── UserManagement.tsx            # Pendaftaran kakitangan baharu & RBAC
│   ├── data/
│   │   └── seedData.ts                   # 14 rekod data contoh makmal Malaysia
│   ├── services/
│   │   └── storageService.ts             # Pengurusan CRUD localStorage & logik bisnes
│   ├── types/
│   │   └── index.ts                      # Definisi jenis data TypeScript
│   ├── App.tsx                           # Komponen induk aplikasi
│   ├── index.css                         # Penggayaan Tailwind CSS & @media print
│   └── main.tsx                          # Titik masuk React DOM
├── .env.example                           # Contoh pemboleh ubah persekitaran
├── .gitignore                             # Fail pengecualian Git
├── CHANGELOG.md                           # Sejarah versi pembangunan
├── index.html                             # Fail HTML utama
├── metadata.json                          # Metadata sistem makmal
├── package.json                           # Senarai dependensi & skrip binaan
├── tsconfig.json                          # Konfigurasi pengkompil TypeScript
└── vite.config.ts                         # Konfigurasi binaan Vite
```

---

## 5. Penyelesaian Masalah Teknikal (Technical Troubleshooting)

### Isu 1: Konflik Port (`Port 3000 is already in use`)
Sekiranya port 3000 telah digunakan oleh aplikasi lain:
- Jalankan arahan: `npx vite --port 3001` atau ubah tetapan port dalam `vite.config.ts`.

### Isu 2: Kamera Tidak Boleh Digunakan di Pelayar (Bukan Localhost)
- Pelayar moden seperti Chrome dan Safari menyekat akses kamera pada sambungan HTTP biasa kecuali `localhost`.
- Jika anda menghoskan aplikasi ini di pelayan rangkaian makmal (*local network IP*), pastikan sambungan menggunakan **HTTPS** dengan sijil keselamatan SSL.

---
*Chemical Inventory System (CIS) — Panduan Pemasangan & Penyelenggaraan v1.0*
