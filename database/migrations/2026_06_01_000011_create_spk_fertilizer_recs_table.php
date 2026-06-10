<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spk_fertilizer_recs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->foreignId('disease_scan_id')->nullable()->constrained('disease_scans')->nullOnDelete();
            $table->foreignId('planting_id')->nullable()->constrained('planting_schedules')->nullOnDelete();
            $table->json('input_data')->nullable();
            $table->json('topsis_scores')->nullable();
            $table->string('rekomendasi', 100);
            $table->json('detail_pupuk')->nullable();
            $table->decimal('estimasi_biaya', 12, 2)->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spk_fertilizer_recs');
    }
};
