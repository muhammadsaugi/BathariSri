<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('waste_price_refs', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis_limbah', ['jerami', 'sekam', 'dedak']);
            $table->string('metode_pengolahan', 255);
            $table->decimal('harga_per_kg', 10, 2);
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('waste_price_refs');
    }
};
