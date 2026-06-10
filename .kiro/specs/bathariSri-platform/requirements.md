# Requirements Document

<!-- Judul: Platform BathariSri v3.0 -->

## Introduction

BathariSri v3.0 adalah platform web berbasis kecerdasan buatan untuk mendukung petani padi muda Indonesia. Platform ini mengintegrasikan Computer Vision untuk deteksi penyakit daun (ResNet50 via FastAPI), Sistem Pendukung Keputusan berbasis TOPSIS untuk rekomendasi pupuk, prediksi hasil panen, dan rekomendasi pengolahan limbah, serta Kalkulator Agronomi berbasis aturan untuk jadwal tanam. Seluruh modul dibangun di atas tumpukan teknologi Laravel 13 + Inertia.js + React JSX + Tailwind CSS.

Dokumen ini diturunkan dari Technical Design Document BathariSri v3.0 dan menjadi acuan formal untuk implementasi, pengujian, dan validasi platform.

---

## Glossary

- **Sistem**: Platform web BathariSri v3.0 secara keseluruhan
- **Auth_Module**: Subsistem autentikasi dan otorisasi berbasis Laravel Breeze
- **RoleMiddleware**: Middleware PHP yang memverifikasi role pengguna sebelum mengizinkan akses ke rute terproteksi
- **Petani**: Pengguna akhir platform dengan role `petani` — petani padi yang menggunakan fitur agronomi
- **Admin**: Pengelola platform dengan role `admin` — memiliki akses penuh ke panel administrasi
- **Lahan**: Entitas data yang merepresentasikan petak sawah milik seorang Petani
- **PlantingCalculatorService**: Service PHP yang menghitung fase pertumbuhan padi dan jadwal pemupukan berbasis aturan agronomi
- **TopsisService**: Service PHP universal yang mengimplementasikan algoritma TOPSIS untuk perankingan alternatif keputusan
- **PadiScanService**: Service PHP yang berkomunikasi dengan endpoint FastAPI untuk inferensi model ResNet50
- **FertilizerSPKService**: Service PHP untuk Sistem Pendukung Keputusan rekomendasi pupuk (Modul 3) menggunakan TopsisService
- **HarvestPredictionService**: Service PHP untuk prediksi hasil panen (Modul 4) menggunakan TopsisService
- **WasteRecommendationService**: Service PHP untuk rekomendasi pengolahan limbah (Modul 5) menggunakan TopsisService
- **FastAPI**: Server Python lokal di `localhost:8000` yang menjalankan model ResNet50 untuk deteksi penyakit daun
- **HST**: Hari Setelah Tanam — jumlah hari sejak tanggal tanam
- **TOPSIS**: Technique for Order Preference by Similarity to Ideal Solution — metode DSS berbasis jarak ke solusi ideal
- **SPK**: Sistem Pendukung Keputusan
- **Severity**: Tingkat keparahan penyakit daun: `mild`, `moderate`, atau `severe`
- **CSV_Exporter**: Komponen ekspor menggunakan library `maatwebsite/excel`

---

## Requirements


### Requirement 1: Autentikasi dan Manajemen Sesi

**User Story:** Sebagai pengguna (admin atau petani), saya ingin login dengan email dan password, sehingga saya dapat mengakses fitur platform sesuai role saya secara aman.

#### Acceptance Criteria

1. WHEN seorang pengguna mengirimkan form login dengan email terdaftar dan password yang benar, THE Auth_Module SHALL mengautentikasi pengguna dan membuat sesi aktif
2. WHEN pengguna dengan `role = admin` berhasil login, THE Auth_Module SHALL mengarahkan pengguna ke `/admin/dashboard`
3. WHEN pengguna dengan `role = petani` berhasil login, THE Auth_Module SHALL mengarahkan pengguna ke `/petani/dashboard`
4. WHEN pengguna mengirimkan kredensial dengan email yang tidak terdaftar atau password yang salah, THE Auth_Module SHALL menolak login dan menampilkan pesan kesalahan tanpa menyebutkan kolom mana yang salah
5. WHEN pengguna dengan `is_active = false` mencoba login, THE Auth_Module SHALL menolak login dan menampilkan pesan "Akun dinonaktifkan"
6. WHEN seorang Petani yang sudah login mencoba mengakses rute `/admin/*`, THE RoleMiddleware SHALL mengembalikan respons HTTP 403
7. WHEN seorang Admin yang sudah login mencoba mengakses rute `/petani/*`, THE RoleMiddleware SHALL mengembalikan respons HTTP 403
8. WHEN pengguna yang belum login mencoba mengakses rute terproteksi, THE Auth_Module SHALL mengarahkan pengguna ke halaman login
9. WHEN seorang calon Petani mengirimkan form registrasi dengan data valid (nama, email unik, password minimal 8 karakter), THE Auth_Module SHALL membuat akun baru dengan `role = petani` dan `is_active = true`

