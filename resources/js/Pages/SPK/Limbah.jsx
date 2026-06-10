import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ============================================================
// Konstanta & Mapping
// ============================================================

const LABEL_FASILITAS = {
    lahan_kosong:   'Lahan Kosong',
    kandang_ternak: 'Kandang Ternak',
    akses_pengepul: 'Akses Pengepul',
    alat_cacah:     'Alat Cacah',
};

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
    { value: 'ekonomi',    label: 'Ekonomi — Maksimalkan nilai jual' },
    { value: 'lingkungan', label: 'Lingkungan — Minimasi dampak negatif' },
    { value: 'keduanya',   label: 'Keduanya — Seimbang' },
];

const NAMA_LIMBAH = {
    jerami: 'Jerami',
    sekam:  'Sekam',
    dedak:  'Dedak',
};

// ============================================================
// Sub-komponen
// ============================================================

function FormField({ label, error, children, required }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
}

function SelectField({ value, onChange, disabled, children, error }) {
    return (
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${
                error ? 'border-red-400' : 'border-gray-200'
            }`}
        >
            {children}
        </select>
    );
}

// Badge fasilitas tersedia / tidak
function FasilitasBadge({ tersedia }) {
    return tersedia ? (
        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Fasilitas Tersedia
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Fasilitas Tidak Tersedia
        </span>
    );
}

// ============================================================
// Komponen Kartu Rekomendasi per Jenis Limbah
// ============================================================

function KartuRekomendasi({ jenisKey, rekomendasi }) {
    if (!rekomendasi) return null;

    const isDisbakar = rekomendasi.label?.toLowerCase().includes('bakar') && !rekomendasi.label?.toLowerCase().includes('biochar');

    return (
        <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isDisbakar ? 'border-red-200' : 'border-gray-100'}`}>
            <div className={`px-6 py-4 border-b flex items-start justify-between gap-3 ${isDisbakar ? 'border-red-100 bg-red-50' : 'border-gray-100'}`}>
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        {NAMA_LIMBAH[jenisKey] ?? jenisKey}
                    </p>
                    <h3 className={`text-lg font-black ${isDisbakar ? 'text-red-700' : 'text-gray-900'}`}>
                        {rekomendasi.label}
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">Rule: {rekomendasi.rule_id}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Estimasi nilai:{' '}
                        <span className="font-bold text-gray-800">
                            Rp {Number(rekomendasi.nilai_ekonomi_estimasi).toLocaleString('id-ID')}
                        </span>
                    </p>
                </div>
                <FasilitasBadge tersedia={rekomendasi.fasilitas_tersedia} />
            </div>

            {rekomendasi.alasan && (
                <div className="px-6 py-4 bg-emerald-50/50 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Alasan Sistem</p>
                    <p className="text-sm text-gray-800">{rekomendasi.alasan}</p>
                </div>
            )}

            {rekomendasi.warning && (
                <div className="mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-xs font-medium text-red-700">{rekomendasi.warning}</p>
                </div>
            )}

            <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Harga per kg</p>
                    <p className="text-base font-black text-gray-900">Rp {Number(rekomendasi.harga_per_kg).toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Volume</p>
                    <p className="text-base font-black text-gray-900">
                        {Number(rekomendasi.volume_kg).toLocaleString('id-ID', { maximumFractionDigits: 0 })} kg
                    </p>
                </div>
                {rekomendasi.dampak_lingkungan && (
                    <div className="bg-emerald-50 rounded-xl p-3 col-span-2 sm:col-span-1 border border-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-0.5">{rekomendasi.dampak_lingkungan.label}</p>
                        <p className="text-base font-black text-emerald-900">
                            {Number(rekomendasi.dampak_lingkungan.value).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
                            <span className="text-xs font-semibold">{rekomendasi.dampak_lingkungan.unit}</span>
                        </p>
                    </div>
                )}
            </div>

            {(rekomendasi.langkah_praktis ?? []).length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Langkah Praktis</p>
                    <ol className="list-decimal list-inside space-y-1.5">
                        {rekomendasi.langkah_praktis.map((langkah, idx) => (
                            <li key={idx} className="text-sm text-gray-700">{langkah}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}

// ============================================================
// Komponen Hasil Rekomendasi Limbah
// ============================================================

function HasilRekomendasi({ result }) {
    const { volume, rekomendasi_jerami, rekomendasi_sekam, rekomendasi_dedak, total_nilai_ekonomi } = result;

    // Cek apakah ada rekomendasi "Dibakar"
    const adaPeringatanDibakar = [rekomendasi_jerami, rekomendasi_sekam, rekomendasi_dedak]
        .some((r) => r?.warning);

    return (
        <div className="space-y-4">
            {/* Volume Limbah — 3 kartu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">Volume Limbah Estimasi</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Berdasarkan estimasi total panen yang diinput.</p>
                </div>
                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Jerami */}
                    <div className="bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🌾</span>
                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Jerami</p>
                        </div>
                        <p className="text-xl font-black text-gray-900">
                            {Number(volume?.jerami_kg ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
                            <span className="text-sm font-semibold text-gray-500">kg</span>
                        </p>
                    </div>
                    {/* Sekam */}
                    <div className="bg-yellow-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🫘</span>
                            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Sekam</p>
                        </div>
                        <p className="text-xl font-black text-gray-900">
                            {Number(volume?.sekam_kg ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
                            <span className="text-sm font-semibold text-gray-500">kg</span>
                        </p>
                    </div>
                    {/* Dedak */}
                    <div className="bg-orange-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">🌰</span>
                            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Dedak</p>
                        </div>
                        <p className="text-xl font-black text-gray-900">
                            {Number(volume?.dedak_kg ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}{' '}
                            <span className="text-sm font-semibold text-gray-500">kg</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Kartu Rekomendasi per Jenis */}
            {rekomendasi_jerami && (
                <KartuRekomendasi jenisKey="jerami" rekomendasi={rekomendasi_jerami} />
            )}
            {rekomendasi_sekam && (
                <KartuRekomendasi jenisKey="sekam" rekomendasi={rekomendasi_sekam} />
            )}
            {rekomendasi_dedak && (
                <KartuRekomendasi jenisKey="dedak" rekomendasi={rekomendasi_dedak} />
            )}

            {/* Total Nilai Ekonomi */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wide mb-1">Total Estimasi Nilai Ekonomi</p>
                        <p className="text-3xl font-black text-white">
                            Rp {Number(total_nilai_ekonomi).toLocaleString('id-ID')}
                        </p>
                        <p className="text-emerald-200 text-xs mt-1">Jumlah dari semua rekomendasi limbah terpilih</p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Peringatan global jika ada rekomendasi Dibakar */}
            {adaPeringatanDibakar && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="text-sm font-bold text-red-700">Peringatan: Rekomendasi Membakar Limbah</p>
                        <p className="text-xs text-red-600 mt-0.5">
                            Salah satu rekomendasi adalah membakar limbah. Praktik ini merusak kualitas udara dan tanah serta tidak ramah lingkungan.
                            Pertimbangkan alternatif lain jika memungkinkan.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// Halaman Utama
// ============================================================

export default function Limbah({ lahans, prefill, result }) {
    const { data, setData, post, processing, errors } = useForm({
        lahan_id:           '',
        estimasi_total_ton: '',
        jenis_limbah_ada:   [],
        fasilitas:          [],
        tujuan_utama:       'keduanya',
    });

    const [autofilled, setAutofilled] = useState(false);

    // Saat lahan dipilih: auto-fill estimasi_total_ton dari prefill
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

    // Toggle checkbox jenis_limbah_ada
    function toggleJenisLimbah(value) {
        const current = data.jenis_limbah_ada;
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        setData('jenis_limbah_ada', next);
    }

    // Toggle checkbox fasilitas
    function toggleFasilitas(value) {
        const current = data.fasilitas;
        const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        setData('fasilitas', next);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('petani.spk.limbah.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="SPK Rekomendasi Pengolahan Limbah" />

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pengolahan Limbah Padi</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Sistem Pakar Berbasis Aturan untuk merekomendasikan pengolahan limbah padi dengan alasan dan langkah praktis.
                    </p>
                </div>

                {/* Hasil Rekomendasi — tampil di atas form jika ada */}
                {result && <HasilRekomendasi result={result} />}

                {/* Form Input */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Data Input</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Isi data limbah untuk mendapatkan rekomendasi pengolahan.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                        {/* Badge autofill */}
                        {autofilled && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Estimasi panen terisi otomatis dari prediksi panen terbaru
                            </div>
                        )}

                        {/* Lahan */}
                        <FormField label="Lahan" error={errors.lahan_id}>
                            <SelectField
                                value={data.lahan_id}
                                onChange={handleLahanChange}
                                error={errors.lahan_id}
                            >
                                <option value="">— Tanpa Lahan —</option>
                                {lahans.map((lahan) => (
                                    <option key={lahan.id} value={lahan.id}>
                                        {lahan.nama_lahan} ({lahan.luas_m2 ? (lahan.luas_m2 / 10000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 }) : 0} Ha)
                                    </option>
                                ))}
                            </SelectField>
                        </FormField>

                        {/* Estimasi Total Panen */}
                        <FormField label="Estimasi Total Panen (ton)" required error={errors.estimasi_total_ton}>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.estimasi_total_ton}
                                onChange={(e) => setData('estimasi_total_ton', e.target.value)}
                                placeholder="contoh: 1.25"
                                className={`w-full border rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                                    errors.estimasi_total_ton ? 'border-red-400' : 'border-gray-200'
                                }`}
                            />
                            {autofilled && data.estimasi_total_ton && (
                                <p className="mt-1 text-xs text-gray-400">Terisi dari prediksi panen terbaru</p>
                            )}
                        </FormField>

                        {/* Jenis Limbah yang Ada */}
                        <FormField label="Jenis Limbah yang Ada" required error={errors.jenis_limbah_ada}>
                            <div className="flex flex-wrap gap-3 mt-1">
                                {JENIS_LIMBAH_OPTIONS.map((opt) => {
                                    const checked = data.jenis_limbah_ada.includes(opt.value);
                                    return (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center gap-2 cursor-pointer select-none border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                                                checked
                                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                value={opt.value}
                                                checked={checked}
                                                onChange={() => toggleJenisLimbah(opt.value)}
                                            />
                                            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                                checked ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'
                                            }`}>
                                                {checked && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </span>
                                            {opt.label}
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.jenis_limbah_ada && (
                                <p className="mt-1 text-xs text-red-600">{errors['jenis_limbah_ada.0'] ?? 'Pilih minimal 1 jenis limbah'}</p>
                            )}
                        </FormField>

                        {/* Fasilitas Tersedia */}
                        <FormField label="Fasilitas yang Tersedia" error={errors.fasilitas}>
                            <div className="flex flex-wrap gap-3 mt-1">
                                {FASILITAS_OPTIONS.map((opt) => {
                                    const checked = data.fasilitas.includes(opt.value);
                                    return (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center gap-2 cursor-pointer select-none border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                                                checked
                                                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                value={opt.value}
                                                checked={checked}
                                                onChange={() => toggleFasilitas(opt.value)}
                                            />
                                            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                                                checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                            }`}>
                                                {checked && (
                                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </span>
                                            {opt.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </FormField>

                        {/* Tujuan Utama */}
                        <FormField label="Tujuan Utama" required error={errors.tujuan_utama}>
                            <div className="space-y-2 mt-1">
                                {TUJUAN_OPTIONS.map((opt) => {
                                    const checked = data.tujuan_utama === opt.value;
                                    return (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center gap-3 cursor-pointer select-none border rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                                checked
                                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="tujuan_utama"
                                                className="sr-only"
                                                value={opt.value}
                                                checked={checked}
                                                onChange={() => setData('tujuan_utama', opt.value)}
                                            />
                                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                checked ? 'border-emerald-600' : 'border-gray-300'
                                            }`}>
                                                {checked && (
                                                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                                )}
                                            </span>
                                            {opt.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </FormField>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-colors text-sm"
                            >
                                {processing ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Dapatkan Rekomendasi Limbah
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
