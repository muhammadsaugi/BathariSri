# Implementation Plan: Platform BathariSri v3.0

## Overview

Implementasi ini mengikuti urutan sprint 7 hari kerja. Setiap hari membangun di atas hasil hari sebelumnya: fondasi database & auth (Hari 1) → Lahan + Jadwal Tanam (Hari 2) → Deteksi Penyakit via FastAPI (Hari 3) → TOPSIS + SPK Pupuk (Hari 4) → SPK Panen & Limbah (Hari 5) → Panel Admin (Hari 6) → Dashboard & Polish (Hari 7).

Tumpukan teknologi: Laravel 13 + Inertia.js + React JSX + Tailwind CSS + PestPHP.

---

## Tasks

- [x] 1. HARI 1 — Fondasi: Database, Middleware, Auth

  - [x] 1.1 Drop migrasi v2 lama dan buat migrasi v3 baru
    - Hapus (via rollback) tabel v2: `smart_nurseries`, `ai_diagnoses`, `smart_wastes`, `nursery_logs`
    - Buat migration baru sesuai urutan dependency ERD:
      1. `update_users_table_v3` — tambah kolom `role` (enum admin/petani), `phone`, `alamat`, `avatar`, `is_active`
      2. `create_lahans_table`
      3. `create_disease_refs_table`
      4. `create_variety_refs_table`
      5. `create_fertilizer_refs_table`
      6. `create_commodity_prices_table`
      7. `create_waste_price_refs_table`
      8. `create_spk_weight_configs_table`
      9. `create_planting_schedules_table`
      10. `create_disease_scans_table`
      11. `create_spk_fertilizer_recs_table`
      12. `create_harvest_predictions_table`
      13. `create_waste_recommendations_table`
      14. `create_articles_table`
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 10.1_

  - [x] 1.2 Buat Seeder data referensi dan pengguna awal
    - `DiseaseRefSeeder` — 4 penyakit: `bacterial_leaf_blight`, `brown_spot`, `leaf_blast`, `healthy` (dengan kolom `penanganan_mild/moderate/severe`, `pencegahan`)
    - `VarietyRefSeeder` — 5 varietas (nama, `umur_panen_hari`, `potensi_hasil_ton_ha`)
    - `FertilizerRefSeeder` — 6 pupuk (A1–A6: Urea+SP36+KCl, NPK Phonska, Urea+Kompos, Organik Penuh, Foliar, Tunda)
    - `SpkWeightConfigSeeder` — bobot default untuk modul M3, M4, M5 (total per modul = 1.0)
    - `AdminUserSeeder` — 1 admin + 1 petani demo (`is_active = true`, password di-hash)
    - Orkestrasi di `DatabaseSeeder.php`
    - _Requirements: 8.7, 8.8_

  - [x] 1.3 Buat `RoleMiddleware` dan daftarkan di `bootstrap/app.php`
    - Buat `app/Http/Middleware/RoleMiddleware.php`
    - Cek `auth()->user()->role !== $role` → `abort(403)`
    - Daftarkan alias `'role'` di `bootstrap/app.php` dalam `->withMiddleware()`
    - _Requirements: 1.6, 1.7_

  - [x] 1.4 Update `HandleInertiaRequests.php` untuk shared data global
    - Tambah ke array `share()`: `auth.user` (dengan `role`, `avatar`), `flash` (success/error), `has_lahan` (boolean cek lahan aktif milik user yang login)
    - _Requirements: 1.2, 1.3, 2.7_

  - [x] 1.5 Update model `User` dan redirect login berdasarkan role
    - Tambah properti `$fillable`, `$casts`, dan relasi: `lahans()`, `diseaseScans()`, `plantingSchedules()`, `spkFertilizerRecs()`, `harvestPredictions()`, `wasteRecommendations()`
    - Update `AuthenticatedSessionController` — setelah login, redirect ke `/admin/dashboard` jika `role=admin`, ke `/petani/dashboard` jika `role=petani`
    - Tambah guard aktif di `AuthenticatedSessionController`: jika `is_active == false`, tolak login dengan pesan "Akun dinonaktifkan"
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [x] 1.6 Update `routes/web.php` dengan route groups petani dan admin
    - Hapus route lama v2 (`/diagnosis`, `/smart-nursery`, `/smart-waste`, `/dashboard` lama)
    - Tambah route group `petani` dengan middleware `['auth', 'role:petani']` dan prefix `/petani`
    - Tambah route group `admin` dengan middleware `['auth', 'role:admin']` dan prefix `/admin`
    - Sertakan semua route sesuai spesifikasi desain (lahan, tanam, scan, spk, artikel untuk petani; dashboard, users, scan, referensi, spk, artikel untuk admin)
    - _Requirements: 1.6, 1.7, 1.8_

