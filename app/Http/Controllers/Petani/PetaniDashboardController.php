<?php

namespace App\Http\Controllers\Petani;

use App\Http\Controllers\Controller;
use App\Models\DiseaseScan;
use App\Models\HarvestPrediction;
use App\Models\Lahan;
use App\Models\SpkFertilizerRec;
use App\Services\PlantingCalculatorService;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PetaniDashboardController extends Controller
{
    public function __construct(
        private PlantingCalculatorService $plantingCalculator
    ) {}

    public function index(): Response
    {
        $userId = auth()->id();

        // ------------------------------------------------------------------
        // 1. Ambil semua lahan aktif milik petani yang sedang login
        // ------------------------------------------------------------------
        // Eager-load planting schedule terbaru per lahan (hindari N+1 query)
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->with([
                'plantingSchedules' => fn ($q) => $q->latest('tanggal_tanam')->limit(1),
            ])
            ->get(['id', 'nama_lahan', 'luas_m2']);

        // ------------------------------------------------------------------
        // 2. Untuk setiap lahan, hitung fase pertumbuhan real-time
        // ------------------------------------------------------------------
        $lahansData = $lahans->map(function (Lahan $lahan) {
            $latestPlanting = $lahan->plantingSchedules->first();

            $todayStatus = null;

            if ($latestPlanting) {
                try {
                    $todayStatus = $this->plantingCalculator->calculatePhase(
                        Carbon::parse($latestPlanting->tanggal_tanam),
                        (int) $latestPlanting->umur_panen_hari
                    );
                } catch (\Throwable) {
                    $todayStatus = null;
                }
            }

            return [
                'id'              => $lahan->id,
                'nama_lahan'      => $lahan->nama_lahan,
                'luas_m2'         => $lahan->luas_m2,
                'today_status'    => $todayStatus,
                'latest_planting' => $latestPlanting
                    ? $latestPlanting->only(['id', 'varietas', 'estimasi_panen'])
                    : null,
            ];
        })->values()->toArray();

        // ------------------------------------------------------------------
        // 3. Ambil scan terbaru milik petani dalam 7 hari terakhir
        // ------------------------------------------------------------------
        $scanTerbaru = DiseaseScan::where('user_id', $userId)
            ->where('scanned_at', '>=', now()->subDays(7)->startOfDay())
            ->latest('scanned_at')
            ->first();

        // ------------------------------------------------------------------
        // 4. Ambil rekomendasi pupuk terbaru (SpkFertilizerRec) milik petani
        // ------------------------------------------------------------------
        $latestFertilizer = SpkFertilizerRec::where('user_id', $userId)
            ->latest()
            ->first();

        // ------------------------------------------------------------------
        // 5. Ambil prediksi panen terbaru (HarvestPrediction) milik petani
        // ------------------------------------------------------------------
        $latestHarvest = HarvestPrediction::where('user_id', $userId)
            ->latest()
            ->first();

        // ------------------------------------------------------------------
        // 6. Render Inertia view — HANYA data milik auth()->id()
        // ------------------------------------------------------------------
        return Inertia::render('Petani/Dashboard', [
            'lahans_data'        => $lahansData,
            'scan_terbaru'       => $scanTerbaru,
            'latest_fertilizer'  => $latestFertilizer,
            'latest_harvest'     => $latestHarvest,
        ]);
    }
}
