<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SpkWeightConfig;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSpkController extends Controller
{
    // =========================================================
    // Default values — sama persis dengan SpkWeightConfigSeeder
    // =========================================================

    private const DEFAULTS = [
        'M3' => [
            ['kriteria_nama' => 'fase_pertumbuhan',  'bobot' => 0.2500, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'kondisi_penyakit',  'bobot' => 0.2200, 'jenis' => 'cost'],
            ['kriteria_nama' => 'ketersediaan_air',  'bobot' => 0.2000, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'jenis_tanah',       'bobot' => 0.1800, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'riwayat_pemupukan', 'bobot' => 0.1500, 'jenis' => 'benefit'],
        ],
        'M4' => [
            ['kriteria_nama' => 'keparahan_penyakit',   'bobot' => 0.3000, 'jenis' => 'cost'],
            ['kriteria_nama' => 'kesesuaian_pemupukan', 'bobot' => 0.2500, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'ketersediaan_air',     'bobot' => 0.2000, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'potensi_varietas',     'bobot' => 0.1500, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'kondisi_cuaca',        'bobot' => 0.1000, 'jenis' => 'benefit'],
        ],
        'M5' => [
            ['kriteria_nama' => 'nilai_ekonomi',          'bobot' => 0.3000, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'kemudahan_pengolahan',   'bobot' => 0.2500, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'dampak_lingkungan',      'bobot' => 0.2000, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'ketersediaan_fasilitas', 'bobot' => 0.1500, 'jenis' => 'benefit'],
            ['kriteria_nama' => 'permintaan_pasar',       'bobot' => 0.1000, 'jenis' => 'benefit'],
        ],
    ];

    // =========================================================
    // index — tampilkan konfigurasi bobot saat ini per modul
    // =========================================================

    /**
     * Tampilkan halaman konfigurasi bobot SPK.
     * Ambil semua bobot dari spk_weight_configs, group by modul (M3, M4, M5).
     */
    public function index(): Response
    {
        $configs = SpkWeightConfig::orderBy('modul')
            ->orderBy('id')
            ->get()
            ->groupBy('modul');

        return Inertia::render('Admin/SpkBobot', [
            'configs' => $configs,
        ]);
    }

    // =========================================================
    // update — simpan konfigurasi bobot baru
    // =========================================================

    /**
     * Perbarui bobot SPK.
     *
     * Aturan validasi:
     * - weights: array yang diperlukan
     * - weights.*.id: integer yang ada di tabel spk_weight_configs
     * - weights.*.bobot: numeric, min:0.01, max:0.99
     * - weights.*.jenis: in:benefit,cost
     * - Total bobot per modul harus berada dalam rentang eksklusif (0.999, 1.001)
     *   — tepat 0.999 atau 1.001 DITOLAK (Property 12)
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'weights'           => ['required', 'array'],
            'weights.*.id'      => ['required', 'integer', 'exists:spk_weight_configs,id'],
            'weights.*.bobot'   => ['required', 'numeric', 'min:0.01', 'max:0.99'],
            'weights.*.jenis'   => ['required', 'string', 'in:benefit,cost'],
        ]);

        $weights = $request->input('weights');

        // Validasi total bobot per modul (eksklusif — Property 12)
        $this->validateWeightTotals($weights);

        // Simpan setiap record
        foreach ($weights as $w) {
            $config = SpkWeightConfig::findOrFail((int) $w['id']);
            $config->update([
                'bobot'      => (float) $w['bobot'],
                'jenis'      => $w['jenis'],
                'updated_by' => auth()->id(),
            ]);
        }

        return redirect()->back()->with('success', 'Konfigurasi bobot SPK berhasil diperbarui.');
    }

    // =========================================================
    // reset — kembalikan bobot ke nilai default seeder
    // =========================================================

    /**
     * Reset bobot SPK ke nilai default untuk modul yang diminta.
     *
     * Request body: { modul: 'M3' | 'M4' | 'M5' }
     */
    public function reset(Request $request): RedirectResponse
    {
        $request->validate([
            'modul' => ['required', 'string', 'in:M3,M4,M5'],
        ]);

        $modul    = $request->input('modul');
        $defaults = self::DEFAULTS[$modul];

        foreach ($defaults as $default) {
            SpkWeightConfig::where('modul', $modul)
                ->where('kriteria_nama', $default['kriteria_nama'])
                ->update([
                    'bobot'      => $default['bobot'],
                    'jenis'      => $default['jenis'],
                    'updated_by' => auth()->id(),
                ]);
        }

        return redirect()->back()->with('success', "Bobot modul {$modul} berhasil direset ke nilai default.");
    }

    // =========================================================
    // Private helpers
    // =========================================================

    /**
     * Validasi total bobot per modul.
     *
     * Aturan (Property 12 / Requirement 5.8, 8.5, 8.6):
     *   abs(sum - 1.0) > 0.001 → TOLAK
     *
     * Artinya hanya rentang EKSKLUSIF (0.999, 1.001) yang diterima.
     * Nilai tepat 0.999 atau 1.001 DITOLAK.
     *
     * Pesan error tidak mencantumkan total aktual.
     *
     * @param  array<int, array{id: int, bobot: numeric, jenis: string}> $weights
     * @throws \Illuminate\Validation\ValidationException
     */
    private function validateWeightTotals(array $weights): void
    {
        // Petakan id → modul
        $ids     = array_column($weights, 'id');
        $configs = SpkWeightConfig::whereIn('id', $ids)->get()->keyBy('id');

        // Kelompokkan bobot baru berdasarkan modul
        $modulTotals = [];
        foreach ($weights as $w) {
            $config = $configs->get((int) $w['id']);
            if (!$config) {
                continue;
            }
            $modul                 = $config->modul;
            $modulTotals[$modul]   = ($modulTotals[$modul] ?? 0.0) + (float) $w['bobot'];
        }

        $errors = [];
        foreach ($modulTotals as $modul => $total) {
            // Eksklusif: abs(sum - 1.0) > 0.001 → TOLAK
            // Ini berarti 0.999 dan 1.001 tepat pada batas juga ditolak
            if (abs($total - 1.0) >= 0.001) {
                $errors["weights"] = [
                    "Total bobot untuk modul {$modul} tidak valid. Pastikan total bobot tiap modul tepat sama dengan 1.",
                ];
                break;
            }
        }

        if (!empty($errors)) {
            throw \Illuminate\Validation\ValidationException::withMessages($errors);
        }
    }
}
