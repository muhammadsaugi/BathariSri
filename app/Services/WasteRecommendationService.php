<?php

namespace App\Services;

use App\Models\WastePriceRef;
use App\Models\WasteRecommendation;
use InvalidArgumentException;

/**
 * Modul 5 — Rekomendasi Pengolahan Limbah via Rule-Based Expert System.
 *
 * Setiap rekomendasi memiliki alasan eksplisit, langkah praktis, dan estimasi nilai ekonomi.
 */
class WasteRecommendationService
{
  public function computeWasteVolume(float $estimasi_total_ton): array
  {
    if ($estimasi_total_ton <= 0) {
      throw new InvalidArgumentException('Estimasi total ton harus lebih dari 0.');
    }

    return [
      'jerami_kg' => $estimasi_total_ton * 1.2 * 1000,
      'sekam_kg'  => $estimasi_total_ton * 0.20 * 1000,
      'dedak_kg'  => $estimasi_total_ton * 0.08 * 1000,
    ];
  }

  public function generate(
    array $input,
    float $estimasi_total_ton,
    int $user_id,
    ?int $lahan_id = null,
    ?int $harvest_id = null
  ): array {
    $volume = $this->computeWasteVolume($estimasi_total_ton);

    $jenisLimbahAda = $input['jenis_limbah_ada'] ?? [];
    $fasilitas      = $input['fasilitas'] ?? [];
    $tujuanUtama    = $input['tujuan_utama'] ?? 'keduanya';

    $rekomendasiJerami = in_array('jerami', $jenisLimbahAda)
      ? $this->recommendJerami($volume['jerami_kg'], $fasilitas, $tujuanUtama)
      : null;

    $rekomendasiSekam = in_array('sekam', $jenisLimbahAda)
      ? $this->recommendSekam($volume['sekam_kg'], $fasilitas, $tujuanUtama)
      : null;

    $rekomendasiDedak = in_array('dedak', $jenisLimbahAda)
      ? $this->recommendDedak($volume['dedak_kg'], $fasilitas, $tujuanUtama)
      : null;

    $totalNilaiEkonomi = 0.0;
    foreach ([$rekomendasiJerami, $rekomendasiSekam, $rekomendasiDedak] as $rec) {
      if ($rec !== null) {
        $totalNilaiEkonomi += $rec['nilai_ekonomi_estimasi'] ?? 0.0;
      }
    }

    $recommendation = WasteRecommendation::create([
      'user_id'             => $user_id,
      'lahan_id'            => $lahan_id,
      'harvest_id'          => $harvest_id,
      'input_data'          => array_merge($input, [
        'estimasi_total_ton' => $estimasi_total_ton,
        'volume'             => $volume,
        'metode'             => 'rule_based_expert_system',
      ]),
      'rekomendasi_jerami'  => $rekomendasiJerami,
      'rekomendasi_sekam'   => $rekomendasiSekam,
      'rekomendasi_dedak'   => $rekomendasiDedak,
      'total_nilai_ekonomi' => round($totalNilaiEkonomi, 2),
    ]);

    return [
      'recommendation'      => $recommendation,
      'volume'              => $volume,
      'rekomendasi_jerami'  => $rekomendasiJerami,
      'rekomendasi_sekam'   => $rekomendasiSekam,
      'rekomendasi_dedak'   => $rekomendasiDedak,
      'total_nilai_ekonomi' => round($totalNilaiEkonomi, 2),
    ];
  }

