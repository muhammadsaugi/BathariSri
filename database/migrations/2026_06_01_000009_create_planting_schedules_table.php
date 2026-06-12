<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('planting_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->string('varietas', 100);
            $table->date('tanggal_semai');
            $table->date('tanggal_tanam');
            $table->integer('umur_panen_hari');
            $table->date('estimasi_panen');
            $table->json('jadwal_pupuk')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('planting_schedules');
    }
};
