<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FertilizerRef extends Model
{
    protected $fillable = [
        'nama',
        'jenis',
        'harga_per_kg',
        'satuan',
        'deskripsi',
    ];

    protected $casts = [
        'harga_per_kg' => 'decimal:2',
    ];
}
