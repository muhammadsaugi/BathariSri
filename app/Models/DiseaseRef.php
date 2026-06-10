<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiseaseRef extends Model
{
    protected $fillable = [
        'disease_key',
        'nama_id',
        'nama_en',
        'nama_ilmiah',
        'deskripsi',
        'gejala',
        'penanganan_mild',
        'penanganan_moderate',
        'penanganan_severe',
        'pencegahan',
    ];

    // =========================================================
    // Relasi Eloquent
    // =========================================================

    /**
     * Relasi non-standard: foreignKey = predicted_class, localKey = disease_key
     */
    public function diseaseScans(): HasMany
    {
        return $this->hasMany(DiseaseScan::class, 'predicted_class', 'disease_key');
    }
}