---

### Requirement 2: Manajemen Lahan Petani

**User Story:** Sebagai Petani, saya ingin mengelola data lahan sawah saya, sehingga saya dapat menggunakan lahan sebagai konteks untuk semua modul analitik.

#### Acceptance Criteria

1. WHEN Petani mengirimkan form tambah lahan dengan data valid (nama lahan, luas dalam are, lokasi, jenis tanah, sumber air), THE Sistem SHALL menyimpan lahan baru dengan `user_id` sama dengan `auth()->id()`
2. WHEN Petani mengakses daftar lahan miliknya, THE Sistem SHALL menampilkan hanya lahan dengan `user_id` sama dengan pengguna yang sedang login
3. WHEN Petani memperbarui data lahan yang dimilikinya, THE Sistem SHALL menyimpan perubahan dan menampilkan data terbaru
4. WHEN Petani menghapus lahan miliknya, THE Sistem SHALL menonaktifkan lahan (`is_active = false`) dan tidak menampilkannya di daftar aktif
5. WHEN Petani mengirimkan form lahan dengan `luas_are <= 0` atau nama lahan kosong, THE Sistem SHALL menolak penyimpanan dan menampilkan pesan validasi
6. IF Petani mencoba mengakses atau memodifikasi lahan berdasarkan `lahan_id` yang `user_id`-nya tidak sama dengan `auth()->id()`, THEN THE Sistem SHALL mengembalikan respons HTTP 403
7. WHEN Petani belum memiliki lahan terdaftar dan mencoba mengakses modul analitik, THE Sistem SHALL menampilkan prompt "Tambah Lahan Dulu" sebelum melanjutkan

---

### Requirement 3: Modul 1 — Kalkulator Jadwal Tanam Cerdas

**User Story:** Sebagai Petani, saya ingin mengetahui fase pertumbuhan padi dan jadwal pemupukan berdasarkan tanggal tanam dan varietas, sehingga saya dapat melakukan tindakan agronomi pada waktu yang tepat.

#### Acceptance Criteria

1. WHEN Petani membuat jadwal tanam baru dengan tanggal semai, tanggal tanam, dan varietas yang valid, THE PlantingCalculatorService SHALL menghitung dan menyimpan estimasi tanggal panen berdasarkan `umur_panen_hari` varietas
2. WHEN Petani membuka halaman detail jadwal tanam, THE PlantingCalculatorService SHALL menghitung HST sebagai `max(0, selisih_hari(today, tanggal_tanam))`
3. WHEN HST dihitung, THE PlantingCalculatorService SHALL menetapkan fase pertumbuhan sesuai aturan: HST < 15 → `vegetatif_awal`; HST ∈ [15, round(umur_panen*0.40)) → `vegetatif_aktif`; HST ∈ [round(umur_panen*0.40), round(umur_panen*0.58)) → `reproduktif`; HST ∈ [round(umur_panen*0.58), umur_panen] → `pemasakan`; HST > umur_panen → `panen`
4. WHEN today bertambah satu hari dengan semua parameter lain konstan, THE PlantingCalculatorService SHALL menghasilkan `hst` yang bertambah tepat 1
5. THE PlantingCalculatorService SHALL menghasilkan `progress_pct` dalam rentang `[0.0, 100.0]` untuk semua nilai HST yang valid
6. WHEN HST berada dalam jendela `[21,25]`, `[40,45]`, atau `[55,60]`, THE PlantingCalculatorService SHALL menyertakan peringatan pemupukan aktif dalam array `alerts`
7. THE PlantingCalculatorService SHALL menghasilkan jadwal pemupukan di mana setiap event memiliki `hst_mulai <= hst_selesai`
8. WHEN PlantingCalculatorService menerima `umur_panen` di luar rentang 90–180 hari (eksklusif terhadap batas), THE Sistem SHALL menolak input sepenuhnya dan menampilkan pesan validasi, karena jadwal tanam tidak valid tanpa nilai umur panen yang benar
9. WHEN PlantingCalculatorService menerima `umur_panen` tepat di nilai batas 90 atau 180 hari, THE Sistem SHALL menampilkan pesan peringatan bahwa pengguna berada di batas rentang yang valid, sambil tetap menerima dan memproses input

