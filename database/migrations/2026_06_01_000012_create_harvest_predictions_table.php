<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('harvest_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->foreignId('spk_fertilizer_id')->nullable()->constrained('spk_fertilizer_recs')->nullOnDelete();
            $table->json('input_data')->nullable();
            $table->json('topsis_scores')->nullable();
            $table->enum('kategori', ['sangat_baik', 'baik', 'cukup', 'rendah', 'berisiko']);
            $table->decimal('estimasi_ton_ha', 6, 2);
            $table->decimal('estimasi_total_ton', 8, 2);
            $table->decimal('estimasi_pendapatan', 14, 2);
            $table->json('faktor_risiko')->nullable();
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('harvest_predictions');
    }
};