- [x] 2. HARI 2 — Manajemen Lahan + Modul 1 (Jadwal Tanam)

  - [x] 2.1 Buat model `Lahan` dan `LahanController` (CRUD Petani)
    - Buat `app/Models/Lahan.php` dengan `$fillable`, `$casts`, relasi `user()`, `diseaseScans()`, `plantingSchedules()`, scope `active()`
    - Buat `app/Http/Controllers/Petani/LahanController.php` dengan method `index`, `create`, `store`, `edit`, `update`, `destroy`
    - `store` dan `update`: validasi `nama_lahan` (required), `luas_are` (numeric, min:0.01), `jenis_tanah` (enum), `sumber_air` (enum)
    - `destroy`: soft-delete via `is_active = false` (bukan hard delete)
    - Semua query filter `user_id = auth()->id()`; akses resource milik user lain → abort(403)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 2.2 Buat halaman React untuk Manajemen Lahan
    - `resources/js/Pages/Petani/Lahan/Index.jsx` — tabel daftar lahan aktif, tombol tambah, edit, hapus (soft)
    - `resources/js/Pages/Petani/Lahan/Create.jsx` — form tambah lahan dengan validasi Inertia
    - `resources/js/Pages/Petani/Lahan/Edit.jsx` — form edit lahan
    - Tampilkan prompt "Belum ada lahan" jika daftar kosong
    - _Requirements: 2.1, 2.7_

  - [x] 2.3 Buat `PlantingCalculatorService`
    - Buat `app/Services/PlantingCalculatorService.php`
    - Implementasi `calculatePhase(Carbon $tanggal_tanam, int $umur_panen, Carbon $today = null): array`
      - `hst = max(0, today->diffInDays(tanggal_tanam))`
      - Batas fase: `batas_reproduktif = round(umur_panen * 0.40)`, `batas_pemasakan = round(umur_panen * 0.58)`
      - Return: `hst`, `fase`, `fase_label`, `fase_index`, `progress_pct = min(100.0, hst/umur_panen*100)`, `alerts`, `next_event`, `days_to_next`
      - Alert pemupukan aktif jika hst ∈ [21,25] OR [40,45] OR [55,60]
    - Implementasi `generateSchedule(Carbon $tanggal_tanam, int $umur_panen): array`
      - Return array event pupuk (Dasar, Susulan 1, 2, 3) dengan `hst_mulai`, `hst_selesai`, `tanggal_mulai`, `tanggal_selesai`, `status`
      - Pastikan setiap event memiliki `hst_mulai <= hst_selesai`
    - Validasi input: tolak `umur_panen` di luar (90, 180) eksklusif; tampilkan warning di batas 90 atau 180
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_

  - [x]* 2.4 Tulis property test untuk `PlantingCalculatorService`
    - **Property 4: Monotonisitas HST** — untuk `today_2 = today_1 + 1 hari`, `hst` bertambah tepat 1
    - **Memvalidasi: Requirements 3.4**
    - **Property 5: Batasan Progress Persentase** — untuk semua `umur_panen ∈ [90,180]`, `progress_pct ∈ [0.0, 100.0]`
    - **Memvalidasi: Requirements 3.5**
    - **Property 6: Validitas Jendela Jadwal Pupuk** — semua event memiliki `hst_mulai <= hst_selesai`
    - **Memvalidasi: Requirements 3.7**
    - Buat file `tests/Unit/PlantingCalculatorServiceTest.php`
    - Gunakan PestPHP dengan loop/dataset untuk menghasilkan kombinasi input acak

  - [x] 2.5 Buat model `PlantingSchedule` dan `PlantingController`
    - Buat `app/Models/PlantingSchedule.php` dengan relasi `user()`, `lahan()`, `spkFertilizerRecs()`
    - Buat `app/Http/Controllers/Petani/PlantingController.php` dengan `index`, `create`, `store`, `show`
    - `store`: validasi `lahan_id`, `varietas`, `tanggal_semai`, `tanggal_tanam`, `umur_panen_hari`; simpan `estimasi_panen` = `tanggal_tanam + umur_panen_hari hari`; simpan `jadwal_pupuk` (JSON dari `generateSchedule`)
    - `show`: panggil `calculatePhase()` real-time; kirim ke frontend
    - Filter semua query dengan `user_id = auth()->id()`
    - _Requirements: 3.1, 3.2, 3.6_

  - [x] 2.6 Buat halaman React untuk Modul 1 (Jadwal Tanam)
    - `resources/js/Pages/Tanam/Index.jsx` — daftar musim tanam aktif petani
    - `resources/js/Pages/Tanam/Create.jsx` — form input: pilih lahan, pilih varietas (dari `variety_refs`), tanggal semai, tanggal tanam
    - `resources/js/Pages/Tanam/Show.jsx` — dashboard visual: indikator fase pertumbuhan, progress bar, timeline jadwal pupuk, peringatan aktif, estimasi panen
    - _Requirements: 3.1, 3.6, 9.2_