---

### Requirement 4: Modul 2 — Deteksi Penyakit Daun

**User Story:** Sebagai Petani, saya ingin mengunggah foto daun padi dan mendapatkan diagnosis penyakit otomatis, sehingga saya dapat segera mengambil tindakan penanganan yang tepat.

#### Acceptance Criteria

1. WHEN Petani mengunggah gambar daun padi yang valid (JPEG/PNG/WebP, maksimal 5MB), THE Sistem SHALL mengirimkan gambar ke FastAPI dan menyimpan hasil deteksi ke `disease_scans`
2. WHEN FastAPI mengembalikan respons berhasil, THE Sistem SHALL menghitung `severity` berdasarkan aturan: `confidence >= 0.85` → `severe`; `confidence ∈ [0.65, 0.85)` → `moderate`; `confidence < 0.65` → `mild`
3. WHEN `predicted_class == 'healthy'` untuk sembarang nilai `confidence ∈ [0.0, 1.0]`, THE Sistem SHALL menetapkan `severity = null`
4. WHEN Petani mengunggah file bukan gambar atau melebihi 5MB, THE Sistem SHALL menolak upload dan menampilkan pesan validasi tanpa menyimpan file
5. IF FastAPI tidak dapat dijangkau atau melampaui batas waktu 30 detik, THEN THE Sistem SHALL melakukan rollback transaksi penuh: menghapus file yang sudah diupload, membatalkan semua catatan database yang dibuat sebagian, dan menampilkan pesan error "Sistem AI tidak tersedia"
6. WHILE Petani telah melakukan 20 scan dalam satu jam terakhir, THE Sistem SHALL menolak permintaan scan berikutnya dengan respons HTTP 429
7. WHEN Petani mengakses halaman riwayat scan, THE Sistem SHALL menampilkan hanya scan dengan `user_id` sama dengan pengguna yang sedang login
8. WHEN hasil scan tersedia, THE Sistem SHALL menampilkan nama penyakit, tingkat kepercayaan, severity, dan panduan penanganan dari `disease_refs` yang sesuai

---

### Requirement 5: Modul 3 — SPK Rekomendasi Pupuk (TOPSIS)

**User Story:** Sebagai Petani, saya ingin mendapatkan rekomendasi jenis dan dosis pupuk berdasarkan kondisi lahan saya, sehingga saya dapat mengoptimalkan pertumbuhan padi secara efisien.

#### Acceptance Criteria

1. WHEN Petani mengirimkan form SPK pupuk dengan input valid (fase pertumbuhan, kondisi penyakit, ketersediaan air, jenis tanah, riwayat pemupukan), THE FertilizerSPKService SHALL menjalankan algoritma TOPSIS dan menyimpan rekomendasi ke `spk_fertilizer_recs`
2. THE TopsisService SHALL menghasilkan hasil dengan jumlah item sama dengan jumlah alternatif yang diberikan, di mana rank merupakan permutasi dari `{1, 2, ..., n}` tanpa duplikasi
3. THE TopsisService SHALL menghasilkan nilai `score` dalam rentang `[0.0, 1.0]` untuk semua input matriks yang valid dengan semua nilai > 0
4. WHEN TopsisService dipanggil dengan input yang identik, THE TopsisService SHALL menghasilkan output yang identik (determinisme/idempoten)
5. WHEN FertilizerSPKService menghitung estimasi biaya, THE Sistem SHALL menghasilkan nilai `estimasi_biaya > 0` hanya untuk input dengan `luas_are > 0`; WHEN `luas_are == 0`, THE Sistem SHALL menolak kalkulasi biaya dan menampilkan pesan validasi
6. WHEN fase pertumbuhan dari PlantingCalculatorService tersedia untuk lahan yang dipilih, THE Sistem SHALL mengisi otomatis kolom fase pada form SPK
7. WHEN data scan penyakit terbaru tersedia untuk lahan yang dipilih, THE Sistem SHALL mengisi otomatis kolom kondisi penyakit pada form SPK
8. IF total `weights` yang dikirimkan Admin tidak berada dalam rentang `(0.999, 1.001)` eksklusif (yaitu, total ≤ 0.999 atau total ≥ 1.001), THEN THE Sistem SHALL menolak pembaruan bobot tanpa menampilkan total aktual

