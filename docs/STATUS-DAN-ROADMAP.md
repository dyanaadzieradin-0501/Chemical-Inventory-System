# Status Pembangunan & Perancangan Masa Depan (Status & Roadmap)
## Chemical Inventory System (CIS) — Versi 1.0

Dokumen ini merekodkan status sebenar ciri-ciri aplikasi, hasil pengesahan teknikal, batasan yang diketahui pada Fasa 1, dan perancangan penambahbaikan untuk fasa seterusnya.

---

## 1. Status Modul & Ciri Sistem

### A. Siap Dibina & Telah Diuji (Verified in MVP Fasa 1)

1. **Simulasi Log Masuk & Role Switcher (FR-001)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Penukaran peranan (Admin vs Staf) menukar kebenaran antaramuka serta-merta dan merekodkan nama pengguna aktif pada setiap transaksi Audit Trail.
2. **Dashboard Pemantauan & Amaran Proaktif (FR-002)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: 4 kad ringkasan metrik (Botol Aktif, Telah Luput, Hampir Luput $\le$ 90 Hari, dan Stok Rendah) mengira data secara tepat daripada storan inventori.
3. **Pendaftaran Stok Masuk mengikut Unit Botol (FR-003)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Kuantiti $N$ botol menjana $N$ rekod berasingan dengan ID unik berturutan `CIS-YYYY-XXXX` dan membuka modal cetakan QR pukal secara automatik.
4. **Penjanaan Label QR Code Fizikal (FR-004)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Kod QR SVG dijana jelas bersama nombor ID, saiz bekas, no. batch, dan tarikh luput mengikut format `@media print`.
5. **Carian Pantas & Penapis Pintar (FR-005)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Carian teks (nama bahan, no. CAS, ID botol, batch) dan penapisan mengikut lokasi, status, serta hazard GHS bertindak balas pantas (< 100ms).
6. **Operasi Pemindahan Lokasi Fizikal (FR-006)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Pemindahan mengemas kini lokasi semasa, menukar status botol kepada `Di Makmal`, dan menolak perpindahan ke bilik yang sama.
7. **Aliran Pelupusan 2 Langkah (FR-007)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Staf boleh menanda botol untuk Menunggu Pelupusan (ditolak dari baki stok aktif). Pengesahan muktamad dikunci khas untuk Admin dengan input wajib No. Rujukan DOE.
8. **Pengurusan Ambang Stok Rendah (FR-008)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Pengurangan baki botol aktif di bawah paras minimum mencetuskan amaran oren pada Dashboard; Admin boleh menetapkan paras minimum bagi setiap jenis bahan kimia.
9. **Jejak Audit Kronologi & SDS Link (FR-009)**:
   - *Status*: Telah dibina dan diuji.
   - *Pengesahan*: Garis masa jejak audit mencatatkan transaksi dari pendaftaran hingga pelupusan secara kekal; pautan SDS rasmi dibuka di tab baharu.
10. **Pengurusan Lokasi Makmal & Sandaran Data (FR-010)**:
    - *Status*: Telah dibina dan diuji.
    - *Pengesahan*: Penambahan lokasi bilik makmal baharu terus muncul dalam pilihan borang; fungsi muat turun fail sandaran JSON dan pemulihan data berfungsi lancar.
11. **Eksport Laporan CSV & Cetakan Dokumen (FR-011)**:
    - *Status*: Telah dibina dan diuji.
    - *Pengesahan*: Penjanaan 3 fail CSV (Inventori Penuh, Tamat Tempoh, dan Arkib Pelupusan) serasi dibuka dalam Microsoft Excel.
12. **Modul Pengurusan & Pendaftaran Pengguna Baharu**:
    - *Status*: Telah dibina dan diuji.
    - *Pengesahan*: Borang pendaftaran pengguna dengan semakan duplikasi ID staf dan emel rasmi berfungsi, membolehkan kakitangan baharu didaftarkan dan dipilih terus di Navbar.

---

### B. Perkara yang Belum Dapat Disahkan Secara Automatik (Unverified External Factors)

1. **Perkakasan Kamera Sebenar Pengguna**: Kod integrasi pengimbas kamera menggunakan `html5-qrcode` telah dipasang bersama mod fallback input manual; keserasian sebenar bergantung kepada kebenaran akses kamera pada peranti fizikal pengguna.
2. **Pencetak Label Pelekat Termal (*Thermal Label Printer*)**: Format cetakan telah diselaraskan dengan CSS `@media print` untuk kertas A4 dan label standard; penjajaran khusus bagi pencetak termal berjenama tertentu (contoh: Zebra, Brother QL) perlu diuji pada perkakasan sebenar institusi.

---

## 2. Batasan Semasa (Current Scope & Limitations pada Fasa 1)

- **Penyimpanan Setempat Pelayar (*Browser-Only Storage*)**: Data disimpan di dalam `localStorage` pelayar peranti. Data tidak disegerakkan secara automatik merentasi peranti berbeza melainkan pengguna mengeksport dan mengimport fail sandaran JSON.
- **Tiada Pengesahan Kata Laluan Sebenar**: Penukaran peranan (Admin vs Staf) menggunakan simulasi *Role Switcher* untuk kemudahan demonstrasi dan pengujian dalaman tanpa memerlukan pelayan pangkalan data.
- **Unit Penjejakan Botol Penuh**: Sistem tidak menjejaki pecahan baki cecair/serbuk secara mililiter atau gram di dalam botol yang telah dibuka.

---

## 3. Pelan Tindakan Masa Depan (Future Phases Roadmap — Fasa 2)

Perkara-perkara berikut dirancang untuk fasa pembangunan seterusnya apabila infrastruktur institusi sedia ada:

1. **Pangkalan Data Awan Berpusat (Cloud Database Sync)**:
   - Integrasi dengan pangkalan data awan (contoh: Supabase atau Firebase) untuk membolehkan data inventori dikemas kini dan disegerakkan merentasi semua peranti makmal secara masa nyata (*real-time multi-device sync*).
2. **Sistem Pengesahan Emel Rasmi (Single Sign-On / Authentication)**:
   - Log masuk individu menggunakan emel rasmi institusi (`@lgm.gov.my`) dan kata laluan selamat / SSO.
3. **Notifikasi Automatik (Emel / Telegram / WhatsApp)**:
   - Menghantar amaran mingguan secara automatik kepada Pegawai Sains bagi botol yang akan tamat tempoh dalam masa $\le$ 30 hari atau bahan kimia yang kehabisan stok.
4. **Modul Anggaran Bajet & Perancangan Perolehan**:
   - Menjana anggaran kos pembelian semula berdasarkan kekerapan penggunaan botol dan paras stok minimum.

---
*Chemical Inventory System (CIS) — Status & Roadmap v1.0*
