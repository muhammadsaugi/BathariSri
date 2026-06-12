<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'phone', 'alamat', 'avatar', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    
    
    

    public function lahans(): HasMany
    {
        return $this->hasMany(\App\Models\Lahan::class);
    }

    public function diseaseScans(): HasMany
    {
        return $this->hasMany(\App\Models\DiseaseScan::class);
    }

    public function plantingSchedules(): HasMany
    {
        return $this->hasMany(\App\Models\PlantingSchedule::class);
    }

    public function spkFertilizerRecs(): HasMany
    {
        return $this->hasMany(\App\Models\SpkFertilizerRec::class);
    }

    public function harvestPredictions(): HasMany
    {
        return $this->hasMany(\App\Models\HarvestPrediction::class);
    }

    public function wasteRecommendations(): HasMany
    {
        return $this->hasMany(\App\Models\WasteRecommendation::class);
    }
}
