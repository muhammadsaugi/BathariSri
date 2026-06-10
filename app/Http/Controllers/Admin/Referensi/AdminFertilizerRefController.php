<?php

namespace App\Http\Controllers\Admin\Referensi;

use App\Http\Controllers\Controller;
use App\Models\FertilizerRef;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFertilizerRefController extends Controller
{
    public function index(): Response
    {
        $pupuk = FertilizerRef::latest()->paginate(15);

        return Inertia::render('Admin/Referensi/Pupuk/Index', [
            'pupuk' => $pupuk,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Referensi/Pupuk/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'        => 'required|string|max:255',
            'jenis'       => 'required|string|in:kimia,organik,majemuk,foliar',
            'harga_per_kg' => 'required|numeric|min:0',
            'satuan'      => 'required|string|max:50',
            'deskripsi'   => 'nullable|string',
        ]);

        FertilizerRef::create($validated);

        return redirect()->route('admin.referensi.pupuk.index')
            ->with('success', 'Data pupuk berhasil ditambahkan.');
    }

    public function edit(FertilizerRef $pupuk): Response
    {
        return Inertia::render('Admin/Referensi/Pupuk/Edit', [
            'pupuk' => $pupuk,
        ]);
    }

    public function update(Request $request, FertilizerRef $pupuk): RedirectResponse
    {
        $validated = $request->validate([
            'nama'        => 'required|string|max:255',
            'jenis'       => 'required|string|in:kimia,organik,majemuk,foliar',
            'harga_per_kg' => 'required|numeric|min:0',
            'satuan'      => 'required|string|max:50',
            'deskripsi'   => 'nullable|string',
        ]);

        $pupuk->update($validated);

        return redirect()->route('admin.referensi.pupuk.index')
            ->with('success', 'Data pupuk berhasil diperbarui.');
    }

    public function destroy(FertilizerRef $pupuk): RedirectResponse
    {
        $pupuk->delete();

        return redirect()->route('admin.referensi.pupuk.index')
            ->with('success', 'Data pupuk berhasil dihapus.');
    }
}
