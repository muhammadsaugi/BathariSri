<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FertilizerRefSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('fertilizer_refs')->insert([
            [
                'nama'        => 'Urea',
                'jenis'       => 'kimia',
                'harga_per_kg' => 2500.00,
                'satuan'      => 'kg',
                'deskripsi'   => 'Pupuk nitrogen tinggi (46% N) untuk mendukung pertumbuhan vegetatif dan pembentukan daun.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nama'        => 'NPK Phonska',
                'jenis'       => 'majemuk',
                'harga_per_kg' => 2900.00,
                'satuan'      => 'kg',
                'deskripsi'   => 'Pupuk majemuk NPK (15-15-15) dengan tambahan sulfur untuk keseimbangan nutrisi tanaman.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nama'        => 'SP36',
                'jenis'       => 'kimia',
                'harga_per_kg' => 2800.00,
                'satuan'      => 'kg',
                'deskripsi'   => 'Pupuk fosfat (36% P2O5) untuk perkembangan akar dan pembungaan padi.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nama'        => 'KCl',
                'jenis'       => 'kimia',
                'harga_per_kg' => 6000.00,
                'satuan'      => 'kg',
                'deskripsi'   => 'Pupuk kalium klorida (60% K2O) untuk memperkuat batang dan meningkatkan ketahanan terhadap hama penyakit.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nama'        => 'Pupuk Organik Granul',
                'jenis'       => 'organik',
                'harga_per_kg' => 800.00,
                'satuan'      => 'kg',
                'deskripsi'   => 'Pupuk organik granul berbahan baku kompos dan bahan organik untuk memperbaiki struktur tanah.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'nama'        => 'Pupuk Daun Gandasil',
                'jenis'       => 'foliar',
                'harga_per_kg' => 45000.00,
                'satuan'      => 'kg',
                'deskripsi'   => 'Pupuk daun cair Gandasil untuk aplikasi semprot guna memenuhi kebutuhan nutrisi tanaman secara cepat.',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
