<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VarietyRefSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('variety_refs')->insert([
            [
                'nama'                => 'Ciherang',
                'umur_panen_hari'     => 116,
                'potensi_hasil_ton_ha' => 6.00,
                'deskripsi'           => 'Varietas unggul nasional paling populer di Indonesia dengan produktivitas tinggi dan rasa nasi yang enak.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'nama'                => 'IR64',
                'umur_panen_hari'     => 110,
                'potensi_hasil_ton_ha' => 5.00,
                'deskripsi'           => 'Varietas semi-dwarf toleran kekeringan dengan umur panen lebih pendek dan adaptasi luas.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'nama'                => 'Inpari 32',
                'umur_panen_hari'     => 118,
                'potensi_hasil_ton_ha' => 6.50,
                'deskripsi'           => 'Varietas unggul potensi hasil tinggi, toleran wereng coklat biotipe 1, 2, dan 3.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'nama'                => 'Mekongga',
                'umur_panen_hari'     => 116,
                'potensi_hasil_ton_ha' => 6.00,
                'deskripsi'           => 'Varietas unggul toleran hama wereng coklat dengan kualitas beras yang baik.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'nama'                => 'Logawa',
                'umur_panen_hari'     => 110,
                'potensi_hasil_ton_ha' => 5.50,
                'deskripsi'           => 'Varietas lokal Jawa toleran lahan kering dengan adaptasi baik pada kondisi ketersediaan air terbatas.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
        ]);
    }
}
