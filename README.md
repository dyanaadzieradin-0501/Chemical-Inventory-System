# Chemical Inventory System (CIS)

> **Sistem Pengurusan & Penjejakan Inventori Bahan Kimia Makmal Bersepadu**  
> Aplikasi web moden untuk mengurus, menjejak lokasi fizikal, dan memantau kitaran hayat setiap botol bahan kimia makmal secara berkesan melalui identiti unik dan label QR Code.

---

## A. Gambaran Ringkas Projek

**Chemical Inventory System (CIS)** ialah sistem aplikasi web yang dibangunkan khas untuk menggantikan rekod manual buku log atau hamparan Excel di institusi makmal dan stor simpanan bahan kimia. Sistem ini membolehkan kakitangan makmal merekodkan penerimaan botol baharu, menjana label kod QR untuk ditampal pada botol fizikal, menjejak pergerakan botol antara bilik makmal, serta memantau tarikh luput dan paras stok secara masa nyata.

---

## B. Masalah yang Diselesaikan

Di kebanyakan makmal, pengurusan inventori menggunakan hamparan Excel menimbulkan beberapa risiko kritikal:

1. **Kehilangan Jejak Botol Fizikal**: Selepas botol asid atau pelarut diambil dari stor utama dan dibawa ke bilik makmal pengujian, sukar untuk mengetahui di mana botol tersebut berada dan siapa yang memindahkannya.
2. **Risiko Keselamatan Bahan Tamat Tempoh (*Expired*)**: Tiada sistem amaran automatik. Bahan kimia yang telah tamat tempoh kerap tersimpan di rak makmal tanpa disedari, yang boleh merosakkan keputusan ujian atau mencetuskan bahaya tindak balas tidak stabil.
3. **Pembelian Berulang & Pembaziran**: Ketiadaan kiraan baki botol aktif secara tepat menyebabkan pesanan baharu dibuat walaupun bahan tersebut masih tersimpan di bilik makmal lain.
4. **Aliran Pelupusan Tidak Tersusun**: Ketiadaan pengasingan jelas antara botol yang telah habis digunakan, rosak, atau tamat tempoh sebelum diserahkan kepada kontraktor pelupusan sisa berjadual Jabatan Alam Sekitar (DOE).

---

## C. Untuk Siapa Sistem Ini?

Sistem ini direka untuk kegunaan dalaman kakitangan pelbagai peringkat umur dan latar belakang teknikal:

- **Pegawai Sains & Ketua Makmal (Admin)**: Mendaftar stok masuk, meluluskan pelupusan muktamad bahan sisa berjadual, mengurus bilik makmal/stor, dan menyelia audit trail keselamatan.
- **Pembantu Makmal & Juruteknik (Staf)**: Melakukan imbasan QR pantas di meja makmal, merekod pemindahan botol ke bilik analisis, dan menandakan botol habis/luput untuk tindakan pelupusan.
- **Pengurus Stor & Pegawai Keselamatan OSH**: Memantau senarai bahan berisiko tinggi (*Hazard GHS*), membuka pautan *Safety Data Sheet* (SDS), dan memuat turun laporan inventori bulanan.

---

## D. Apa yang Boleh Dibuat?

- **Pendaftaran Stok Masuk Mengikut Unit Botol**: Pendaftaran kuantiti *N* unit botol menghasilkan *N* rekod unik berasingan dengan nombor siri `CIS-YYYY-XXXX` dan lencana amaran GHS.
- **Penjanaan & Cetakan Label QR Fizikal**: Menjana label pelekat bersaiz standard makmal (70mm × 35mm atau helaian A4) yang sedia dicetak (`@media print`) tanpa elemen navigasi laman web.
- **Pengimbas QR Code & Carian Pantas**: Imbas kod QR menggunakan kamera telefon/komputer atau taip nombor ID untuk membuka profil penuh botol dalam masa kurang daripada 1 saat.
- **Pemindahan Lokasi Fizikal**: Rekod perpindahan botol dari stor ke bilik makmal tertentu berserta nama staf dan catatan tujuan.
- **Aliran Pelupusan 2 Langkah (*2-Step Disposal*)**:
  1. *Langkah 1 (Semua Kakitangan)*: Menanda botol sebagai *Menunggu Pelupusan* berserta sebab (Habis Digunakan / Tamat Tempoh / Rosak) dan baki botol ditolak serta-merta daripada kiraan stok aktif.
  2. *Langkah 2 (Admin Sahaja)*: Mengesahkan status *Telah Dilupuskan* berserta No. Rujukan Notis DOE dan tarikh pelupusan rasmi.