  private function recommendJerami(float $volumeKg, array $fasilitas, string $tujuan): array
  {
    $hasKandang = in_array('kandang_ternak', $fasilitas);
    $hasLahan   = in_array('lahan_kosong', $fasilitas);
    $ekonomi    = in_array($tujuan, ['ekonomi', 'keduanya'], true);

    if ($volumeKg > 500 && $hasKandang && $ekonomi) {
      return $this->buildResult('jerami', 'Pakan Ternak', $volumeKg, [
        'rule_id'   => 'J-R1',
        'alasan'    => 'Volume jerami cukup besar (>500 kg) dan fasilitas kandang ternak tersedia dengan tujuan ekonomi.',
        'langkah'   => ['Keringkan jerami 3–5 hari', 'Cacah ukuran 5–10 cm', 'Simpan di tempat teduh', 'Berikan ke ternak secara bertahap'],
      ]);
    }

    if ($volumeKg > 200 && $hasLahan) {
      return $this->buildResult('jerami', 'Kompos', $volumeKg, [
        'rule_id' => 'J-R2',
        'alasan'  => 'Volume jerami memadai (>200 kg) dan tersedia lahan kosong untuk pengomposan.',
        'langkah' => ['Tumpuk jerami dengan pupuk kandang', 'Siram rutin setiap 3 hari', 'Aduk setiap minggu', 'Kompos siap 4–6 minggu'],
      ]);
    }

    if ($volumeKg > 100 && $hasLahan) {
      return $this->buildResult('jerami', 'Biochar', $volumeKg, [
        'rule_id' => 'J-R3',
        'alasan'  => 'Jerami cukup untuk biochar dan lahan kosong tersedia.',
        'langkah' => ['Keringkan jerami', 'Bakar terkontrol (pirolisis sederhana)', 'Dinginkan dan simpan', 'Aplikasikan ke lahan'],
      ]);
    }

    if ($volumeKg > 0) {
      return $this->buildResult('jerami', 'Mulsa', $volumeKg, [
        'rule_id' => 'J-R4',
        'alasan'  => 'Tidak ada fasilitas khusus — mulsa adalah opsi paling praktis dan ramah lingkungan.',
        'langkah' => ['Sebar jerami tipis di permukaan lahan', 'Tutup dengan tanah tipis', 'Biarkan terurai alami'],
        'warning' => null,
      ]);
    }

    return $this->buildResult('jerami', 'Mulsa', $volumeKg, [
      'rule_id' => 'J-R0',
      'alasan'  => 'Volume jerami terbatas.',
      'langkah' => ['Gunakan sebagai mulsa langsung di lahan.'],
    ]);
  }

  private function recommendSekam(float $volumeKg, array $fasilitas, string $tujuan): array
  {
    $hasLahan = in_array('lahan_kosong', $fasilitas);
    $ekonomi  = in_array($tujuan, ['ekonomi', 'keduanya'], true);

    if ($ekonomi && $volumeKg > 300) {
      return $this->buildResult('sekam', 'Arang Sekam/Biochar', $volumeKg, [
        'rule_id' => 'S-R1',
        'alasan'  => 'Volume sekam besar dengan tujuan ekonomi — arang sekam bernilai jual tinggi.',
        'langkah' => ['Keringkan sekam hingga kadar air <15%', 'Karbonisasi dalam drum tertutup', 'Ayak dan kemas', 'Jual ke pengepul atau gunakan sendiri'],
      ]);
    }

    if ($hasLahan && $volumeKg > 150) {
      return $this->buildResult('sekam', 'Media Tanam', $volumeKg, [
        'rule_id' => 'S-R2',
        'alasan'  => 'Sekam cocok diolah menjadi media tanam dengan lahan kosong tersedia.',
        'langkah' => ['Campur sekam dengan kompos 3:1', 'Tambahkan pupuk organik', 'Aduk merata', 'Inkubasi 2 minggu sebelum pakai'],
      ]);
    }

    if (in_array('akses_pengepul', $fasilitas)) {
      return $this->buildResult('sekam', 'Jual Langsung', $volumeKg, [
        'rule_id' => 'S-R3',
        'alasan'  => 'Akses pengepul tersedia — opsi paling mudah untuk monetisasi cepat.',
        'langkah' => ['Keringkan sekam', 'Kemas dalam karung', 'Hubungi pengepul setempat'],
      ]);
    }

    return $this->buildResult('sekam', 'Briket Bahan Bakar', $volumeKg, [
      'rule_id' => 'S-R4',
      'alasan'  => 'Alternatif default — briket sekam bernilai ekonomi sedang.',
      'langkah' => ['Cacah sekam halus', 'Campur dengan perekat alami', 'Cetak briket', 'Jemur hingga kering'],
    ]);
  }

