<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('commodity_prices', function (Blueprint $table) {
            $table->id();
            $table->string('komoditas', 100);
            $table->decimal('harga_per_kg', 10, 2);
            $table->string('satuan', 50);
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('commodity_prices');
    }
};
