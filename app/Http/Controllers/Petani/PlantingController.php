<?php

namespace App\Http\Controllers\Petani;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use App\Models\PlantingSchedule;
use App\Models\VarietyRef;
use App\Services\PlantingCalculatorService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlantingController extends Controller
{
    public function __construct(
        private PlantingCalculatorService $calculator
    ) {
    }
    public function index(): Response
    {
        $plantings = PlantingSchedule::where('user_id', auth()->id())
            ->with('lahan')
            ->latest()
            ->get()
            ->map(function (PlantingSchedule $planting) {
                $todayStatus = null;

                try {
                    $todayStatus = $this->calculator->calculatePhase(
                        $planting->tanggal_tanam,
                        $planting->umur_panen_hari
                    );
                } catch (\InvalidArgumentException) {
                    
                }

                return array_merge($planting->toArray(), [
                    'today_status' => $todayStatus,
                ]);
            });

        return Inertia::render('Tanam/Index', [
            'plantings' => $plantings,
        ]);
    }

    
    public function create(): Response
    {
        $lahans = Lahan::where('user_id', auth()->id())
            ->active()
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2', 'varietas_default']);

        $varietyRefs = VarietyRef::orderBy('nama')->get(['id', 'nama', 'umur_panen_hari', 'potensi_hasil_ton_ha']);

        return Inertia::render('Tanam/Create', [
            'lahans' => $lahans,
            'varietyRefs' => $varietyRefs,
        ]);
    }

    
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lahan_id' => [
                'nullable',
                'integer',
                'exists:lahans,id,user_id,' . auth()->id(),
            ],
            'varietas' => ['required', 'string', 'max:100'],
            'tanggal_semai' => ['required', 'date'],
            'tanggal_tanam' => ['required', 'date', 'after_or_equal:tanggal_semai'],
            'umur_panen_hari' => ['required', 'integer', 'min:90', 'max:180'],
            'catatan' => ['nullable', 'string'],
        ]);

        $umurPanenHari = (int) $validated['umur_panen_hari'];
        $lahanId = isset($validated['lahan_id']) ? (int) $validated['lahan_id'] : null;

        
        $tanggalTanam = Carbon::parse($validated['tanggal_tanam']);
        $estimasiPanen = (clone $tanggalTanam)->addDays($umurPanenHari);

        
        $jadwalPupuk = $this->calculator->generateSchedule(
            $tanggalTanam,
            $umurPanenHari
        );

        
        $jadwalPupukArray = array_map(function (array $event): array {
            return array_merge($event, [
                'tanggal_mulai' => $event['tanggal_mulai']->toDateString(),
                'tanggal_selesai' => $event['tanggal_selesai']->toDateString(),
            ]);
        }, $jadwalPupuk);

        $planting = PlantingSchedule::create([
            'user_id' => auth()->id(),
            'lahan_id' => $lahanId,
            'varietas' => $validated['varietas'],
            'tanggal_semai' => $validated['tanggal_semai'],
            'tanggal_tanam' => $validated['tanggal_tanam'],
            'umur_panen_hari' => $umurPanenHari,
            'estimasi_panen' => $estimasiPanen->toDateString(),
            'jadwal_pupuk' => $jadwalPupukArray,
            'catatan' => $validated['catatan'] ?? null,
        ]);

        return redirect()->route('petani.tanam.show', $planting)
            ->with('success', 'Jadwal tanam berhasil dibuat.');
    }

    
    public function show(PlantingSchedule $tanam): Response
    {
        
        if ($tanam->user_id !== auth()->id()) {
            abort(403);
        }

        $tanam->load('lahan');

        
        $todayStatus = $this->calculator->calculatePhase(
            $tanam->tanggal_tanam,
            $tanam->umur_panen_hari
        );

        
        $schedule = $tanam->jadwal_pupuk ?? [];

        return Inertia::render('Tanam/Show', [
            'planting' => $tanam,
            'schedule' => $schedule,
            'today_status' => $todayStatus,
        ]);
    }

    
    public function destroy(PlantingSchedule $tanam): RedirectResponse
    {
        
        if ($tanam->user_id !== auth()->id()) {
            abort(403);
        }

        $tanam->delete();

        return redirect()->route('petani.tanam.index')
            ->with('success', 'Jadwal tanam berhasil dihapus.');
    }
}
