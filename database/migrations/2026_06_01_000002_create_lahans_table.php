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
        Schema::create('lahans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nama_lahan', 255);
            $table->decimal('luas_are', 8, 2);
            $table->string('desa', 255);
            $table->string('kecamatan', 255);
            $table->string('kabupaten', 255);
            $table->enum('jenis_tanah', ['liat', 'lempung', 'pasir']);
            $table->enum('sumber_air', ['irigasi_teknis', 'tadah_hujan', 'pompa']);
            $table->string('varietas_default', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lahans');
    }
};
