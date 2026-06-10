<?php

namespace App\Services;

use Carbon\Carbon;
use InvalidArgumentException;

class PlantingCalculatorService
{
    /**
     * Mapping fase ke label bahasa Indonesia.
     */
    private const FASE_LABELS = [
        'vegetatif_awal'   => 'Fase Vegetatif Awal (Establishment)',
        'vegetatif_aktif'  => 'Fase Vegetatif Aktif (Anakan Maksimum)',
        'reproduktif'      => 'Fase Reproduktif (Pembentukan Malai)',
        'pemasakan'        => 'Fase Pemasakan (Pengisian Gabah)',
        'panen'            => 'Siap Panen / Pasca Panen',
    ];

    /**
     * Mapping fase ke index numerik.
     */
    private const FASE_INDEX = [
        'vegetatif_awal'  => 0,
        'vegetatif_aktif' => 1,
        'reproduktif'     => 2,
        'pemasakan'       => 3,
        'panen'           => 4,
    ];

    /**
     * Jendela pemupukan: [hst_mulai, hst_selesai, nama_event].
     */
    private const FERTILIZER_WINDOWS = [
        ['mulai' => 21, 'selesai' => 25, 'nama' => 'Susulan 1'],
        ['mulai' => 40, 'selesai' => 45, 'nama' => 'Susulan 2'],
        ['mulai' => 55, 'selesai' => 60, 'nama' => 'Susulan 3'],
    ];

    /**
     * Validasi umur_panen dan kembalikan warning jika berada di batas.
     *
     * @throws InvalidArgumentException jika umur_panen di luar rentang (90, 180) eksklusif
     */
    private function validateUmurPanen(int $umur_panen): ?string
    {
        if ($umur_panen < 90 || $umur_panen > 180) {
            throw new InvalidArgumentException('Umur panen harus antara 90 dan 180 hari');
        }

        if ($umur_panen === 90 || $umur_panen === 180) {
            return 'Umur panen berada di batas rentang yang valid (' . $umur_panen . ' hari). Pastikan varietas sesuai.';
        }

        return null;
    }

    /**
     * Menghitung status pertumbuhan padi hari ini.
     *
     * @param Carbon      $tanggal_tanam  Tanggal tanam (bukan semai)
     * @param int         $umur_panen     Umur panen varietas dalam hari [90, 180]
     * @param Carbon|null $today          Tanggal hari ini (default: Carbon::today())
     * @return array [
     *     'hst'          => int,
     *     'fase'         => string,
     *     'fase_label'   => string,
     *     'fase_index'   => int,
     *     'progress_pct' => float,
     *     'next_event'   => string,
     *     'days_to_next' => int|null,
     *     'alerts'       => array,
     *     'warning'      => string|null,
     * ]
     * @throws InvalidArgumentException
     */
    public function calculatePhase(Carbon $tanggal_tanam, int $umur_panen, ?Carbon $today = null): array
    {
        $warning = $this->validateUmurPanen($umur_panen);

        $today = $today ?? Carbon::today();

        // HST = jumlah hari sejak tanggal tanam (tidak boleh negatif)
        // Gunakan signed diff: positif jika today >= tanam, negatif jika today < tanam
        $rawDiff = $tanggal_tanam->diffInDays($today, false);
        $hst = max(0, (int) $rawDiff);

        // Hitung batas fase berdasarkan umur varietas
        $batas_reproduktif = (int) round($umur_panen * 0.40);
        $batas_pemasakan   = (int) round($umur_panen * 0.58);

        // Tentukan fase
        if ($hst > $umur_panen) {
            $fase = 'panen';
        } elseif ($hst >= $batas_pemasakan) {
            $fase = 'pemasakan';
        } elseif ($hst >= $batas_reproduktif) {
            $fase = 'reproduktif';
        } elseif ($hst >= 15) {
            $fase = 'vegetatif_aktif';
        } else {
            $fase = 'vegetatif_awal';
        }

        // progress_pct selalu dalam [0.0, 100.0]
        $progress_pct = min(100.0, ($hst / $umur_panen) * 100);

        // Deteksi alert pemupukan aktif
        $alerts = [];
        foreach (self::FERTILIZER_WINDOWS as $window) {
            if ($hst >= $window['mulai'] && $hst <= $window['selesai']) {
                $alerts[] = 'Waktunya pemupukan ' . $window['nama'] . '!';
            }
        }

        // Hitung next_event dan days_to_next
        $next_event   = null;
        $days_to_next = null;

        foreach (self::FERTILIZER_WINDOWS as $window) {
            if ($hst < $window['mulai']) {
                // Event ini belum dimulai — ini adalah event berikutnya
                $next_event   = 'Pupuk ' . $window['nama'];
                $days_to_next = $window['mulai'] - $hst;
                break;
            } elseif ($hst <= $window['selesai']) {
                // Sedang dalam jendela event ini
                $next_event   = 'Pupuk ' . $window['nama'] . ' (sedang aktif)';
                $days_to_next = 0;
                break;
            }
        }

        // Jika semua jendela pupuk sudah lewat, next_event adalah panen
        if ($next_event === null) {
            if ($hst <= $umur_panen) {
                $days_to_next = $umur_panen - $hst;
                $next_event   = 'Estimasi Panen';
            } else {
                $next_event   = 'Panen (sudah terlewat/selesai)';
                $days_to_next = 0;
            }
        }

        return [
            'hst'          => $hst,
            'fase'         => $fase,
            'fase_label'   => self::FASE_LABELS[$fase],
            'fase_index'   => self::FASE_INDEX[$fase],
            'progress_pct' => $progress_pct,
            'next_event'   => $next_event,
            'days_to_next' => $days_to_next,
            'alerts'       => $alerts,
            'warning'      => $warning,
        ];
    }

