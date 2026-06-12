import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PiArrowRight, PiX } from 'react-icons/pi';

const NAMA_PUPUK = {
    A1: 'Urea + SP36 + KCl',
    A2: 'NPK Phonska',
    A3: 'Urea + Kompos',
    A4: 'Pupuk Organik Penuh',
    A5: 'Pupuk Daun (Foliar)',
    A6: 'Tunda + Penanganan Hama',
};

const LABEL_FASE = {
    vegetatif_awal:  'Vegetatif Awal (1–14 HST)',
    vegetatif_aktif: 'Vegetatif Aktif (15–45 HST)',
    reproduktif:     'Reproduktif (46–65 HST)',
    pemasakan:       'Pemasakan (66 HST ke atas)',
};

const LABEL_PENYAKIT = {
    healthy:  'Tidak Ada Penyakit',
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
    belum_pupuk:    'Belum Pernah Dipupuk',
    sudah_dasar:    'Sudah Pupuk Dasar',
    sudah_susulan1: 'Sudah Susulan 1',
};

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
            className={`w-full h-[38px] border px-3 text-[14px] text-zinc-900 bg-white rounded-[7px] outline-none transition-all
                disabled:bg-zinc-50 disabled:text-zinc-400
                hover:border-zinc-400
                focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/10
                ${error ? 'border-red-400' : 'border-zinc-300'}`}
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
                <span className="text-[22px] font-semibold text-zinc-900 leading-none" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {value}
                </span>
                {unit && <span className="text-[13px] text-zinc-500">{unit}</span>}
            </div>
            {subtext && <p className="text-[12px] text-zinc-400 mt-1">{subtext}</p>}
        </div>
    );
}

