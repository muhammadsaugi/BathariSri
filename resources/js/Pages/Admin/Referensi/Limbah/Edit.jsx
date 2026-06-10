import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function LimbahEdit({ limbah }) {
    const { data, setData, patch, processing, errors } = useForm({
        jenis_limbah: limbah.jenis_limbah ?? '',
        metode_pengolahan: limbah.metode_pengolahan ?? '',
        harga_per_kg: limbah.harga_per_kg ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.referensi.limbah.update', limbah.id));
    };

    const inputClass =
        'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.referensi.limbah.index')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Harga Limbah</h1>
                        <p className="text-sm text-gray-500 mt-1">Ubah data limbah: {limbah.jenis_limbah}</p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Harga Limbah" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Jenis Limbah <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.jenis_limbah}
                            onChange={(e) => setData('jenis_limbah', e.target.value)}
                            className={inputClass}
                        >
                            <option value="">-- Pilih Jenis --</option>
                            <option value="jerami">Jerami</option>
                            <option value="sekam">Sekam</option>
                            <option value="dedak">Dedak</option>
                        </select>
                        {errors.jenis_limbah && <p className="text-red-500 text-xs mt-1">{errors.jenis_limbah}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Metode Pengolahan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.metode_pengolahan}
                            onChange={(e) => setData('metode_pengolahan', e.target.value)}
                            className={inputClass}
                        />
                        {errors.metode_pengolahan && <p className="text-red-500 text-xs mt-1">{errors.metode_pengolahan}</p>}
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
                        />
                        {errors.harga_per_kg && <p className="text-red-500 text-xs mt-1">{errors.harga_per_kg}</p>}
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
                            href={route('admin.referensi.limbah.index')}
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
