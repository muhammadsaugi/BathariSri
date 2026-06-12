<?php

namespace App\Services;

use App\Models\FertilizerRef;
use App\Models\SpkFertilizerRec;
use InvalidArgumentException;


class FertilizerSPKService
{
  private const INPUT_SETS = [
    'rendah'  => [0, 0, 40],
    'sedang'  => [25, 50, 75],
    'tinggi'  => [60, 100, 100],
  ];

  private const OUTPUT_SETS_UREA = [
    'rendah'  => [0.0, 0.0, 0.25],
    'sedang'  => [0.15, 0.35, 0.55],
    'tinggi'  => [0.45, 0.70, 1.00],
  ];

  private const OUTPUT_SETS_P = [
    'rendah'  => [0.0, 0.0, 0.12],
    'sedang'  => [0.08, 0.15, 0.25],
    'tinggi'  => [0.20, 0.30, 0.45],
  ];

  private const OUTPUT_SETS_K = [
    'rendah'  => [0.0, 0.0, 0.10],
    'sedang'  => [0.06, 0.12, 0.20],
    'tinggi'  => [0.15, 0.22, 0.35],
  ];

  public function __construct(private FuzzyLogicEngine $fuzzy) {}

  public function generate(
    array $input,
    float $luas_m2,
    int $user_id,
    ?int $lahan_id = null,
    ?int $planting_id = null,
    ?int $disease_scan_id = null
  ): array {
    if ($luas_m2 <= 0) {
      throw new InvalidArgumentException('Luas lahan harus lebih dari 0.');
    }

    $luas_ha = $luas_m2 / 10000;

    $crisp = $this->mapCrispInputs($input);
    $fuzzified = [
      'fase_n'    => $this->fuzzy->fuzzify($crisp['fase_n'], self::INPUT_SETS),
      'penyakit'  => $this->fuzzy->fuzzify($crisp['penyakit'], self::INPUT_SETS),
      'air'       => $this->fuzzy->fuzzify($crisp['air'], self::INPUT_SETS),
      'tanah'     => $this->fuzzy->fuzzify($crisp['tanah'], self::INPUT_SETS),
      'riwayat'   => $this->fuzzy->fuzzify($crisp['riwayat'], self::INPUT_SETS),
    ];

    $ureaRules = $this->buildUreaRules($fuzzified);
    $pRules    = $this->buildPhosphorRules($fuzzified);
    $kRules    = $this->buildKaliumRules($fuzzified);

    $dosisUrea = $this->defuzzifyOutput($ureaRules, self::OUTPUT_SETS_UREA, 0.0, 1.0);
    $dosisP    = $this->defuzzifyOutput($pRules, self::OUTPUT_SETS_P, 0.0, 0.45);
    $dosisK    = $this->defuzzifyOutput($kRules, self::OUTPUT_SETS_K, 0.0, 0.35);

    
    if ($input['kondisi_penyakit'] === 'severe') {
      $dosisUrea = min($dosisUrea, 0.20);
    }

    $firedRules = array_merge($ureaRules, $pRules, $kRules);
    
    
    $dosisUreaHa = $dosisUrea * 100;
    $dosisPHa    = $dosisP * 100;
    $dosisKHa    = $dosisK * 100;
    
    $estimasiBiaya = $this->hitungBiaya($dosisUreaHa, $dosisPHa, $dosisKHa, $luas_ha);

    $detailPupuk = [
      'metode'               => 'fuzzy_logic',
      'dosis_urea_per_ha'    => round($dosisUreaHa, 3),
      'dosis_fosfor_per_ha'  => round($dosisPHa, 3),
      'dosis_kalium_per_ha'  => round($dosisKHa, 3),
      'total_urea_kg'        => round($dosisUreaHa * $luas_ha, 2),
      'total_fosfor_kg'      => round($dosisPHa * $luas_ha, 2),
      'total_kalium_kg'      => round($dosisKHa * $luas_ha, 2),
      'jadwal_aplikasi'      => $this->buildJadwalAplikasi($input['fase_pertumbuhan']),
      'crisp_inputs'         => $crisp,
      'fuzzified_inputs'     => $fuzzified,
      'fired_rules'          => $firedRules,
      'konteks_input'        => $input,
    ];

    $namaRekomendasi = $this->buildNamaRekomendasi($dosisUrea, $dosisP, $dosisK);

    $rec = SpkFertilizerRec::create([
      'user_id'         => $user_id,
      'lahan_id'        => $lahan_id,
      'disease_scan_id' => $disease_scan_id,
      'planting_id'     => $planting_id,
      'input_data'      => $input,
      'topsis_scores'   => [
        'metode'        => 'fuzzy_logic',
        'fuzzified'     => $fuzzified,
        'fired_rules'   => $firedRules,
        'dosis_crisp'   => [
          'urea'   => round($dosisUrea, 3),
          'fosfor' => round($dosisP, 3),
          'kalium' => round($dosisK, 3),
        ],
      ],
      'rekomendasi'     => $namaRekomendasi,
      'detail_pupuk'    => $detailPupuk,
      'estimasi_biaya'  => $estimasiBiaya,
    ]);

    return [
      'rec'            => $rec,
      'rekomendasi'    => $namaRekomendasi,
      'nama_pupuk'     => $namaRekomendasi,
      'fuzzy_result'   => $detailPupuk,
      'detail_pupuk'   => $detailPupuk,
      'estimasi_biaya' => $estimasiBiaya,
    ];
  }

