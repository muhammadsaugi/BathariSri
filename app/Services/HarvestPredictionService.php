<?php

namespace App\Services;

use App\Models\CommodityPrice;
use App\Models\HarvestPrediction;
use App\Models\Lahan;
use App\Models\VarietyRef;
use InvalidArgumentException;


class HarvestPredictionService
{
  private const FAKTOR_PENYAKIT = [
    'tidak_ada' => 1.00,
    'mild'      => 0.90,
    'moderate'  => 0.75,
    'severe'    => 0.55,
  ];

  private const FAKTOR_PEMUPUKAN = [
    'ikut_rekomendasi_3x'  => 1.00,
    'ikut_kurang_3x'       => 0.92,
    'tidak_ikut_3x'        => 0.85,
    'tidak_ikut_kurang_3x' => 0.75,
    'tidak_pernah'         => 0.70,
  ];

  private const FAKTOR_AIR = [
    'irigasi_baik'  => 1.00,
    'irigasi_cukup' => 0.90,
    'tadah_baik'    => 0.80,
    'tadah_cukup'   => 0.70,
    'kurang'        => 0.60,
  ];

  private const FAKTOR_CUACA = [
    'normal'     => 1.00,
    'banjir'     => 0.50,
    'kekeringan' => 0.55,
  ];

  private const KATEGORI_THRESHOLDS = [
    'sangat_baik' => 0.90,
    'baik'        => 0.75,
    'cukup'       => 0.60,
    'rendah'      => 0.45,
    'berisiko'    => 0.0,
  ];

  public function generate(
    array $input,
    Lahan $lahan,
    VarietyRef $variety,
    int $user_id,
    ?int $spk_fertilizer_id = null
  ): array {
    $this->validateInput($input);

    $potensiTonHa = (float) $variety->potensi_hasil_ton_ha;

    $faktorPenyakit   = self::FAKTOR_PENYAKIT[$input['kondisi_penyakit']];
    $faktorPemupukan  = self::FAKTOR_PEMUPUKAN[$input['kesesuaian_pemupukan']];
    $faktorAir        = self::FAKTOR_AIR[$input['ketersediaan_air']];
    $faktorCuaca      = self::FAKTOR_CUACA[$input['kondisi_cuaca']];

    $faktorGabungan = $faktorPenyakit * $faktorPemupukan * $faktorAir * $faktorCuaca;
    $estimasiTonHa  = round($potensiTonHa * $faktorGabungan, 2);

    $rasioPotensi = $potensiTonHa > 0 ? $estimasiTonHa / $potensiTonHa : 0;
    $kategoriEnum = $this->tentukanKategori($rasioPotensi);
    $kategoriLabel = $this->labelKategori($kategoriEnum);

    $luasHa           = (float) $lahan->luas_m2 / 10000;
    $estimasiTotalTon = round($estimasiTonHa * $luasHa, 2);

    $commodityPrice = CommodityPrice::where('komoditas', 'LIKE', '%GKP%')
      ->orWhere('komoditas', 'LIKE', '%Panen%')
      ->orderByDesc('updated_at')
      ->first();

    $hargaPerKg = $commodityPrice ? (float) $commodityPrice->harga_per_kg : 0.0;
    $estimasiPendapatan = round($estimasiTotalTon * 1000 * $hargaPerKg, 2);

    $regressionDetails = [
      'metode'            => 'regresi_linear_berganda_multiplikatif',
      'rumus'             => 'Y = potensi × faktor_penyakit × faktor_pemupukan × faktor_air × faktor_cuaca',
      'potensi_ton_ha'    => $potensiTonHa,
      'faktor_penyakit'   => $faktorPenyakit,
      'faktor_pemupukan'  => $faktorPemupukan,
      'faktor_air'        => $faktorAir,
      'faktor_cuaca'      => $faktorCuaca,
      'faktor_gabungan'   => round($faktorGabungan, 4),
      'rasio_potensi'     => round($rasioPotensi, 4),
      'interpretasi'      => $this->buildInterpretasi($faktorPenyakit, $faktorPemupukan, $faktorAir, $faktorCuaca, $potensiTonHa),
    ];

    $faktorRisiko = $this->buildFaktorRisiko($input, $faktorPenyakit, $faktorPemupukan, $faktorAir, $faktorCuaca);

    $prediction = HarvestPrediction::create([
      'user_id'             => $user_id,
      'lahan_id'            => $lahan->id,
      'spk_fertilizer_id'   => $spk_fertilizer_id,
      'input_data'          => array_merge($input, [
        'potensi_ton_ha' => $potensiTonHa,
        'luas_m2'        => (float) $lahan->luas_m2,
        'variety_nama'   => $variety->nama,
      ]),
      'topsis_scores'       => $regressionDetails,
      'kategori'            => $kategoriEnum,
      'estimasi_ton_ha'     => $estimasiTonHa,
      'estimasi_total_ton'  => $estimasiTotalTon,
      'estimasi_pendapatan' => $estimasiPendapatan,
      'faktor_risiko'       => $faktorRisiko,
    ]);

    return [
      'prediction'          => $prediction,
      'kategori'            => $kategoriEnum,
      'kategori_label'      => $kategoriLabel,
      'regression_details'  => $regressionDetails,
      'estimasi_ton_ha'     => $estimasiTonHa,
      'estimasi_total_ton'  => $estimasiTotalTon,
      'harga_per_kg'        => $hargaPerKg,
      'estimasi_pendapatan' => $estimasiPendapatan,
      'faktor_risiko'       => $faktorRisiko,
    ];
  }

