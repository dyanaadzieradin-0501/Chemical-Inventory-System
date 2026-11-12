# Dokumen Keperluan Produk (Product Requirements Document - PRD)
## Chemical Inventory System (CIS) — Versi 1.0 (Fasa 1 MVP)

> **Rujukan PRD Rasmi**: Fail PDF asal bertajuk `Chemical_Inventory_System__CIS__-_PRD_v1.0_1a7eacbc.pdf` (tersedia dalam repositori di laluan `public/assets/aistudio/Chemical_Inventory_System__CIS__-_PRD_v1.0_1a7eacbc.pdf`).

---

## 1. Pengenalan & Objektif Produk

Chemical Inventory System (CIS) dibangunkan bagi mewujudkan sistem pengurusan inventori bahan kimia makmal berketepatan tinggi (*end-to-end physical bottle traceability*) untuk menggantikan pengurusan manual berasaskan Excel. Sistem ini memberi fokus kepada unit botol/bekas fizikal, pematuhan keselamatan GHS & OSH, pencegahan pembaziran perolehan melalui amaran awal, serta kawalan pelupusan sisa berjadual mengikut Akta Kualiti Alam Sekeliling Jabatan Alam Sekitar (DOE).

---

## 2. Sasaran Pengguna & Peranan (User Roles)

Sistem menetapkan 2 peringkat peranan pengguna utama:

1. **Admin / Pegawai (Pegawai Sains / Ketua Makmal / Pengurus Stor)**:
   - Bertanggungjawab mendaftarkan katalog bahan kimia baharu, merekod penerimaan stok masuk, menjana dan mencetak label QR, mengubah tetapan lokasi makmal, meluluskan pelupusan muktamad bahan berjadual, menyelia jejak audit (*Audit Trail*), serta menguruskan pendaftaran kakitangan dan sandaran data.
2. **Staf / Pembantu Makmal (Pembantu Makmal / Penolong Pegawai Sains / Juruteknik)**:
   - Bertanggungjawab menjalankan operasi harian: imbasan QR fizikal, carian pantas bahan, pemindahan botol ke bilik makmal pengujian, menandakan botol habis/tamat tempoh sebagai *Menunggu Pelupusan*, dan merujuk pautan *Safety Data Sheet* (SDS). Staf disekat daripada meluluskan pelupusan muktamad atau memadam rekod sejarah.

---

## 3. Matlamat & Metrik Kejayaan (Success Metrics)

- **Kebolehkesanan 100% (*Full Traceability*)**: Setiap botol fizikal didaftarkan dengan ID unik berturutan `CIS-YYYY-XXXX` dan kod QR tersendiri.
- **Sifar Penggunaan Bahan Luput**: 100% botol tamat tempoh (*expired*) atau hampir tamat tempoh ($\le$ 90 hari) dikesan secara automatik pada Dashboard.
- **Kepantasan Operasi Makmal**: Kakitangan boleh mencari atau mengimbas maklumat penuh botol dalam masa kurang daripada 1 saat.
- **Integriti Stok Aktif**: Pengiraan stok aktif hanya merangkumi botol berstatus `IN_STORE` dan `IN_LAB`; botol yang telah ditanda pelupusan ditolak serta-merta.

---

## 4. Peraturan Perniagaan (Business Rules & Edge Cases)

1. **Unit Penjejakan**: Sistem menjejak unit botol/bekas fizikal penuh (bukan isipadu pecahan ml/gram cecair yang tinggal).
2. **Pengiraan Baki Stok Aktif**: Hanya botol berstatus `IN_STORE` (Dalam Stor) dan `IN_LAB` (Di Makmal) dikira sebagai stok aktif. Botol berstatus `PENDING_DISPOSAL` (Menunggu Pelupusan) dan `DISPOSED` (Telah Dilupuskan) dikecualikan secara automatik.
3. **Keutamaan Amaran Tarikh Luput**:
   - Tarikh Luput < Tarikh Hari Ini: Dilabel **Merah / Telah Luput**.
   - Tarikh Luput $\le$ 90 Hari dari Hari Ini: Dilabel **Kuning / Hampir Luput**.