  private function mapCrispInputs(array $input): array
  {
    return [
      'fase_n'   => match ($input['fase_pertumbuhan']) {
        'vegetatif_awal'  => 55.0,
        'vegetatif_aktif' => 92.0,
        'reproduktif'     => 48.0,
        'pemasakan'       => 18.0,
        default           => 50.0,
      },
      'penyakit' => match ($input['kondisi_penyakit']) {
        'healthy'  => 5.0,
        'mild'     => 30.0,
        'moderate' => 58.0,
        'severe'   => 88.0,
        default    => 10.0,
      },
      'air' => match ($input['ketersediaan_air']) {
        'baik'   => 88.0,
        'cukup'  => 55.0,
        'kurang' => 22.0,
        default  => 50.0,
      },
      'tanah' => match ($input['jenis_tanah']) {
        'lempung' => 82.0,
        'liat'    => 62.0,
        'pasir'   => 35.0,
        default   => 60.0,
      },
      'riwayat' => match ($input['riwayat_pemupukan']) {
        'belum_pupuk'    => 90.0,
        'sudah_dasar'    => 52.0,
        'sudah_susulan1' => 22.0,
        default          => 50.0,
      },
    ];
  }

  
  private function buildUreaRules(array $fuzzified): array
  {
    $rules = [];

    $strength = $this->fuzzy->andMin([
      $fuzzified['fase_n']['tinggi'],
      $fuzzified['penyakit']['rendah'],
      $fuzzified['air']['tinggi'],
    ]);
    if ($strength > 0) {
      $rules[] = $this->rule('U1', $strength, 'tinggi', 'Urea tinggi — fase vegetatif aktif, tanaman sehat, air cukup.');
    }

    $strength = $this->fuzzy->andMin([
      $fuzzified['fase_n']['tinggi'],
      $fuzzified['penyakit']['sedang'],
    ]);
    if ($strength > 0) {
      $rules[] = $this->rule('U2', $strength, 'sedang', 'Urea sedang — fase butuh nitrogen tetapi ada tekanan penyakit.');
    }

    $strength = $this->fuzzy->andMin([
      $fuzzified['fase_n']['tinggi'],
      $fuzzified['penyakit']['tinggi'],
    ]);
    if ($strength > 0) {
      $rules[] = $this->rule('U3', $strength, 'rendah', 'Urea rendah — penyakit parah, prioritaskan penanganan OPT.');
    }

    $strength = $this->fuzzy->andMin([$fuzzified['fase_n']['sedang'], $fuzzified['riwayat']['tinggi']]);
    if ($strength > 0) {
      $rules[] = $this->rule('U4', $strength, 'sedang', 'Urea sedang — fase menengah dan belum pernah pupuk.');
    }

    $strength = $this->fuzzy->andMin([$fuzzified['fase_n']['rendah'], $fuzzified['riwayat']['rendah']]);
    if ($strength > 0) {
      $rules[] = $this->rule('U5', $strength, 'rendah', 'Urea rendah — fase pemasakan dan sudah susulan.');
    }

    $strength = $fuzzified['air']['rendah'];
    if ($strength > 0) {
      $rules[] = $this->rule('U6', $strength, 'rendah', 'Urea rendah — ketersediaan air kurang.');
    }

    return $rules;
  }

  private function buildPhosphorRules(array $fuzzified): array
  {
    $rules = [];

    $strength = $this->fuzzy->andMin([$fuzzified['fase_n']['sedang'], $fuzzified['tanah']['tinggi']]);
    if ($strength > 0) {
      $rules[] = $this->rule('P1', $strength, 'sedang', 'Fosfor sedang — tanah lempung pada fase pertumbuhan menengah.');
    }

    $strength = $this->fuzzy->andMin([$fuzzified['riwayat']['tinggi'], $fuzzified['tanah']['sedang']]);
    if ($strength > 0) {
      $rules[] = $this->rule('P2', $strength, 'tinggi', 'Fosfor tinggi — belum pupuk dan tanah perlu P dasar.');
    }

    $strength = $fuzzified['fase_n']['rendah'];
    if ($strength > 0) {
      $rules[] = $this->rule('P3', $strength, 'rendah', 'Fosfor rendah — fase pemasakan, kebutuhan P menurun.');
    }

    return $rules;
  }

