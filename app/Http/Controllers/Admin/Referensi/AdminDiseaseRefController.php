<?php

namespace App\Http\Controllers\Admin\Referensi;

use App\Http\Controllers\Controller;
use App\Models\DiseaseRef;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDiseaseRefController extends Controller
{
    public function index(): Response
    {
        $penyakit = DiseaseRef::latest()->paginate(15);

        return Inertia::render('Admin/Referensi/Penyakit/Index', [
            'penyakit' => $penyakit,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Referensi/Penyakit/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'disease_key'         => 'required|string|max:100|unique:disease_refs,disease_key',
            'nama_id'             => 'required|string|max:255',
            'nama_ilmiah'         => 'nullable|string|max:255',
            'deskripsi'           => 'nullable|string',
            'gejala'              => 'nullable|string',
            'penanganan_mild'     => 'nullable|string',
            'penanganan_moderate' => 'nullable|string',
            'penanganan_severe'   => 'nullable|string',
            'pencegahan'          => 'nullable|string',
        ]);

        DiseaseRef::create($validated);

        return redirect()->route('admin.referensi.penyakit.index')
            ->with('success', 'Data penyakit berhasil ditambahkan.');
    }

    public function edit(DiseaseRef $penyakit): Response
    {
        return Inertia::render('Admin/Referensi/Penyakit/Edit', [
            'penyakit' => $penyakit,
        ]);
    }

    public function update(Request $request, DiseaseRef $penyakit): RedirectResponse
    {
        $validated = $request->validate([
            'disease_key'         => 'required|string|max:100|unique:disease_refs,disease_key,' . $penyakit->id,
            'nama_id'             => 'required|string|max:255',
            'nama_ilmiah'         => 'nullable|string|max:255',
            'deskripsi'           => 'nullable|string',
            'gejala'              => 'nullable|string',
            'penanganan_mild'     => 'nullable|string',
            'penanganan_moderate' => 'nullable|string',
            'penanganan_severe'   => 'nullable|string',
            'pencegahan'          => 'nullable|string',
        ]);

        $penyakit->update($validated);

        return redirect()->route('admin.referensi.penyakit.index')
            ->with('success', 'Data penyakit berhasil diperbarui.');
    }

    public function destroy(DiseaseRef $penyakit): RedirectResponse
    {
        $penyakit->delete();

        return redirect()->route('admin.referensi.penyakit.index')
            ->with('success', 'Data penyakit berhasil dihapus.');
    }
}
