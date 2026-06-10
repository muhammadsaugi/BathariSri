<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VarietyRef extends Model
{
    protected $fillable = [
        'nama',
        'umur_panen_hari',
        'potensi_hasil_ton_ha',
        'deskripsi',
    ];

    protected $casts = [
        'potensi_hasil_ton_ha' => 'decimal:2',
    ];
}
