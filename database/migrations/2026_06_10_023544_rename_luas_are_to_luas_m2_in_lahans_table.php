<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        
        \Illuminate\Support\Facades\DB::statement('UPDATE lahans SET luas_are = luas_are * 100');

        Schema::table('lahans', function (Blueprint $table) {
            $table->renameColumn('luas_are', 'luas_m2');
        });
    }

    
    public function down(): void
    {
        Schema::table('lahans', function (Blueprint $table) {
            $table->renameColumn('luas_m2', 'luas_are');
        });

        
        \Illuminate\Support\Facades\DB::statement('UPDATE lahans SET luas_are = luas_are / 100');
    }
};
