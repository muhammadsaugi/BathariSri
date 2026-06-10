<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HarvestPrediction extends Model
{
    protected $fillable = [
        'user_id',
        'lahan_id',
        'spk_fertilizer_id',
        'input_data',
        'topsis_scores',
        'kategori',
        'estimasi_ton_ha',
        'estimasi_total_ton',
        'estimasi_pendapatan',
        'faktor_risiko',
    ];

    protected $casts = [
        'input_data'          => 'array',
        'topsis_scores'       => 'array',
        'faktor_risiko'       => 'array',
        'estimasi_ton_ha'     => 'decimal:2',
        'estimasi_total_ton'  => 'decimal:2',
        'estimasi_pendapatan' => 'decimal:2',
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

    public function spkFertilizer(): BelongsTo
    {
        return $this->belongsTo(SpkFertilizerRec::class, 'spk_fertilizer_id');
    }

    public function wasteRecommendation(): HasOne
    {
        return $this->hasOne(WasteRecommendation::class, 'harvest_id');
    }
}
