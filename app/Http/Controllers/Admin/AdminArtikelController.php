<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminArtikelController extends Controller
{
    /**
     * Daftar semua artikel dengan author, paginate 15.
     */
    public function index(): Response
    {
        $artikel = Article::with('author:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Artikel/Index', [
            'artikel' => $artikel,
        ]);
    }

    /**
     * Form tambah artikel baru.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Artikel/Create');
    }

    /**
     * Simpan artikel baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:500',
            'content'      => 'required|string',
            'category'     => 'required|string|in:penyakit,pemupukan,pasca_panen,teknologi,umum',
            'thumbnail'    => 'nullable|url|max:500',
            'is_published' => 'nullable|boolean',
        ]);

        $validated['slug']      = Article::generateSlug($validated['title']);
        $validated['author_id'] = auth()->id();

        if (!empty($validated['is_published'])) {
            $validated['published_at'] = now();
        }

        Article::create($validated);

        return redirect()->route('admin.artikel.index')
            ->with('success', 'Artikel berhasil ditambahkan.');
    }

    /**
     * Form edit artikel.
     */
    public function edit(Article $artikel): Response
    {
        return Inertia::render('Admin/Artikel/Edit', [
            'artikel' => $artikel,
        ]);
    }

    /**
     * Update artikel.
     */
    public function update(Request $request, Article $artikel): RedirectResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:500',
            'content'      => 'required|string',
            'category'     => 'required|string|in:penyakit,pemupukan,pasca_panen,teknologi,umum',
            'thumbnail'    => 'nullable|url|max:500',
            'is_published' => 'nullable|boolean',
        ]);

        // Re-generate slug hanya jika title berubah
        if ($validated['title'] !== $artikel->title) {
            $validated['slug'] = Article::generateSlug($validated['title']);
        }

        // Set published_at jika is_published berubah dari false ke true
        $nowPublished = !empty($validated['is_published']);
        if ($nowPublished && !$artikel->is_published) {
            $validated['published_at'] = now();
        }

        $artikel->update($validated);

        return redirect()->route('admin.artikel.index')
            ->with('success', 'Artikel berhasil diperbarui.');
    }

    /**
     * Hapus artikel.
     */
    public function destroy(Article $artikel): RedirectResponse
    {
        $artikel->delete();

        return redirect()->route('admin.artikel.index')
            ->with('success', 'Artikel berhasil dihapus.');
    }
}
