<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    
    public function run(): void
    {
        $this->call([
            DiseaseRefSeeder::class,
            VarietyRefSeeder::class,
            FertilizerRefSeeder::class,
            CommodityPriceSeeder::class,
            WastePriceRefSeeder::class,
            SpkWeightConfigSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
