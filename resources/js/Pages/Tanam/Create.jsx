import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const inputCls = 'w-full h-[38px] border px-3 text-[14px] text-zinc-900 bg-white rounded-lg outline-none transition-all hover:border-zinc-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 border-zinc-300';
const labelCls = 'block text-[13px] font-medium text-zinc-700 mb-[5px]';
const errCls   = 'mt-1 text-[12px] text-red-600';

export default function Create({ lahans, varietyRefs }) {
    const { data, setData, post, processing, errors } = useForm({
        lahan_id: '', varietas: '', tanggal_semai: '', tanggal_tanam: '', umur_panen_hari: '', catatan: '',
    });

    useEffect(() => {
        if (!data.varietas) { setData('umur_panen_hari', ''); return; }
        const v = varietyRefs.find((v) => v.nama === data.varietas);
        if (v) setData('umur_panen_hari', v.umur_panen_hari);
    }, [data.varietas]);

    const handleSubmit = (e) => { e.preventDefault(); post(route('petani.tanam.store')); };

    return (
        <AuthenticatedLayout>
            <Head title="Mulai Musim Tanam Baru" />

            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Mulai Musim Tanam Baru</h1>
                        <p className="text-[13px] text-green-200">Isi data musim tanam untuk mendapatkan jadwal pemupukan otomatis.</p>
                    </div>
                    <Link href={route('petani.tanam.index')} className="shrink-0 inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-[12px] font-medium px-3.5 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        ← Kembali
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Form — 3/5 */}
                <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl">
                    <div className="px-5 py-4 border-b border-zinc-100">
                        <h2 className="text-[15px] font-medium text-zinc-900">Data Musim Tanam</h2>
                        <p className="text-[13px] text-zinc-500 mt-0.5">Semua field wajib diisi kecuali yang ditandai opsional.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                        {/* Lahan */}
                        <div>
                            <label className={labelCls}>Lahan <span className="text-zinc-400 font-normal text-[12px]">(opsional)</span></label>
                            <select className={inputCls} value={data.lahan_id} onChange={(e) => setData('lahan_id', e.target.value)}>
                                <option value="">— Tanpa Lahan —</option>
                                {lahans.map((l) => <option key={l.id} value={l.id}>{l.nama_lahan}{l.luas_are ? ` (${l.luas_are} are)` : ''}</option>)}
                            </select>
                            {errors.lahan_id && <p className={errCls}>{errors.lahan_id}</p>}
                        </div>

                        {/* Varietas */}
                        <div>
                            <label className={labelCls}>Varietas Padi <span className="text-red-500">*</span></label>
                            <select className={inputCls} value={data.varietas} onChange={(e) => setData('varietas', e.target.value)} required>
                                <option value="">— Pilih Varietas —</option>
                                {varietyRefs.map((v) => <option key={v.id} value={v.nama}>{v.nama} — {v.umur_panen_hari} hari</option>)}
                            </select>
                            {errors.varietas && <p className={errCls}>{errors.varietas}</p>}
                        </div>

                        {/* Tanggal */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Tanggal Semai <span className="text-red-500">*</span></label>
                                <input type="date" className={inputCls} value={data.tanggal_semai} onChange={(e) => setData('tanggal_semai', e.target.value)} required />
                                {errors.tanggal_semai && <p className={errCls}>{errors.tanggal_semai}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Tanggal Tanam <span className="text-red-500">*</span></label>
                                <input type="date" className={inputCls} value={data.tanggal_tanam} min={data.tanggal_semai || undefined} onChange={(e) => setData('tanggal_tanam', e.target.value)} required />
                                {errors.tanggal_tanam && <p className={errCls}>{errors.tanggal_tanam}</p>}
                            </div>
                        </div>

                        {/* Umur Panen */}
                        <div>
                            <label className={labelCls}>Umur Panen (hari) <span className="text-red-500">*</span></label>
                            <input type="number" min="90" max="180" className={inputCls} value={data.umur_panen_hari} onChange={(e) => setData('umur_panen_hari', e.target.value ? Number(e.target.value) : '')} placeholder="90 – 180 hari" required />
                            <p className="mt-1 text-[12px] text-zinc-400">Terisi otomatis saat varietas dipilih.</p>
                            {errors.umur_panen_hari && <p className={errCls}>{errors.umur_panen_hari}</p>}
                        </div>

                        {/* Catatan */}
                        <div>
                            <label className={labelCls}>Catatan <span className="text-zinc-400 font-normal text-[12px]">(opsional)</span></label>
                            <textarea rows={3} className={`${inputCls} h-auto py-2.5`} value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} placeholder="Catatan tambahan..." />
                        </div>

                        <button type="submit" disabled={processing} className="w-full bg-[#166534] text-white text-[14px] font-medium px-4 py-[10px] rounded-lg hover:bg-[#15803d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors">
                            {processing ? 'Menyimpan...' : 'Mulai Musim Tanam'}
                        </button>
                    </form>
                </div>

                {/* Info — 2/5 */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-zinc-200 rounded-xl p-5">
                        <p className="text-[12px] font-semibold text-zinc-400 uppercase tracking-[0.05em] mb-3">Jadwal Pupuk Otomatis</p>
                        <div className="space-y-3">
                            {[
                                { label: 'Pupuk Dasar', hst: 'HST 0–3', color: '#166534' },
                                { label: 'Susulan 1',   hst: 'HST 21–25', color: '#15803d' },
                                { label: 'Susulan 2',   hst: 'HST 40–45', color: '#16a34a' },
                                { label: 'Susulan 3',   hst: 'HST 55–60', color: '#22c55e' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                                        <span className="text-[13px] font-medium text-zinc-700">{item.label}</span>
                                    </div>
                                    <span className="text-[12px] text-zinc-400">{item.hst}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5">
                        <p className="text-[12px] font-semibold text-[#166534] uppercase tracking-[0.05em] mb-2">Fase Pertumbuhan</p>
                        <div className="space-y-1.5">
                            {[
                                { label: 'Vegetatif Awal', hst: '1–14 HST' },
                                { label: 'Vegetatif Aktif', hst: '15–45 HST' },
                                { label: 'Reproduktif', hst: '46–65 HST' },
                                { label: 'Pemasakan', hst: '66+ HST' },
                            ].map((f) => (
                                <div key={f.label} className="flex justify-between text-[12px]">
                                    <span className="text-[#166534] font-medium">{f.label}</span>
                                    <span className="text-zinc-500">{f.hst}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