---

### Requirement 6: Modul 4 — Prediksi Hasil Panen (TOPSIS)

**User Story:** Sebagai Petani, saya ingin mendapatkan prediksi estimasi hasil panen berdasarkan kondisi saat ini, sehingga saya dapat merencanakan penjualan dan keuangan usaha tani.

#### Acceptance Criteria

1. WHEN Petani mengirimkan form prediksi panen dengan input valid, THE HarvestPredictionService SHALL menjalankan TOPSIS dan menyimpan hasil ke `harvest_predictions`
2. THE HarvestPredictionService SHALL menghasilkan `kategori` yang selalu merupakan salah satu dari `{sangat_baik, baik, cukup, rendah, berisiko}`
3. WHEN kategori panen ditentukan, THE HarvestPredictionService SHALL menghitung `estimasi_ton_ha` sebagai `faktor_kategori × potensi_hasil_ton_ha` varietas yang dipilih
4. WHEN `estimasi_ton_ha` tersedia, THE Sistem SHALL menghitung `estimasi_total_ton` sebagai `estimasi_ton_ha × (luas_are / 100)` dan `estimasi_pendapatan` menggunakan harga komoditas referensi
5. WHEN data rekomendasi pupuk (`spk_fertilizer_recs`) tersedia untuk lahan yang dipilih, THE Sistem SHALL menawarkan tautan kontekstual ke data tersebut sebagai input prediksi panen
6. THE Sistem SHALL menampilkan `faktor_risiko` yang menjelaskan komponen yang berkontribusi terhadap kategori panen yang diberikan

---

### Requirement 7: Modul 5 — Rekomendasi Pengolahan Limbah (TOPSIS)

**User Story:** Sebagai Petani, saya ingin mendapatkan rekomendasi cara mengolah limbah panen (jerami, sekam, dedak), sehingga saya dapat memperoleh nilai ekonomi tambahan dari hasil sampingan pertanian.

#### Acceptance Criteria

1. WHEN Petani mengirimkan form rekomendasi limbah dengan input valid, THE WasteRecommendationService SHALL menjalankan TOPSIS dan menyimpan hasil ke `waste_recommendations`
2. WHEN WasteRecommendationService menerima `estimasi_total_ton > 0`, THE Sistem SHALL menghitung volume limbah dengan formula: `jerami_kg = estimasi_total_ton × 1.2 × 1000`, `sekam_kg = estimasi_total_ton × 0.20 × 1000`, `dedak_kg = estimasi_total_ton × 0.08 × 1000`
3. WHEN volume limbah dihitung, nilai `jerami_kg / (estimasi_total_ton × 1000)` SHALL selalu berada dalam toleransi `1.2 ± 0.001`, dan `sekam_kg / (estimasi_total_ton × 1000)` SHALL selalu berada dalam toleransi `0.20 ± 0.001`
4. THE Sistem SHALL menghitung `total_nilai_ekonomi` berdasarkan volume limbah dikalikan harga referensi dari `waste_price_refs`
5. WHEN data prediksi panen (`harvest_predictions`) tersedia untuk lahan yang dipilih, THE Sistem SHALL mengisi otomatis nilai `estimasi_total_ton` pada form limbah

---

### Requirement 8: Panel Administrasi

**User Story:** Sebagai Admin, saya ingin mengelola seluruh aspek platform melalui panel terpusat, sehingga saya dapat memastikan data referensi akurat, bobot SPK optimal, dan pengguna dikelola dengan baik.

#### Acceptance Criteria

