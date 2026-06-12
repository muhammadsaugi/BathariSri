<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DiseaseScan extends Model
{
    protected $fillable = [
        'user_id',
        'lahan_id',
        'image_path',
        'predicted_class',
        'confidence',
        'severity',
        'raw_response',
        'action_taken',
        'scanned_at',
    ];

    protected $casts = [
        'confidence'   => 'decimal:4',
        'raw_response' => 'array',
        'scanned_at'   => 'datetime',
    ];

    
    
    

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lahan(): BelongsTo
    {
        return $this->belongsTo(Lahan::class);
    }

    
    public function diseaseRef(): BelongsTo
    {
        return $this->belongsTo(DiseaseRef::class, 'predicted_class', 'disease_key');
    }

    public function spkFertilizerRec(): HasOne
    {
        return $this->hasOne(SpkFertilizerRec::class, 'disease_scan_id');
    }

    
    
    

    
    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
