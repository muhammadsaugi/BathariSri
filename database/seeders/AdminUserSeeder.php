<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        User::firstOrCreate(
            ['email' => 'admin@bathariSri.test'],
            [
                'name'      => 'Administrator BathariSri',
                'password'  => Hash::make('admin123'),
                'role'      => 'admin',
                'is_active' => true,
            ]
        );

        // 2. Petani demo
        $petani = User::firstOrCreate(
            ['email' => 'budi@demo.test'],
            [
                'name'      => 'Budi Santoso',
                'password'  => Hash::make('petani123'),
                'role'      => 'petani',
                'is_active' => true,
            ]
        );

        // 3. Lahan demo untuk Budi
        DB::table('lahans')->insertOrIgnore([
            [
                'user_id'          => $petani->id,
                'nama_lahan'       => 'Sawah Timur Rumah',
                'luas_are'         => 50.00,
                'desa'             => 'Desa Sumber Sari',
                'kecamatan'        => 'Kecamatan Jember',
                'kabupaten'        => 'Kabupaten Jember',
                'jenis_tanah'      => 'lempung',
                'sumber_air'       => 'irigasi_teknis',
                'varietas_default' => null,
                'is_active'        => true,
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
        ]);
    }
}