- [x] 3. HARI 3 — Modul 2 (Deteksi Penyakit via FastAPI)

  - [x] 3.1 Buat model `DiseaseRef`, `DiseaseScan`, dan semua relasi Eloquent
    - Buat `app/Models/DiseaseRef.php` dengan `$fillable` dan kolom penanganan per severity
    - Buat `app/Models/DiseaseScan.php` dengan `$fillable`, `$casts`, relasi `user()`, `lahan()`, `diseaseRef()` (by `predicted_class = disease_key`), `spkFertilizerRec()`
    - Update relasi di `User` dan `Lahan` jika belum lengkap
    - _Requirements: 4.1, 4.8_

  - [x] 3.2 Implementasi lengkap `PadiScanService`
    - Update/buat `app/Services/PadiScanService.php`
    - `predict(string $imagePath): array` — HTTP POST multipart ke `PADISCAN_API_URL/api/v1/predict` (dari `.env`), timeout 30 detik, lempar `PadiScanException` jika gagal/timeout
    - `isHealthy(): bool` — cek endpoint FastAPI tersedia
    - Buat custom exception `app/Exceptions/PadiScanException.php`
    - _Requirements: 4.1, 4.5_

  - [x]* 3.3 Tulis property test untuk logika severity
    - **Property 7: Severity Null untuk Daun Sehat** — untuk sembarang `confidence ∈ [0.0, 1.0]` dengan `predicted_class == 'healthy'`, severity = `null`
    - **Memvalidasi: Requirements 4.3**
    - **Property 8: Monotonisitas Severity terhadap Confidence** — verifikasi ketiga threshold (>=0.85 → severe, [0.65,0.85) → moderate, <0.65 → mild) dengan berbagai nilai confidence
    - **Memvalidasi: Requirements 4.2**
    - Buat file `tests/Unit/SeverityComputationTest.php`

  - [x] 3.4 Buat `ScanController` dengan throttle, CRUD, dan rollback error
    - Buat `app/Http/Controllers/Petani/ScanController.php`
    - `store`: validasi file (image, mimes:jpg,jpeg,png,webp, max:5120); rate limit throttle:20,1 (via route middleware); simpan file ke `storage/app/public/scans/{user_id}/`; panggil `PadiScanService::predict()`; jika `PadiScanException` → hapus file + return error "Sistem AI tidak tersedia"; hitung severity via `computeSeverity()`; INSERT ke `disease_scans`
    - `index`: tampilkan riwayat scan milik `auth()->id()`
    - `show`: load scan + relasi `diseaseRef` untuk panduan penanganan
    - `destroy`: hapus record + file fisik
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [x] 3.5 Buat halaman React untuk Modul 2 (Scan Penyakit)
    - `resources/js/Pages/Scan/Penyakit.jsx` — form upload gambar, pilih lahan, loading spinner saat proses AI
    - `resources/js/Pages/Scan/Hasil.jsx` — tampil nama penyakit, confidence, severity, panduan penanganan dari `disease_refs`
    - `resources/js/Pages/Scan/Riwayat.jsx` — tabel riwayat scan milik petani
    - _Requirements: 4.1, 4.4, 4.8_

