import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PupukCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        jenis: '',
        harga_per_kg: '',
        satuan: '',
        deskripsi: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.referensi.pupuk.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.referensi.pupuk.index')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tambah Pupuk</h1>
                        <p className="text-sm text-gray-500 mt-1">Tambah data referensi pupuk baru</p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Pupuk" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Nama Pupuk <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Contoh: Urea, NPK Mutiara"
                        />
                        {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Jenis <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.jenis}
                            onChange={(e) => setData('jenis', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">-- Pilih Jenis --</option>
                            <option value="kimia">Kimia</option>
                            <option value="organik">Organik</option>
                            <option value="majemuk">Majemuk</option>
                            <option value="foliar">Foliar</option>
                        </select>
                        {errors.jenis && <p className="text-red-500 text-xs mt-1">{errors.jenis}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Harga per kg (Rp) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.harga_per_kg}
                            onChange={(e) => setData('harga_per_kg', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Contoh: 10000"
                        />
                        {errors.harga_per_kg && <p className="text-red-500 text-xs mt-1">{errors.harga_per_kg}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Satuan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.satuan}
                            onChange={(e) => setData('satuan', e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            placeholder="Contoh: kg, liter"
                        />
                        {errors.satuan && <p className="text-red-500 text-xs mt-1">{errors.satuan}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                            placeholder="Deskripsi singkat tentang pupuk ini..."
                        />
                        {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Pupuk'}
                        </button>
                        <Link
                            href={route('admin.referensi.pupuk.index')}
                            className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
