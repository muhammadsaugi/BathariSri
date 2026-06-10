<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommodityPrice extends Model
{
    protected $fillable = [
        'komoditas',
        'harga_per_kg',
        'satuan',
        'updated_by',
    ];

    protected $casts = [
        'harga_per_kg' => 'decimal:2',
    ];

    // =========================================================
    // Relasi Eloquent
    // =========================================================

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
