import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ============================================================
// Konstanta & Mapping
// ============================================================

const KATEGORI_BADGE = {
    sangat_baik: 'bg-emerald-100 text-emerald-700',
    baik:        'bg-green-100 text-green-700',
    cukup:       'bg-yellow-100 text-yellow-700',
    rendah:      'bg-orange-100 text-orange-700',
    berisiko:    'bg-red-100 text-red-700',
};

const KATEGORI_NAMA = {
    sangat_baik: 'Sangat Baik',
    baik:        'Baik',
    cukup:       'Cukup',
    rendah:      'Rendah',
    berisiko:    'Berisiko',
};

const LABEL_PENYAKIT = {
    tidak_ada: 'Tidak Ada',
    mild:      'Ringan',
    moderate:  'Sedang',
    severe:    'Parah',
};

const LABEL_PEMUPUKAN = {
    ikut_rekomendasi_3x:    'Ikut Rekomendasi 3×',
    ikut_kurang_3x:         'Ikut Rekomendasi < 3×',
    tidak_ikut_3x:          'Tidak Ikut, 3×',
    tidak_ikut_kurang_3x:   'Tidak Ikut, < 3×',
    tidak_pernah:           'Tidak Pernah',
};

const LABEL_AIR = {
    irigasi_baik:   'Irigasi Teknis (Baik)',
    irigasi_cukup:  'Irigasi Teknis (Cukup)',
    tadah_baik:     'Tadah Hujan (Baik)',
    tadah_cukup:    'Tadah Hujan (Cukup)',
    kurang:         'Kurang / Kering',
};

