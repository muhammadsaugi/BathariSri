<?php

namespace App\Http\Controllers\Petani\SPK;

use App\Http\Controllers\Controller;
use App\Models\DiseaseScan;
use App\Models\Lahan;
use App\Models\SpkFertilizerRec;
use App\Models\VarietyRef;
use App\Services\HarvestPredictionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HarvestController extends Controller
{
    public function __construct(
        private HarvestPredictionService $harvestService,
    ) {}

    
    public function create(): Response
    {
        $userId = auth()->id();

        
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2', 'jenis_tanah']);

        
        $varietyRefs = VarietyRef::orderBy('nama')->get(['id', 'nama', 'potensi_hasil_ton_ha', 'umur_panen_hari']);

        
        $prefill = [];

        foreach ($lahans as $lahan) {
            $lahanPrefill = [
                'lahan_id'          => $lahan->id,
                'spk_fertilizer_id' => null,
                'kondisi_penyakit'  => null,
            ];

            
            $latestFertilizer = SpkFertilizerRec::where('user_id', $userId)
                ->where('lahan_id', $lahan->id)
                ->latest()
                ->first(['id']);

            if ($latestFertilizer) {
                $lahanPrefill['spk_fertilizer_id'] = $latestFertilizer->id;
            }

            
            $latestScan = DiseaseScan::where('user_id', $userId)
                ->where('lahan_id', $lahan->id)
                ->where('scanned_at', '>=', now()->subDays(30))
                ->latest('scanned_at')
                ->first(['severity']);

            if ($latestScan) {
                
                $severityMap = [
                    'healthy'  => 'tidak_ada',
                    'mild'     => 'mild',
                    'moderate' => 'moderate',
                    'severe'   => 'severe',
                ];
                $lahanPrefill['kondisi_penyakit'] = $severityMap[$latestScan->severity] ?? null;
            }

            $prefill[$lahan->id] = $lahanPrefill;
        }

        return Inertia::render('SPK/Panen', [
            'lahans'      => $lahans,
            'varietyRefs' => $varietyRefs,
            'prefill'     => $prefill,
        ]);
    }

    
    public function store(Request $request): Response
    {
        $userId = auth()->id();

        $validated = $request->validate([
            'lahan_id'              => ['nullable', 'exists:lahans,id,user_id,' . $userId],
            'variety_id'            => ['required', 'exists:variety_refs,id'],
            'kondisi_penyakit'      => ['required', 'in:tidak_ada,mild,moderate,severe'],
            'kesesuaian_pemupukan'  => ['required', 'in:ikut_rekomendasi_3x,ikut_kurang_3x,tidak_ikut_3x,tidak_ikut_kurang_3x,tidak_pernah'],
            'ketersediaan_air'      => ['required', 'in:irigasi_baik,irigasi_cukup,tadah_baik,tadah_cukup,kurang'],
            'kondisi_cuaca'         => ['required', 'in:normal,banjir,kekeringan'],
        ]);

        $lahanId = $validated['lahan_id'] ?? null;

        
        if ($lahanId) {
            $lahan = Lahan::where('id', $lahanId)
                ->where('user_id', $userId)
                ->firstOrFail();
        } else {
            
            $lahan = new Lahan([
                'id'       => null,
                'luas_m2'  => 2500.0,
            ]);
        }

        
        $variety = VarietyRef::findOrFail($validated['variety_id']);

        
        $spkFertilizerId = $request->input('spk_fertilizer_id');

        if (! $spkFertilizerId && $lahanId) {
            $spkFertilizerId = SpkFertilizerRec::where('user_id', $userId)
                ->where('lahan_id', $lahanId)
                ->latest()
                ->value('id');
        }

        
        $input = [
            'kondisi_penyakit'     => $validated['kondisi_penyakit'],
            'kesesuaian_pemupukan' => $validated['kesesuaian_pemupukan'],
            'ketersediaan_air'     => $validated['ketersediaan_air'],
            'kondisi_cuaca'        => $validated['kondisi_cuaca'],
        ];

        
        $result = $this->harvestService->generate(
            input: $input,
            lahan: $lahan,
            variety: $variety,
            user_id: $userId,
            spk_fertilizer_id: $spkFertilizerId,
        );

        
        $lahans = Lahan::where('user_id', $userId)
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2', 'jenis_tanah']);

        $varietyRefs = VarietyRef::orderBy('nama')->get(['id', 'nama', 'potensi_hasil_ton_ha', 'umur_panen_hari']);

        return Inertia::render('SPK/Panen', [
            'lahans'      => $lahans,
            'varietyRefs' => $varietyRefs,
            'prefill'     => null,
            'result'      => [
                'prediction_id'        => $result['prediction']->id,
                'kategori'             => $result['kategori'],
                'kategori_label'       => $result['kategori_label'],
                'estimasi_ton_ha'      => $result['estimasi_ton_ha'],
                'estimasi_total_ton'   => $result['estimasi_total_ton'],
                'estimasi_pendapatan'  => $result['estimasi_pendapatan'],
                'faktor_risiko'        => $result['faktor_risiko'],
                'regression_details'   => $result['regression_details'],
            ],
        ]);
    }
}