- **Dashboard Amaran Proaktif**: Pengesanan automatik botol *Telah Luput* (Merah), *Hampir Luput $\le$ 90 Hari* (Kuning), dan *Amaran Stok Rendah* (di bawah paras minimum).
- **Jejak Audit Kronologi (*Audit Trail*)**: Setiap tindakan (daftar, pindah, tanda lupus, sah lupus) direkodkan secara kekal dengan cap masa dan nama pegawai.
- **Pendaftaran & Kawalan Akses Pengguna (*RBAC*)**: Mendaftar kakitangan baharu, menetapkan peranan (*Admin* vs *Staf*), dan fungsi tukar profil sesi dengan satu klik.
- **Eksport Laporan Rasmi & Sandaran Data**: Muat turun fail CSV untuk Microsoft Excel, cetakan laporan PDF, serta sandaran data penuh (*JSON Backup & Restore*).

---

## E. Contoh Cara Penggunaan (Senario Lengkap)

1. **Penerimaan Bahan Kimia di Stor**:
   - Pegawai Sains membuka menu **Stok Masuk (Stock In)**, memilih templat pantas *Acetone*, memasukkan kuantiti `3` botol, dan menekan butang **Daftar 3 Unit Botol**.
   - Sistem terus memaparkan modal cetakan dengan 3 keping label QR unik (`CIS-2026-0015`, `0016`, `0017`). Pegawai mencetak dan menampal label pada setiap botol.
2. **Pengambilan Botol ke Bilik Makmal**:
   - Pembantu Makmal mengambil satu botol untuk analisis, membuka aplikasi di telefon, dan menekan butang **Imbas QR**.
   - Kamera mengimbas label botol, profil botol terbuka, pembantu makmal menekan **Pindah Lokasi**, memilih *Makmal Kimia Analisis 1*, dan menekan **Sahkan**.
   - Status botol kini bertukar kepada `Di Makmal` dan tercatat dalam jejak audit.
3. **Bahan Kimia Habis Digunakan**:
   - Selepas botol kosong, pembantu makmal menekan butang **Tanda Lupus**, memilih sebab *Habis Digunakan*, dan menghantar permohonan.
   - Pegawai Sains menyemak senarai di tab **Pelupusan Bahan**, menekan **Sahkan Telah Dilupuskan**, memasukkan No. Rujukan fail DOE, dan status botol dikunci kekal sebagai arkib.

---

## F. Cara Mencuba Aplikasi

Aplikasi prototaip berfungsi penuh sedia diuji melalui pelayar web moden (Chrome, Safari, Edge):

