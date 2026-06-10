<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WastePriceRefSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('waste_price_refs')->insert([
            [
                'jenis_limbah'      => 'jerami',
                'metode_pengolahan' => 'Kompos',
                'harga_per_kg'      => 0.40,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'jenis_limbah'      => 'jerami',
                'metode_pengolahan' => 'Pakan Ternak',
                'harga_per_kg'      => 0.80,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'jenis_limbah'      => 'sekam',
                'metode_pengolahan' => 'Arang Sekam/Biochar',
                'harga_per_kg'      => 1.50,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'jenis_limbah'      => 'sekam',
                'metode_pengolahan' => 'Media Tanam',
                'harga_per_kg'      => 3.00,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'jenis_limbah'      => 'dedak',
                'metode_pengolahan' => 'Pakan Ternak Langsung',
                'harga_per_kg'      => 2.50,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
            [
                'jenis_limbah'      => 'dedak',
                'metode_pengolahan' => 'Campuran Pupuk Organik',
                'harga_per_kg'      => 1.20,
                'created_at'        => now(),
                'updated_at'        => now(),
            ],
        ]);
    }
}
