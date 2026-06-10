<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'category',
        'thumbnail',
        'author_id',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // =========================================================
    // Relasi Eloquent
    // =========================================================

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // =========================================================
    // Scopes
    // =========================================================

    /**
     * Scope untuk memfilter hanya artikel yang dipublikasikan.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    // =========================================================
    // Static helpers
    // =========================================================

    /**
     * Generate slug unik dari judul artikel.
     * Jika slug sudah ada, tambahkan suffix numerik hingga unik.
     */
    public static function generateSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