- **Pautan Aplikasi (Preview Live)**: [https://ais-pre-wjzgxgjmlvzfi2gcph53mn-998654182869.asia-east1.run.app](https://ais-pre-wjzgxgjmlvzfi2gcph53mn-998654182869.asia-east1.run.app)
- **Pautan Pembangunan (Dev Environment)**: [https://ais-dev-wjzgxgjmlvzfi2gcph53mn-998654182869.asia-east1.run.app](https://ais-dev-wjzgxgjmlvzfi2gcph53mn-998654182869.asia-east1.run.app)

*Nota: Anda boleh bertukar antara akaun Admin (kuasa penuh) dan akaun Staf (kebenaran terhad) menggunakan menu pilihan di bar atas aplikasi.*

---

## G. Status Semasa Projek

| Komponen / Modul | Status | Keterangan |
| :--- | :--- | :--- |
| **Pendaftaran Stok Masuk & QR** | Siap & Diuji | Berfungsi penuh menjana rekod unik dan cetakan label fizikal. |
| **Carian & Pengimbas QR Kamera** | Siap & Diuji | Menyokong kamera pelayar web dan input ID manual / USB scanner. |
| **Pemindahan Lokasi Fizikal** | Siap & Diuji | Mengemas kini status bilik dan log jejak audit secara masa nyata. |
| **Aliran Pelupusan 2 Langkah** | Siap & Diuji | Pemisahan kebenaran antara Staf dan Admin berpandukan Akta DOE. |
| **Dashboard KPI & Amaran Luput** | Siap & Diuji | Perbandingan dinamik tarikh luput vs tarikh semasa sistem. |
| **Pengurusan Pengguna (RBAC)** | Siap & Diuji | Pendaftaran kakitangan baharu dan pertukaran profil aktif. |
| **Eksport Laporan & Sandaran JSON** | Siap & Diuji | Muat turun CSV Excel, cetakan PDF, dan sandaran fail JSON. |
| **Pangkalan Data Awan (Cloud DB)** | Fasa Seterusnya | Fasa 1 menggunakan storan selamat pelayar (`localStorage`); integrasi pelayan awan berpusat dirancang untuk Fasa 2. |

---

## H. Panduan Lanjut & Dokumentasi

Sila rujuk dokumen terperinci dalam folder `docs/`:

- [**Panduan Pengguna (User Manual)**](docs/PANDUAN-PENGGUNA.md): Langkah demi langkah penggunaan sistem untuk kakitangan makmal.
- [**Dokumen Keperluan Produk (PRD Summary)**](docs/KEPERLUAN-PRODUK.md): Huraian keperluan sistem, peraturan perniagaan (*business rules*), dan kriteria penerimaan.
- [**Status & Perancangan (Status & Roadmap)**](docs/STATUS-DAN-ROADMAP.md): Senarai fungsi yang telah disahkan, batasan semasa, dan perancangan Fasa 2.
- [**Data & Privasi (Data & Privacy)**](docs/DATA-DAN-PRIVASI.md): Maklumat keselamatan simpanan data dan tiadanya penghantaran data ke pihak ketiga.
- [**Panduan Pemasangan & Penyelenggaraan (Setup Guide)**](docs/SETUP-DAN-PENYELENGGARAAN.md): Arahan teknikal untuk menjalankan kod sumber pada komputer tempatan.
- [**Sejarah Perubahan (Changelog)**](CHANGELOG.md): Rekod versi dan penambahbaikan yang telah dilaksanakan.

---

## I. Ringkasan Teknologi yang Digunakan

Aplikasi ini dibina dengan teknologi web moden tanpa kebergantungan pelayan luar (*client-side deterministic application*):

- **React 19 & TypeScript**: Digunakan untuk membina antaramuka pengguna yang interaktif, pantas, dan bebas daripada ralat jenis data.
- **Tailwind CSS v4**: Digunakan untuk penggayaan antaramuka instrumen sains berkebolehbacaan tinggi (*high-contrast readability*) serta kawalan cetakan `@media print`.
- **Vite**: Alat binaan (*build tool*) moden yang memastikan pemuatan aplikasi berjalan pantas.
- **qrcode.react**: Pustaka untuk menjana kod QR dalam bentuk vektor SVG yang bersih dan mudah diimbas.
- **html5-qrcode**: Pustaka untuk mengakses kamera peranti bagi mengimbas kod QR terus melalui pelayar web.
- **Lucide React**: Set ikonografi teknikal yang seragam untuk simbol instrumen dan keselamatan makmal.
- **localStorage Web Storage**: Tempat simpanan data inventori setempat di dalam pelayar pengguna bagi memastikan sistem boleh beroperasi tanpa pelayan pangkalan data luaran pada Fasa 1.

---

## J. Maklum Balas & Bantuan

Sekiranya anda menemui sebarang isu teknikal, ralat, atau cadangan penambahbaikan semasa menguji sistem ini:
- Sila buka laporan melalui tab **GitHub Issues** pada repositori projek ini.
- Berikan penerangan ringkas mengenai langkah yang dilakukan sebelum ralat berlaku dan paparan mesej yang tertera.

---
*Chemical Inventory System (CIS) — Dokumen Rasmi v1.0 (Dikemas kini: November 2026)*