- [x] 4. Checkpoint Hari 3 — Pastikan Semua Tes Unit Lulus
  - Jalankan `php artisan test --filter PlantingCalculator` dan `--filter Severity`
  - Pastikan semua tes unit dan property test lulus, tanyakan ke user jika ada kendala.

- [x] 5. HARI 4 — TopsisService + Modul 3 (SPK Rekomendasi Pupuk)

  - [x] 5.1 Implementasi `TopsisService` (universal, 6 langkah TOPSIS)
    - Buat `app/Services/TopsisService.php`
    - `calculate(array $alternatives, array $weights, array $types): array` — orchestrates 5 private steps
    - `normalize(array $matrix): array` — r_ij = x_ij / sqrt(Σ x_kj²) per kolom
    - `weight(array $normalized, array $weights): array` — v_ij = w_j × r_ij
    - `idealSolutions(array $weighted, array $types): array` — A+ dan A- per benefit/cost
    - `computeScores(array $weighted, array $idealPos, array $idealNeg): array` — Ci = D- / (D+ + D-)
    - Step 6: sort descending, assign rank mulai dari 1
    - _Requirements: 5.2, 5.3, 5.4_

  - [x]* 5.2 Tulis property test untuk `TopsisService`
    - **Property 1: Keunikan Ranking TOPSIS** — untuk `n` alternatif, rank membentuk permutasi `{1,...,n}` tanpa duplikasi
    - **Memvalidasi: Requirements 5.2, 6.1**
    - **Property 2: Batasan Skor TOPSIS** — semua skor ∈ [0.0, 1.0]
    - **Memvalidasi: Requirements 5.3, 6.2**
    - **Property 3: Determinisme TOPSIS** — input identik → output identik
    - **Memvalidasi: Requirements 5.4**
    - Buat file `tests/Unit/TopsisServiceTest.php`
    - Gunakan PestPHP dataset dengan berbagai ukuran matriks (2–8 alternatif, 3–6 kriteria)

  - [x] 5.3 Buat `FertilizerSPKService` dan model `SpkFertilizerRec`
    - Buat `app/Models/SpkFertilizerRec.php` dengan relasi `user()`, `lahan()`, `planting()`, `diseaseScan()`, `harvestPrediction()`
    - Buat `app/Models/SpkWeightConfig.php`
    - Buat `app/Services/FertilizerSPKService.php` — inject `TopsisService`
    - `generate(array $input, float $luas_are): array` — ambil bobot dari `spk_weight_configs` modul=M3; bangun matriks 6×5 dari `ALTERNATIVE_MATRIX` + input petani (pemetaan `PHASE_SCORES`, `DISEASE_SCORES`); panggil `TopsisService::calculate()`; hitung `estimasi_biaya` (validasi `luas_are > 0`); INSERT ke `spk_fertilizer_recs`
    - Pre-fill otomatis: ambil fase dari `planting_schedules` terbaru, ambil `kondisi_penyakit` dari `disease_scans` terbaru untuk lahan yang dipilih
    - _Requirements: 5.1, 5.5, 5.6, 5.7_

  - [x] 5.4 Buat `SPK/FertilizerController`
    - Buat `app/Http/Controllers/Petani/SPK/FertilizerController.php`
    - `create`: ambil lahan petani, pre-fill data dari M1/M2 jika tersedia, kirim ke view
    - `store`: validasi input SPK; panggil `FertilizerSPKService::generate()`; redirect ke hasil
    - Semua query filter `user_id = auth()->id()`
    - _Requirements: 5.1, 5.6, 5.7_

  - [x] 5.5 Buat halaman React `Pages/SPK/Pupuk.jsx`
    - Form input: pilih lahan (auto-pilih jika hanya satu), fase pertumbuhan (pre-fill dari M1), kondisi penyakit (pre-fill dari M2), ketersediaan air, jenis tanah, riwayat pemupukan
    - Tampilkan hasil: tabel ranking TOPSIS semua alternatif, rekomendasi terpilih (rank 1), detail pupuk (jenis, dosis, jadwal), estimasi biaya
    - _Requirements: 5.1, 5.6, 5.7, 9.4_