  private function recommendDedak(float $volumeKg, array $fasilitas, string $tujuan): array
  {
    $hasKandang = in_array('kandang_ternak', $fasilitas);
    $ekonomi    = in_array($tujuan, ['ekonomi', 'keduanya'], true);

    if ($hasKandang && $ekonomi) {
      return $this->buildResult('dedak', 'Pakan Ternak Langsung', $volumeKg, [
        'rule_id' => 'D-R1',
        'alasan'  => 'Dedak bernilai tinggi sebagai pakan ternak dan kandang tersedia.',
        'langkah' => ['Pastikan dedak kering', 'Campur dengan hijauan/pakan lain', 'Berikan 1–2 kg/ekor/hari', 'Simpan di tempat kering kedap udara'],
      ]);
    }

    if ($volumeKg > 100) {
      return $this->buildResult('dedak', 'Campuran Pupuk Organik', $volumeKg, [
        'rule_id' => 'D-R2',
        'alasan'  => 'Volume dedak cukup untuk diolah menjadi pupuk organik.',
        'langkah' => ['Campur dedak dengan kompos/jerami', 'Tambahkan bioaktivator', 'Fermentasi 2–3 minggu', 'Aplikasikan ke lahan'],
      ]);
    }

    return $this->buildResult('dedak', 'Simpan/Jual', $volumeKg, [
      'rule_id' => 'D-R3',
      'alasan'  => 'Volume terbatas — simpan atau jual langsung paling praktis.',
      'langkah' => ['Kemas dalam karung kedap', 'Simpan di gudang kering', 'Hubungi pengepul dedak'],
    ]);
  }

  private function buildResult(string $jenis, string $label, float $volumeKg, array $meta): array
  {
    $hargaPerKg = $this->getHargaPerKg($jenis, $label);
    $nilaiEkonomi = round($volumeKg * $hargaPerKg, 2);
    $isDisbakar = str_contains(strtolower($label), 'bakar') && ! str_contains(strtolower($label), 'biochar') && ! str_contains(strtolower($label), 'arang');

    // Kalkulasi Dampak Lingkungan
    $metricLabel = 'Reduksi CO₂ (Avoided Emissions)';
    $metricValue = 0;
    $metricUnit = 'kg CO₂-eq';

    if ($jenis === 'jerami') {
        if (str_contains(strtolower($label), 'kompos')) {
            $metricValue = $volumeKg * 1.397;
        } elseif (str_contains(strtolower($label), 'pakan')) {
            $metricValue = $volumeKg * 1.470;
        } elseif (str_contains(strtolower($label), 'biochar')) {
            $metricValue = $volumeKg * 1.770;
        } elseif (str_contains(strtolower($label), 'mulsa')) {
            $metricValue = $volumeKg * 1.200;
        } else {
            $metricValue = $volumeKg * 1.200;
        }
    } elseif ($jenis === 'sekam') {
        if (str_contains(strtolower($label), 'arang') || str_contains(strtolower($label), 'biochar')) {
            $metricValue = $volumeKg * 1.450;
        } else {
            $metricValue = $volumeKg * 1.200;
        }
    } elseif ($jenis === 'dedak') {
        $metricLabel = 'Protein Terselamatkan';
        $metricValue = $volumeKg * 0.12; // Asumsi 12% kandungan protein rata-rata
        $metricUnit = 'kg Protein';
    }

    $dampakLingkungan = [
        'label' => $metricLabel,
        'value' => round($metricValue, 2),
        'unit'  => $metricUnit,
    ];

    return [
      'metode'                 => 'rule_based',
      'rule_id'                => $meta['rule_id'],
      'label'                  => $label,
      'alasan'                 => $meta['alasan'],
      'langkah_praktis'        => $meta['langkah'],
      'warning'                => $meta['warning'] ?? ($isDisbakar
        ? 'Membakar jerami merusak kualitas udara dan tanah. Tidak direkomendasikan.'
        : null),
      'fasilitas_tersedia'     => true,
      'harga_per_kg'           => $hargaPerKg,
      'nilai_ekonomi_estimasi' => $nilaiEkonomi,
      'volume_kg'              => $volumeKg,
      'dampak_lingkungan'      => $dampakLingkungan,
    ];
  }

  private function getHargaPerKg(string $jenisLimbah, string $metodeLabel): float
  {
    $priceRef = WastePriceRef::where('jenis_limbah', $jenisLimbah)
      ->where('metode_pengolahan', 'LIKE', '%' . explode(' ', $metodeLabel)[0] . '%')
      ->first();

    if (! $priceRef) {
      $priceRef = WastePriceRef::where('jenis_limbah', $jenisLimbah)->first();
    }

    return $priceRef ? (float) $priceRef->harga_per_kg : 0.0;
  }
}