const LABEL_CUACA = {
    normal:     'Normal',
    banjir:     'Banjir',
    kekeringan: 'Kekeringan',
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

// ============================================================
// Komponen Hasil Prediksi Panen
// ============================================================

function HasilPrediksi({ result }) {
    const badgeClass = KATEGORI_BADGE[result.kategori] ?? 'bg-gray-100 text-gray-700';
    const namaKategori = KATEGORI_NAMA[result.kategori] ?? result.kategori_label;

    // Pisah faktor risiko yang negatif (komponen buruk)
    const faktorNegatif = (result.faktor_risiko ?? []).filter(
        (f) => f.dampak === 'negatif' || f.tipe === 'negatif' || f.is_negative === true
    );

    // Jika tidak ada field dampak/tipe, tampilkan semua faktor_risiko
    const tampilFaktor = faktorNegatif.length > 0 ? faktorNegatif : (result.faktor_risiko ?? []);

    return (
        <div className="space-y-4">
            {/* Card Utama — Hasil Prediksi */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Hasil Prediksi Panen
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-white">{namaKategori}</h2>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${badgeClass}`}>
                            {result.kategori}
                        </span>
                    </div>
                    <p className="text-emerald-100 text-sm mt-0.5">{result.kategori_label}</p>
                </div>

                {/* Statistik */}
                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Estimasi Hasil</p>
                        <p className="text-xl font-black text-gray-900">
                            {typeof result.estimasi_ton_ha === 'number'
                                ? result.estimasi_ton_ha.toFixed(2)
                                : result.estimasi_ton_ha}{' '}
                            <span className="text-sm font-semibold text-gray-500">ton/ha</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">produktivitas per hektare</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Total Panen</p>
                        <p className="text-xl font-black text-gray-900">
                            {typeof result.estimasi_total_ton === 'number'
                                ? result.estimasi_total_ton.toFixed(2)
                                : result.estimasi_total_ton}{' '}
                            <span className="text-sm font-semibold text-gray-500">ton</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">total estimasi panen</p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Estimasi Pendapatan</p>
                        <p className="text-xl font-black text-gray-900">
                            Rp {Number(result.estimasi_pendapatan).toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">perkiraan nilai jual</p>
                    </div>
                </div>

                {/* Tombol ke Limbah */}
                <div className="px-6 pb-5">
                    <Link
                        href={route('petani.spk.limbah')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                    >
                        Rencanakan Pengolahan Limbah
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Faktor Risiko */}
            {tampilFaktor.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-orange-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-base font-bold text-gray-900">Faktor Risiko</h3>
                    </div>
                    <ul className="divide-y divide-gray-50">
                        {tampilFaktor.map((faktor, idx) => (
                            <li key={idx} className="px-6 py-3.5 flex items-start gap-3">
                                <span className="mt-0.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{faktor.faktor ?? faktor.nama ?? faktor.label}</p>
                                    {(faktor.keterangan ?? faktor.deskripsi) && (
                                        <p className="text-xs text-gray-500 mt-0.5">{faktor.keterangan ?? faktor.deskripsi}</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

// ============================================================
// Halaman Utama
// ============================================================

export default function Panen({ lahans, varietyRefs, prefill, result }) {
    const { data, setData, post, processing, errors } = useForm({
        lahan_id:               '',
        variety_id:             '',
        kondisi_penyakit:       '',
        kesesuaian_pemupukan:   '',
        ketersediaan_air:       '',
        kondisi_cuaca:          '',
    });

    const [autofilled, setAutofilled] = useState(false);

    // Saat lahan dipilih: auto-fill kondisi_penyakit dari prefill
    function handleLahanChange(e) {
        const lahanId = e.target.value;
        const updates = { lahan_id: lahanId, kondisi_penyakit: '' };

        let didAutofill = false;

        if (lahanId && prefill) {
            const pre = prefill[lahanId];
            if (pre?.kondisi_penyakit) {
                updates.kondisi_penyakit = pre.kondisi_penyakit;
                didAutofill = true;
            }
        }

        setData((prev) => ({ ...prev, ...updates }));
        setAutofilled(didAutofill);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('petani.spk.panen.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="SPK Prediksi Panen" />

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Prediksi Hasil Panen</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Prediksi hasil panen berbasis Regresi Linear Berganda dengan koefisien dari literatur agronomi padi.
                    </p>
                </div>

                {/* Hasil Prediksi — tampil di atas form jika ada */}
                {result && <HasilPrediksi result={result} />}

                {/* Form Input */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Data Input</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Isi kondisi pertanaman untuk mendapatkan prediksi panen.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                        {/* Badge autofill */}
                        {autofilled && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Kondisi penyakit terisi otomatis dari scan terbaru
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

                        {/* Varietas Padi */}
                        <FormField label="Varietas Padi" required error={errors.variety_id}>
                            <SelectField
                                value={data.variety_id}
                                onChange={(e) => setData('variety_id', e.target.value)}
                                error={errors.variety_id}
                            >
                                <option value="">— Pilih Varietas —</option>
                                {(varietyRefs ?? []).map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.nama}
                                        {v.potensi_hasil_ton_ha != null
                                            ? ` (potensi ${v.potensi_hasil_ton_ha} ton/ha)`
                                            : ''}
                                    </option>
                                ))}
                            </SelectField>
                        </FormField>

                        {/* Kondisi Penyakit */}
                        <FormField label="Kondisi Penyakit" required error={errors.kondisi_penyakit}>
                            <SelectField
                                value={data.kondisi_penyakit}
                                onChange={(e) => setData('kondisi_penyakit', e.target.value)}
                                error={errors.kondisi_penyakit}
                            >
                                <option value="">— Pilih Kondisi Penyakit —</option>
                                {Object.entries(LABEL_PENYAKIT).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </SelectField>
                            {autofilled && data.kondisi_penyakit && (
                                <p className="mt-1 text-xs text-gray-400">Terisi dari data scan terbaru</p>
                            )}
                        </FormField>

                        {/* Kesesuaian Pemupukan */}
                        <FormField label="Kesesuaian Pemupukan" required error={errors.kesesuaian_pemupukan}>
                            <SelectField
                                value={data.kesesuaian_pemupukan}
                                onChange={(e) => setData('kesesuaian_pemupukan', e.target.value)}
                                error={errors.kesesuaian_pemupukan}
                            >
                                <option value="">— Pilih Kesesuaian Pemupukan —</option>
                                {Object.entries(LABEL_PEMUPUKAN).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </SelectField>
                        </FormField>

                        {/* Ketersediaan Air */}
                        <FormField label="Ketersediaan Air" required error={errors.ketersediaan_air}>
                            <SelectField
                                value={data.ketersediaan_air}
                                onChange={(e) => setData('ketersediaan_air', e.target.value)}
                                error={errors.ketersediaan_air}
                            >
                                <option value="">— Pilih Ketersediaan Air —</option>
                                {Object.entries(LABEL_AIR).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </SelectField>
                        </FormField>

                        {/* Kondisi Cuaca */}
                        <FormField label="Kondisi Cuaca" required error={errors.kondisi_cuaca}>
                            <SelectField
                                value={data.kondisi_cuaca}
                                onChange={(e) => setData('kondisi_cuaca', e.target.value)}
                                error={errors.kondisi_cuaca}
                            >
                                <option value="">— Pilih Kondisi Cuaca —</option>
                                {Object.entries(LABEL_CUACA).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </SelectField>
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
                                        Prediksi Hasil Panen
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