function HasilRekomendasi({ result }) {
    const detail = result.detail_pupuk ?? result.fuzzy_result ?? {};
    const luasHa = result.luas_m2 ? (result.luas_m2 / 10000) : 0;

    return (
        <div className="bg-white border border-zinc-200 border-l-[3px] border-l-[#166534] rounded-[10px] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mb-1.5">
                    Rekomendasi Pupuk
                </p>
                <h2 className="text-[20px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {result.nama_pupuk}
                </h2>
                {detail.jadwal_aplikasi && (
                    <p className="text-[13px] text-zinc-500 mt-0.5">{detail.jadwal_aplikasi}</p>
                )}
            </div>

            <div className="px-5 py-4">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.05em] mb-3">Dosis Pupuk</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MetricCard
                        label="Urea (N)"
                        value={Number(detail.dosis_urea_per_ha ?? 0).toFixed(1)}
                        unit="kg/ha"
                        subtext={`Total: ${Number(detail.total_urea_kg ?? 0).toFixed(1)} kg`}
                    />
                    <MetricCard
                        label="Fosfor (SP36)"
                        value={Number(detail.dosis_fosfor_per_ha ?? 0).toFixed(1)}
                        unit="kg/ha"
                        subtext={`Total: ${Number(detail.total_fosfor_kg ?? 0).toFixed(1)} kg`}
                    />
                    <MetricCard
                        label="Kalium (KCl)"
                        value={Number(detail.dosis_kalium_per_ha ?? 0).toFixed(1)}
                        unit="kg/ha"
                        subtext={`Total: ${Number(detail.total_kalium_kg ?? 0).toFixed(1)} kg`}
                    />
                </div>
            </div>

            <div className="px-5 pb-5">
                <div className="h-px bg-zinc-100 mb-4" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-[8px] p-4 sm:min-w-[200px]">
                        <p className="text-[12px] font-medium text-zinc-500 uppercase tracking-[0.05em] mb-1.5">Estimasi Biaya</p>
                        <p className="text-[20px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Rp {Number(result.estimasi_biaya).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[12px] text-zinc-400 mt-1">
                            untuk {luasHa.toLocaleString('id-ID', { maximumFractionDigits: 4 })} Ha
                        </p>
                    </div>
                    <Link
                        href={route('petani.spk.panen')}
                        className="inline-flex items-center gap-2 bg-[#166534] text-white text-[14px] font-medium px-[18px] py-[9px] rounded-[7px] hover:bg-[#15803d] transition-colors shrink-0"
                    >
                        Perkiraan Hasil Panen
                        <PiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function RiwayatRekomendasi({ previousRecs, onViewDetail }) {
    if (!previousRecs || previousRecs.length === 0) return null;

    return (
        <div className="bg-white border border-zinc-200 rounded-[10px] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
                <h3 className="text-[15px] font-medium text-zinc-900">Riwayat Rekomendasi</h3>
                <p className="text-[13px] text-zinc-500 mt-0.5">5 rekomendasi terakhir</p>
            </div>
            <div className="divide-y divide-zinc-50">
                {previousRecs.map((rec) => (
                    <div key={rec.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[14px] font-medium text-zinc-900 truncate">
                                {NAMA_PUPUK[rec.rekomendasi] ?? rec.rekomendasi}
                            </p>
                            <p className="text-[13px] text-zinc-500">
                                {rec.lahan?.nama_lahan ?? 'Tanpa Lahan'}
                                {' · '}
                                {new Date(rec.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                })}
                            </p>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                            <p className="text-[14px] font-medium text-zinc-800">
                                Rp {Number(rec.estimasi_biaya).toLocaleString('id-ID')}
                            </p>
                            <button
                                onClick={() => onViewDetail(rec)}
                                className="text-[12px] font-medium text-[#166534] hover:text-[#15803d] transition-colors"
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

export default function Pupuk({ lahans, prefill, previous_recs, result }) {
    const [selectedHistory, setSelectedHistory] = useState(null);
    const historyResult = selectedHistory ? {
        ...selectedHistory,
        nama_pupuk: NAMA_PUPUK[selectedHistory.rekomendasi] ?? selectedHistory.rekomendasi,
        luas_m2: selectedHistory.lahan?.luas_m2 ?? 0,
    } : null;

    const { data, setData, post, processing, errors } = useForm({
        lahan_id:          '',
        fase_pertumbuhan:  '',
        kondisi_penyakit:  '',
        ketersediaan_air:  '',
        jenis_tanah:       '',
        riwayat_pemupukan: '',
    });

    const [autofilled, setAutofilled] = useState(false);

    function handleLahanChange(e) {
        const lahanId = e.target.value;
        const updates = { lahan_id: lahanId, jenis_tanah: '', fase_pertumbuhan: '', kondisi_penyakit: '' };
        let didAutofill = false;

        if (lahanId) {
            const lahan = lahans.find((l) => String(l.id) === String(lahanId));
            if (lahan) updates.jenis_tanah = lahan.jenis_tanah ?? '';

            const pre = prefill && prefill[lahanId];
            if (pre) {
                if (pre.fase_pertumbuhan) { updates.fase_pertumbuhan = pre.fase_pertumbuhan; didAutofill = true; }
                if (pre.kondisi_penyakit) { updates.kondisi_penyakit = pre.kondisi_penyakit; didAutofill = true; }
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
            <Head title="Rekomendasi Pupuk" />

            {/* ── Page Header ── */}
            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Rekomendasi Pupuk
                </h1>
                <p className="text-[13px] text-green-200">
                    Masukkan kondisi lahanmu untuk mendapatkan rekomendasi jenis dan dosis pupuk yang tepat.
                </p>
            </div>

            {/* ── 2-Kolom: Form Kiri | Hasil Kanan ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Form — 2/5 */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-zinc-200 rounded-xl">
                        <div className="px-5 py-4 border-b border-zinc-100">
                            <h2 className="text-[15px] font-medium text-zinc-900">Isi Data Lahan</h2>
                            <p className="text-[13px] text-zinc-500 mt-0.5">Sesuaikan dengan kondisi riil di lapangan.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                            {autofilled && (
                                <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-3.5 py-2.5 rounded-lg text-[12px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0" />
                                    Data terisi otomatis dari catatan terbaru
                                </div>
                            )}

                            <FormField label="Pilih Lahan" error={errors.lahan_id}>
                                <SelectField value={data.lahan_id} onChange={handleLahanChange} error={errors.lahan_id}>
                                    <option value="">— Tanpa Lahan —</option>
                                    {lahans.map((lahan) => (
                                        <option key={lahan.id} value={lahan.id}>
                                            {lahan.nama_lahan} ({lahan.luas_m2 ? (lahan.luas_m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : 0} Ha)
                                        </option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <FormField label="Fase Pertumbuhan" required error={errors.fase_pertumbuhan}>
                                <SelectField value={data.fase_pertumbuhan} onChange={(e) => setData('fase_pertumbuhan', e.target.value)} error={errors.fase_pertumbuhan}>
                                    <option value="">— Pilih Fase —</option>
                                    {Object.entries(LABEL_FASE).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <FormField label="Kondisi Penyakit" required error={errors.kondisi_penyakit}>
                                <SelectField value={data.kondisi_penyakit} onChange={(e) => setData('kondisi_penyakit', e.target.value)} error={errors.kondisi_penyakit}>
                                    <option value="">— Pilih Kondisi —</option>
                                    {Object.entries(LABEL_PENYAKIT).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <FormField label="Ketersediaan Air" required error={errors.ketersediaan_air}>
                                <SelectField value={data.ketersediaan_air} onChange={(e) => setData('ketersediaan_air', e.target.value)} error={errors.ketersediaan_air}>
                                    <option value="">— Pilih Ketersediaan Air —</option>
                                    {Object.entries(LABEL_AIR).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <FormField label="Jenis Tanah" required error={errors.jenis_tanah}>
                                <SelectField value={data.jenis_tanah} onChange={(e) => setData('jenis_tanah', e.target.value)} error={errors.jenis_tanah}>
                                    <option value="">— Pilih Jenis Tanah —</option>
                                    {Object.entries(LABEL_TANAH).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                                {data.lahan_id && data.jenis_tanah && (
                                    <p className="mt-1 text-[12px] text-zinc-400">Terisi dari data lahan</p>
                                )}
                            </FormField>

                            <FormField label="Riwayat Pemupukan" required error={errors.riwayat_pemupukan}>
                                <SelectField value={data.riwayat_pemupukan} onChange={(e) => setData('riwayat_pemupukan', e.target.value)} error={errors.riwayat_pemupukan}>
                                    <option value="">— Pilih Riwayat —</option>
                                    {Object.entries(LABEL_RIWAYAT).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#166534] text-white text-[14px] font-medium px-4 py-[10px] rounded-lg hover:bg-[#15803d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Memproses...' : 'Dapatkan Rekomendasi'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hasil — 3/5 */}
                <div className="lg:col-span-3 space-y-4">
                    {result ? (
                        <HasilRekomendasi result={result} />
                    ) : (
                        <div className="bg-white border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[320px]">
                            <div className="w-12 h-12 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[14px] font-medium text-zinc-700 mb-1">Hasil Rekomendasi</p>
                            <p className="text-[13px] text-zinc-400">Isi form di sebelah kiri untuk mendapatkan rekomendasi pupuk.</p>
                        </div>
                    )}

                    <RiwayatRekomendasi previousRecs={previous_recs} onViewDetail={setSelectedHistory} />
                </div>
            </div>

            {selectedHistory && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4"
                    onClick={() => setSelectedHistory(null)}
                >
                    <div
                        className="bg-white rounded-[10px] w-full max-w-[480px] overflow-hidden shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-zinc-100">
                            <div>
                                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mb-1">Riwayat Rekomendasi</p>
                                <h3 className="text-[17px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                    {historyResult?.nama_pupuk}
                                </h3>
                                <p className="text-[13px] text-zinc-500 mt-0.5">
                                    {new Date(selectedHistory.created_at).toLocaleDateString('id-ID', {
                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedHistory(null)}
                                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-[7px] text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                            >
                                <PiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="px-5 py-4 space-y-3">
                            {(() => {
                                const det = historyResult?.detail_pupuk ?? historyResult?.fuzzy_result ?? {};
                                return (
                                    <div className="grid grid-cols-3 gap-3">
                                        <MetricCard label="Urea (N)" value={Number(det.dosis_urea_per_ha ?? 0).toFixed(1)} unit="kg/ha" subtext={`${Number(det.total_urea_kg ?? 0).toFixed(1)} kg total`} />
                                        <MetricCard label="Fosfor" value={Number(det.dosis_fosfor_per_ha ?? 0).toFixed(1)} unit="kg/ha" subtext={`${Number(det.total_fosfor_kg ?? 0).toFixed(1)} kg total`} />
                                        <MetricCard label="Kalium" value={Number(det.dosis_kalium_per_ha ?? 0).toFixed(1)} unit="kg/ha" subtext={`${Number(det.total_kalium_kg ?? 0).toFixed(1)} kg total`} />
                                    </div>
                                );
                            })()}

                            <div className="grid grid-cols-2 gap-3">
                                <MetricCard
                                    label="Estimasi Biaya"
                                    value={`Rp ${Number(historyResult?.estimasi_biaya ?? 0).toLocaleString('id-ID')}`}
                                />
                                <MetricCard
                                    label="Luas Lahan"
                                    value={`${historyResult?.luas_m2 ? (historyResult.luas_m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : 0} Ha`}
                                />
                            </div>
                        </div>

                        <div className="px-5 pb-5">
                            <button
                                onClick={() => setSelectedHistory(null)}
                                className="w-full bg-zinc-900 text-white text-[14px] font-medium py-[9px] rounded-[7px] hover:bg-zinc-800 transition-colors"
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