- [ ] 6. HARI 5 — Modul 4 (Prediksi Panen) + Modul 5 (Rekomendasi Limbah)

  - [x] 6.1 Buat `HarvestPredictionService` dan model `HarvestPrediction`
    - Buat `app/Models/HarvestPrediction.php` dengan relasi `user()`, `lahan()`, `spkFertilizer()`, `wasteRecommendation()`
    - Buat `app/Services/HarvestPredictionService.php` — inject `TopsisService`
    - `generate(array $input, Lahan $lahan, VarietyRef $variety): array`
      - Jalankan TOPSIS, tentukan `kategori` dari `{sangat_baik, baik, cukup, rendah, berisiko}`
      - `estimasi_ton_ha = HARVEST_CATEGORIES[$kategori]['faktor'] × $variety->potensi_hasil_ton_ha`
      - `estimasi_total_ton = estimasi_ton_ha × (luas_are / 100)`
      - `estimasi_pendapatan = estimasi_total_ton × commodity_price->harga_per_ton` (dari `commodity_prices`)
      - INSERT ke `harvest_predictions`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

  - [x] 6.2 Buat `WasteRecommendationService` dan model `WasteRecommendation`
    - Buat `app/Models/WasteRecommendation.php` dengan relasi `user()`, `lahan()`, `harvest()`
    - Buat `app/Services/WasteRecommendationService.php` — inject `TopsisService`
    - `computeWasteVolume(float $estimasi_total_ton): array` — `jerami_kg = ton×1.2×1000`, `sekam_kg = ton×0.20×1000`, `dedak_kg = ton×0.08×1000`; validasi input > 0
    - `generate(array $input, float $estimasi_total_ton): array` — hitung volume limbah; jalankan TOPSIS per jenis limbah; ambil harga dari `waste_price_refs`; hitung `total_nilai_ekonomi`; INSERT ke `waste_recommendations`
    - Pre-fill: ambil `estimasi_total_ton` dari `harvest_predictions` terbaru untuk lahan yang dipilih
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x]* 6.3 Tulis property test untuk `WasteRecommendationService`
    - **Property 9: Konservasi Rasio Volume Limbah** — untuk sembarang `estimasi_total_ton > 0`, verifikasi `abs(jerami_kg/(ton×1000) - 1.2) <= 0.001`, `abs(sekam_kg/(ton×1000) - 0.20) <= 0.001`, `abs(dedak_kg/(ton×1000) - 0.08) <= 0.001`
    - **Memvalidasi: Requirements 7.2, 7.3**
    - Buat file `tests/Unit/WasteRecommendationServiceTest.php`
    - Gunakan dataset dengan berbagai nilai `estimasi_total_ton` (desimal, besar, kecil)

  - [x] 6.4 Buat `SPK/HarvestController` dan `SPK/WasteController`
    - Buat `app/Http/Controllers/Petani/SPK/HarvestController.php` (`create`, `store`) — pre-fill dari `spk_fertilizer_recs` terbaru; sertakan `faktor_risiko` di response
    - Buat `app/Http/Controllers/Petani/SPK/WasteController.php` (`create`, `store`) — pre-fill `estimasi_total_ton` dari `harvest_predictions` terbaru
    - _Requirements: 6.1, 6.5, 7.1, 7.5_

  - [x] 6.5 Buat halaman React `Pages/SPK/Panen.jsx` dan `Pages/SPK/Limbah.jsx`
    - `Panen.jsx` — form input kondisi lahan, pilih varietas; tampil kategori panen, estimasi ton/ha, estimasi total ton, estimasi pendapatan, `faktor_risiko` dengan breakdown komponen; tautan ke rekomendasi pupuk terkait
    - `Limbah.jsx` — form input pre-fill dari M4; tampil volume limbah per jenis (jerami, sekam, dedak), rekomendasi pengolahan (ranking TOPSIS), total nilai ekonomi
    - _Requirements: 6.2, 6.3, 6.4, 6.6, 7.2, 7.3, 7.4_

