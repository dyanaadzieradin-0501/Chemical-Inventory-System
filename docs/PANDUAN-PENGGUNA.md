# Panduan Pengguna (User Manual)
## Chemical Inventory System (CIS) — Versi 1.0

Dokumen ini menerangkan cara penggunaan sistem langkah demi langkah bagi memudahkan kakitangan makmal menjalankan operasi harian, mendaftar stok bahan kimia, mencetak label, dan mengurus pelupusan.

---

## 1. Peranan Pengguna & Kawalan Akses

Sistem CIS membahagikan kebenaran akses kepada dua (2) peranan utama:

| Peranan | Profil Pengguna | Kebenaran Tindakan |
| :--- | :--- | :--- |
| **Pegawai / Pentadbir (Admin)** | Pegawai Sains, Pegawai Penyelidik, Ketua Makmal, Pengurus Stor. | Akses penuh: Mendaftar stok baharu, menjana & mencetak label QR, memindahkan lokasi, meluluskan pelupusan muktamad bahan, mengurus bilik makmal/stor, mendaftar pengguna baharu, dan memuat turun sandaran data. |
| **Staf / Pembantu Makmal** | Pembantu Makmal, Penolong Pegawai Sains, Juruteknik. | Operasi harian: Carian teks pantas, imbasan kamera QR, merekod pengambilan botol ke bilik makmal, menanda botol habis/luput untuk menunggu pelupusan, dan membuka pautan keselamatan SDS. Tidak dibenarkan meluluskan pelupusan muktamad atau memadam data. |

> **Cara Menukar Peranan (Role Switcher)**:  
> Di bahagian penjuru atas bar navigasi (Navbar), terdapat kotak pilihan dropdown pengguna. Anda boleh memilih mana-mana nama kakitangan untuk beralih peranan serta-merta tanpa perlu log keluar.

---

## 2. Langkah Demi Langkah: Pendaftaran Stok Masuk (Stock In)

1. Pastikan peranan anda adalah **Admin / Pegawai**.
2. Klik tab **Stok Masuk (Stock In)** pada menu navigasi sebelah kiri.
3. Anda boleh menekan butang **Preset Makmal Lazim** (contoh: *Acetone*, *HCl 37%*, *Methanol*, atau *NaOH*) untuk mengisi maklumat asas secara pantas, atau isi maklumat berikut secara manual:
   - **Nama Bahan Kimia**: Contoh: `Acetone (AR Grade)`.
   - **No. CAS / Formula**: Contoh: `67-64-1`.
   - **Jenama Pengeluar**: Contoh: `Merck Millipore`, `Sigma-Aldrich`.
   - **Saiz Bekas**: Contoh: `2.5 L`, `500 g`, `1.0 kg`.
   - **No. Batch / Lot**: Nombor siri batch pada botol fizikal.
   - **Tarikh Luput**: Tarikh tamat tempoh bahan kimia.
   - **Kuantiti Botol**: Masukkan bilangan botol fizikal yang diterima (contoh: `3`).
   - **Lokasi Simpanan Awal**: Pilih bilik atau rak stor simpanan (contoh: *Stor Utama - Rak Pelarut*).
   - **Hazard Class GHS**: Tandakan kotak klasifikasi bahaya (contoh: *Mudah Terbakar*).
   - **Pautan SDS**: Masukkan URL pautan lembaran data keselamatan pengeluar.
4. Klik butang **Daftar Unit Botol & Cetak Label QR**.
5. Sistem akan menjana rekod unik secara berasingan bagi setiap botol dengan format `CIS-YYYY-XXXX` dan memaparkan pratonton label sedia dicetak.

---

## 3. Langkah Demi Langkah: Mencetak Label QR Botol Fizikal