1. WHEN Admin mengakses `/admin/dashboard`, THE Sistem SHALL menampilkan ringkasan statistik: jumlah total petani aktif, total scan bulan ini, total SPK yang dijalankan, dan artikel terpublikasi
2. WHEN Admin mengakses daftar pengguna, THE Sistem SHALL menampilkan semua pengguna dengan role `petani` beserta status aktif/nonaktif
3. WHEN Admin mengklik toggle aktif/nonaktif pada pengguna, THE Sistem SHALL membalikkan nilai `is_active` pengguna tersebut dan menyimpan perubahan
4. WHEN Admin berhasil menonaktifkan pengguna yang sedang login, THE Auth_Module SHALL segera menginvalidasi sesi pengguna tersebut
5. WHEN Admin mengirimkan pembaruan bobot SPK dengan total dalam rentang `[0.999, 1.001]`, THE Sistem SHALL menyimpan konfigurasi bobot baru ke `spk_weight_configs`
6. IF Admin mengirimkan bobot SPK dengan total di luar rentang `(0.999, 1.001)` eksklusif (yaitu, total ≤ 0.999 atau total ≥ 1.001), THEN THE Sistem SHALL menolak pembaruan
7. WHEN Admin mengklik tombol reset bobot SPK, THE Sistem SHALL mengembalikan bobot ke nilai default yang telah dikonfigurasi seeder
8. THE Sistem SHALL menyediakan CRUD penuh untuk data referensi: `fertilizer_refs`, `disease_refs`, `variety_refs`, `commodity_prices`, dan `waste_price_refs`
9. WHEN Admin memperbarui data referensi, THE Sistem SHALL merefleksikan perubahan pada kalkulasi SPK dan tampilan di sisi petani
10. WHEN Admin mengirimkan form artikel baru dengan judul, konten, dan kategori, THE Sistem SHALL menyimpan artikel dengan `slug` unik yang diturunkan dari judul dan `author_id` dari Admin yang login
11. WHEN Admin mengekspor data scan ke CSV, THE CSV_Exporter SHALL menghasilkan file yang mengandung kolom: ID scan, nama petani, nama lahan, tanggal scan, predicted class, confidence, dan severity
12. WHEN Admin mengakses halaman riwayat scan, THE Sistem SHALL menampilkan semua scan dari semua petani dengan kemampuan filter berdasarkan tanggal dan predicted class

---

### Requirement 9: Dashboard Petani

**User Story:** Sebagai Petani, saya ingin melihat ringkasan kondisi pertanian saya dalam satu halaman, sehingga saya dapat memantau status semua lahan dan modul analitik dengan cepat.

#### Acceptance Criteria

1. WHEN Petani mengakses `/petani/dashboard`, THE Sistem SHALL menampilkan daftar lahan aktif yang dimiliki pengguna yang sedang login
2. WHEN Petani memiliki jadwal tanam aktif, THE Sistem SHALL menampilkan fase pertumbuhan terkini yang dihitung real-time oleh PlantingCalculatorService
3. WHEN Petani memiliki scan penyakit terbaru (dalam 7 hari terakhir), THE Sistem SHALL menampilkan ringkasan hasil scan terakhir termasuk predicted class dan severity; WHEN tidak ada scan dalam 7 hari terakhir, THE Sistem SHALL tidak menampilkan bagian predicted class dan severity
4. WHEN Petani memiliki rekomendasi pupuk atau prediksi panen terbaru, THE Sistem SHALL menampilkan tautan cepat ke hasil tersebut
5. THE Sistem SHALL menampilkan hanya data milik Petani yang sedang login — tidak ada kebocoran data antar pengguna

---

### Requirement 10: Artikel dan Tips Pertanian

**User Story:** Sebagai Petani, saya ingin membaca artikel dan tips pertanian yang relevan, sehingga saya dapat meningkatkan pengetahuan dan keterampilan budidaya padi.

#### Acceptance Criteria

1. WHEN Petani mengakses `/petani/artikel`, THE Sistem SHALL menampilkan daftar semua artikel dengan `is_published = true`, diurutkan berdasarkan `published_at` terbaru
2. WHEN Petani mengakses halaman artikel dengan slug yang valid dan artikel tersebut dipublikasikan, THE Sistem SHALL menampilkan konten lengkap artikel
3. IF Petani mencoba mengakses artikel dengan `is_published = false`, THEN THE Sistem SHALL mengembalikan respons HTTP 404
4. WHEN Admin mempublikasikan artikel, THE Sistem SHALL mengisi `published_at` dengan timestamp saat ini dan menyimpan `is_published = true`
5. WHERE artikel memiliki thumbnail, THE Sistem SHALL menampilkan gambar thumbnail pada daftar artikel
6. THE Sistem SHALL memastikan setiap artikel memiliki `slug` yang unik di seluruh tabel `articles`

---

## Correctness Properties

*Properti adalah karakteristik atau perilaku yang harus berlaku untuk semua eksekusi sistem yang valid — pernyataan formal tentang apa yang harus dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi secara otomatis.*

### Property 1: Keunikan Ranking TOPSIS