- [x] 7. Checkpoint Hari 5 — Semua Property Test Lulus
  - Jalankan `php artisan test --filter TopsisService` dan `--filter WasteRecommendation`
  - Pastikan semua property test (Property 1–9) lulus, tanyakan ke user jika ada kendala.

- [x] 8. HARI 6 — Panel Administrasi

  - [x] 8.1 Buat `Admin/DashboardController` dengan statistik dan data chart
    - Buat `app/Http/Controllers/Admin/DashboardController.php`
    - Statistik: total petani aktif, total scan bulan ini, total SPK dijalankan bulan ini, total artikel terpublikasi
    - Data chart: scan per hari (7 hari terakhir), distribusi predicted_class
    - _Requirements: 8.1_

  - [x] 8.2 Buat `Admin/UserController` (index + toggle active)
    - Buat `app/Http/Controllers/Admin/UserController.php`
    - `index`: daftar semua pengguna `role=petani` dengan status aktif/nonaktif + pagination
    - `toggle`: balikkan `is_active`; jika user sedang login, invalidasi sesi mereka via `Auth::logoutOtherDevices()` atau hapus token sesi aktif
    - _Requirements: 8.2, 8.3, 8.4_

  - [x]* 8.3 Tulis property test untuk toggle aktif pengguna
    - **Property 11: Konsistensi Toggle Aktif Pengguna** — untuk nilai `is_active` awal `v`, setelah toggle, nilai menjadi `!v`; setelah toggle kedua, kembali ke `v`
    - **Memvalidasi: Requirements 8.3**
    - Buat file `tests/Unit/UserToggleTest.php`

  - [x] 8.4 Buat `Admin/ScanController` (index + export CSV)
    - Buat `app/Http/Controllers/Admin/ScanController.php`
    - `index`: semua scan dari semua petani, filter berdasarkan tanggal dan `predicted_class`, pagination
    - `export`: gunakan `maatwebsite/excel` (streaming) untuk export CSV dengan kolom: ID scan, nama petani, nama lahan, tanggal scan, predicted class, confidence, severity
    - Jalankan `composer require maatwebsite/excel:^3.1` jika belum terpasang
    - _Requirements: 8.11, 8.12_

  - [x] 8.5 Buat CRUD Admin untuk semua tabel referensi
    - `Admin/Referensi/FertilizerRefController.php` — resource CRUD penuh (`index`, `create`, `store`, `edit`, `update`, `destroy`)
    - `Admin/Referensi/DiseaseRefController.php` — resource CRUD penuh
    - `Admin/Referensi/VarietyRefController.php` — resource CRUD penuh
    - `Admin/Referensi/CommodityPriceController.php` — resource CRUD penuh
    - `Admin/Referensi/WastePriceRefController.php` — resource CRUD penuh
    - Buat model yang belum ada: `FertilizerRef`, `VarietyRef`, `CommodityPrice`, `WastePriceRef`
    - _Requirements: 8.8, 8.9_

  - [x] 8.6 Buat `Admin/SpkController` (konfigurasi bobot + reset)
    - Buat `app/Http/Controllers/Admin/SpkController.php`
    - `index`: tampilkan bobot saat ini per modul (M3, M4, M5) dari `spk_weight_configs`
    - `update`: validasi `weights.*` (numeric, min:0.01, max:0.99); cek `abs(sum(weights) - 1.0) > 0.001` → tolak tanpa tampilkan total aktual; simpan ke `spk_weight_configs`
    - `reset`: kembalikan bobot ke nilai default dari `SpkWeightConfigSeeder`
    - _Requirements: 5.8, 8.5, 8.6, 8.7_

  - [x]* 8.7 Tulis property test untuk validasi bobot SPK
    - **Property 12: Validasi Total Bobot SPK** — untuk setiap set bobot yang berhasil disimpan, jumlah berada dalam rentang eksklusif `(0.999, 1.001)`; nilai tepat di 0.999 atau 1.001 ditolak
    - **Memvalidasi: Requirements 5.8, 8.5, 8.6**
    - Buat file `tests/Unit/SpkWeightValidationTest.php`

  - [x] 8.8 Buat `Admin/ArtikelController` (CRUD + publish) dan model `Article`
    - Buat `app/Models/Article.php` dengan scope `published()`, `$casts`, relasi `author()`; pastikan `slug` unik
    - Buat `app/Http/Controllers/Admin/ArtikelController.php` resource penuh
    - `store`/`update`: generate `slug` dari judul (unik); set `author_id = auth()->id()`
    - `publish` (via update `is_published=true`): set `published_at = now()`
    - _Requirements: 8.10, 10.4, 10.6_

  - [x] 8.9 Buat semua halaman React untuk Panel Admin
    - `Pages/Admin/Dashboard.jsx` — kartu statistik + chart scan
    - `Pages/Admin/Users/Index.jsx` — tabel petani dengan toggle aktif/nonaktif
    - `Pages/Admin/Scan/Index.jsx` — tabel semua scan dengan filter tanggal + predicted_class, tombol export CSV
    - `Pages/Admin/Referensi/Pupuk/` — Index, Create, Edit (form CRUD `fertilizer_refs`)
    - `Pages/Admin/Referensi/Penyakit/` — Index, Create, Edit (form CRUD `disease_refs`)
    - `Pages/Admin/Referensi/Varietas/` — Index, Create, Edit
    - `Pages/Admin/Referensi/Harga/` — Index, Create, Edit (`commodity_prices`)
    - `Pages/Admin/Referensi/Limbah/` — Index, Create, Edit (`waste_price_refs`)
    - `Pages/Admin/SpkBobot.jsx` — form bobot per modul M3/M4/M5 dengan validasi total = 1.00 + tombol reset
    - `Pages/Admin/Artikel/Index.jsx`, `Create.jsx`, `Edit.jsx` — CRUD artikel dengan toggle publish
    - _Requirements: 8.1–8.12_

