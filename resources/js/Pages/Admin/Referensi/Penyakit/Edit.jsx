import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PenyakitEdit({ penyakit }) {
    const { data, setData, patch, processing, errors } = useForm({
        disease_key: penyakit.disease_key ?? '',
        nama_id: penyakit.nama_id ?? '',
        nama_ilmiah: penyakit.nama_ilmiah ?? '',
        deskripsi: penyakit.deskripsi ?? '',
        gejala: penyakit.gejala ?? '',
        penanganan_mild: penyakit.penanganan_mild ?? '',
        penanganan_moderate: penyakit.penanganan_moderate ?? '',
        penanganan_severe: penyakit.penanganan_severe ?? '',
        pencegahan: penyakit.pencegahan ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.referensi.penyakit.update', penyakit.id));
    };

    const textareaClass =
        'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none';
    const inputClass =
        'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.referensi.penyakit.index')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Penyakit</h1>
                        <p className="text-sm text-gray-500 mt-1">Ubah data referensi: {penyakit.nama_id}</p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Penyakit" />

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Disease Key <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.disease_key}
                                onChange={(e) => setData('disease_key', e.target.value)}
                                className={inputClass}
                            />
                            {errors.disease_key && <p className="text-red-500 text-xs mt-1">{errors.disease_key}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Nama (Indonesia) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_id}
                                onChange={(e) => setData('nama_id', e.target.value)}
                                className={inputClass}
                            />
                            {errors.nama_id && <p className="text-red-500 text-xs mt-1">{errors.nama_id}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Ilmiah</label>
                        <input
                            type="text"
                            value={data.nama_ilmiah}
                            onChange={(e) => setData('nama_ilmiah', e.target.value)}
                            className={inputClass}
                        />
                        {errors.nama_ilmiah && <p className="text-red-500 text-xs mt-1">{errors.nama_ilmiah}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={3}
                            className={textareaClass}
                        />
                        {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gejala</label>
                        <textarea
                            value={data.gejala}
                            onChange={(e) => setData('gejala', e.target.value)}
                            rows={3}
                            className={textareaClass}
                        />
                        {errors.gejala && <p className="text-red-500 text-xs mt-1">{errors.gejala}</p>}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700">Penanganan Berdasarkan Tingkat Keparahan</h3>
                        <div>
                            <label className="block text-xs font-semibold text-yellow-600 mb-1.5 uppercase tracking-wide">
                                Mild (Ringan)
                            </label>
                            <textarea
                                value={data.penanganan_mild}
                                onChange={(e) => setData('penanganan_mild', e.target.value)}
                                rows={2}
                                className={textareaClass}
                            />
                            {errors.penanganan_mild && <p className="text-red-500 text-xs mt-1">{errors.penanganan_mild}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-orange-600 mb-1.5 uppercase tracking-wide">
                                Moderate (Sedang)
                            </label>
                            <textarea
                                value={data.penanganan_moderate}
                                onChange={(e) => setData('penanganan_moderate', e.target.value)}
                                rows={2}
                                className={textareaClass}
                            />
                            {errors.penanganan_moderate && <p className="text-red-500 text-xs mt-1">{errors.penanganan_moderate}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-red-600 mb-1.5 uppercase tracking-wide">
                                Severe (Parah)
                            </label>
                            <textarea
                                value={data.penanganan_severe}
                                onChange={(e) => setData('penanganan_severe', e.target.value)}
                                rows={2}
                                className={textareaClass}
                            />
                            {errors.penanganan_severe && <p className="text-red-500 text-xs mt-1">{errors.penanganan_severe}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pencegahan</label>
                        <textarea
                            value={data.pencegahan}
                            onChange={(e) => setData('pencegahan', e.target.value)}
                            rows={3}
                            className={textareaClass}
                        />
                        {errors.pencegahan && <p className="text-red-500 text-xs mt-1">{errors.pencegahan}</p>}
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
                            href={route('admin.referensi.penyakit.index')}
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
