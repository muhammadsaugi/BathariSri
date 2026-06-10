<?php

use App\Services\PlantingCalculatorService;
use Carbon\Carbon;

// ============================================================
// Unit Tests untuk PlantingCalculatorService
// ============================================================

$service = new PlantingCalculatorService();

// ─── calculatePhase: HST dasar ──────────────────────────────

it('menghitung HST dengan benar untuk hari tertentu', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');
    $today = Carbon::parse('2025-01-21'); // 20 hari setelah tanam

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['hst'])->toBe(20);
});

it('HST tidak negatif jika today sebelum tanggal tanam', function () use ($service) {
    $tanam = Carbon::parse('2025-12-01');
    $today = Carbon::parse('2025-01-01'); // sebelum tanam

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['hst'])->toBe(0);
});

it('HST = 0 jika today sama dengan tanggal tanam', function () use ($service) {
    $tanam = Carbon::parse('2025-06-01');

    $result = $service->calculatePhase($tanam, 120, $tanam->clone());

    expect($result['hst'])->toBe(0);
});

// ─── calculatePhase: Fase pertumbuhan ───────────────────────

it('fase vegetatif_awal jika HST < 15', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');
    $today = Carbon::parse('2025-01-10'); // HST = 9

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['fase'])->toBe('vegetatif_awal');
    expect($result['fase_label'])->toBe('Fase Vegetatif Awal (Establishment)');
    expect($result['fase_index'])->toBe(0);
});

it('fase vegetatif_aktif jika HST >= 15 dan < batas_reproduktif', function () use ($service) {
    // umur_panen=120, batas_reproduktif = round(120*0.40) = 48
    $tanam = Carbon::parse('2025-01-01');
    $today = Carbon::parse('2025-01-31'); // HST = 30

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['fase'])->toBe('vegetatif_aktif');
    expect($result['fase_label'])->toBe('Fase Vegetatif Aktif (Anakan Maksimum)');
    expect($result['fase_index'])->toBe(1);
});

it('fase reproduktif jika HST >= batas_reproduktif dan < batas_pemasakan', function () use ($service) {
    // umur_panen=120, batas_reproduktif=48, batas_pemasakan=round(120*0.58)=70
    $tanam = Carbon::parse('2025-01-01');
    $today = Carbon::parse('2025-03-01'); // HST = 59

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['fase'])->toBe('reproduktif');
    expect($result['fase_label'])->toBe('Fase Reproduktif (Pembentukan Malai)');
    expect($result['fase_index'])->toBe(2);
});

it('fase pemasakan jika HST >= batas_pemasakan dan <= umur_panen', function () use ($service) {
    // umur_panen=120, batas_pemasakan=70
    $tanam = Carbon::parse('2025-01-01');
    $today = Carbon::parse('2025-03-22'); // HST = 80

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['fase'])->toBe('pemasakan');
    expect($result['fase_label'])->toBe('Fase Pemasakan (Pengisian Gabah)');
    expect($result['fase_index'])->toBe(3);
});

it('fase panen jika HST > umur_panen', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');
    $today = Carbon::parse('2025-05-20'); // HST > 120

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['fase'])->toBe('panen');
    expect($result['fase_label'])->toBe('Siap Panen / Pasca Panen');
    expect($result['fase_index'])->toBe(4);
});

// ─── calculatePhase: progress_pct ───────────────────────────

it('progress_pct berada dalam rentang [0.0, 100.0]', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    // HST = 0
    $result = $service->calculatePhase($tanam, 120, $tanam->clone());
    expect($result['progress_pct'])->toBeGreaterThanOrEqual(0.0);
    expect($result['progress_pct'])->toBeLessThanOrEqual(100.0);

    // HST = 60 (setengah jalan)
    $result2 = $service->calculatePhase($tanam, 120, $tanam->clone()->addDays(60));
    expect($result2['progress_pct'])->toBeGreaterThanOrEqual(0.0);
    expect($result2['progress_pct'])->toBeLessThanOrEqual(100.0);

    // HST > umur_panen (harus 100)
    $result3 = $service->calculatePhase($tanam, 120, $tanam->clone()->addDays(150));
    expect($result3['progress_pct'])->toBe(100.0);
});

it('progress_pct tepat 50% pada HST = umur_panen/2', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');
    $today = $tanam->clone()->addDays(60); // HST = 60 dari umur_panen = 120

    $result = $service->calculatePhase($tanam, 120, $today);

    expect($result['progress_pct'])->toBe(50.0);
});