- [x] 9. HARI 7 — Dashboard Petani, Layouts, Artikel, dan Integration Tests

  - [x] 9.1 Buat `Petani/DashboardController` dengan ringkasan real-time
    - Buat `app/Http/Controllers/Petani/DashboardController.php`
    - `index`: ambil lahan aktif milik `auth()->id()`; untuk setiap lahan, ambil planting aktif terbaru dan hitung fase real-time via `PlantingCalculatorService::calculatePhase()`; ambil scan terbaru (7 hari terakhir); ambil rekomendasi pupuk/prediksi panen terbaru; kirim ke view
    - Pastikan TIDAK ada data petani lain yang bocor
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [x] 9.2 Buat `Pages/Petani/Dashboard.jsx`
    - Kartu ringkasan per lahan: nama lahan, fase pertumbuhan terkini (badge warna), progress bar musim tanam
    - Kartu scan terakhir (jika ada scan ≤ 7 hari): predicted class + severity + badge warna
    - Kartu quick links: ke SPK pupuk/panen/limbah terbaru jika tersedia
    - Tampil prompt "Tambah Lahan Dulu" jika `has_lahan === false`
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 9.3 Buat `ArtikelController` (Petani) dan halaman artikel read-only
    - Buat `app/Http/Controllers/Petani/ArtikelController.php`
    - `index`: tampilkan artikel `is_published = true`, diurutkan `published_at DESC`
    - `show`: tampilkan artikel by slug; jika `is_published = false` → abort(404)
    - Buat `Pages/Petani/Artikel/Index.jsx` — grid artikel dengan thumbnail, judul, kategori, tanggal
    - Buat `Pages/Petani/Artikel/Show.jsx` — konten lengkap artikel + thumbnail
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [x] 9.4 Buat `PetaniLayout.jsx` dan `AdminLayout.jsx`
    - `resources/js/Layouts/PetaniLayout.jsx` — sidebar navigasi petani (Dashboard, Lahan, Tanam, Scan Penyakit, SPK Pupuk/Panen/Limbah, Artikel), header dengan nama user + avatar, tombol logout
    - `resources/js/Layouts/AdminLayout.jsx` — sidebar navigasi admin (Dashboard, Pengguna, Riwayat Scan, Referensi Data, Konfigurasi SPK, Artikel), header dengan nama admin + tombol logout
    - Integrasikan `has_lahan` dari shared data Inertia untuk prompt modal di PetaniLayout
    - _Requirements: 1.2, 1.3, 2.7_

  - [x]* 9.5 Tulis integration test alur M1→M3
    - Test: Petani membuat jadwal tanam → fase tersedia → form SPK pupuk ter-pre-fill dengan fase yang benar → TOPSIS berjalan → rekomendasi tersimpan
    - Buat file `tests/Feature/PlantingToFertilizerFlowTest.php`
    - _Requirements: 5.6_

  - [x]* 9.6 Tulis integration test alur M2→M3
    - Test: Petani melakukan scan (mock FastAPI) → kondisi penyakit tersedia → form SPK pupuk ter-pre-fill dengan kondisi penyakit → TOPSIS berjalan → rekomendasi tersimpan
    - Buat file `tests/Feature/ScanToFertilizerFlowTest.php`
    - _Requirements: 5.7_

  - [x]* 9.7 Tulis integration test alur M4→M5
    - Test: Prediksi panen tersimpan dengan `estimasi_total_ton` → form limbah ter-pre-fill → volume limbah dihitung → rekomendasi limbah tersimpan
    - Buat file `tests/Feature/HarvestToWasteFlowTest.php`
    - _Requirements: 7.5_

  - [x]* 9.8 Tulis integration test kepemilikan resource eksklusif
    - **Property 10: Kepemilikan Resource Eksklusif** — verifikasi controller tidak mengembalikan data milik petani lain
    - **Memvalidasi: Requirements 2.2, 4.7, 9.5**
    - Buat file `tests/Feature/ResourceOwnershipTest.php`
    - Buat dua user petani dengan data masing-masing; pastikan query salah user tidak mengambil data user lain

