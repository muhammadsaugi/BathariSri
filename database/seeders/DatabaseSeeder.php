<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Urutan penting:
     * - Data referensi (disease, variety, fertilizer) tidak bergantung FK lain.
     * - commodity_prices dan waste_price_refs tidak bergantung FK lain.
     * - spk_weight_configs memiliki FK nullable ke users, bisa diisi sebelum users.
     * - AdminUserSeeder paling terakhir karena membuat record lahans yang butuh FK users.
     */
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
