import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const inputCls = 'w-full h-[38px] border px-3 text-[14px] text-zinc-900 bg-white rounded-lg outline-none transition-all hover:border-zinc-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 border-zinc-300';
const labelCls = 'block text-[13px] font-medium text-zinc-700 mb-[5px]';
const errCls   = 'mt-1 text-[12px] text-red-600';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lahan: '', luas_m2: '', desa: '', kecamatan: '', kabupaten: '', jenis_tanah: '', sumber_air: '', varietas_default: '',
    });

    const handleSubmit = (e) => { e.preventDefault(); post(route('petani.lahan.store')); };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Lahan" />

            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Tambah Lahan</h1>
                        <p className="text-[13px] text-green-200">Isi data lahan sawah Anda untuk memulai analitik pertanian.</p>
                    </div>
                    <Link href={route('petani.lahan.index')} className="shrink-0 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-[12px] font-medium px-3.5 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        ← Kembali
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <h2 className="text-[15px] font-medium text-zinc-900">Data Lahan</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                        <div>
                            <label className={labelCls}>Nama Lahan <span className="text-red-500">*</span></label>
                            <input type="text" className={inputCls} value={data.nama_lahan} onChange={(e) => setData('nama_lahan', e.target.value)} placeholder="Contoh: Sawah Utara Blok A" required />
                            {errors.nama_lahan && <p className={errCls}>{errors.nama_lahan}</p>}
                        </div>

                        <div>
                            <label className={labelCls}>Luas Lahan (m²) <span className="text-red-500">*</span></label>
                            <input type="number" step="1" min="1" className={inputCls} value={data.luas_m2} onChange={(e) => setData('luas_m2', e.target.value)} placeholder="Contoh: 5000" required />
                            {data.luas_m2 && <p className="mt-1 text-[12px] text-zinc-400">≈ {(data.luas_m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 4 })} Ha</p>}
                            {errors.luas_m2 && <p className={errCls}>{errors.luas_m2}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[['desa', 'Desa'], ['kecamatan', 'Kecamatan'], ['kabupaten', 'Kabupaten']].map(([field, label]) => (
                                <div key={field}>
                                    <label className={labelCls}>{label} <span className="text-red-500">*</span></label>
                                    <input type="text" className={inputCls} value={data[field]} onChange={(e) => setData(field, e.target.value)} required />
                                    {errors[field] && <p className={errCls}>{errors[field]}</p>}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Jenis Tanah <span className="text-red-500">*</span></label>
                                <select className={inputCls} value={data.jenis_tanah} onChange={(e) => setData('jenis_tanah', e.target.value)} required>
                                    <option value="">— Pilih —</option>
                                    <option value="liat">Tanah Liat</option>
                                    <option value="lempung">Tanah Lempung</option>
                                    <option value="pasir">Tanah Pasir</option>
                                </select>
                                {errors.jenis_tanah && <p className={errCls}>{errors.jenis_tanah}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Sumber Air <span className="text-red-500">*</span></label>
                                <select className={inputCls} value={data.sumber_air} onChange={(e) => setData('sumber_air', e.target.value)} required>
                                    <option value="">— Pilih —</option>
                                    <option value="irigasi_teknis">Irigasi Teknis</option>
                                    <option value="tadah_hujan">Tadah Hujan</option>
                                    <option value="pompa">Pompa Air</option>
                                </select>
                                {errors.sumber_air && <p className={errCls}>{errors.sumber_air}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelCls}>Varietas Default <span className="text-zinc-400 font-normal text-[12px]">(opsional)</span></label>
                            <input type="text" className={inputCls} value={data.varietas_default} onChange={(e) => setData('varietas_default', e.target.value)} placeholder="Contoh: Ciherang" />
                        </div>

                        <button type="submit" disabled={processing} className="w-full bg-[#166534] text-white text-[14px] font-medium px-4 py-[10px] rounded-lg hover:bg-[#15803d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors">
                            {processing ? 'Menyimpan...' : 'Simpan Lahan'}
                        </button>
                    </form>
                </div>

                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5 h-fit">
                    <p className="text-[12px] font-semibold text-[#166534] uppercase tracking-[0.05em] mb-3">Panduan Pengisian</p>
                    <ul className="space-y-2.5">
                        {[
                            'Masukkan luas dalam m² (1 hektare = 10.000 m²)',
                            'Pilih jenis tanah yang sesuai dengan kondisi lapangan',
                            'Sumber air mempengaruhi rekomendasi SPK',
                            'Varietas default digunakan sebagai referensi modul prediksi',
                        ].map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-[12px] text-[#166534]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0 mt-1.5" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
