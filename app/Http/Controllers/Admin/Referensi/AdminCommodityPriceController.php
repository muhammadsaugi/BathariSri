<?php

namespace App\Http\Controllers\Admin\Referensi;

use App\Http\Controllers\Controller;
use App\Models\CommodityPrice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCommodityPriceController extends Controller
{
    public function index(): Response
    {
        $harga = CommodityPrice::with('updatedBy:id,name')->latest()->paginate(15);

        return Inertia::render('Admin/Referensi/Harga/Index', [
            'harga' => $harga,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Referensi/Harga/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'komoditas'   => 'required|string|max:255',
            'harga_per_kg' => 'required|numeric|min:0',
            'satuan'      => 'required|string|max:50',
        ]);

        $validated['updated_by'] = auth()->id();

        CommodityPrice::create($validated);

        return redirect()->route('admin.referensi.harga.index')
            ->with('success', 'Data harga komoditas berhasil ditambahkan.');
    }

    public function edit(CommodityPrice $harga): Response
    {
        return Inertia::render('Admin/Referensi/Harga/Edit', [
            'harga' => $harga,
        ]);
    }

    public function update(Request $request, CommodityPrice $harga): RedirectResponse
    {
        $validated = $request->validate([
            'komoditas'   => 'required|string|max:255',
            'harga_per_kg' => 'required|numeric|min:0',
            'satuan'      => 'required|string|max:50',
        ]);

        $validated['updated_by'] = auth()->id();

        $harga->update($validated);

        return redirect()->route('admin.referensi.harga.index')
            ->with('success', 'Data harga komoditas berhasil diperbarui.');
    }

    public function destroy(CommodityPrice $harga): RedirectResponse
    {
        $harga->delete();

        return redirect()->route('admin.referensi.harga.index')
            ->with('success', 'Data harga komoditas berhasil dihapus.');
    }
}
