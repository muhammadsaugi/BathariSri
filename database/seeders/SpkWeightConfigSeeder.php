<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpkWeightConfigSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('spk_weight_configs')->insert([
            
            [
                'modul'         => 'M3',
                'kriteria_nama' => 'fase_pertumbuhan',
                'bobot'         => 0.2500,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M3',
                'kriteria_nama' => 'kondisi_penyakit',
                'bobot'         => 0.2200,
                'jenis'         => 'cost',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M3',
                'kriteria_nama' => 'ketersediaan_air',
                'bobot'         => 0.2000,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M3',
                'kriteria_nama' => 'jenis_tanah',
                'bobot'         => 0.1800,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M3',
                'kriteria_nama' => 'riwayat_pemupukan',
                'bobot'         => 0.1500,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],

            
            [
                'modul'         => 'M4',
                'kriteria_nama' => 'keparahan_penyakit',
                'bobot'         => 0.3000,
                'jenis'         => 'cost',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M4',
                'kriteria_nama' => 'kesesuaian_pemupukan',
                'bobot'         => 0.2500,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M4',
                'kriteria_nama' => 'ketersediaan_air',
                'bobot'         => 0.2000,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M4',
                'kriteria_nama' => 'potensi_varietas',
                'bobot'         => 0.1500,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M4',
                'kriteria_nama' => 'kondisi_cuaca',
                'bobot'         => 0.1000,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],

            
            [
                'modul'         => 'M5',
                'kriteria_nama' => 'nilai_ekonomi',
                'bobot'         => 0.3000,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M5',
                'kriteria_nama' => 'kemudahan_pengolahan',
                'bobot'         => 0.2500,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M5',
                'kriteria_nama' => 'dampak_lingkungan',
                'bobot'         => 0.2000,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M5',
                'kriteria_nama' => 'ketersediaan_fasilitas',
                'bobot'         => 0.1500,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'modul'         => 'M5',
                'kriteria_nama' => 'permintaan_pasar',
                'bobot'         => 0.1000,
                'jenis'         => 'benefit',
                'updated_by'    => null,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);
    }
}
