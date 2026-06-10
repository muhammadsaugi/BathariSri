<?php

namespace App\Http\Controllers\Petani\SPK;

use App\Http\Controllers\Controller;
use App\Models\DiseaseScan;
use App\Models\Lahan;
use App\Models\PlantingSchedule;
use App\Models\SpkFertilizerRec;
use App\Services\FertilizerSPKService;
use App\Services\PlantingCalculatorService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FertilizerController extends Controller
{
    public function __construct(
        private FertilizerSPKService $fertilizerService,
        private PlantingCalculatorService $calculatorService,
    ) {}

    /**
     * Tampilkan form SPK pupuk dengan pre-fill otomatis dari M1 dan M2.
     *
     * Pre-fill:
     *   - fase_pertumbuhan : dari PlantingSchedule terbaru per lahan (M1)
     *   - kondisi_penyakit : dari DiseaseScan terbaru per lahan dalam 30 hari terakhir (M2)
     */
    public function create(): Response
    {
        $userId = auth()->id();

        // Ambil lahan aktif milik user yang sedang login
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2', 'jenis_tanah']);

        // Ambil riwayat rekomendasi pupuk terbaru milik user (5 terakhir)
        $previousRecs = SpkFertilizerRec::where('user_id', $userId)
            ->with(['lahan:id,nama_lahan'])
            ->latest()
            ->take(5)
            ->get(['id', 'lahan_id', 'rekomendasi', 'detail_pupuk', 'estimasi_biaya', 'created_at']);

        // Bangun data pre-fill per lahan dari M1 dan M2
        $prefill = [];

        foreach ($lahans as $lahan) {
            $lahanPrefill = [
                'lahan_id'         => $lahan->id,
                'planting_id'      => null,
                'fase_pertumbuhan' => null,
                'disease_scan_id'  => null,
                'kondisi_penyakit' => null,
            ];

            // M1 — PlantingSchedule terbaru untuk lahan ini
            $latestPlanting = PlantingSchedule::where('user_id', $userId)
                ->where('lahan_id', $lahan->id)
                ->latest('tanggal_tanam')
                ->first();

            if ($latestPlanting && $latestPlanting->tanggal_tanam) {
                try {
                    $phaseData = $this->calculatorService->calculatePhase(
                        Carbon::parse($latestPlanting->tanggal_tanam),
                        $latestPlanting->umur_panen_hari,
                    );

                    // Hanya pre-fill fase yang valid untuk form SPK (bukan 'panen')
                    if (in_array($phaseData['fase'], ['vegetatif_awal', 'vegetatif_aktif', 'reproduktif', 'pemasakan'])) {
                        $lahanPrefill['planting_id']      = $latestPlanting->id;
                        $lahanPrefill['fase_pertumbuhan'] = $phaseData['fase'];
                    }
                } catch (\InvalidArgumentException) {
                    // Jika umur_panen tidak valid, lewati pre-fill fase
                }
            }

            // M2 — DiseaseScan terbaru dalam 30 hari terakhir untuk lahan ini
            $latestScan = DiseaseScan::where('user_id', $userId)
                ->where('lahan_id', $lahan->id)
                ->where('scanned_at', '>=', now()->subDays(30))
                ->latest('scanned_at')
                ->first();

            if ($latestScan) {
                $lahanPrefill['disease_scan_id']  = $latestScan->id;
                $lahanPrefill['kondisi_penyakit'] = $latestScan->severity ?? 'healthy';
            }

            $prefill[$lahan->id] = $lahanPrefill;
        }

        return Inertia::render('SPK/Pupuk', [
            'lahans'       => $lahans,
            'prefill'      => $prefill,
            'previous_recs' => $previousRecs,
        ]);
    }

    /**
     * Jalankan Fuzzy Logic untuk rekomendasi pupuk dan tampilkan hasil.
     */
    public function store(Request $request): Response
    {
        $userId = auth()->id();

        $validated = $request->validate([
            'lahan_id'          => ['nullable', 'exists:lahans,id,user_id,' . $userId],
            'fase_pertumbuhan'  => ['required', 'in:vegetatif_awal,vegetatif_aktif,reproduktif,pemasakan'],
            'kondisi_penyakit'  => ['required', 'in:healthy,mild,moderate,severe'],
            'ketersediaan_air'  => ['required', 'in:baik,cukup,kurang'],
            'jenis_tanah'       => ['required', 'in:liat,lempung,pasir'],
            'riwayat_pemupukan' => ['required', 'in:belum_pupuk,sudah_dasar,sudah_susulan1'],
        ]);

        // Tentukan luas lahan: ambil dari lahan jika ada, default 2500 m2 (0.25 Ha) jika tidak ada
        $luasM2 = 2500.0;
        $lahanId = $validated['lahan_id'] ?? null;

        if ($lahanId) {
            $lahan = Lahan::where('id', $lahanId)
                ->where('user_id', $userId)
                ->first();

            if ($lahan) {
                $luasM2 = (float) $lahan->luas_m2;
            }
        }

        // Resolusi planting_id dan disease_scan_id dari data terbaru lahan yang dipilih
        $plantingId    = null;
        $diseaseScanId = null;

        if ($lahanId) {
            $latestPlanting = PlantingSchedule::where('user_id', $userId)
                ->where('lahan_id', $lahanId)
                ->latest('tanggal_tanam')
                ->value('id');

            $plantingId = $latestPlanting;

            $latestScan = DiseaseScan::where('user_id', $userId)
                ->where('lahan_id', $lahanId)
                ->where('scanned_at', '>=', now()->subDays(30))
                ->latest('scanned_at')
                ->value('id');

            $diseaseScanId = $latestScan;
        }

        // Susun array input untuk service
        $input = [
            'fase_pertumbuhan'  => $validated['fase_pertumbuhan'],
            'kondisi_penyakit'  => $validated['kondisi_penyakit'],
            'ketersediaan_air'  => $validated['ketersediaan_air'],
            'jenis_tanah'       => $validated['jenis_tanah'],
            'riwayat_pemupukan' => $validated['riwayat_pemupukan'],
        ];

        // Jalankan Fuzzy Inference System via FertilizerSPKService
        $result = $this->fertilizerService->generate(
            input: $input,
            luas_m2: $luasM2,
            user_id: $userId,
            lahan_id: $lahanId,
            planting_id: $plantingId,
            disease_scan_id: $diseaseScanId,
        );

        // Ambil ulang daftar lahan untuk dikirim kembali ke view
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2', 'jenis_tanah']);

        // Ambil riwayat rekomendasi terbaru (termasuk yang baru saja disimpan)
        $previousRecs = SpkFertilizerRec::where('user_id', $userId)
            ->with(['lahan:id,nama_lahan'])
            ->latest()
            ->take(5)
            ->get(['id', 'lahan_id', 'rekomendasi', 'detail_pupuk', 'estimasi_biaya', 'created_at']);

        // Tampilkan form + hasil dalam satu halaman (UX terbaik)
        return Inertia::render('SPK/Pupuk', [
            'lahans'        => $lahans,
            'prefill'       => null,
            'previous_recs'  => $previousRecs,
            'result'        => [
                'rec_id'         => $result['rec']->id,
                'rekomendasi'    => $result['rekomendasi'],
                'nama_pupuk'     => $result['nama_pupuk'],
                'fuzzy_result'   => $result['fuzzy_result'],
                'detail_pupuk'   => $result['detail_pupuk'],
                'estimasi_biaya' => $result['estimasi_biaya'],
                'luas_m2'        => $luasM2,
                'input'          => $input,
            ],
        ]);
    }
}
