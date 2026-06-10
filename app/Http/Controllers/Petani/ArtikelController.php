<?php

namespace App\Http\Controllers\Petani;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class ArtikelController extends Controller
{
    /**
     * Tampilkan daftar artikel yang sudah dipublikasikan.
     * Diurutkan dari yang terbaru, paginate 12 per halaman.
     */
    public function index(): Response
    {
        $artikels = Article::with('author:id,name')
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->paginate(12);

        return Inertia::render('Petani/Artikel/Index', [
            'artikels' => $artikels,
        ]);
    }

    /**
     * Tampilkan detail satu artikel berdasarkan slug.
     * Jika artikel belum dipublikasikan → abort(404).
     */
    public function show(string $slug): Response
    {
        $artikel = Article::with('author:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        if (! $artikel->is_published) {
            abort(404);
        }

        return Inertia::render('Petani/Artikel/Show', [
            'artikel' => $artikel,
        ]);
    }
}
