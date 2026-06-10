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
        Schema::create('variety_refs', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100);
            $table->integer('umur_panen_hari');
            $table->decimal('potensi_hasil_ton_ha', 5, 2);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variety_refs');
    }
};
