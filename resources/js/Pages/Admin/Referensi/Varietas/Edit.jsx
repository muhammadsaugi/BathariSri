import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VarietasEdit({ varietas }) {
    const { data, setData, patch, processing, errors } = useForm({
        nama: varietas.nama ?? '',
        umur_panen_hari: varietas.umur_panen_hari ?? '',
        potensi_hasil_ton_ha: varietas.potensi_hasil_ton_ha ?? '',
        deskripsi: varietas.deskripsi ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.referensi.varietas.update', varietas.id));
    };

    const inputClass =
        'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.referensi.varietas.index')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Varietas</h1>
                        <p className="text-sm text-gray-500 mt-1">Ubah data varietas: {varietas.nama}</p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Varietas" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Nama Varietas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className={inputClass}
                        />
                        {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Umur Panen (Hari) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="90"
                                max="180"
                                value={data.umur_panen_hari}
                                onChange={(e) => setData('umur_panen_hari', e.target.value)}
                                className={inputClass}
                            />
                            {errors.umur_panen_hari && <p className="text-red-500 text-xs mt-1">{errors.umur_panen_hari}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Potensi Hasil (ton/ha) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.potensi_hasil_ton_ha}
                                onChange={(e) => setData('potensi_hasil_ton_ha', e.target.value)}
                                className={inputClass}
                            />
                            {errors.potensi_hasil_ton_ha && (
                                <p className="text-red-500 text-xs mt-1">{errors.potensi_hasil_ton_ha}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                        />
                        {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <Link
                            href={route('admin.referensi.varietas.index')}
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
