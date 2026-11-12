# Polisi Data & Privasi (Data & Privacy Policy)
## Chemical Inventory System (CIS) — Versi 1.0

Dokumen ini menerangkan jenis data yang diuruskan oleh Chemical Inventory System (CIS), lokasi penyimpanan, kawalan akses, dan langkah keselamatan yang diguna pakai.

---

## 1. Jenis Data yang Diuruskan

Sistem CIS menguruskan data operasi makmal berikut:

1. **Maklumat Botol Bahan Kimia**:
   - Nama bahan kimia, formula kimia / No. CAS Registry.
   - Jenama pengeluar, saiz bekas, nombor lot / batch.
   - Tarikh terima, tarikh luput, dan nama pembekal.
   - Klasifikasi bahaya GHS (Global Harmonized System) dan pautan web Safety Data Sheet (SDS).
   - Status kitaran hayat botol (`Dalam Stor`, `Di Makmal`, `Menunggu Pelupusan`, `Telah Dilupuskan`).
   - Maklumat pelupusan (sebab pelupusan, tarikh pelupusan, No. Rujukan fail Jabatan Alam Sekitar/DOE).
2. **Jejak Audit (Audit Trail)**:
   - Cap masa transaksi, jenis tindakan (*Stok Masuk, Pindah Lokasi, Tanda Pelupusan, Sahkan Pelupusan*).
   - Nama dan peranan kakitangan yang melakukan transaksi, lokasi asal, lokasi destinasi, dan catatan penggunaan.
3. **Senarai Lokasi Makmal & Stor**:
   - Nama bilik makmal, almari simpanan, dan penerangan fungsi.
4. **Profil Kakitangan Makmal (User Profiles)**:
   - Nama penuh, No. ID Staf, alamat emel rasmi institusi, jawatan, bahagian makmal, dan peranan sistem (*Admin* vs *Staf*).

---

## 2. Di Mana Data Disimpan?

- **Penyimpanan Setempat Pelayar (*Browser Local Storage*)**:  
  Pada Fasa 1 MVP, seluruh pangkalan data aplikasi disimpan secara setempat di dalam memori pelayar web anda melalui kunci storan `cis_malaysia_v1_data`.
- **Tiada Pangkalan Data Awan Terbuka**:  
  Data **TIDAK** disimpan pada pelayan awan pihak ketiga, pelayan komersial luaran, atau pangkalan data awam.

---

## 3. Adakah Data Dihantar kepada Pihak Ketiga atau Model AI?

- **Tiada Penghantaran Data ke Model AI**:  
  Sistem CIS pada Fasa 1 beroperasi secara deterministik sepenuhnya. Tiada teks inventori, maklumat botol, atau data kakitangan dihantar kepada sebarang model AI atau enjin bahasa besar (LLM).
- **Tiada Penjejak / Telemetri Komersial**:  
  Aplikasi ini tidak memasang kuki penjejak pengiklanan (*tracking cookies*), sistem telemetri luaran, atau analitik pihak ketiga.
- **Pautan Safety Data Sheet (SDS)**:  
  Pautan SDS dibuka terus oleh pelayar anda ke laman web rasmi pembekal (contoh: Sigma-Aldrich atau Fisher Scientific) atau storan dokumen Google Drive organisasi anda dalam tab baharu menggunakan parameter keselamatan `rel="noopener noreferrer"`.

---

## 4. Kawalan Akses & Keselamatan Data

- **Kawalan Akses Peranan (RBAC)**:  
  Sistem mengasingkan kebenaran antara peranan Admin (Pegawai Sains) dan Staf (Pembantu Makmal) bagi mengelakkan perubahan tetapan atau pengesahan pelupusan tanpa kebenaran.
- **Integriti Rekod Terkunci**:  
  Botol yang telah disahkan pelupusannya dikunci daripada sebarang modifikasi bagi mengekalkan ketepatan rekod sisa berjadual.

---

## 5. Kaedah Sandaran & Pemadaman Data

### A. Membuat Salinan Sandaran (Backup)
Kakitangan dinasihatkan membuat salinan sandaran secara berkala:
1. Buka tab **Laporan & Tetapan**.
2. Klik butang **Muat Turun Sandaran (Backup JSON)**.
3. Fail sandaran `.json` akan dimuat turun ke komputer anda untuk simpanan selamat luar talian (*offline*).

### B. Memulihkan Data (Restore)
1. Buka tab **Laporan & Tetapan**.
2. Klik **Pulihkan Dari JSON** dan pilih fail sandaran `.json` yang disimpan terdahulu.

### C. Menetapkan Semula atau Memadam Data
- Untuk mengembalikan sistem kepada data contoh permulaan (14 botol makmal Malaysia):  
  Buka tab **Laporan & Tetapan** $\rightarrow$ klik **Set Semula Demo (14 Botol)**.
- Untuk memadamkan keseluruhan data aplikasi daripada pelayar:  
  Buka tetapan pelayar anda (*Browser Settings*) $\rightarrow$ Padam Data Tapak (*Clear Site Data/Local Storage*) untuk URL aplikasi ini.

---
*Chemical Inventory System (CIS) — Polisi Data & Privasi v1.0*
