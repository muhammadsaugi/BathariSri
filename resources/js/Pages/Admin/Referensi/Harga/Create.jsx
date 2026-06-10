import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function HargaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        komoditas: '',
        harga_per_kg: '',
        satuan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.referensi.harga.store'));
    };

    const inputClass =
        'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.referensi.harga.index')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tambah Harga Komoditas</h1>
                        <p className="text-sm text-gray-500 mt-1">Tambah data harga komoditas baru</p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Harga Komoditas" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Komoditas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.komoditas}
                            onChange={(e) => setData('komoditas', e.target.value)}
                            className={inputClass}
                            placeholder="Contoh: Gabah Kering Giling, Beras Putih"
                        />
                        {errors.komoditas && <p className="text-red-500 text-xs mt-1">{errors.komoditas}</p>}
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
                            className={inputClass}
                            placeholder="Contoh: 5500"
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
                            className={inputClass}
                            placeholder="Contoh: kg, liter"
                        />
                        {errors.satuan && <p className="text-red-500 text-xs mt-1">{errors.satuan}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Harga'}
                        </button>
                        <Link
                            href={route('admin.referensi.harga.index')}
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
