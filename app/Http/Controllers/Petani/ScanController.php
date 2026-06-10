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
    ) {}

    /**
     * Tampilkan riwayat scan milik user yang sedang login.
     */
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

    /**
     * Tampilkan form upload gambar untuk scan baru.
     */
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

    /**
     * Proses upload gambar, panggil AI, dan simpan hasil deteksi.
     *
     * Rate limit: 20 request/jam per user (ditangani via throttle:20,1 di route).
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi input
        $validated = $request->validate([
            'image'    => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'lahan_id' => ['nullable', 'exists:lahans,id,user_id,' . auth()->id()],
        ]);

        $userId = auth()->id();
        $image  = $request->file('image');

        // 2. Simpan file ke storage/app/public/scans/{user_id}/{timestamp}_{safe_filename}
        $timestamp    = now()->format('YmdHis');
        // Sanitasi nama file: ambil hanya nama (tanpa path), lalu ganti karakter non-alfanumerik
        $safeName     = preg_replace('/[^A-Za-z0-9._-]/', '_', pathinfo($image->getClientOriginalName(), PATHINFO_BASENAME));
        $filename     = $timestamp . '_' . $safeName;
        $relativePath = 'scans/' . $userId . '/' . $filename;

        Storage::disk('public')->putFileAs(
            'scans/' . $userId,
            $image,
            $filename
        );

        // Path absolut untuk PadiScanService
        $absolutePath = storage_path('app/public/' . $relativePath);

        // 3. Panggil AI — jika gagal, hapus file yang sudah disimpan
        try {
            $prediction = $this->scanService->predict($absolutePath);
        } catch (PadiScanException $e) {
            Storage::disk('public')->delete($relativePath);

            return back()->withErrors([
                'image' => 'Sistem AI deteksi penyakit sedang tidak tersedia. Silakan coba beberapa saat lagi.',
            ]);
        }

        // 4. Hitung severity dari predicted_class dan confidence
        $severity = $this->calculatorService->computeSeverity(
            $prediction['predicted_class'],
            $prediction['confidence']
        );

        // 5. Simpan hasil scan ke database
        $scan = DiseaseScan::create([
            'user_id'         => $userId,
            'lahan_id'        => $validated['lahan_id'] ?? null,
            'image_path'      => $relativePath,
            'predicted_class' => $prediction['predicted_class'],
            'confidence'      => $prediction['confidence'],
            'severity'        => $severity,
            'raw_response'    => $prediction,
            'scanned_at'      => now(),
        ]);

        // 6. Redirect ke halaman hasil scan
        return redirect()->route('petani.scan.show', $scan->id);
    }

    /**
     * Tampilkan detail hasil scan beserta panduan penanganan.
     */
    public function show(DiseaseScan $scan): Response
    {
        // Cek kepemilikan
        if ($scan->user_id !== auth()->id()) {
            abort(403);
        }

        // Load relasi yang diperlukan
        $scan->load(['diseaseRef', 'lahan']);

        $diseaseRef  = $scan->diseaseRef;
        $penanganan  = null;

        // Ambil panduan penanganan sesuai severity
        if ($diseaseRef && $scan->severity) {
            $penanganan = match ($scan->severity) {
                'mild'     => $diseaseRef->penanganan_mild,
                'moderate' => $diseaseRef->penanganan_moderate,
                'severe'   => $diseaseRef->penanganan_severe,
                default    => null,
            };
        }

        return Inertia::render('Scan/Hasil', [
            'scan'       => $scan,
            'diseaseRef' => $diseaseRef,
            'penanganan' => $penanganan,
        ]);
    }

    /**
     * Hapus scan beserta file fisiknya.
     */
    public function destroy(DiseaseScan $scan): RedirectResponse
    {
        // Cek kepemilikan
        if ($scan->user_id !== auth()->id()) {
            abort(403);
        }

        // Hapus file fisik jika ada
        if ($scan->image_path && Storage::disk('public')->exists($scan->image_path)) {
            Storage::disk('public')->delete($scan->image_path);
        }

        // Hapus record dari database
        $scan->delete();

        return redirect()->route('petani.scan.index')
            ->with('success', 'Data scan berhasil dihapus.');
    }
}
