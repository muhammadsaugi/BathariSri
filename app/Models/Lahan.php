<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lahan extends Model
{
    protected $fillable = [
        'user_id',
        'nama_lahan',
        'luas_m2',
        'desa',
        'kecamatan',
        'kabupaten',
        'jenis_tanah',
        'sumber_air',
        'varietas_default',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'luas_m2'  => 'decimal:2',
    ];

    // =========================================================
    // Relasi Eloquent
    // =========================================================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function diseaseScans(): HasMany
    {
        return $this->hasMany(DiseaseScan::class);
    }

    public function plantingSchedules(): HasMany
    {
        return $this->hasMany(PlantingSchedule::class);
    }

    public function spkFertilizerRecs(): HasMany
    {
        return $this->hasMany(SpkFertilizerRec::class);
    }

    public function harvestPredictions(): HasMany
    {
        return $this->hasMany(HarvestPrediction::class);
    }

    public function wasteRecommendations(): HasMany
    {
        return $this->hasMany(WasteRecommendation::class);
    }

    // =========================================================
    // Scopes
    // =========================================================

    /**
     * Scope untuk memfilter hanya lahan yang aktif (is_active = true).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