// ─── calculatePhase: alerts pemupukan ───────────────────────

it('alert muncul jika HST dalam jendela [21,25]', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    foreach ([21, 22, 23, 24, 25] as $hst) {
        $today  = $tanam->clone()->addDays($hst);
        $result = $service->calculatePhase($tanam, 120, $today);
        expect($result['alerts'])->toContain('Waktunya pemupukan Susulan 1!');
    }
});

it('alert muncul jika HST dalam jendela [40,45]', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    foreach ([40, 42, 45] as $hst) {
        $today  = $tanam->clone()->addDays($hst);
        $result = $service->calculatePhase($tanam, 120, $today);
        expect($result['alerts'])->toContain('Waktunya pemupukan Susulan 2!');
    }
});

it('alert muncul jika HST dalam jendela [55,60]', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    foreach ([55, 57, 60] as $hst) {
        $today  = $tanam->clone()->addDays($hst);
        $result = $service->calculatePhase($tanam, 120, $today);
        expect($result['alerts'])->toContain('Waktunya pemupukan Susulan 3!');
    }
});

it('tidak ada alert di luar jendela pemupukan', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    // HST = 30 — di luar semua jendela
    $today  = $tanam->clone()->addDays(30);
    $result = $service->calculatePhase($tanam, 120, $today);
    expect($result['alerts'])->toBeEmpty();
});

it('alert kosong pada HST = 20 (batas sebelum Susulan 1)', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');
    $today = $tanam->clone()->addDays(20);

    $result = $service->calculatePhase($tanam, 120, $today);
    expect($result['alerts'])->toBeEmpty();
});

it('alert kosong pada HST = 26 (batas setelah Susulan 1)', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');
    $today = $tanam->clone()->addDays(26);

    $result = $service->calculatePhase($tanam, 120, $today);
    expect($result['alerts'])->toBeEmpty();
});

// ─── calculatePhase: validasi umur_panen ────────────────────

it('throw InvalidArgumentException jika umur_panen < 90', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    expect(fn () => $service->calculatePhase($tanam, 89))->toThrow(InvalidArgumentException::class);
});

it('throw InvalidArgumentException jika umur_panen > 180', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    expect(fn () => $service->calculatePhase($tanam, 181))->toThrow(InvalidArgumentException::class);
});

it('return warning jika umur_panen = 90 (batas bawah)', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    $result = $service->calculatePhase($tanam, 90, $tanam->clone());

    expect($result['warning'])->not->toBeNull();
    expect($result['warning'])->toContain('90');
});

it('return warning jika umur_panen = 180 (batas atas)', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    $result = $service->calculatePhase($tanam, 180, $tanam->clone());

    expect($result['warning'])->not->toBeNull();
    expect($result['warning'])->toContain('180');
});

it('tidak ada warning untuk umur_panen = 120 (nilai tengah valid)', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    $result = $service->calculatePhase($tanam, 120, $tanam->clone());

    expect($result['warning'])->toBeNull();
});

// ─── generateSchedule ───────────────────────────────────────

it('generateSchedule menghasilkan 4 event pemupukan', function () use ($service) {
    $tanam  = Carbon::parse('2025-01-01');
    $result = $service->generateSchedule($tanam, 120);

    expect($result)->toHaveCount(4);
});

it('generateSchedule event pertama adalah Pupuk Dasar (hst 0-3)', function () use ($service) {
    $tanam  = Carbon::parse('2025-01-01');
    $result = $service->generateSchedule($tanam, 120);

    expect($result[0]['event'])->toBe('Pupuk Dasar');
    expect($result[0]['hst_mulai'])->toBe(0);
    expect($result[0]['hst_selesai'])->toBe(3);
});

it('generateSchedule setiap event memiliki hst_mulai <= hst_selesai (INVARIANT)', function () use ($service) {
    $tanam  = Carbon::parse('2025-03-15');
    $result = $service->generateSchedule($tanam, 116);

    foreach ($result as $event) {
        expect($event['hst_mulai'])->toBeLessThanOrEqual($event['hst_selesai']);
    }
});

