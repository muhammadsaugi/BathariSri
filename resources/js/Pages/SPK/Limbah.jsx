import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PiCheckCircle, PiXCircle, PiWarningCircle, PiLeaf } from 'react-icons/pi';

const JENIS_LIMBAH_OPTIONS = [
    { value: 'jerami', label: 'Jerami' },
    { value: 'sekam',  label: 'Sekam' },
    { value: 'dedak',  label: 'Dedak' },
];

const FASILITAS_OPTIONS = [
    { value: 'lahan_kosong',   label: 'Lahan Kosong' },
    { value: 'kandang_ternak', label: 'Kandang Ternak' },
    { value: 'akses_pengepul', label: 'Akses Pengepul' },
    { value: 'alat_cacah',     label: 'Alat Cacah' },
];

const TUJUAN_OPTIONS = [
    { value: 'ekonomi',    label: 'Ekonomi',    desc: 'Maksimalkan nilai jual' },
    { value: 'lingkungan', label: 'Lingkungan', desc: 'Minimasi dampak negatif' },
    { value: 'keduanya',   label: 'Keduanya',   desc: 'Seimbang antara keduanya' },
];

const NAMA_LIMBAH = { jerami: 'Jerami', sekam: 'Sekam', dedak: 'Dedak' };

// ── Sub-komponen ──────────────────────────────────────────────────────────────

