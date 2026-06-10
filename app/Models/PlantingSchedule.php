<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlantingSchedule extends Model
{
    protected $fillable = [
        'user_id',
        'lahan_id',
        'varietas',
        'tanggal_semai',
        'tanggal_tanam',
        'umur_panen_hari',
        'estimasi_panen',
        'jadwal_pupuk',
        'catatan',
    ];

    protected $casts = [
        'tanggal_semai'   => 'date',
        'tanggal_tanam'   => 'date',
        'estimasi_panen'  => 'date',
        'umur_panen_hari' => 'integer',
        'jadwal_pupuk'    => 'array',
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

    public function spkFertilizerRecs(): HasMany
    {
        return $this->hasMany(SpkFertilizerRec::class, 'planting_id');
    }
}
