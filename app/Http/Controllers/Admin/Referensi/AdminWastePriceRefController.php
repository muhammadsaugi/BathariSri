<?php

namespace App\Http\Controllers\Admin\Referensi;

use App\Http\Controllers\Controller;
use App\Models\WastePriceRef;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminWastePriceRefController extends Controller
{
    public function index(): Response
    {
        $limbah = WastePriceRef::latest()->paginate(15);

        return Inertia::render('Admin/Referensi/Limbah/Index', [
            'limbah' => $limbah,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Referensi/Limbah/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_limbah'       => 'required|string|in:jerami,sekam,dedak',
            'metode_pengolahan'  => 'required|string|max:255',
            'harga_per_kg'       => 'required|numeric|min:0',
        ]);

        WastePriceRef::create($validated);

        return redirect()->route('admin.referensi.limbah.index')
            ->with('success', 'Data harga limbah berhasil ditambahkan.');
    }

    public function edit(WastePriceRef $limbah): Response
    {
        return Inertia::render('Admin/Referensi/Limbah/Edit', [
            'limbah' => $limbah,
        ]);
    }

    public function update(Request $request, WastePriceRef $limbah): RedirectResponse
    {
        $validated = $request->validate([
            'jenis_limbah'       => 'required|string|in:jerami,sekam,dedak',
            'metode_pengolahan'  => 'required|string|max:255',
            'harga_per_kg'       => 'required|numeric|min:0',
        ]);

        $limbah->update($validated);

        return redirect()->route('admin.referensi.limbah.index')
            ->with('success', 'Data harga limbah berhasil diperbarui.');
    }

    public function destroy(WastePriceRef $limbah): RedirectResponse
    {
        $limbah->delete();

        return redirect()->route('admin.referensi.limbah.index')
            ->with('success', 'Data harga limbah berhasil dihapus.');
    }
}