*Untuk setiap* panggilan `TopsisService::calculate()` dengan `n` alternatif (n ≥ 2) dan input valid (semua nilai > 0, bobot berjumlah ≈ 1.0), hasil selalu mengandung tepat `n` item dengan rank membentuk permutasi `{1, 2, ..., n}` tanpa duplikasi.

**Memvalidasi: Requirements 5.2, 6.1**

### Property 2: Batasan Skor TOPSIS

*Untuk sembarang* matriks alternatif valid di mana semua nilai > 0, semua bobot > 0 dan berjumlah ≈ 1.0, setiap `score` dalam output `TopsisService::calculate()` berada dalam interval `[0.0, 1.0]`.

**Memvalidasi: Requirements 5.3, 6.2**

### Property 3: Determinisme TOPSIS

*Untuk setiap* pasangan panggilan `TopsisService::calculate()` dengan input yang identik (alternatives, weights, types sama), kedua panggilan menghasilkan output yang identik (skor dan ranking sama).

**Memvalidasi: Requirements 5.4**

### Property 4: Monotonisitas HST

*Untuk setiap* tanggal tanam yang valid dan nilai `umur_panen` yang valid, jika `today_2 = today_1 + 1 hari`, maka `calculatePhase(..., today_2).hst == calculatePhase(..., today_1).hst + 1`.

**Memvalidasi: Requirements 3.4**

### Property 5: Batasan Progress Persentase

*Untuk setiap* kombinasi `tanggal_tanam`, `umur_panen ∈ [90, 180]`, dan `today` yang valid, `PlantingCalculatorService::calculatePhase()` selalu menghasilkan `progress_pct ∈ [0.0, 100.0]`.

**Memvalidasi: Requirements 3.5**

### Property 6: Validitas Jendela Jadwal Pupuk

*Untuk setiap* pasangan `(tanggal_tanam, umur_panen)` yang valid, semua event yang dihasilkan `PlantingCalculatorService::generateSchedule()` memiliki `hst_mulai <= hst_selesai`.

**Memvalidasi: Requirements 3.7**

### Property 7: Severity Null untuk Daun Sehat

*Untuk sembarang* nilai `confidence ∈ [0.0, 1.0]`, jika `predicted_class == 'healthy'`, maka `computeSeverity(predicted_class, confidence)` selalu mengembalikan `null`.

**Memvalidasi: Requirements 4.3**

### Property 8: Monotonisitas Severity terhadap Confidence

*Untuk setiap* `predicted_class` yang bukan `'healthy'`, fungsi `computeSeverity` menghasilkan `'severe'` ketika `confidence >= 0.85`, `'moderate'` ketika `confidence ∈ [0.65, 0.85)`, dan `'mild'` ketika `confidence < 0.65`.

**Memvalidasi: Requirements 4.2**

### Property 9: Konservasi Rasio Volume Limbah

*Untuk setiap* nilai `estimasi_total_ton > 0`, `WasteRecommendationService::computeWasteVolume()` menghasilkan `abs(jerami_kg / (estimasi_total_ton × 1000) - 1.2) <= 0.001` dan `abs(sekam_kg / (estimasi_total_ton × 1000) - 0.20) <= 0.001` dan `abs(dedak_kg / (estimasi_total_ton × 1000) - 0.08) <= 0.001`.

**Memvalidasi: Requirements 7.2, 7.3**

### Property 10: Kepemilikan Resource Eksklusif

*Untuk setiap* query yang dilakukan controller Petani terhadap lahan, scan penyakit, jadwal tanam, atau rekomendasi SPK, semua item yang dikembalikan memiliki `user_id == auth()->id()` — tidak ada data milik Petani lain yang bocor.

**Memvalidasi: Requirements 2.2, 4.7, 9.5**

### Property 11: Konsistensi Toggle Aktif Pengguna

*Untuk setiap* pengguna dengan nilai `is_active` awal `v`, setelah Admin menjalankan operasi toggle, nilai `is_active` pengguna tersebut menjadi `!v`.

**Memvalidasi: Requirements 8.3**

### Property 12: Validasi Total Bobot SPK

*Untuk setiap* set bobot yang berhasil disimpan melalui `AdminSpkController::update()`, jumlah semua bobot dalam satu modul berada dalam rentang eksklusif `(0.999, 1.001)` — nilai tepat di 0.999 atau 1.001 ditolak.

**Memvalidasi: Requirements 5.8, 8.5, 8.6**
