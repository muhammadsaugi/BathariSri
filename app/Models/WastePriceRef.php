<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WastePriceRef extends Model
{
    protected $fillable = [
        'jenis_limbah',
        'metode_pengolahan',
        'harga_per_kg',
    ];

    protected $casts = [
        'harga_per_kg' => 'decimal:2',
    ];
}