it('generateSchedule menghitung tanggal_mulai dan tanggal_selesai dengan benar', function () use ($service) {
    $tanam  = Carbon::parse('2025-01-01');
    $result = $service->generateSchedule($tanam, 120);

    // Pupuk Susulan 1: hst 21-25
    $susulan1 = $result[1];
    expect($susulan1['hst_mulai'])->toBe(21);
    expect($susulan1['hst_selesai'])->toBe(25);
    expect($susulan1['tanggal_mulai']->toDateString())->toBe('2025-01-22');
    expect($susulan1['tanggal_selesai']->toDateString())->toBe('2025-01-26');
});

it('generateSchedule status selesai jika hst hari ini sudah melewati event', function () use ($service) {
    // Hari ini HST = 70 — Susulan 1 (21-25) dan Susulan 2 (40-45) sudah selesai
    Carbon::setTestNow(Carbon::parse('2025-01-01')->addDays(70));
    $tanam  = Carbon::parse('2025-01-01');
    $result = $service->generateSchedule($tanam, 120);

    expect($result[1]['status'])->toBe('selesai'); // Susulan 1
    expect($result[2]['status'])->toBe('selesai'); // Susulan 2
    Carbon::setTestNow(); // reset
});

it('generateSchedule status aktif jika hst hari ini dalam jendela event', function () use ($service) {
    // HST = 22 — dalam jendela Susulan 1 (21-25)
    Carbon::setTestNow(Carbon::parse('2025-01-01')->addDays(22));
    $tanam  = Carbon::parse('2025-01-01');
    $result = $service->generateSchedule($tanam, 120);

    expect($result[1]['status'])->toBe('aktif'); // Susulan 1
    Carbon::setTestNow();
});

it('generateSchedule status mendatang jika hst hari ini sebelum event', function () use ($service) {
    // HST = 5 — semua event belum tiba
    Carbon::setTestNow(Carbon::parse('2025-01-01')->addDays(5));
    $tanam  = Carbon::parse('2025-01-01');
    $result = $service->generateSchedule($tanam, 120);

    expect($result[1]['status'])->toBe('mendatang'); // Susulan 1
    expect($result[2]['status'])->toBe('mendatang'); // Susulan 2
    Carbon::setTestNow();
});

it('generateSchedule throw InvalidArgumentException jika umur_panen < 90', function () use ($service) {
    $tanam = Carbon::parse('2025-01-01');

    expect(fn () => $service->generateSchedule($tanam, 89))->toThrow(InvalidArgumentException::class);
});

// ─── computeSeverity ────────────────────────────────────────

it('computeSeverity mengembalikan null untuk predicted_class healthy', function () use ($service) {
    expect($service->computeSeverity('healthy', 0.0))->toBeNull();
    expect($service->computeSeverity('healthy', 0.5))->toBeNull();
    expect($service->computeSeverity('healthy', 0.99))->toBeNull();
    expect($service->computeSeverity('healthy', 1.0))->toBeNull();
});

it('computeSeverity mengembalikan severe jika confidence >= 0.85', function () use ($service) {
    expect($service->computeSeverity('leaf_blast', 0.85))->toBe('severe');
    expect($service->computeSeverity('leaf_blast', 0.90))->toBe('severe');
    expect($service->computeSeverity('leaf_blast', 1.0))->toBe('severe');
    expect($service->computeSeverity('brown_spot', 0.95))->toBe('severe');
});

it('computeSeverity mengembalikan moderate jika confidence >= 0.65 dan < 0.85', function () use ($service) {
    expect($service->computeSeverity('leaf_blast', 0.65))->toBe('moderate');
    expect($service->computeSeverity('leaf_blast', 0.75))->toBe('moderate');
    expect($service->computeSeverity('leaf_blast', 0.84))->toBe('moderate');
    expect($service->computeSeverity('bacterial_leaf_blight', 0.70))->toBe('moderate');
});

it('computeSeverity mengembalikan mild jika confidence < 0.65', function () use ($service) {
    expect($service->computeSeverity('leaf_blast', 0.0))->toBe('mild');
    expect($service->computeSeverity('leaf_blast', 0.30))->toBe('mild');
    expect($service->computeSeverity('leaf_blast', 0.64))->toBe('mild');
    expect($service->computeSeverity('brown_spot', 0.50))->toBe('mild');
});

it('computeSeverity boundary: tepat 0.65 adalah moderate bukan mild', function () use ($service) {
    expect($service->computeSeverity('leaf_blast', 0.65))->toBe('moderate');
});

it('computeSeverity boundary: tepat 0.85 adalah severe bukan moderate', function () use ($service) {
    expect($service->computeSeverity('leaf_blast', 0.85))->toBe('severe');
});
