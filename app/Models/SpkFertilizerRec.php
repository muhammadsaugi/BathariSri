<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SpkFertilizerRec extends Model
{
    protected $fillable = [
        'user_id',
        'lahan_id',
        'disease_scan_id',
        'planting_id',
        'input_data',
        'topsis_scores',
        'rekomendasi',
        'detail_pupuk',
        'estimasi_biaya',
        'catatan',
    ];

    protected $casts = [
        'input_data'     => 'array',
        'topsis_scores'  => 'array',
        'detail_pupuk'   => 'array',
        'estimasi_biaya' => 'decimal:2',
    ];

    
    
    

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lahan(): BelongsTo
    {
        return $this->belongsTo(Lahan::class);
    }

    public function diseaseScan(): BelongsTo
    {
        return $this->belongsTo(DiseaseScan::class, 'disease_scan_id');
    }

    public function planting(): BelongsTo
    {
        return $this->belongsTo(PlantingSchedule::class, 'planting_id');
    }

    public function harvestPrediction(): HasOne
    {
        return $this->hasOne(HarvestPrediction::class, 'spk_fertilizer_id');
    }
}