4. **Aliran Pelupusan 2 Langkah**:
   - Langkah 1: Mana-mana kakitangan boleh menanda botol aktif sebagai *Menunggu Pelupusan* berserta sebab (Habis Digunakan, Tamat Tempoh, Rosak).
   - Langkah 2: Hanya Admin boleh mengesahkan status *Telah Dilupuskan* dengan memasukkan Tarikh Lupus dan No. Rujukan Notis DOE.
5. **Kunci Rekod Dilupuskan**: Rekod botol yang telah dilupuskan dikunci sepenuhnya sebagai rekod arkib kekal; status atau lokasinya tidak boleh diubah semula.
6. **Pemindahan Lokasi**: Pengguna tidak boleh memindahkan botol ke lokasi yang sama dengan lokasi semasanya.
7. **Kamera Tidak Tersedia**: Jika perkakasan kamera tidak disokong atau dinafikan, sistem mesti menyediakan kotak carian manual dan sokongan pengimbas kod bar USB tanpa memaparkan ralat perisian.

---

## 5. Ringkasan Kriteria Penerimaan (Acceptance Criteria FR-001 hingga FR-011)

| Requirement ID | Ciri Fungsian | Kriteria Penerimaan (*Acceptance Criteria*) |
| :--- | :--- | :--- |
| **FR-001** | Simulasi Log Masuk & Role Switcher | Pertukaran peranan (Admin vs Staf) mengemas kini kebenaran butang tindakan serta-merta dan merekodkan nama pelaksana dalam jejak audit. |
| **FR-002** | Dashboard Pemantauan & Amaran | Memaparkan 4 kad ringkasan tepat: Botol Aktif, Botol Expired (Merah), Botol Hampir Expired $\le$ 90h (Kuning), dan Bahan Stok Rendah. |
| **FR-003** | Pendaftaran Stok Masuk (Stock In) | Kuantiti $N$ botol mencipta $N$ rekod berasingan dengan ID unik `CIS-YYYY-XXXX`, mengesahkan medan wajib, dan membuka modal cetakan label QR. |
| **FR-004** | Penjanaan & Cetakan Label QR | Kod QR SVG dijana jelas bersama metadata botol dan mempunyai susun atur cetakan kemas (`@media print`) tanpa elemen navigasi laman web. |
| **FR-005** | Carian Pantas, Penapis & Imbasan QR | Carian masa nyata bertindak balas < 200ms; imbasan kamera atau input ID manual memaparkan maklumat penuh botol dalam < 1 saat. |
| **FR-006** | Operasi Pemindahan Lokasi | Mengemas kini lokasi fizikal, menukar status botol kepada `Di Makmal`, dan mencatat perpindahan dalam jejak audit. |
| **FR-007** | Aliran Pelupusan 2 Langkah | Menanda pelupusan menolak botol dari baki aktif; pengesahan muktamad dikunci khas untuk peranan Admin. |
| **FR-008** | Amaran Stok Rendah | Kiraan botol aktif $\le$ paras minimum mencetuskan amaran stok rendah; Admin boleh mengubah suai ambang paras minimum. |
| **FR-009** | Rekod Sejarah (Audit Trail) & SDS | Profil botol memaparkan garis masa kronologi setiap tindakan (daftar, pindah, lupus) secara read-only dan pautan SDS rasmi boleh dibuka. |
| **FR-010** | Pengurusan Lokasi & Sandaran Data | Admin boleh menambah bilik makmal/stor baharu serta memuat turun/memulihkan fail sandaran JSON. |
| **FR-011** | Eksport Laporan CSV & Cetak PDF | Pengguna boleh mengeksport fail CSV (Inventori Penuh, Luput/Risiko, Pelupusan) yang serasi dibuka dalam Microsoft Excel serta cetakan PDF. |

---
*Chemical Inventory System (CIS) — Dokumen Keperluan Produk v1.0*