- [ ] 10. Checkpoint Final — Semua Tes Lulus dan Responsive Check
  - Jalankan `php artisan test` untuk semua unit, property, dan integration tests
  - Perbaiki UI minor jika ada komponen yang tidak responsif di mobile
  - Pastikan semua tes lulus, tanyakan ke user jika ada kendala.

---

## Notes

- Task bertanda `*` adalah opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Checkpoint memastikan validasi inkremental setiap 2–3 hari
- Property test memvalidasi invariant matematika kritis (TOPSIS, HST, severity, volume limbah)
- Integration test memvalidasi alur lintas modul (M1→M3, M2→M3, M4→M5)
- Semua controller petani wajib filter `user_id = auth()->id()` untuk keamanan kepemilikan data
- Gunakan `php artisan test --run` (PestPHP) untuk menjalankan tes sekali tanpa watch mode

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3"] },
    { "id": 1, "tasks": ["1.2", "1.4", "1.5", "1.6"] },
    { "id": 2, "tasks": ["2.1", "2.3"] },
    { "id": 3, "tasks": ["2.2", "2.4", "2.5", "3.1"] },
    { "id": 4, "tasks": ["2.6", "3.2", "3.3"] },
    { "id": 5, "tasks": ["3.4", "5.1"] },
    { "id": 6, "tasks": ["3.5", "5.2", "5.3"] },
    { "id": 7, "tasks": ["5.4", "6.1"] },
    { "id": 8, "tasks": ["5.5", "6.2", "6.3"] },
    { "id": 9, "tasks": ["6.4", "8.1", "8.8"] },
    { "id": 10, "tasks": ["6.5", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7"] },
    { "id": 11, "tasks": ["8.9", "9.1"] },
    { "id": 12, "tasks": ["9.2", "9.3", "9.4"] },
    { "id": 13, "tasks": ["9.5", "9.6", "9.7", "9.8"] }
  ]
}
```
