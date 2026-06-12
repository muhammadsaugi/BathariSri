<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DiseaseRefSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('disease_refs')->upsert([
            [
                'disease_key'         => 'bacterial_leaf_blight',
                'nama_id'             => 'Hawar Daun Bakteri',
                'nama_en'             => 'Bacterial Leaf Blight',
                'nama_ilmiah'         => 'Xanthomonas oryzae pv. oryzae',
                'deskripsi'           => 'Penyakit bakterial yang menyebabkan layu dan kematian jaringan daun dari ujung atau tepi daun.',
                'gejala'              => 'Bercak berwarna kuning kehijauan di tepi daun yang berkembang menjadi coklat keabu-abuan, daun layu.',
                'penanganan_mild'     => 'Kurangi pemupukan nitrogen, perbaiki drainase lahan.',
                'penanganan_moderate' => 'Aplikasi bakterisida berbahan aktif tembaga, kurangi nitrogen secara signifikan.',
                'penanganan_severe'   => 'Segera aplikasi bakterisida, pertimbangkan tidak memupuk, isolasi lahan yang terinfeksi.',
                'pencegahan'          => 'Gunakan benih sehat, varietas tahan, hindari pemupukan nitrogen berlebihan.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'disease_key'         => 'brown_spot',
                'nama_id'             => 'Bercak Coklat',
                'nama_en'             => 'Brown Spot',
                'nama_ilmiah'         => 'Helminthosporium oryzae',
                'deskripsi'           => 'Penyakit jamur yang ditandai dengan bercak-bercak coklat oval pada daun.',
                'gejala'              => 'Bercak oval hingga silindris berwarna coklat dengan pusat abu-abu, tepi kuning pada daun.',
                'penanganan_mild'     => 'Aplikasi fungisida berbahan aktif propikonazol, perbaiki nutrisi tanaman.',
                'penanganan_moderate' => 'Aplikasi fungisida 2 kali interval 7-10 hari, pastikan pemupukan kalium cukup.',
                'penanganan_severe'   => 'Aplikasi fungisida intensif, evaluasi dan perbaiki kondisi tanah secara menyeluruh.',
                'pencegahan'          => 'Gunakan benih sehat, pemupukan kalium dan silika cukup, hindari stress air.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
                'disease_key'         => 'leaf_blast',
                'nama_id'             => 'Blas Daun',
                'nama_en'             => 'Leaf Blast',
                'nama_ilmiah'         => 'Pyricularia oryzae',
                'deskripsi'           => 'Penyakit jamur paling berbahaya pada padi, dapat menyebabkan gagal panen.',
                'gejala'              => 'Bercak belah ketupat atau diamond-shaped berwarna abu-abu dengan tepi coklat gelap.',
                'penanganan_mild'     => 'Aplikasi fungisida berbahan aktif trisiklazol atau propikonazol.',
                'penanganan_moderate' => 'Aplikasi fungisida 2-3 kali, kurangi nitrogen, perbaiki aerasi.',
                'penanganan_severe'   => 'Aplikasi fungisida segera, kurangi nitrogen drastis, pertimbangkan konsultasi PPL.',
                'pencegahan'          => 'Gunakan varietas tahan blast, hindari nitrogen berlebihan, perhatikan kelembaban.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
            [
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
            ],
            [
                'disease_key'         => 'healthy',
                'nama_id'             => 'Sehat',
                'nama_en'             => 'Healthy',
                'nama_ilmiah'         => '-',
                'deskripsi'           => 'Tanaman dalam kondisi sehat tanpa tanda-tanda infeksi penyakit.',
                'gejala'              => 'Tidak ada gejala penyakit.',
                'penanganan_mild'     => null,
                'penanganan_moderate' => null,
                'penanganan_severe'   => null,
                'pencegahan'          => 'Pertahankan praktik budidaya yang baik, pemantauan rutin.',
                'created_at'          => now(),
                'updated_at'          => now(),
            ],
        ], ['disease_key'], ['nama_id', 'nama_en', 'nama_ilmiah', 'deskripsi', 'gejala', 'penanganan_mild', 'penanganan_moderate', 'penanganan_severe', 'pencegahan', 'updated_at']);
    }
}