    /**
     * Menghasilkan jadwal pemupukan dan milestone musim tanam.
     *
     * @param Carbon $tanggal_tanam
     * @param int    $umur_panen
     * @return array array of events, each:
     *     ['event'          => string,
     *      'tanggal_mulai'  => Carbon,
     *      'tanggal_selesai'=> Carbon,
     *      'hst_mulai'      => int,
     *      'hst_selesai'    => int,
     *      'status'         => 'selesai'|'aktif'|'mendatang']
     * @throws InvalidArgumentException
     */
    public function generateSchedule(Carbon $tanggal_tanam, int $umur_panen): array
    {
        $this->validateUmurPanen($umur_panen);

        $today = Carbon::today();
        $hst_today = max(0, (int) $tanggal_tanam->diffInDays($today, false));

        // Definisi event jadwal pupuk
        $event_definitions = [
            [
                'event'      => 'Pupuk Dasar',
                'hst_mulai'  => 0,
                'hst_selesai' => 3,
            ],
            [
                'event'      => 'Pupuk Susulan 1',
                'hst_mulai'  => 21,
                'hst_selesai' => 25,
            ],
            [
                'event'      => 'Pupuk Susulan 2',
                'hst_mulai'  => 40,
                'hst_selesai' => 45,
            ],
            [
                'event'      => 'Pupuk Susulan 3',
                'hst_mulai'  => 55,
                'hst_selesai' => 60,
            ],
        ];

        $schedule = [];

        foreach ($event_definitions as $def) {
            // INVARIANT: hst_mulai <= hst_selesai (terjamin dari definisi di atas)
            $hst_mulai   = $def['hst_mulai'];
            $hst_selesai = $def['hst_selesai'];

            $tanggal_mulai   = (clone $tanggal_tanam)->addDays($hst_mulai);
            $tanggal_selesai = (clone $tanggal_tanam)->addDays($hst_selesai);

            // Tentukan status berdasarkan HST hari ini
            if ($hst_today > $hst_selesai) {
                $status = 'selesai';
            } elseif ($hst_today >= $hst_mulai) {
                $status = 'aktif';
            } else {
                $status = 'mendatang';
            }

            $schedule[] = [
                'event'           => $def['event'],
                'tanggal_mulai'   => $tanggal_mulai,
                'tanggal_selesai' => $tanggal_selesai,
                'hst_mulai'       => $hst_mulai,
                'hst_selesai'     => $hst_selesai,
                'status'          => $status,
            ];
        }

        return $schedule;
    }

    /**
     * Menghitung tingkat keparahan penyakit berdasarkan predicted_class dan confidence.
     *
     * @param string $predicted_class  Hasil klasifikasi model ('healthy', 'leaf_blast', dll)
     * @param float  $confidence       Nilai kepercayaan model [0.0, 1.0]
     * @return string|null             'severe'|'moderate'|'mild'|null (null jika healthy)
     */
    public function computeSeverity(string $predicted_class, float $confidence): ?string
    {
        if ($predicted_class === 'healthy') {
            return null;
        }

        if ($confidence >= 0.85) {
            return 'severe';
        }

        if ($confidence >= 0.65) {
            return 'moderate';
        }

        return 'mild';
    }
}