  private function validateInput(array $input): void
  {
    foreach (['kondisi_penyakit', 'kesesuaian_pemupukan', 'ketersediaan_air', 'kondisi_cuaca'] as $key) {
      if (! array_key_exists($key, $input)) {
        throw new InvalidArgumentException("Input wajib tidak ada: '{$key}'.");
      }
    }
  }

  private function tentukanKategori(float $rasioPotensi): string
  {
    foreach (self::KATEGORI_THRESHOLDS as $kategori => $threshold) {
      if ($rasioPotensi >= $threshold) {
        return $kategori;
      }
    }

    return 'berisiko';
  }

  private function labelKategori(string $enum): string
  {
    return match ($enum) {
      'sangat_baik' => 'Sangat Baik',
      'baik'        => 'Baik',
      'cukup'       => 'Cukup',
      'rendah'      => 'Rendah',
      default       => 'Berisiko',
    };
  }

  private function buildInterpretasi(
    float $fPenyakit,
    float $fPupuk,
    float $fAir,
    float $fCuaca,
    float $potensi
  ): array {
    $items = [];

    if ($fPenyakit < 1.0) {
      $items[] = sprintf(
        'Keparahan penyakit mengurangi potensi sebesar %.0f%% (%.2f ton/ha).',
        (1 - $fPenyakit) * 100,
        $potensi * (1 - $fPenyakit)
      );
    }

    if ($fPupuk < 1.0) {
      $items[] = sprintf(
        'Kesesuaian pemupukan mengurangi estimasi sebesar %.0f%%.',
        (1 - $fPupuk) * 100
      );
    }

    if ($fAir < 1.0) {
      $items[] = sprintf(
        'Ketersediaan air mengurangi estimasi sebesar %.0f%%.',
        (1 - $fAir) * 100
      );
    }

    if ($fCuaca < 1.0) {
      $items[] = sprintf(
        'Kondisi cuaca ekstrem mengurangi estimasi sebesar %.0f%%.',
        (1 - $fCuaca) * 100
      );
    }

    if ($items === []) {
      $items[] = 'Semua faktor dalam kondisi optimal — estimasi mendekati potensi varietas.';
    }

    return $items;
  }

  private function buildFaktorRisiko(
    array $input,
    float $fPenyakit,
    float $fPupuk,
    float $fAir,
    float $fCuaca
  ): array {
    $risiko = [];

    if ($fPenyakit < 0.85) {
      $risiko[] = [
        'faktor'     => 'keparahan_penyakit',
        'koefisien'  => $fPenyakit,
        'keterangan' => match ($input['kondisi_penyakit']) {
          'moderate' => 'Penyakit sedang menekan potensi hasil panen.',
          'severe'   => 'Penyakit parah — risiko gagal panen meningkat signifikan.',
          default    => 'Tekanan penyakit mengurangi produktivitas.',
        },
      ];
    }

    if ($fPupuk < 0.85) {
      $risiko[] = [
        'faktor'     => 'kesesuaian_pemupukan',
        'koefisien'  => $fPupuk,
        'keterangan' => 'Pemupukan belum optimal terhadap rekomendasi agronomi.',
      ];
    }

    if ($fAir < 0.75) {
      $risiko[] = [
        'faktor'     => 'ketersediaan_air',
        'koefisien'  => $fAir,
        'keterangan' => 'Ketersediaan air terbatas menurunkan potensi hasil.',
      ];
    }

    if ($fCuaca < 0.70) {
      $risiko[] = [
        'faktor'     => 'kondisi_cuaca',
        'koefisien'  => $fCuaca,
        'keterangan' => match ($input['kondisi_cuaca']) {
          'banjir'     => 'Banjir berpotensi merusak tanaman dan menurunkan hasil.',
          'kekeringan' => 'Kekeringan menekan pembentukan gabah.',
          default      => 'Cuaca ekstrem menjadi faktor risiko utama.',
        },
      ];
    }

    return $risiko;
  }
}
