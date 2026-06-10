import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Mapping nama pupuk dari kode alternatif
const NAMA_PUPUK = {
    A1: 'Urea + SP36 + KCl',
    A2: 'NPK Phonska',
    A3: 'Urea + Kompos',
    A4: 'Pupuk Organik Penuh',
    A5: 'Pupuk Daun (Foliar)',
    A6: 'Tunda + Penanganan OPT',
};

const LABEL_FASE = {
    vegetatif_awal:   'Vegetatif Awal (HST 1-14)',
    vegetatif_aktif:  'Vegetatif Aktif (HST 15-45)',
    reproduktif:      'Reproduktif (HST 46-65)',
    pemasakan:        'Pemasakan (HST 66+)',
};

const LABEL_PENYAKIT = {
    healthy:  'Sehat (Tidak Ada Penyakit)',
    mild:     'Ringan',
    moderate: 'Sedang',
    severe:   'Parah',
};

const LABEL_AIR = {
    baik:   'Baik',
    cukup:  'Cukup',
    kurang: 'Kurang',
};

const LABEL_TANAH = {
    lempung: 'Tanah Lempung',
    liat:    'Tanah Liat',
    pasir:   'Tanah Pasir',
};

const LABEL_RIWAYAT = {
    belum_pupuk:     'Belum Pernah Pupuk',
    sudah_dasar:     'Sudah Pupuk Dasar',
    sudah_susulan1:  'Sudah Susulan 1',
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
// Komponen Hasil Rekomendasi
// ============================================================

function HasilRekomendasi({ result }) {
    const detail = result.detail_pupuk ?? result.fuzzy_result ?? {};

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                        Fuzzy Logic (FIS) — Defuzzifikasi Centroid
                    </span>
                    <h2 className="text-2xl font-black text-white">{result.nama_pupuk}</h2>
                    <p className="text-emerald-100 text-sm mt-0.5">{detail.jadwal_aplikasi}</p>
                </div>

                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Urea (N)</p>
                        <p className="text-xl font-black text-gray-900">
                            {Number(detail.dosis_urea_per_ha ?? 0).toFixed(1)}{' '}
                            <span className="text-sm font-semibold text-gray-500">kg/ha</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Total: {Number(detail.total_urea_kg ?? 0).toFixed(1)} kg</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Fosfor (SP36)</p>
                        <p className="text-xl font-black text-gray-900">
                            {Number(detail.dosis_fosfor_per_ha ?? 0).toFixed(1)}{' '}
                            <span className="text-sm font-semibold text-gray-500">kg/ha</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Total: {Number(detail.total_fosfor_kg ?? 0).toFixed(1)} kg</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Kalium (KCl)</p>
                        <p className="text-xl font-black text-gray-900">
                            {Number(detail.dosis_kalium_per_ha ?? 0).toFixed(1)}{' '}
                            <span className="text-sm font-semibold text-gray-500">kg/ha</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Total: {Number(detail.total_kalium_kg ?? 0).toFixed(1)} kg</p>
                    </div>
                </div>

                <div className="px-6 pb-4">
                    <div className="bg-amber-50 rounded-xl p-4 inline-block min-w-[200px]">
                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Estimasi Biaya</p>
                        <p className="text-xl font-black text-gray-900">Rp {Number(result.estimasi_biaya).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-gray-500 mt-0.5">untuk {result.luas_m2 ? (result.luas_m2 / 10000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 }) : 0} Ha</p>
                    </div>
                </div>

                <div className="px-6 pb-5">
                    <Link href={route('petani.spk.panen')} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm">
                        Prediksi Panen
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// Komponen Riwayat Rekomendasi
// ============================================================

function RiwayatRekomendasi({ previousRecs, onViewDetail }) {
    if (!previousRecs || previousRecs.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Riwayat Rekomendasi</h3>
                <p className="text-xs text-gray-500 mt-0.5">5 rekomendasi terakhir Anda.</p>
            </div>
            <div className="divide-y divide-gray-50">
                {previousRecs.map((rec) => (
                    <div key={rec.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {NAMA_PUPUK[rec.rekomendasi] ?? rec.rekomendasi}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {rec.lahan?.nama_lahan ?? 'Tanpa Lahan'}
                                    {' · '}
                                    {new Date(rec.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                            <p className="text-sm font-bold text-gray-800">
                                Rp {Number(rec.estimasi_biaya).toLocaleString('id-ID')}
                            </p>
                            <button
                                onClick={() => onViewDetail(rec)}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================================
// Halaman Utama
// ============================================================

export default function Pupuk({ lahans, prefill, previous_recs, result }) {
    const [selectedHistory, setSelectedHistory] = useState(null);
    const historyResult = selectedHistory ? {
        ...selectedHistory,
        nama_pupuk: NAMA_PUPUK[selectedHistory.rekomendasi] ?? selectedHistory.rekomendasi,
        luas_m2: selectedHistory.lahan?.luas_m2 ?? 0,
    } : null;

    const { data, setData, post, processing, errors } = useForm({
        lahan_id:           '',
        fase_pertumbuhan:   '',
        kondisi_penyakit:   '',
        ketersediaan_air:   '',
        jenis_tanah:        '',
        riwayat_pemupukan:  '',
    });

    // Lacak apakah field terisi dari prefill supaya bisa tampil badge
    const [autofilled, setAutofilled] = useState(false);

    // Saat lahan dipilih: auto-fill jenis_tanah, fase, kondisi_penyakit dari prefill
    function handleLahanChange(e) {
        const lahanId = e.target.value;
        const updates = { lahan_id: lahanId, jenis_tanah: '', fase_pertumbuhan: '', kondisi_penyakit: '' };

        let didAutofill = false;

        if (lahanId) {
            // Ambil jenis_tanah dari lahans
            const lahan = lahans.find((l) => String(l.id) === String(lahanId));
            if (lahan) {
                updates.jenis_tanah = lahan.jenis_tanah ?? '';
            }

            // Ambil fase & kondisi dari prefill
            const pre = prefill && prefill[lahanId];
            if (pre) {
                if (pre.fase_pertumbuhan) {
                    updates.fase_pertumbuhan = pre.fase_pertumbuhan;
                    didAutofill = true;
                }
                if (pre.kondisi_penyakit) {
                    updates.kondisi_penyakit = pre.kondisi_penyakit;
                    didAutofill = true;
                }
            }
        }

        setData((prev) => ({ ...prev, ...updates }));
        setAutofilled(didAutofill);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('petani.spk.pupuk.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="SPK Rekomendasi Pupuk" />

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rekomendasi Pupuk</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Sistem Fuzzy Logic (FIS) untuk menghitung dosis pupuk Urea, Fosfor, dan Kalium sesuai kondisi lahan Anda.
                    </p>
                </div>

                {/* Hasil Rekomendasi — tampil di atas form jika ada */}
                {result && <HasilRekomendasi result={result} />}

                {/* Form Input */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Data Input</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Isi kondisi lahan untuk mendapatkan rekomendasi pupuk.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                        {/* Badge autofill */}
                        {autofilled && (
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-medium">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Terisi otomatis dari data tanam/scan terbaru
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

                        {/* Fase Pertumbuhan */}
                        <FormField label="Fase Pertumbuhan" required error={errors.fase_pertumbuhan}>
                            <SelectField
                                value={data.fase_pertumbuhan}
                                onChange={(e) => setData('fase_pertumbuhan', e.target.value)}
                                error={errors.fase_pertumbuhan}
                            >
                                <option value="">— Pilih Fase —</option>
                                {Object.entries(LABEL_FASE).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
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
                                <option value="">— Pilih Kondisi —</option>
                                {Object.entries(LABEL_PENYAKIT).map(([val, label]) => (
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

                        {/* Jenis Tanah */}
                        <FormField label="Jenis Tanah" required error={errors.jenis_tanah}>
                            <SelectField
                                value={data.jenis_tanah}
                                onChange={(e) => setData('jenis_tanah', e.target.value)}
                                error={errors.jenis_tanah}
                            >
                                <option value="">— Pilih Jenis Tanah —</option>
                                {Object.entries(LABEL_TANAH).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </SelectField>
                            {data.lahan_id && data.jenis_tanah && (
                                <p className="mt-1 text-xs text-gray-400">Terisi dari data lahan</p>
                            )}
                        </FormField>

                        {/* Riwayat Pemupukan */}
                        <FormField label="Riwayat Pemupukan" required error={errors.riwayat_pemupukan}>
                            <SelectField
                                value={data.riwayat_pemupukan}
                                onChange={(e) => setData('riwayat_pemupukan', e.target.value)}
                                error={errors.riwayat_pemupukan}
                            >
                                <option value="">— Pilih Riwayat —</option>
                                {Object.entries(LABEL_RIWAYAT).map(([val, label]) => (
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
                                        Dapatkan Rekomendasi Pupuk
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Riwayat */}
                <RiwayatRekomendasi previousRecs={previous_recs} onViewDetail={setSelectedHistory} />

            </div>

            {/* Modal Detail Riwayat */}
            {selectedHistory && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4"
                    onClick={() => setSelectedHistory(null)}
                >
                    <div
                        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 pt-6 pb-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                                        Fuzzy Logic (FIS)
                                    </span>
                                    <h3 className="text-xl font-black text-white leading-tight">{historyResult?.nama_pupuk}</h3>
                                    <p className="text-emerald-100 text-xs mt-1">
                                        {new Date(selectedHistory.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedHistory(null)}
                                    className="shrink-0 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Dosis Grid */}
                        <div className="px-6 py-5">
                            {(() => {
                                const det = historyResult?.detail_pupuk ?? historyResult?.fuzzy_result ?? {};
                                return (
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        <div className="bg-emerald-50 rounded-2xl p-3.5 text-center">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1">Urea (N)</p>
                                            <p className="text-lg font-black text-gray-900">{Number(det.dosis_urea_per_ha ?? 0).toFixed(1)}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold">kg/ha</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{Number(det.total_urea_kg ?? 0).toFixed(1)} kg total</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-2xl p-3.5 text-center">
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">Fosfor</p>
                                            <p className="text-lg font-black text-gray-900">{Number(det.dosis_fosfor_per_ha ?? 0).toFixed(1)}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold">kg/ha</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{Number(det.total_fosfor_kg ?? 0).toFixed(1)} kg total</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-2xl p-3.5 text-center">
                                            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-1">Kalium</p>
                                            <p className="text-lg font-black text-gray-900">{Number(det.dosis_kalium_per_ha ?? 0).toFixed(1)}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold">kg/ha</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{Number(det.total_kalium_kg ?? 0).toFixed(1)} kg total</p>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Estimasi Biaya & Lahan */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-amber-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1">Estimasi Biaya</p>
                                    <p className="text-base font-black text-gray-900">Rp {Number(historyResult?.estimasi_biaya ?? 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Luas Lahan</p>
                                    <p className="text-base font-black text-gray-900">
                                        {historyResult?.luas_m2 ? (historyResult.luas_m2 / 10000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 }) : 0} Ha
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => setSelectedHistory(null)}
                                className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