1. Semasa modal cetakan terbuka (selepas mendaftar stok masuk atau dengan menekan ikon **Cetak QR** pada senarai inventori):
2. Semak susun atur label. Setiap label mengandungi:
   - Nama bahan kimia dan no. CAS.
   - Nombor ID unik botol (contoh: `CIS-2026-0001`).
   - Imej Kod QR SVG berkontras tinggi.
   - Jenama, saiz bekas, no. lot, lokasi simpanan, dan tarikh luput.
3. Klik butang **Cetak Sekarang (Ctrl + P)**.
4. Kotak cetakan pelayar akan terbuka. Sistem telah dikonfigurasikan secara automatik untuk menyembunyikan semua elemen laman web, bar sisi, dan butang nav, menghasilkan cetakan label yang bersih pada kertas pelekat atau helaian A4.
5. Gunting atau tanggalkan pelekat dan tampal pada botol bahan kimia fizikal berkenaan.

---

## 4. Langkah Demi Langkah: Mengimbas Kod QR & Carian Pantas

1. Di komputer makmal atau telefon pintar berkamera, klik butang **Imbas QR Botol** pada bar atas atau pada bar sisi.
2. Halakan kamera peranti ke arah kod QR pada botol.
3. Sebaik sahaja kod dikesan, modal **Lembaran Data Botol** akan terbuka dalam masa kurang daripada 1 saat.
4. **Jika Kamera Tidak Tersedia atau Ditolak**:
   - Sistem menyediakan kotak input pantas di bahagian bawah modal imbasan.
   - Taip nombor ID botol (contoh: `CIS-2026-0001` atau hanya taip nombor `1`) dan tekan kekunci **Enter** atau butang **Buka**.
   - Anda juga boleh menyambungkan alat pengimbas kod bar USB fizikal; imbasan kod bar akan mengisi ID secara automatik dan menekan Enter.

---

## 5. Langkah Demi Langkah: Memindahkan Lokasi Botol ke Bilik Makmal

1. Buka profil botol melalui carian, senarai inventori, atau imbasan QR.
2. Klik butang **Pindah / Ambil ke Makmal**.
3. Pilih **Lokasi Destinasi Baharu** (contoh: *Makmal Kimia Analisis 1*).  
   *(Nota: Sistem menghalang pemilihan lokasi yang sama dengan lokasi semasa).*
4. Masukkan **Catatan Penggunaan** (pilihan, contoh: *Diambil untuk analisis spektrometri GC-MS*).
5. Klik **Sahkan Pemindahan**.
6. Status botol akan dikemas kini kepada `Di Makmal`, lokasi semasa bertukar serta-merta, dan rekod pergerakan dicatatkan secara automatik dalam **Jejak Audit (Audit Trail)** berserta nama staf dan tarikh masa.

---

## 6. Langkah Demi Langkah: Aliran Pelupusan 2 Langkah (2-Step Disposal)

Untuk mematuhi garis panduan keselamatan dan Akta Kualiti Alam Sekeliling Jabatan Alam Sekitar (DOE), pelupusan bahan kimia diasingkan kepada 2 fasa:

### Langkah 1: Tanda Menunggu Pelupusan (Boleh Dilakukan oleh Semua Kakitangan)
1. Apabila botol bahan kimia telah kosong, rosak, atau tamat tempoh, buka profil botol tersebut.
2. Klik butang **Tanda Lupus**.
3. Pilih sebab pelupusan:
   - *Tamat Tempoh (Expired Chemical)*
   - *Habis Digunakan (Empty Container)*
   - *Rosak / Terpencemar / Mengendap*
   - *Botol Retak / Penutup Bocor*
4. Masukkan catatan keadaan fizikal bahan dan klik **Tanda Menunggu Pelupusan**.
5. Botol kini berstatus `Menunggu Pelupusan` dan **dikeluarkan serta-merta daripada baki stok aktif**.

