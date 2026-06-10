<?php

use App\Models\Lahan;
use App\Models\User;
use App\Models\VarietyRef;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);
use App\Services\FertilizerSPKService;
use App\Services\FuzzyLogicEngine;
use App\Services\HarvestPredictionService;
use App\Services\WasteRecommendationService;

it('fuzzy engine menghitung membership segitiga dengan benar', function () {
    $engine = new FuzzyLogicEngine();

    expect($engine->triangular(50, 25, 50, 75))->toBe(1.0);
    expect($engine->triangular(0, 0, 40, 80))->toBe(0.0);
});

it('fertilizer fuzzy menghasilkan dosis numerik per nutrisi', function () {
    $user = User::factory()->create(['role' => 'petani']);
    $service = app(FertilizerSPKService::class);

    $result = $service->generate(
        [
            'fase_pertumbuhan'  => 'vegetatif_aktif',
            'kondisi_penyakit'  => 'healthy',
            'ketersediaan_air'  => 'baik',
            'jenis_tanah'       => 'lempung',
            'riwayat_pemupukan' => 'belum_pupuk',
        ],
        10.0,
        $user->id
    );

    expect($result['detail_pupuk']['dosis_urea_per_are'])->toBeGreaterThan(0);
    expect($result['detail_pupuk']['fired_rules'])->not->toBeEmpty();
    expect($result['estimasi_biaya'])->toBeGreaterThan(0);
});

it('harvest regression menghitung estimasi ton per ha', function () {
    $user = User::factory()->create(['role' => 'petani']);
    $lahan = Lahan::create([
        'user_id'     => $user->id,
        'nama_lahan'  => 'Sawah Test',
        'luas_are'    => 100,
        'desa'        => 'Test',
        'kecamatan'   => 'Test',
        'kabupaten'   => 'Test',
        'jenis_tanah' => 'lempung',
        'sumber_air'  => 'irigasi_teknis',
        'is_active'   => true,
    ]);
    $variety = VarietyRef::first() ?? VarietyRef::create([
        'nama' => 'TestVar', 'umur_panen_hari' => 110, 'potensi_hasil_ton_ha' => 6.0,
    ]);

    $service = app(HarvestPredictionService::class);
    $result = $service->generate(
        [
            'kondisi_penyakit'     => 'tidak_ada',
            'kesesuaian_pemupukan' => 'ikut_rekomendasi_3x',
            'ketersediaan_air'     => 'irigasi_baik',
            'kondisi_cuaca'        => 'normal',
        ],
        $lahan,
        $variety,
        $user->id
    );

    expect($result['estimasi_ton_ha'])->toBe(6.0);
    expect($result['kategori'])->toBe('sangat_baik');
    expect($result['regression_details']['faktor_gabungan'])->toBe(1.0);
});

it('waste rule engine merekomendasikan pakan ternak saat kondisi cocok', function () {
    $user = User::factory()->create(['role' => 'petani']);
    $service = app(WasteRecommendationService::class);

    $result = $service->generate(
        [
            'jenis_limbah_ada' => ['jerami'],
            'fasilitas'        => ['kandang_ternak'],
            'tujuan_utama'     => 'ekonomi',
        ],
        1.0,
        $user->id
    );

    expect($result['rekomendasi_jerami']['label'])->toBe('Pakan Ternak');
    expect($result['rekomendasi_jerami']['rule_id'])->toBe('J-R1');
    expect($result['rekomendasi_jerami']['alasan'])->not->toBeEmpty();
});
