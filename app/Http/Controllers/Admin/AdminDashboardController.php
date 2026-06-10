<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\DiseaseScan;
use App\Models\SpkFertilizerRec;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // -------------------------------------------------------
        // Statistik badge
        // -------------------------------------------------------
        $totalPetaniAktif  = User::where('role', 'petani')->where('is_active', true)->count();

        $totalScanBulanIni = DiseaseScan::whereMonth('scanned_at', now()->month)
            ->whereYear('scanned_at', now()->year)
            ->count();

        $totalSpkBulanIni  = SpkFertilizerRec::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $totalArtikelPublish = Article::where('is_published', true)->count();

        // -------------------------------------------------------
        // Data chart: scan per hari 7 hari terakhir
        // -------------------------------------------------------
        $scanPerHari = DiseaseScan::selectRaw('DATE(scanned_at) as tanggal, COUNT(*) as total')
            ->where('scanned_at', '>=', now()->subDays(6)->startOfDay())
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get();

        // -------------------------------------------------------
        // Distribusi predicted_class
        // -------------------------------------------------------
        $distribusiPenyakit = DiseaseScan::selectRaw('predicted_class, COUNT(*) as total')
            ->groupBy('predicted_class')
            ->get();

        // -------------------------------------------------------
        // Scan terbaru 10 record
        // -------------------------------------------------------
        $scanTerbaru = DiseaseScan::with(['user:id,name', 'lahan:id,nama_lahan'])
            ->latest('scanned_at')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalPetaniAktif'    => $totalPetaniAktif,
                'totalScanBulanIni'   => $totalScanBulanIni,
                'totalSpkBulanIni'    => $totalSpkBulanIni,
                'totalArtikelPublish' => $totalArtikelPublish,
            ],
            'scanPerHari'       => $scanPerHari,
            'distribusiPenyakit' => $distribusiPenyakit,
            'scanTerbaru'       => $scanTerbaru,
        ]);
    }
}
