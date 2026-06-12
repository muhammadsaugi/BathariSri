<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        
        DB::statement('ALTER TABLE disease_scans MODIFY predicted_class VARCHAR(100) NOT NULL');

        if (! DB::table('disease_refs')->where('disease_key', 'tungro')->exists()) {
            DB::table('disease_refs')->insert([
                'disease_key'         => 'tungro',
                'nama_id'             => 'Tungro',
                'nama_en'             => 'Tungro',
                'nama_ilmiah'         => 'Rice tungro bacilliform virus / Rice tungro spherical virus',
                'deskripsi'           => 'Penyakit virus yang ditularkan wereng hijau, menyebabkan daun menguning dan pertumbuhan terhambat.',
                'gejala'              => 'Daun menguning atau oranye mulai dari ujung, pertumbuhan kerdil, malai sedikit atau tidak terbentuk.',
                'penanganan_mild'     => 'Kendalikan populasi wereng hijau, perbaiki drainase dan nutrisi tanaman.',
                'penanganan_moderate' => 'Aplikasi insektisida untuk wereng hijau, cabut dan musnahkan tanaman terinfeksi ringan.',
                'penanganan_severe'   => 'Segera musnahkan tanaman terinfeksi berat, aplikasi insektisida intensif, ganti varietas tahan tungro musim berikutnya.',
                'pencegahan'          => 'Gunakan varietas tahan tungro, kendalikan wereng hijau sejak dini, hindari tanam berdekatan dengan lahan terinfeksi.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('disease_scans', function (Blueprint $table) {
            $table->enum('predicted_class', [
                'bacterial_leaf_blight',
                'brown_spot',
                'leaf_blast',
                'healthy',
            ])->change();
        });
    }
};
