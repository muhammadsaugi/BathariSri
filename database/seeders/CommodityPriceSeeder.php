<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommodityPriceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('commodity_prices')->insert([
            [
                'komoditas'   => 'Gabah Kering Panen (GKP)',
                'harga_per_kg' => 5500.00,
                'satuan'      => 'kg',
                'updated_by'  => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'komoditas'   => 'Gabah Kering Giling (GKG)',
                'harga_per_kg' => 6200.00,
                'satuan'      => 'kg',
                'updated_by'  => null,
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
