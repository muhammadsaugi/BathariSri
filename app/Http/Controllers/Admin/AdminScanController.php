<?php

namespace App\Http\Controllers\Admin;

use App\Exports\DiseaseScanExport;
use App\Http\Controllers\Controller;
use App\Models\DiseaseScan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminScanController extends Controller
{
    /**
     * Tampilkan semua data scan penyakit dari seluruh petani.
     * Filter opsional: predicted_class, date_from, date_to
     */
    public function index(Request $request)
    {
        $filters = $request->only(['predicted_class', 'date_from', 'date_to']);

        $scans = DiseaseScan::with(['user:id,name', 'lahan:id,nama_lahan'])
            ->when($filters['predicted_class'] ?? null, fn ($q, $v) => $q->where('predicted_class', $v))
            ->when($filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('scanned_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('scanned_at', '<=', $v))
            ->latest('scanned_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Scan/Index', [
            'scans'   => $scans,
            'filters' => $filters,
        ]);
    }

    /**
     * Export data scan penyakit ke file CSV.
     * Filter opsional: predicted_class, date_from, date_to
     */
    public function export(Request $request)
    {
        $filters = $request->only(['predicted_class', 'date_from', 'date_to']);

        return Excel::download(
            new DiseaseScanExport($filters),
            'scan-penyakit.csv',
            \Maatwebsite\Excel\Excel::CSV
        );
    }
}