### Langkah 2: Pengesahan Pelupusan Muktamad (Admin / Pegawai Sains Sahaja)
1. Log masuk sebagai **Admin / Pegawai Sains**.
2. Klik tab **Pelupusan Bahan** pada menu navigasi.
3. Di tab **Menunggu Pengesahan**, semak senarai botol yang telah ditandakan oleh staf.
4. Klik butang **Sahkan Pelupusan**.
5. Masukkan **Tarikh Pelupusan Rasmi** dan **No. Rujukan Notis DOE** (contoh: `DOE/SW/2026/0411` atau rujukan kontraktor sisa berjadual berdaftar).
6. Masukkan catatan pengesahan pegawai dan klik **Sahkan Telah Dilupuskan**.
7. Status botol kini dikunci sepenuhnya sebagai `Telah Dilupuskan` dalam arkib kekal dan tidak boleh diubah suai atau dipadam lagi.

---

## 7. Langkah Demi Langkah: Pendaftaran Kakitangan Baharu

1. Buka tab **Pengguna & Akses** pada menu navigasi sebelah kiri.
2. Di panel borang sebelah kiri, masukkan:
   - Nama Penuh Kakitangan.
   - No. ID Staf (contoh: `LGM/PS/0512`).
   - Peranan Sistem (*Admin* atau *Staf*).
   - Alamat Emel Rasmi (contoh: `nama@lgm.gov.my`).
   - Jawatan Rasmi dan Bahagian Makmal.
3. Klik butang **Daftar Akses Pengguna**.
4. Nama kakitangan baharu akan tersenarai serta-merta dan boleh dipilih melalui dropdown penukar peranan di bar atas.

---

## 8. Panduan Status & Kod Warna Sistem

Sistem menggunakan warna berkontras tinggi bagi memudahkan pengecaman visual segera:

- **Merah (`Telah Luput`)**: Botol aktif yang tarikh luputnya telah melepasi tarikh semasa. Perlu diasingkan serta-merta untuk pelupusan.
- **Ambar / Kuning (`Hampir Luput ≤ 90 Hari`)**: Bahan kimia yang akan tamat tempoh dalam masa kurang daripada 3 bulan. Disarankan digunakan terdahulu (*First Expired, First Out*).
- **Hijau (`Dalam Stor`)**: Botol berada di rak stor simpanan pusat dan sedia untuk diambil.
- **Biru (`Di Makmal`)**: Botol sedang aktif digunakan di dalam bilik makmal pengujian tertentu.
- **Kelabu (`Terkunci / Telah Dilupuskan`)**: Rekod arkib sejarah yang telah selesai proses pelupusan berjadual.

---

## 9. Penyelesaian Masalah Biasa (Troubleshooting)

### A. Kamera Pengimbas QR Tidak Berfungsi
- **Sebab**: Pelayar web belum diberikan kebenaran (*camera permission*) atau peranti komputer tiada perkakasan kamera.
- **Penyelesaian**: 
  1. Klik ikon kunci / kebenaran di sebelah alamat URL pelayar dan benarkan akses Kamera (*Allow Camera*).
  2. Jika menggunakan komputer makmal tanpa kamera, gunakan kotak input manual di bawah paparan kamera untuk menaip ID botol atau gunakan pengimbas kod bar USB.

### B. Data Inventori Hilang Selepas Pembersihan Pelayar
- **Sebab**: Pada Fasa 1, data disimpan dalam storan pelayar (*localStorage*). Tindakan membersihkan cache atau "Clear Browsing Data" boleh memadamkan rekod.
- **Penyelesaian**:
  1. Sentiasa buat salinan sandaran secara berkala melalui tab **Laporan & Tetapan** $\rightarrow$ **Muat Turun Sandaran (Backup JSON)**.
  2. Jika data terpadam, buka tab **Laporan & Tetapan** $\rightarrow$ klik **Pulihkan Dari JSON** $\rightarrow$ pilih fail sandaran `.json` anda untuk memulihkan seluruh rekod inventori.

---
*Chemical Inventory System (CIS) — Manual Pengguna v1.0*
