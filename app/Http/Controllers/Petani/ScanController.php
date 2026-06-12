<?php

namespace App\Http\Controllers\Petani;

use App\Exceptions\PadiScanException;
use App\Http\Controllers\Controller;
use App\Models\DiseaseScan;
use App\Services\PadiScanService;
use App\Services\PlantingCalculatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ScanController extends Controller
{
    public function __construct(
        private PadiScanService $scanService,
        private PlantingCalculatorService $calculatorService,
    ) {
    }

    public function index(): Response
    {
        $scans = DiseaseScan::where('user_id', auth()->id())
            ->with('lahan:id,nama_lahan')
            ->orderByDesc('scanned_at')
            ->get();

        return Inertia::render('Scan/Riwayat', [
            'scans' => $scans,
        ]);
    }

    
    public function create(): Response
    {
        $lahans = \App\Models\Lahan::where('user_id', auth()->id())
            ->where('is_active', true)
            ->orderBy('nama_lahan')
            ->get(['id', 'nama_lahan', 'luas_m2']);

        return Inertia::render('Scan/Penyakit', [
            'lahans' => $lahans,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'lahan_id' => ['nullable', 'exists:lahans,id,user_id,' . auth()->id()],
        ]);

        $userId = auth()->id();
        $image = $request->file('image');

        
        $timestamp = now()->format('YmdHis');
        
        $safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', pathinfo($image->getClientOriginalName(), PATHINFO_BASENAME));
        $filename = $timestamp . '_' . $safeName;
        $relativePath = 'scans/' . $userId . '/' . $filename;

        Storage::disk('public')->putFileAs(
            'scans/' . $userId,
            $image,
            $filename
        );

        
        $absolutePath = storage_path('app/public/' . $relativePath);

        
        try {
            $prediction = $this->scanService->predict($absolutePath);
        } catch (PadiScanException $e) {
            Storage::disk('public')->delete($relativePath);

            return back()->withErrors([
                'image' => 'Sistem AI deteksi penyakit sedang tidak tersedia. Silakan coba beberapa saat lagi.',
            ]);
        }

        
        $severity = $this->calculatorService->computeSeverity(
            $prediction['predicted_class'],
            $prediction['confidence']
        );

        
        $scan = DiseaseScan::create([
            'user_id' => $userId,
            'lahan_id' => $validated['lahan_id'] ?? null,
            'image_path' => $relativePath,
            'predicted_class' => $prediction['predicted_class'],
            'confidence' => $prediction['confidence'],
            'severity' => $severity,
            'raw_response' => $prediction,
            'scanned_at' => now(),
        ]);

        
        return redirect()->route('petani.scan.show', $scan->id);
    }

    
    public function show(DiseaseScan $scan): Response
    {
        
        if ($scan->user_id !== auth()->id()) {
            abort(403);
        }

        
        $scan->load(['diseaseRef', 'lahan']);

        $diseaseRef = $scan->diseaseRef;
        $penanganan = null;

        
        if ($diseaseRef && $scan->severity) {
            $penanganan = match ($scan->severity) {
                'mild' => $diseaseRef->penanganan_mild,
                'moderate' => $diseaseRef->penanganan_moderate,
                'severe' => $diseaseRef->penanganan_severe,
                default => null,
            };
        }

        return Inertia::render('Scan/Hasil', [
            'scan' => $scan,
            'diseaseRef' => $diseaseRef,
            'penanganan' => $penanganan,
        ]);
    }

    
    public function destroy(DiseaseScan $scan): RedirectResponse
    {
        
        if ($scan->user_id !== auth()->id()) {
            abort(403);
        }

        
        if ($scan->image_path && Storage::disk('public')->exists($scan->image_path)) {
            Storage::disk('public')->delete($scan->image_path);
        }

        
        $scan->delete();

        return redirect()->route('petani.scan.index')
            ->with('success', 'Data scan berhasil dihapus.');
    }
}
