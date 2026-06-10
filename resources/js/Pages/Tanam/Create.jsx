import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ lahans, varietyRefs }) {
    const { data, setData, post, processing, errors } = useForm({
        lahan_id: '',
        varietas: '',
        tanggal_semai: '',
        tanggal_tanam: '',
        umur_panen_hari: '',
        catatan: '',
    });

    // Auto-fill umur_panen_hari saat varietas dipilih
    useEffect(() => {
        if (!data.varietas) {
            setData('umur_panen_hari', '');
            return;
        }
        const selected = varietyRefs.find((v) => v.nama === data.varietas);
        if (selected) {
            setData('umur_panen_hari', selected.umur_panen_hari);
        }
    }, [data.varietas]);

    function handleSubmit(e) {
        e.preventDefault();
        post(route('petani.tanam.store'));
    }

    const inputClass =
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-900 text-sm outline-none transition-all';
    const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
    const errorClass = 'text-xs text-red-600 mt-1';

    return (
        <AuthenticatedLayout>
            <Head title="Mulai Musim Tanam Baru" />

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('petani.tanam.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Jadwal Tanam
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mulai Musim Tanam Baru</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Isi data musim tanam untuk mendapatkan jadwal pemupukan otomatis.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Lahan (opsional) */}
                        <div>
                            <label htmlFor="lahan_id" className={labelClass}>
                                Lahan{' '}
                                <span className="text-gray-400 font-normal text-xs">(opsional)</span>
                            </label>
                            <select
                                id="lahan_id"
                                className={inputClass}
                                value={data.lahan_id}
                                onChange={(e) => setData('lahan_id', e.target.value)}
                            >
                                <option value="">— Tanpa lahan —</option>
                                {lahans.map((lahan) => (
                                    <option key={lahan.id} value={lahan.id}>
                                        {lahan.nama_lahan}
                                        {lahan.luas_are ? ` (${lahan.luas_are} are)` : ''}
                                    </option>
                                ))}
                            </select>
                            {errors.lahan_id && <p className={errorClass}>{errors.lahan_id}</p>}
                        </div>

                        {/* Varietas */}
                        <div>
                            <label htmlFor="varietas" className={labelClass}>
                                Varietas Padi <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="varietas"
                                className={inputClass}
                                value={data.varietas}
                                onChange={(e) => setData('varietas', e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih varietas...</option>
                                {varietyRefs.map((v) => (
                                    <option key={v.id} value={v.nama}>
                                        {v.nama} — umur panen {v.umur_panen_hari} hari
                                    </option>
                                ))}
                            </select>
                            {errors.varietas && <p className={errorClass}>{errors.varietas}</p>}
                        </div>

                        {/* Tanggal Semai & Tanam */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="tanggal_semai" className={labelClass}>
                                    Tanggal Semai <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tanggal_semai"
                                    type="date"
                                    className={inputClass}
                                    value={data.tanggal_semai}
                                    onChange={(e) => setData('tanggal_semai', e.target.value)}
                                    required
                                />
                                {errors.tanggal_semai && <p className={errorClass}>{errors.tanggal_semai}</p>}
                            </div>
                            <div>
                                <label htmlFor="tanggal_tanam" className={labelClass}>
                                    Tanggal Tanam <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tanggal_tanam"
                                    type="date"
                                    className={inputClass}
                                    value={data.tanggal_tanam}
                                    min={data.tanggal_semai || undefined}
                                    onChange={(e) => setData('tanggal_tanam', e.target.value)}
                                    required
                                />
                                {errors.tanggal_tanam && <p className={errorClass}>{errors.tanggal_tanam}</p>}
                            </div>
                        </div>

                        {/* Umur Panen */}
                        <div>
                            <label htmlFor="umur_panen_hari" className={labelClass}>
                                Umur Panen (hari) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="umur_panen_hari"
                                type="number"
                                min="90"
                                max="180"
                                className={inputClass}
                                value={data.umur_panen_hari}
                                onChange={(e) => setData('umur_panen_hari', e.target.value ? Number(e.target.value) : '')}
                                placeholder="90 – 180 hari"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Terisi otomatis saat varietas dipilih. Rentang valid: 90–180 hari.
                            </p>
                            {errors.umur_panen_hari && <p className={errorClass}>{errors.umur_panen_hari}</p>}
                        </div>

                        {/* Catatan */}
                        <div>
                            <label htmlFor="catatan" className={labelClass}>
                                Catatan{' '}
                                <span className="text-gray-400 font-normal text-xs">(opsional)</span>
                            </label>
                            <textarea
                                id="catatan"
                                rows={3}
                                className={inputClass}
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                placeholder="Catatan tambahan mengenai musim tanam ini..."
                            />
                            {errors.catatan && <p className={errorClass}>{errors.catatan}</p>}
                        </div>

                        {/* Aksi */}
                        <div className="flex items-center justify-between pt-2">
                            <Link
                                href={route('petani.tanam.index')}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Mulai Musim Tanam'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
