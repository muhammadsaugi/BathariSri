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
        // Konversi data dari are ke m2 (1 are = 100 m2)
        \Illuminate\Support\Facades\DB::statement('UPDATE lahans SET luas_are = luas_are * 100');

        Schema::table('lahans', function (Blueprint $table) {
            $table->renameColumn('luas_are', 'luas_m2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lahans', function (Blueprint $table) {
            $table->renameColumn('luas_m2', 'luas_are');
        });

        // Kembalikan ke are
        \Illuminate\Support\Facades\DB::statement('UPDATE lahans SET luas_are = luas_are / 100');
    }
};
