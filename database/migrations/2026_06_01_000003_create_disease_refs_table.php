<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('disease_refs', function (Blueprint $table) {
            $table->id();
            $table->string('disease_key', 100)->unique();
            $table->string('nama_id', 255);
            $table->string('nama_en', 255)->nullable();
            $table->string('nama_ilmiah', 255)->nullable();
            $table->text('deskripsi')->nullable();
            $table->text('gejala')->nullable();
            $table->text('penanganan_mild')->nullable();
            $table->text('penanganan_moderate')->nullable();
            $table->text('penanganan_severe')->nullable();
            $table->text('pencegahan')->nullable();
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('disease_refs');
    }
};
