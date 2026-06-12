import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Penyakit({ lahans = [] }) {
    const { data, setData, post, processing, errors } = useForm({ image: null, lahan_id: '' });
    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    function handleFile(file) {
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert('Ukuran file melebihi 5MB.'); return; }
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) { alert('Format tidak didukung. Gunakan JPG, PNG, atau WebP.'); return; }
        setData('image', file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
    }

    const handleSubmit = (e) => { e.preventDefault(); post(route('petani.scan.store'), { forceFormData: true }); };

    const inputCls = `w-full h-[38px] border px-3 text-[14px] text-zinc-900 bg-white rounded-lg outline-none transition-all hover:border-zinc-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 border-zinc-300`;

    return (
        <AuthenticatedLayout>
            <Head title="Deteksi Penyakit Daun Padi" />

            {}
            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Deteksi Penyakit Daun Padi
                        </h1>
                        <p className="text-[13px] text-green-200">Upload foto daun padi untuk dianalisis oleh AI secara instan.</p>
                    </div>
                    <Link href={route('petani.scan.index')} className="shrink-0 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-[12px] font-medium px-3.5 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        ← Riwayat
                    </Link>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {}
                <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <h2 className="text-[15px] font-medium text-zinc-900">Upload Foto Daun</h2>
                        <p className="text-[13px] text-zinc-500 mt-0.5">JPG, PNG, WebP — Maks. 5MB</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-5">
                        {}
                        <div
                            onClick={() => !processing && fileInputRef.current?.click()}
                            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden ${dragOver ? 'border-[#166534] bg-[#f0fdf4]' : 'border-zinc-200 hover:border-[#166534]/50 bg-zinc-50'} ${processing ? 'opacity-60 cursor-not-allowed' : ''}`}
                            style={{ minHeight: preview ? 'auto' : '220px' }}
                        >
                            {preview ? (
                                <div className="w-full">
                                    <img src={preview} alt="Preview" className="w-full max-h-72 object-contain rounded-xl" />
                                    {!processing && (
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/25 flex items-center justify-center rounded-xl transition-all group">
                                            <span className="opacity-0 group-hover:opacity-100 text-white text-[13px] font-semibold bg-black/60 px-4 py-2 rounded-lg transition-opacity">
                                                Klik untuk ganti gambar
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-14 px-6 text-center">
                                    <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mb-4">
                                        <svg className="w-7 h-7 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-[14px] font-medium text-zinc-700 mb-1">Seret gambar ke sini atau klik untuk pilih</p>
                                    <p className="text-[12px] text-zinc-400">JPG, PNG, WebP — Maks. 5MB</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} disabled={processing} />
                        {errors.image && <p className="text-[12px] text-red-600">{errors.image}</p>}

                        {}
                        {lahans.length > 0 && (
                            <div>
                                <label className="block text-[13px] font-medium text-zinc-700 mb-[5px]">
                                    Lahan <span className="text-zinc-400 font-normal text-[12px]">(opsional)</span>
                                </label>
                                <select value={data.lahan_id} onChange={(e) => setData('lahan_id', e.target.value)} disabled={processing} className={inputCls}>
                                    <option value="">— Tanpa Lahan —</option>
                                    {lahans.map((l) => (
                                        <option key={l.id} value={l.id}>{l.nama_lahan}{l.luas_are ? ` (${l.luas_are} are)` : ''}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {}
                        {processing && (
                            <div className="flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3">
                                <svg className="w-5 h-5 text-[#166534] animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <p className="text-[13px] font-medium text-[#166534]">Menganalisis gambar dengan AI...</p>
                            </div>
                        )}

                        {}
                        <button
                            type="submit"
                            disabled={processing || !data.image}
                            className="w-full bg-[#166534] text-white text-[14px] font-medium px-4 py-[10px] rounded-lg hover:bg-[#15803d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                        >
                            {processing ? 'Menganalisis...' : 'Analisis dengan AI'}
                        </button>
                    </form>
                </div>

                {}
                <div className="lg:col-span-2 space-y-4">
                    {}
                    <div className="bg-white border border-zinc-200 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-[14px] font-semibold text-zinc-800">Tips untuk hasil terbaik</h3>
                        </div>
                        <ul className="space-y-2.5">
                            {[
                                'Pastikan daun terlihat jelas dan pencahayaan cukup',
                                'Fokuskan kamera pada bagian yang menunjukkan gejala',
                                'Hindari bayangan atau pantulan cahaya berlebihan',
                                'Satu gambar per satu daun untuk akurasi optimal',
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[13px] text-zinc-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0 mt-1.5" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {}
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5">
                        <p className="text-[12px] font-semibold text-[#166534] uppercase tracking-[0.05em] mb-2">Model AI</p>
                        <p className="text-[14px] font-semibold text-[#14532d] mb-1">ResNet50</p>
                        <p className="text-[12px] text-[#166534]">Mendeteksi 4 kondisi: Hawar Daun Bakteri, Bercak Coklat, Blas Daun, dan Sehat.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
