<?php

namespace App\Http\Controllers\Admin\Referensi;

use App\Http\Controllers\Controller;
use App\Models\VarietyRef;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminVarietyRefController extends Controller
{
    public function index(): Response
    {
        $varietas = VarietyRef::latest()->paginate(15);

        return Inertia::render('Admin/Referensi/Varietas/Index', [
            'varietas' => $varietas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Referensi/Varietas/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'                  => 'required|string|max:255',
            'umur_panen_hari'       => 'required|integer|min:90|max:180',
            'potensi_hasil_ton_ha'  => 'required|numeric|min:0',
            'deskripsi'             => 'nullable|string',
        ]);

        VarietyRef::create($validated);

        return redirect()->route('admin.referensi.varietas.index')
            ->with('success', 'Data varietas berhasil ditambahkan.');
    }

    public function edit(VarietyRef $varietas): Response
    {
        return Inertia::render('Admin/Referensi/Varietas/Edit', [
            'varietas' => $varietas,
        ]);
    }

    public function update(Request $request, VarietyRef $varietas): RedirectResponse
    {
        $validated = $request->validate([
            'nama'                  => 'required|string|max:255',
            'umur_panen_hari'       => 'required|integer|min:90|max:180',
            'potensi_hasil_ton_ha'  => 'required|numeric|min:0',
            'deskripsi'             => 'nullable|string',
        ]);

        $varietas->update($validated);

        return redirect()->route('admin.referensi.varietas.index')
            ->with('success', 'Data varietas berhasil diperbarui.');
    }

    public function destroy(VarietyRef $varietas): RedirectResponse
    {
        $varietas->delete();

        return redirect()->route('admin.referensi.varietas.index')
            ->with('success', 'Data varietas berhasil dihapus.');
    }
}
