<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SpkWeightConfig extends Model
{
    protected $fillable = [
        'modul',
        'kriteria_nama',
        'bobot',
        'jenis',
        'updated_by',
    ];

    protected $casts = [
        'bobot' => 'decimal:4',
    ];

    // =========================================================
    // Scopes
    // =========================================================

    /**
     * Scope untuk memfilter konfigurasi bobot berdasarkan modul.
     */
    public function scopeForModule(Builder $query, string $modul): Builder
    {
        return $query->where('modul', $modul);
    }
}
