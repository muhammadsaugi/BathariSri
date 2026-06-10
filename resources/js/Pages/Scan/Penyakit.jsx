import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Penyakit({ lahans = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        image: null,
        lahan_id: '',
    });

    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const inputClass =
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-gray-900 text-sm outline-none transition-all';
    const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
    const errorClass = 'text-xs text-red-600 mt-1';

    function handleFile(file) {
        if (!file) return;

        // Validasi ukuran (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file melebihi 5MB. Silakan pilih gambar yang lebih kecil.');
            return;
        }

        // Validasi tipe
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            alert('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
            return;
        }

        setData('image', file);

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
    }

    function handleInputChange(e) {
        handleFile(e.target.files?.[0]);
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
    }

    function handleDragOver(e) {
        e.preventDefault();
        setDragOver(true);
    }

    function handleDragLeave() {
        setDragOver(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('petani.scan.store'), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Deteksi Penyakit Daun Padi" />

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={route('petani.scan.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Riwayat
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Deteksi Penyakit Daun Padi
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Upload foto daun padi untuk dianalisis oleh AI
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Upload Area */}
                        <div>
                            <label className={labelClass}>
                                Foto Daun Padi <span className="text-red-500">*</span>
                            </label>

                            {/* Drop Zone */}
                            <div
                                onClick={() => !processing && fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden
                                    ${dragOver
                                        ? 'border-emerald-400 bg-emerald-50'
                                        : 'border-gray-200 hover:border-emerald-300 bg-gray-50 hover:bg-emerald-50/40'
                                    }
                                    ${processing ? 'opacity-60 cursor-not-allowed' : ''}
                                `}
                                style={{ minHeight: preview ? 'auto' : '200px' }}
                            >
                                {preview ? (
                                    /* Preview Gambar */
                                    <div className="w-full">
                                        <img
                                            src={preview}
                                            alt="Preview daun padi"
                                            className="w-full max-h-80 object-contain rounded-2xl"
                                        />
                                        {!processing && (
                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center rounded-2xl transition-all group">
                                                <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-xl transition-opacity">
                                                    Klik untuk ganti gambar
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Placeholder */
                                    <div className="flex flex-col items-center py-12 px-6 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            Seret gambar ke sini atau klik untuk pilih
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1.5">
                                            JPG, PNG, WebP — Maks. 5MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleInputChange}
                                disabled={processing}
                            />

                            {errors.image && (
                                <p className={errorClass}>{errors.image}</p>
                            )}
                        </div>

                        {/* Pilih Lahan (opsional) */}
                        {lahans.length > 0 && (
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
                                    disabled={processing}
                                >
                                    <option value="">— Tanpa lahan —</option>
                                    {lahans.map((lahan) => (
                                        <option key={lahan.id} value={lahan.id}>
                                            {lahan.nama_lahan}
                                            {lahan.luas_are ? ` (${lahan.luas_are} are)` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.lahan_id && (
                                    <p className={errorClass}>{errors.lahan_id}</p>
                                )}
                            </div>
                        )}

                        {/* Loading State */}
                        {processing && (
                            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3.5">
                                <svg className="w-5 h-5 text-emerald-600 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <p className="text-sm font-semibold text-emerald-800">
                                    Menganalisis gambar dengan AI...
                                </p>
                            </div>
                        )}

                        {/* Tombol Aksi */}
                        <div className="flex items-center justify-between pt-1">
                            <Link
                                href={route('petani.scan.index')}
                                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !data.image}
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menganalisis...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Analisis dengan AI
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Panduan */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tips untuk hasil terbaik
                    </h3>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Pastikan daun terlihat jelas dan pencahayaan cukup</li>
                        <li>• Fokuskan kamera pada bagian daun yang menunjukkan gejala</li>
                        <li>• Hindari bayangan atau pantulan cahaya yang berlebihan</li>
                        <li>• Satu gambar per satu daun untuk akurasi optimal</li>
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
