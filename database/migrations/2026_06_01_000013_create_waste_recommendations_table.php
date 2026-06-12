<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('waste_recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->foreignId('harvest_id')->nullable()->constrained('harvest_predictions')->nullOnDelete();
            $table->json('input_data')->nullable();
            $table->json('rekomendasi_jerami')->nullable();
            $table->json('rekomendasi_sekam')->nullable();
            $table->json('rekomendasi_dedak')->nullable();
            $table->decimal('total_nilai_ekonomi', 14, 2);
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('waste_recommendations');
    }
};
