<?php

namespace App\Services;

use Carbon\Carbon;
use InvalidArgumentException;

class PlantingCalculatorService
{
    
    private const FASE_LABELS = [
        'vegetatif_awal'   => 'Fase Vegetatif Awal (Establishment)',
        'vegetatif_aktif'  => 'Fase Vegetatif Aktif (Anakan Maksimum)',
        'reproduktif'      => 'Fase Reproduktif (Pembentukan Malai)',
        'pemasakan'        => 'Fase Pemasakan (Pengisian Gabah)',
        'panen'            => 'Siap Panen / Pasca Panen',
    ];

    
    private const FASE_INDEX = [
        'vegetatif_awal'  => 0,
        'vegetatif_aktif' => 1,
        'reproduktif'     => 2,
        'pemasakan'       => 3,
        'panen'           => 4,
    ];

    
    private const FERTILIZER_WINDOWS = [
        ['mulai' => 21, 'selesai' => 25, 'nama' => 'Susulan 1'],
        ['mulai' => 40, 'selesai' => 45, 'nama' => 'Susulan 2'],
        ['mulai' => 55, 'selesai' => 60, 'nama' => 'Susulan 3'],
    ];

    
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

    
    public function calculatePhase(Carbon $tanggal_tanam, int $umur_panen, ?Carbon $today = null): array
    {
        $warning = $this->validateUmurPanen($umur_panen);

        $today = $today ?? Carbon::today();

        
        
        $rawDiff = $tanggal_tanam->diffInDays($today, false);
        $hst = max(0, (int) $rawDiff);

        
        $batas_reproduktif = (int) round($umur_panen * 0.40);
        $batas_pemasakan   = (int) round($umur_panen * 0.58);

        
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

        
        $progress_pct = min(100.0, ($hst / $umur_panen) * 100);

        
        $alerts = [];
        foreach (self::FERTILIZER_WINDOWS as $window) {
            if ($hst >= $window['mulai'] && $hst <= $window['selesai']) {
                $alerts[] = 'Waktunya pemupukan ' . $window['nama'] . '!';
            }
        }

        
        $next_event   = null;
        $days_to_next = null;

        foreach (self::FERTILIZER_WINDOWS as $window) {
            if ($hst < $window['mulai']) {
                
                $next_event   = 'Pupuk ' . $window['nama'];
                $days_to_next = $window['mulai'] - $hst;
                break;
            } elseif ($hst <= $window['selesai']) {
                
                $next_event   = 'Pupuk ' . $window['nama'] . ' (sedang aktif)';
                $days_to_next = 0;
                break;
            }
        }

        
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

    
    public function generateSchedule(Carbon $tanggal_tanam, int $umur_panen): array
    {
        $this->validateUmurPanen($umur_panen);

        $today = Carbon::today();
        $hst_today = max(0, (int) $tanggal_tanam->diffInDays($today, false));

        
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
            
            $hst_mulai   = $def['hst_mulai'];
            $hst_selesai = $def['hst_selesai'];

            $tanggal_mulai   = (clone $tanggal_tanam)->addDays($hst_mulai);
            $tanggal_selesai = (clone $tanggal_tanam)->addDays($hst_selesai);

            
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
