<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('spk_weight_configs', function (Blueprint $table) {
            $table->id();
            $table->string('modul', 10); 
            $table->string('kriteria_nama', 255);
            $table->decimal('bobot', 5, 4);
            $table->enum('jenis', ['benefit', 'cost']);
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('spk_weight_configs');
    }
};