function FormField({ label, error, children, required }) {
    return (
        <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-[5px]">
                {label}
                {required && <span className="text-red-600 ml-0.5">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
        </div>
    );
}

function SelectField({ value, onChange, disabled, children, error }) {
    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full h-[38px] border px-3 text-[14px] text-zinc-900 bg-white rounded-lg outline-none transition-all disabled:bg-zinc-50 disabled:text-zinc-400 hover:border-zinc-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 ${error ? 'border-red-400' : 'border-zinc-300'}`}
        >
            {children}
        </select>
    );
}

function MetricCard({ label, value, unit, subtext }) {
    return (
        <div className="bg-zinc-50 border border-zinc-200 rounded-[8px] p-4">
            <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-[0.05em] mb-1.5">{label}</p>
            <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-semibold text-zinc-900 leading-none" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{value}</span>
                {unit && <span className="text-[13px] text-zinc-500">{unit}</span>}
            </div>
            {subtext && <p className="text-[12px] text-zinc-400 mt-1">{subtext}</p>}
        </div>
    );
}

function KartuRekomendasi({ jenisKey, rekomendasi }) {
    if (!rekomendasi) return null;
    const isDisbakar = rekomendasi.label?.toLowerCase().includes('bakar') && !rekomendasi.label?.toLowerCase().includes('biochar');

    return (
        <div className={`bg-white rounded-xl overflow-hidden ${isDisbakar ? 'border border-red-200 border-l-[3px] border-l-red-500' : 'border border-zinc-200 border-l-[3px] border-l-[#166534]'}`}>
            <div className={`px-5 py-4 border-b flex items-start justify-between gap-3 ${isDisbakar ? 'border-red-100' : 'border-zinc-100'}`}>
                <div className="min-w-0">
                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mb-1">
                        {NAMA_LIMBAH[jenisKey] ?? jenisKey}
                    </p>
                    <h3 className={`text-[17px] font-semibold ${isDisbakar ? 'text-red-700' : 'text-zinc-900'}`} style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {rekomendasi.label}
                    </h3>
                    <p className="text-[13px] text-zinc-500 mt-0.5">
                        Nilai estimasi: <span className="font-medium text-zinc-800">Rp {Number(rekomendasi.nilai_ekonomi_estimasi).toLocaleString('id-ID')}</span>
                    </p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${rekomendasi.fasilitas_tersedia ? 'bg-[#dcfce7] text-[#166534]' : 'bg-zinc-100 text-zinc-500'}`}>
                    {rekomendasi.fasilitas_tersedia
                        ? <><PiCheckCircle weight="fill" className="w-3 h-3" /> Fasilitas Tersedia</>
                        : <><PiXCircle weight="fill" className="w-3 h-3" /> Fasilitas Tidak Ada</>
                    }
                </span>
            </div>

            {rekomendasi.alasan && (
                <div className="px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/50">
                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.05em] mb-1">Alasan</p>
                    <p className="text-[13px] text-zinc-700">{rekomendasi.alasan}</p>
                </div>
            )}

            {rekomendasi.warning && (
                <div className="mx-5 mt-3.5 flex items-start gap-2 bg-[#fee2e2] border border-red-200 rounded-lg px-4 py-3">
                    <PiWarningCircle weight="fill" className="w-4 h-4 text-red-500 shrink-0 mt-px" />
                    <p className="text-[13px] text-red-700">{rekomendasi.warning}</p>
                </div>
            )}

            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <MetricCard label="Harga per kg" value={`Rp ${Number(rekomendasi.harga_per_kg).toLocaleString('id-ID')}`} />
                <MetricCard label="Volume" value={Number(rekomendasi.volume_kg).toLocaleString('id-ID', { maximumFractionDigits: 0 })} unit="kg" />
                {rekomendasi.dampak_lingkungan && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] p-4 col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <PiLeaf weight="duotone" className="w-4 h-4 text-[#166534]" />
                            <p className="text-[11px] font-medium text-[#166534] uppercase tracking-[0.05em]">{rekomendasi.dampak_lingkungan.label}</p>
                        </div>
                        <p className="text-[22px] font-semibold text-[#14532d] leading-none" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {Number(rekomendasi.dampak_lingkungan.value).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
                            <span className="text-[13px] font-medium text-[#166534]">{rekomendasi.dampak_lingkungan.unit}</span>
                        </p>
                    </div>
                )}
            </div>

            {(rekomendasi.langkah_praktis ?? []).length > 0 && (
                <div className="border-t border-zinc-100 px-5 py-4">
                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.05em] mb-2.5">Langkah Praktis</p>
                    <ol className="list-decimal list-inside space-y-1.5">
                        {rekomendasi.langkah_praktis.map((langkah, idx) => (
                            <li key={idx} className="text-[13px] text-zinc-700">{langkah}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}

function HasilRekomendasi({ result }) {
    const { volume, rekomendasi_jerami, rekomendasi_sekam, rekomendasi_dedak, total_nilai_ekonomi } = result;
    const adaPeringatanDibakar = [rekomendasi_jerami, rekomendasi_sekam, rekomendasi_dedak].some((r) => r?.warning);

    return (
        <div className="space-y-4">
            {/* Volume Cards */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-100">
                    <h3 className="text-[15px] font-medium text-zinc-900">Volume Limbah Estimasi</h3>
                    <p className="text-[13px] text-zinc-500 mt-0.5">Berdasarkan estimasi total panen yang diinput.</p>
                </div>
                <div className="px-5 py-4 grid grid-cols-3 gap-3">
                    <MetricCard label="Jerami" value={Number(volume?.jerami_kg ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })} unit="kg" />
                    <MetricCard label="Sekam"  value={Number(volume?.sekam_kg  ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })} unit="kg" />
                    <MetricCard label="Dedak"  value={Number(volume?.dedak_kg  ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })} unit="kg" />
                </div>
            </div>

            {rekomendasi_jerami && <KartuRekomendasi jenisKey="jerami" rekomendasi={rekomendasi_jerami} />}
            {rekomendasi_sekam  && <KartuRekomendasi jenisKey="sekam"  rekomendasi={rekomendasi_sekam} />}
            {rekomendasi_dedak  && <KartuRekomendasi jenisKey="dedak"  rekomendasi={rekomendasi_dedak} />}

            {/* Total Nilai Ekonomi */}
            <div className="bg-white border border-zinc-200 border-l-[3px] border-l-[#166534] rounded-xl px-5 py-4">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mb-1.5">Total Estimasi Nilai Ekonomi</p>
                <p className="text-[28px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Rp {Number(total_nilai_ekonomi).toLocaleString('id-ID')}
                </p>
                <p className="text-[13px] text-zinc-500 mt-1">Jumlah dari semua rekomendasi limbah terpilih</p>
            </div>

            {adaPeringatanDibakar && (
                <div className="flex items-start gap-3 bg-[#fee2e2] border border-red-200 rounded-xl px-5 py-4">
                    <PiWarningCircle weight="fill" className="w-5 h-5 text-red-500 shrink-0 mt-px" />
                    <div>
                        <p className="text-[14px] font-medium text-red-700">Peringatan: Rekomendasi Membakar Limbah</p>
                        <p className="text-[13px] text-red-600 mt-0.5">
                            Salah satu rekomendasi adalah membakar limbah. Praktik ini merusak kualitas udara dan tanah. Pertimbangkan alternatif lain.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Halaman Utama ─────────────────────────────────────────────────────────────

export default function Limbah({ lahans, prefill, result }) {
    const { data, setData, post, processing, errors } = useForm({
        lahan_id:           '',
        estimasi_total_ton: '',
        jenis_limbah_ada:   [],
        fasilitas:          [],
        tujuan_utama:       'keduanya',
    });

    const [autofilled, setAutofilled] = useState(false);

    function handleLahanChange(e) {
        const lahanId = e.target.value;
        const updates = { lahan_id: lahanId, estimasi_total_ton: '' };
        let didAutofill = false;
        if (lahanId && prefill) {
            const pre = prefill[lahanId];
            if (pre?.estimasi_total_ton != null) {
                updates.estimasi_total_ton = String(pre.estimasi_total_ton);
                didAutofill = true;
            }
        }
        setData((prev) => ({ ...prev, ...updates }));
        setAutofilled(didAutofill);
    }

    const toggleJenisLimbah = (value) => {
        const c = data.jenis_limbah_ada;
        setData('jenis_limbah_ada', c.includes(value) ? c.filter((v) => v !== value) : [...c, value]);
    };

    const toggleFasilitas = (value) => {
        const c = data.fasilitas;
        setData('fasilitas', c.includes(value) ? c.filter((v) => v !== value) : [...c, value]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('petani.spk.limbah.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Limbah Padi" />

            {/* Page Header */}
            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Kelola Limbah Padi
                </h1>
                <p className="text-[13px] text-green-200">
                    Dapatkan rekomendasi pengolahan jerami, sekam, dan dedak agar bernilai ekonomis dan ramah lingkungan.
                </p>
            </div>

            {/* 2-Kolom: Form Kiri | Hasil Kanan */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Form — 2/5 */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-zinc-200 rounded-xl">
                        <div className="px-5 py-4 border-b border-zinc-100">
                            <h2 className="text-[15px] font-medium text-zinc-900">Isi Data Limbah</h2>
                            <p className="text-[13px] text-zinc-500 mt-0.5">Isi sesuai kondisi pasca panen di lahanmu.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                            {autofilled && (
                                <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-3.5 py-2.5 rounded-lg text-[12px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0" />
                                    Estimasi panen terisi otomatis dari prediksi terbaru
                                </div>
                            )}

                            <FormField label="Pilih Lahan" error={errors.lahan_id}>
                                <SelectField value={data.lahan_id} onChange={handleLahanChange} error={errors.lahan_id}>
                                    <option value="">— Tanpa Lahan —</option>
                                    {lahans.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.nama_lahan} ({l.luas_m2 ? (l.luas_m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : 0} Ha)
                                        </option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <FormField label="Estimasi Total Panen (ton)" required error={errors.estimasi_total_ton}>
                                <input
                                    type="number" step="0.01" min="0.01"
                                    value={data.estimasi_total_ton}
                                    onChange={(e) => setData('estimasi_total_ton', e.target.value)}
                                    placeholder="contoh: 1.25"
                                    className={`w-full h-[38px] border px-3 text-[14px] text-zinc-900 bg-white rounded-lg outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-400 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10 ${errors.estimasi_total_ton ? 'border-red-400' : 'border-zinc-300'}`}
                                />
                                {autofilled && data.estimasi_total_ton && (
                                    <p className="mt-1 text-[12px] text-zinc-400">Terisi dari prediksi panen terbaru</p>
                                )}
                            </FormField>

                            <FormField label="Jenis Limbah yang Ada" required error={errors.jenis_limbah_ada}>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {JENIS_LIMBAH_OPTIONS.map((opt) => {
                                        const checked = data.jenis_limbah_ada.includes(opt.value);
                                        return (
                                            <label key={opt.value} className={`flex items-center gap-2 cursor-pointer select-none border px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all ${checked ? 'bg-[#f0fdf4] border-[#166534] text-[#166534]' : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'}`}>
                                                <input type="checkbox" className="sr-only" value={opt.value} checked={checked} onChange={() => toggleJenisLimbah(opt.value)} />
                                                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#166534] border-[#166534]' : 'border-zinc-300'}`}>
                                                    {checked && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </span>
                                                {opt.label}
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.jenis_limbah_ada && <p className="mt-1 text-[12px] text-red-600">Pilih minimal 1 jenis limbah</p>}
                            </FormField>

                            <FormField label="Fasilitas yang Tersedia" error={errors.fasilitas}>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {FASILITAS_OPTIONS.map((opt) => {
                                        const checked = data.fasilitas.includes(opt.value);
                                        return (
                                            <label key={opt.value} className={`flex items-center gap-2 cursor-pointer select-none border px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all ${checked ? 'bg-[#dbeafe] border-[#1e40af] text-[#1e40af]' : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'}`}>
                                                <input type="checkbox" className="sr-only" value={opt.value} checked={checked} onChange={() => toggleFasilitas(opt.value)} />
                                                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#1e40af] border-[#1e40af]' : 'border-zinc-300'}`}>
                                                    {checked && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                </span>
                                                {opt.label}
                                            </label>
                                        );
                                    })}
                                </div>
                            </FormField>

                            <FormField label="Tujuan Utama" required error={errors.tujuan_utama}>
                                <div className="space-y-2 mt-1">
                                    {TUJUAN_OPTIONS.map((opt) => {
                                        const checked = data.tujuan_utama === opt.value;
                                        return (
                                            <label key={opt.value} className={`flex items-center gap-3 cursor-pointer select-none border px-3.5 py-2.5 text-[13px] rounded-lg transition-all ${checked ? 'bg-[#f0fdf4] border-[#166534]' : 'bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400'}`}>
                                                <input type="radio" name="tujuan_utama" className="sr-only" value={opt.value} checked={checked} onChange={() => setData('tujuan_utama', opt.value)} />
                                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-[#166534]' : 'border-zinc-300'}`}>
                                                    {checked && <span className="w-2 h-2 rounded-full bg-[#166534]" />}
                                                </span>
                                                <span>
                                                    <span className={`font-medium ${checked ? 'text-[#166534]' : 'text-zinc-800'}`}>{opt.label}</span>
                                                    <span className="text-zinc-500 ml-1.5">— {opt.desc}</span>
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </FormField>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#166534] text-white text-[14px] font-medium px-4 py-[10px] rounded-lg hover:bg-[#15803d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Memproses...' : 'Dapatkan Rekomendasi Limbah'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hasil — 3/5 */}
                <div className="lg:col-span-3">
                    {result ? (
                        <HasilRekomendasi result={result} />
                    ) : (
                        <div className="bg-white border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[320px]">
                            <div className="w-12 h-12 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                                <PiLeaf className="w-6 h-6 text-[#166534]" />
                            </div>
                            <p className="text-[14px] font-medium text-zinc-700 mb-1">Rekomendasi Limbah</p>
                            <p className="text-[13px] text-zinc-400">Isi form di sebelah kiri untuk mendapatkan rekomendasi pengolahan limbah.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
