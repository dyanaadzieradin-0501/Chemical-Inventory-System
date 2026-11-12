# Sejarah Perubahan (Changelog)
## Chemical Inventory System (CIS)

Semua perubahan dan penambahbaikan pada projek ini direkodkan dalam dokumen ini mengikut susunan kronologi versi.

---

### [Versi 1.1.0] — November 2026

#### Penambahan Ciri Baharu (Added)
- **Modul Pendaftaran Pengguna & Kawalan Akses (`UserManagement.tsx`)**:
  - Penambahan borang pendaftaran kakitangan baharu dengan medan Nama Penuh, No. ID Staf, Alamat Emel Rasmi, Peranan (Admin vs Staf), Jawatan Rasmi, dan Bahagian Makmal.
  - Pengesahan automatik bagi menyekat pendaftaran No. ID Staf atau emel pendua.
  - Senarai kakitangan berdaftar berserta status aktif/nyahaktif dan butang *Tukar Sesi* untuk memudahkan pengujian.
  - Perlindungan keselamatan bagi menghalang pemadaman akaun pentadbir tunggal.
- **Penyegerakan Dinamik Navbar**:
  - Pilihan *Role Switcher* di bahagian atas kini membaca senarai kakitangan berdaftar secara automatik daripada storan pangkalan data.
- **Dokumentasi Penuh Repositori**:
  - Penambahan fail `README.md` utama, `docs/PANDUAN-PENGGUNA.md`, `docs/KEPERLUAN-PRODUK.md`, `docs/STATUS-DAN-ROADMAP.md`, `docs/DATA-DAN-PRIVASI.md`, `docs/SETUP-DAN-PENYELENGGARAAN.md`, dan `CHANGELOG.md`.

#### Penambahbaikan Reka Bentuk Visual & UI/UX (Changed)
- **Transformasi Arah Visual (*Clinical Scientific Console*)**:
  - Menggantikan gaya template AI generik (kad bertingkat dan bayang tebal) kepada susun atur instrumen sains berwibawa dengan garisan pemisah halus (*1px hairline dividers*).
  - Melaksanakan *Zero-Pill Discipline*: Membuang kapsul warna pill yang berlebihan dan menggantikannya dengan tipografi tabular tegas (`font-mono tabular-nums`).
  - Mengoptimumkan format cetakan label pelekat makmal (`QRModal.tsx`) mengikut standard saiz pelekat 70mm × 35mm.
  - Memperkemas *Dashboard KPI* dengan strip metrik mendatar yang mudah diimbas.
  - Menyepadukan bar carian teks dan penapis dropdown menjadi *Integrated Lab Toolbar*.

---

### [Versi 1.0.0] — 12 November 2026

#### Pelancaran Awal (Initial Release — MVP Fasa 1)
- **Teras Sistem & Model Data**:
  - Pelaksanaan entiti data `ChemicalBottle`, `AuditLogEntry`, `Location`, dan `ChemicalThreshold` berasaskan storan selamat pelayar (`localStorage`).
  - Memuatkan 14 rekod data contoh bahan kimia makmal Malaysia merangkumi pelbagai status dan tarikh luput.
- **Pendaftaran Stok Masuk (FR-003)**:
  - Pendaftaran penerimaan bahan kimia mengikut unit botol fizikal dengan penjanaan nombor siri unik berturutan `CIS-YYYY-XXXX`.
- **Penjanaan & Cetakan Label QR Code (FR-004)**:
  - Penjanaan kod QR SVG dan susun atur khas sedia cetak (`@media print`) tanpa elemen navigasi laman web.
- **Carian Pantas & Pengimbas QR Kamera (FR-005)**:
  - Carian masa nyata (< 100ms) merangkumi nama bahan, No. CAS, ID botol, dan no. batch.
  - Integrasi pengimbas kamera web menggunakan `html5-qrcode` berserta input manual dan pengimbas kod bar USB.
- **Pemindahan Lokasi Fizikal (FR-006)**:
  - Merekod pergerakan botol dari stor ke bilik makmal pengujian berserta catatan dan pengemaskinian status `Di Makmal`.
- **Aliran Pelupusan 2 Langkah (FR-007)**:
  - Langkah 1: Staf menanda botol untuk *Menunggu Pelupusan* berserta sebab (Habis Digunakan / Tamat Tempoh / Rosak) dan ditolak daripada baki stok aktif.
  - Langkah 2: Admin mengesahkan status *Telah Dilupuskan* berserta No. Rujukan Notis DOE dan tarikh pelupusan rasmi.
- **Dashboard Pemantauan & Amaran Proaktif (FR-002 & FR-008)**:
  - Pengesanan dinamik botol Telah Luput (Merah), Hampir Luput $\le$ 90 Hari (Kuning), dan Amaran Stok Rendah.
- **Jejak Audit Kronologi (FR-009)**:
  - Garis masa kekal setiap pergerakan botol dari penerimaan hingga pelupusan dan pautan terus ke Safety Data Sheet (SDS).
- **Pengurusan Lokasi & Sandaran Data (FR-010 & FR-011)**:
  - Penambahan bilik makmal/stor baharu, eksport 3 jenis laporan CSV, paparan cetak dokumen rasmi, serta fungsi sandaran dan pemulihan fail JSON.
