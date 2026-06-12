<?php

namespace App\Http\Controllers\Petani;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use App\Models\VarietyRef;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LahanController extends Controller
{
    public function index(): Response
    {
        $lahans = Lahan::where('user_id', auth()->id())
            ->active()
            ->latest()
            ->get();

        return Inertia::render('Petani/Lahan/Index', [
            'lahans' => $lahans,
        ]);
    }

    /**
     * Tampilkan form tambah lahan.
     */
    public function create(): Response
    {
        $varietasList = VarietyRef::orderBy('nama')->get(['id', 'nama']);
        return Inertia::render('Petani/Lahan/Create', [
            'varietasList' => $varietasList,
        ]);
    }

    /**
     * Simpan lahan baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_lahan' => ['required', 'string', 'max:255'],
            'luas_ha' => ['required', 'numeric', 'min:0.001'],
            'desa' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:255'],
            'kabupaten' => ['required', 'string', 'max:255'],
            'jenis_tanah' => ['required', 'string', 'in:liat,lempung,pasir'],
            'sumber_air' => ['required', 'string', 'in:irigasi_teknis,tadah_hujan,pompa'],
            'varietas_default' => ['nullable', 'string', 'max:100'],
        ]);

        $validated['user_id'] = auth()->id();
        $validated['is_active'] = true;

        // Konversi Hektar ke m2
        $validated['luas_m2'] = $validated['luas_ha'] * 10000;
        unset($validated['luas_ha']);

        Lahan::create($validated);

        return redirect()->route('petani.lahan.index')
            ->with('success', 'Lahan berhasil ditambahkan.');
    }

    /**
     * Tampilkan form edit lahan.
     * Abort 403 jika lahan bukan milik user yang login.
     */
    public function edit(Lahan $lahan): Response
    {
        if ($lahan->user_id !== auth()->id()) {
            abort(403);
        }

        $varietasList = VarietyRef::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('Petani/Lahan/Edit', [
            'lahan' => $lahan,
            'varietasList' => $varietasList,
        ]);
    }

    /**
     * Update data lahan yang sudah ada.
     * Abort 403 jika lahan bukan milik user yang login.
     */
    public function update(Request $request, Lahan $lahan): RedirectResponse
    {
        if ($lahan->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'nama_lahan' => ['required', 'string', 'max:255'],
            'luas_ha' => ['required', 'numeric', 'min:0.001'],
            'desa' => ['required', 'string', 'max:255'],
            'kecamatan' => ['required', 'string', 'max:255'],
            'kabupaten' => ['required', 'string', 'max:255'],
            'jenis_tanah' => ['required', 'string', 'in:liat,lempung,pasir'],
            'sumber_air' => ['required', 'string', 'in:irigasi_teknis,tadah_hujan,pompa'],
            'varietas_default' => ['nullable', 'string', 'max:100'],
        ]);

        // Konversi Hektar ke m2
        $validated['luas_m2'] = $validated['luas_ha'] * 10000;
        unset($validated['luas_ha']);

        $lahan->update($validated);

        return redirect()->route('petani.lahan.index')
            ->with('success', 'Data lahan berhasil diperbarui.');
    }

    /**
     * Nonaktifkan lahan (soft delete via is_active = false).
     * Abort 403 jika lahan bukan milik user yang login.
     */
    public function destroy(Lahan $lahan): RedirectResponse
    {
        if ($lahan->user_id !== auth()->id()) {
            abort(403);
        }

        $lahan->update(['is_active' => false]);

        return redirect()->route('petani.lahan.index')
            ->with('success', 'Lahan berhasil dihapus.');
    }
}
