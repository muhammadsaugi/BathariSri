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

    
    public function create(): Response
    {
        $varietasList = VarietyRef::orderBy('nama')->get(['id', 'nama']);
        return Inertia::render('Petani/Lahan/Create', [
            'varietasList' => $varietasList,
        ]);
    }

    
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_lahan'       => ['required', 'string', 'max:255'],
            'luas_m2'          => ['required', 'numeric', 'min:1'],
            'desa'             => ['required', 'string', 'max:255'],
            'kecamatan'        => ['required', 'string', 'max:255'],
            'kabupaten'        => ['required', 'string', 'max:255'],
            'jenis_tanah'      => ['required', 'string', 'in:liat,lempung,pasir'],
            'sumber_air'       => ['required', 'string', 'in:irigasi_teknis,tadah_hujan,pompa'],
            'varietas_default' => ['nullable', 'string', 'max:100'],
        ]);

        $validated['user_id']   = auth()->id();
        $validated['is_active'] = true;

        Lahan::create($validated);

        return redirect()->route('petani.lahan.index')
            ->with('success', 'Lahan berhasil ditambahkan.');
    }

    
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

    
    public function update(Request $request, Lahan $lahan): RedirectResponse
    {
        if ($lahan->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'nama_lahan'       => ['required', 'string', 'max:255'],
            'luas_m2'          => ['required', 'numeric', 'min:1'],
            'desa'             => ['required', 'string', 'max:255'],
            'kecamatan'        => ['required', 'string', 'max:255'],
            'kabupaten'        => ['required', 'string', 'max:255'],
            'jenis_tanah'      => ['required', 'string', 'in:liat,lempung,pasir'],
            'sumber_air'       => ['required', 'string', 'in:irigasi_teknis,tadah_hujan,pompa'],
            'varietas_default' => ['nullable', 'string', 'max:100'],
        ]);

        $lahan->update($validated);

        return redirect()->route('petani.lahan.index')
            ->with('success', 'Data lahan berhasil diperbarui.');
    }

    
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
