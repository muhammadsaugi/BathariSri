<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WasteRecommendation extends Model
{
    protected $fillable = [
        'user_id',
        'lahan_id',
        'harvest_id',
        'input_data',
        'rekomendasi_jerami',
        'rekomendasi_sekam',
        'rekomendasi_dedak',
        'total_nilai_ekonomi',
    ];

    protected $casts = [
        'input_data'          => 'array',
        'rekomendasi_jerami'  => 'array',
        'rekomendasi_sekam'   => 'array',
        'rekomendasi_dedak'   => 'array',
        'total_nilai_ekonomi' => 'decimal:2',
    ];

    // =========================================================
    // Relasi Eloquent
    // =========================================================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lahan(): BelongsTo
    {
        return $this->belongsTo(Lahan::class);
    }

    public function harvest(): BelongsTo
    {
        return $this->belongsTo(HarvestPrediction::class, 'harvest_id');
    }
}