  private function buildKaliumRules(array $fuzzified): array
  {
    $rules = [];

    $strength = $this->fuzzy->andMin([$fuzzified['fase_n']['sedang'], $fuzzified['penyakit']['sedang']]);
    if ($strength > 0) {
      $rules[] = $this->rule('K1', $strength, 'sedang', 'Kalium sedang — mendukung ketahanan saat ada tekanan penyakit.');
    }

    $strength = $this->fuzzy->andMin([$fuzzified['fase_n']['tinggi'], $fuzzified['air']['sedang']]);
    if ($strength > 0) {
      $rules[] = $this->rule('K2', $strength, 'tinggi', 'Kalium tinggi — fase vegetatif aktif membutuhkan K untuk anakan.');
    }

    $strength = $fuzzified['penyakit']['tinggi'];
    if ($strength > 0) {
      $rules[] = $this->rule('K3', $strength, 'rendah', 'Kalium rendah — fokus penanganan penyakit terlebih dahulu.');
    }

    return $rules;
  }

  private function rule(string $id, float $strength, string $output, string $explanation): array
  {
    return [
      'id'          => $id,
      'strength'    => round($strength, 4),
      'output'      => $output,
      'output_label'=> ucfirst($output),
      'explanation' => $explanation,
      'nutrient'    => str_starts_with($id, 'U') ? 'urea' : (str_starts_with($id, 'P') ? 'fosfor' : 'kalium'),
    ];
  }

  
  private function defuzzifyOutput(array $rules, array $outputSets, float $min, float $max): float
  {
    if ($rules === []) {
      return ($min + $max) / 2 * 0.5;
    }

    return $this->fuzzy->defuzzifyCentroid(
      $min,
      $max,
      function (float $x) use ($rules, $outputSets): float {
        $mu = 0.0;
        foreach ($rules as $rule) {
          $label = $rule['output'];
          $set   = $outputSets[$label] ?? $outputSets['sedang'];
          $ruleMu = min($rule['strength'], count($set) === 4
            ? $this->fuzzy->trapezoidal($x, $set[0], $set[1], $set[2], $set[3])
            : $this->fuzzy->triangular($x, $set[0], $set[1], $set[2]));
          $mu = max($mu, $ruleMu);
        }

        return $mu;
      }
    );
  }

  private function buildNamaRekomendasi(float $urea, float $p, float $k): string
  {
    if ($urea < 0.15 && $p < 0.08 && $k < 0.06) {
      return 'Tunda Pemupukan — Prioritas Penanganan Penyakit';
    }

    $parts = [];
    if ($urea >= 0.15) {
      $parts[] = 'Urea';
    }
    if ($p >= 0.08) {
      $parts[] = 'SP36';
    }
    if ($k >= 0.06) {
      $parts[] = 'KCl';
    }

    return $parts === [] ? 'Pupuk Ringan Sesuai Kondisi' : implode(' + ', $parts);
  }

  private function buildJadwalAplikasi(string $fase): string
  {
    return match ($fase) {
      'vegetatif_awal'  => 'Aplikasikan pupuk dasar (P & K) saat tanam, Urea 7–10 HST.',
      'vegetatif_aktif' => 'Aplikasikan susulan 1 pada HST 21–25 (prioritas Urea).',
      'reproduktif'     => 'Aplikasikan susulan 2 pada HST 40–45 (NPK seimbang).',
      'pemasakan'       => 'Hindari nitrogen tinggi; fokus K jika diperlukan sebelum HST 55.',
      default           => 'Sesuaikan dengan jadwal musim tanam aktif.',
    };
  }

  private function hitungBiaya(float $ureaHa, float $pHa, float $kHa, float $luasHa): float
  {
    $hargaUrea = (float) (FertilizerRef::where('nama', 'LIKE', '%Urea%')->value('harga_per_kg') ?? 6500);
    $hargaP    = (float) (FertilizerRef::where('nama', 'LIKE', '%SP36%')->orWhere('nama', 'LIKE', '%Fosfor%')->value('harga_per_kg') ?? 8000);
    $hargaK    = (float) (FertilizerRef::where('nama', 'LIKE', '%KCl%')->orWhere('nama', 'LIKE', '%Kalium%')->value('harga_per_kg') ?? 9500);

    return round(($ureaHa * $hargaUrea + $pHa * $hargaP + $kHa * $hargaK) * $luasHa, 2);
  }
}
