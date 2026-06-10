import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ lahan, varietasList = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        nama_lahan: lahan.nama_lahan ?? '',
        luas_ha: lahan.luas_m2 ? (lahan.luas_m2 / 10000).toString() : '',
        desa: lahan.desa ?? '',
        kecamatan: lahan.kecamatan ?? '',
        kabupaten: lahan.kabupaten ?? '',
        jenis_tanah: lahan.jenis_tanah ?? '',
        sumber_air: lahan.sumber_air ?? '',
        varietas_default: lahan.varietas_default ?? '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        patch(route('petani.lahan.update', lahan.id));
    }

    const inputClass =
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-900 text-sm outline-none transition-all';
    const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
    const errorClass = 'text-xs text-red-600 mt-1';

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Lahan — ${lahan.nama_lahan}`} />

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('petani.lahan.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Lahan
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit Lahan</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Memperbarui data untuk lahan{' '}
                        <span className="font-semibold text-emerald-700">{lahan.nama_lahan}</span>.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nama Lahan */}
                        <div>
                            <label htmlFor="nama_lahan" className={labelClass}>
                                Nama Lahan <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="nama_lahan"
                                type="text"
                                className={inputClass}
                                value={data.nama_lahan}
                                onChange={(e) => setData('nama_lahan', e.target.value)}
                                placeholder="Contoh: Sawah Utara Blok A"
                                required
                            />
                            {errors.nama_lahan && <p className={errorClass}>{errors.nama_lahan}</p>}
                        </div>

                        {/* Luas */}
                        <div>
                            <label htmlFor="luas_ha" className={labelClass}>
                                Luas Lahan (Hektar / Ha) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="luas_ha"
                                type="number"
                                step="0.001"
                                min="0.001"
                                className={inputClass}
                                value={data.luas_ha}
                                onChange={(e) => setData('luas_ha', e.target.value)}
                                placeholder="Contoh: 0.75"
                                required
                            />
                            {errors.luas_ha && <p className={errorClass}>{errors.luas_ha}</p>}
                        </div>

                        {/* Lokasi */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="desa" className={labelClass}>
                                    Desa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="desa"
                                    type="text"
                                    className={inputClass}
                                    value={data.desa}
                                    onChange={(e) => setData('desa', e.target.value)}
                                    placeholder="Nama desa"
                                    required
                                />
                                {errors.desa && <p className={errorClass}>{errors.desa}</p>}
                            </div>
                            <div>
                                <label htmlFor="kecamatan" className={labelClass}>
                                    Kecamatan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="kecamatan"
                                    type="text"
                                    className={inputClass}
                                    value={data.kecamatan}
                                    onChange={(e) => setData('kecamatan', e.target.value)}
                                    placeholder="Nama kecamatan"
                                    required
                                />
                                {errors.kecamatan && <p className={errorClass}>{errors.kecamatan}</p>}
                            </div>
                            <div>
                                <label htmlFor="kabupaten" className={labelClass}>
                                    Kabupaten <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="kabupaten"
                                    type="text"
                                    className={inputClass}
                                    value={data.kabupaten}
                                    onChange={(e) => setData('kabupaten', e.target.value)}
                                    placeholder="Nama kabupaten"
                                    required
                                />
                                {errors.kabupaten && <p className={errorClass}>{errors.kabupaten}</p>}
                            </div>
                        </div>

                        {/* Jenis Tanah */}
                        <div>
                            <label htmlFor="jenis_tanah" className={labelClass}>
                                Jenis Tanah <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="jenis_tanah"
                                className={inputClass}
                                value={data.jenis_tanah}
                                onChange={(e) => setData('jenis_tanah', e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih jenis tanah...</option>
                                <option value="liat">Tanah Liat</option>
                                <option value="lempung">Tanah Lempung</option>
                                <option value="pasir">Tanah Pasir</option>
                            </select>
                            {errors.jenis_tanah && <p className={errorClass}>{errors.jenis_tanah}</p>}
                        </div>

                        {/* Sumber Air */}
                        <div>
                            <label htmlFor="sumber_air" className={labelClass}>
                                Sumber Air <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="sumber_air"
                                className={inputClass}
                                value={data.sumber_air}
                                onChange={(e) => setData('sumber_air', e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih sumber air...</option>
                                <option value="irigasi_teknis">Irigasi Teknis</option>
                                <option value="tadah_hujan">Tadah Hujan</option>
                                <option value="pompa">Pompa Air</option>
                            </select>
                            {errors.sumber_air && <p className={errorClass}>{errors.sumber_air}</p>}
                        </div>

                        {/* Varietas Default (opsional) */}
                        <div>
                            <label htmlFor="varietas_default" className={labelClass}>
                                Varietas Padi Default{' '}
                                <span className="text-gray-400 font-normal text-xs">(opsional)</span>
                            </label>
                            <select
                                id="varietas_default"
                                className={inputClass}
                                value={data.varietas_default}
                                onChange={(e) => setData('varietas_default', e.target.value)}
                            >
                                <option value="">-- Pilih Varietas Padi --</option>
                                {varietasList.map((item) => (
                                    <option key={item.id} value={item.nama}>
                                        {item.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.varietas_default && <p className={errorClass}>{errors.varietas_default}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <Link
                                href={route('petani.lahan.index')}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
