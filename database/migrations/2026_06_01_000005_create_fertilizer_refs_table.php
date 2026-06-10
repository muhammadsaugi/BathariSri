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
        Schema::create('fertilizer_refs', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 255);
            $table->enum('jenis', ['kimia', 'organik', 'majemuk', 'foliar']);
            $table->decimal('harga_per_kg', 10, 2);
            $table->string('satuan', 50);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fertilizer_refs');
    }
};
