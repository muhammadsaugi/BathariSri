<?php

namespace App\Http\Controllers\Petani\SPK;

use App\Http\Controllers\Controller;
use App\Models\HarvestPrediction;
use App\Models\Lahan;
use App\Services\WasteRecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WasteController extends Controller
{
    public function __construct(
        private WasteRecommendationService $wasteService,
    ) {}

    /**
     * Tampilkan form SPK rekomendasi limbah dengan pre-fill otomatis.
     *
     * Pre-fill per lahan:
     *   - harvest_id          : dari HarvestPrediction terbaru per lahan (Modul 4)
     *   - estimasi_total_ton  : estimasi ton dari prediksi panen terbaru
     */
    public function create(): Response
    {
        $userId = auth()->id();

        // Ambil lahan aktif milik user
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2']);

        // Bangun data pre-fill per lahan
        $prefill = [];

        foreach ($lahans as $lahan) {
            $lahanPrefill = [
                'lahan_id'          => $lahan->id,
                'harvest_id'        => null,
                'estimasi_total_ton' => null,
            ];

            // Cari HarvestPrediction terbaru per lahan
            $latestHarvest = HarvestPrediction::where('user_id', $userId)
                ->where('lahan_id', $lahan->id)
                ->latest()
                ->first(['id', 'estimasi_total_ton']);

            if ($latestHarvest) {
                $lahanPrefill['harvest_id']         = $latestHarvest->id;
                $lahanPrefill['estimasi_total_ton']  = (float) $latestHarvest->estimasi_total_ton;
            }

            $prefill[$lahan->id] = $lahanPrefill;
        }

        return Inertia::render('SPK/Limbah', [
            'lahans'  => $lahans,
            'prefill' => $prefill,
        ]);
    }

    /**
     * Jalankan rule-based expert system untuk rekomendasi pengolahan limbah.
     */
    public function store(Request $request): Response
    {
        $userId = auth()->id();

        $validated = $request->validate([
            'lahan_id'          => ['nullable', 'exists:lahans,id,user_id,' . $userId],
            'harvest_id'        => ['nullable', 'exists:harvest_predictions,id,user_id,' . $userId],
            'estimasi_total_ton' => ['required', 'numeric', 'min:0.01'],
            'jenis_limbah_ada'  => ['required', 'array'],
            'jenis_limbah_ada.*' => ['in:jerami,sekam,dedak'],
            'fasilitas'         => ['nullable', 'array'],
            'fasilitas.*'       => ['in:lahan_kosong,kandang_ternak,akses_pengepul,alat_cacah'],
            'tujuan_utama'      => ['required', 'in:ekonomi,lingkungan,keduanya'],
        ]);

        $lahanId   = $validated['lahan_id'] ?? null;
        $harvestId = $validated['harvest_id'] ?? null;

        // Susun input untuk service
        $input = [
            'jenis_limbah_ada' => $validated['jenis_limbah_ada'],
            'fasilitas'        => $validated['fasilitas'] ?? [],
            'tujuan_utama'     => $validated['tujuan_utama'],
        ];

        // Panggil WasteRecommendationService
        $result = $this->wasteService->generate(
            input: $input,
            estimasi_total_ton: (float) $validated['estimasi_total_ton'],
            user_id: $userId,
            lahan_id: $lahanId,
            harvest_id: $harvestId,
        );

        // Ambil ulang daftar lahan untuk dikembalikan ke view
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2']);

        return Inertia::render('SPK/Limbah', [
            'lahans'  => $lahans,
            'prefill' => null,
            'result'  => [
                'recommendation_id'    => $result['recommendation']->id,
                'volume'               => $result['volume'],
                'rekomendasi_jerami'   => $result['rekomendasi_jerami'],
                'rekomendasi_sekam'    => $result['rekomendasi_sekam'],
                'rekomendasi_dedak'    => $result['rekomendasi_dedak'],
                'total_nilai_ekonomi'  => $result['total_nilai_ekonomi'],
            ],
        ]);
    }
}
