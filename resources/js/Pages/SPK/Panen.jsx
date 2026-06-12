import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PiArrowRight, PiWarningCircle } from 'react-icons/pi';

const KATEGORI_BADGE = {
    sangat_baik: 'bg-[#dcfce7] text-[#166534]',
    baik:        'bg-[#dcfce7] text-[#166534]',
    cukup:       'bg-[#fef3c7] text-[#92400e]',
    rendah:      'bg-[#ffedd5] text-[#9a3412]',
    berisiko:    'bg-[#fee2e2] text-[#991b1b]',
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
    ikut_rekomendasi_3x:  'Ikut Rekomendasi, 3× atau lebih',
    ikut_kurang_3x:       'Ikut Rekomendasi, kurang dari 3×',
    tidak_ikut_3x:        'Tidak Ikut Rekomendasi, 3×',
    tidak_ikut_kurang_3x: 'Tidak Ikut Rekomendasi, kurang dari 3×',
    tidak_pernah:         'Tidak Pernah Dipupuk',
};

const LABEL_AIR = {
    irigasi_baik:  'Irigasi Teknis (Baik)',
    irigasi_cukup: 'Irigasi Teknis (Cukup)',
    tadah_baik:    'Tadah Hujan (Baik)',
    tadah_cukup:   'Tadah Hujan (Cukup)',
    kurang:        'Kurang / Kering',
};

const LABEL_CUACA = {
    normal:     'Normal',
    banjir:     'Banjir',
    kekeringan: 'Kekeringan',
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

function HasilPrediksi({ result }) {
    const badgeClass = KATEGORI_BADGE[result.kategori] ?? 'bg-zinc-100 text-zinc-700';
    const namaKategori = KATEGORI_NAMA[result.kategori] ?? result.kategori_label;

    const faktorNegatif = (result.faktor_risiko ?? []).filter(
        (f) => f.dampak === 'negatif' || f.tipe === 'negatif' || f.is_negative === true
    );
    const tampilFaktor = faktorNegatif.length > 0 ? faktorNegatif : (result.faktor_risiko ?? []);

    return (
        <div className="space-y-4">
            <div className="bg-white border border-zinc-200 border-l-[3px] border-l-[#166534] rounded-[10px] overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-100">
                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.06em] mb-1.5">
                        Perkiraan Hasil Panen
                    </p>
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[20px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {namaKategori}
                        </h2>
                        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
                            {namaKategori}
                        </span>
                    </div>
                    {result.kategori_label && (
                        <p className="text-[13px] text-zinc-500 mt-0.5">{result.kategori_label}</p>
                    )}
                </div>

                <div className="px-5 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <MetricCard
                            label="Estimasi Hasil"
                            value={typeof result.estimasi_ton_ha === 'number' ? result.estimasi_ton_ha.toFixed(2) : result.estimasi_ton_ha}
                            unit="ton/ha"
                            subtext="produktivitas per hektare"
                        />
                        <MetricCard
                            label="Total Panen"
                            value={typeof result.estimasi_total_ton === 'number' ? result.estimasi_total_ton.toFixed(2) : result.estimasi_total_ton}
                            unit="ton"
                            subtext="estimasi total panen"
                        />
                        <MetricCard
                            label="Estimasi Pendapatan"
                            value={`Rp ${Number(result.estimasi_pendapatan).toLocaleString('id-ID')}`}
                            subtext="perkiraan nilai jual"
                        />
                    </div>
                </div>

                <div className="px-5 pb-5">
                    <Link
                        href={route('petani.spk.limbah')}
                        className="inline-flex items-center gap-2 bg-[#166534] text-white text-[14px] font-medium px-[18px] py-[9px] rounded-[7px] hover:bg-[#15803d] transition-colors"
                    >
                        Rencanakan Pengelolaan Limbah
                        <PiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {tampilFaktor.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-[10px] overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
                        <PiWarningCircle weight="fill" className="w-4 h-4 text-amber-500 shrink-0" />
                        <h3 className="text-[15px] font-medium text-zinc-900">Faktor yang Mempengaruhi Hasil</h3>
                    </div>
                    <ul className="divide-y divide-zinc-50">
                        {tampilFaktor.map((faktor, idx) => (
                            <li key={idx} className="px-5 py-3.5 flex items-start gap-3">
                                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                <div>
                                    <p className="text-[14px] font-medium text-zinc-800">
                                        {faktor.faktor ?? faktor.nama ?? faktor.label}
                                    </p>
                                    {(faktor.keterangan ?? faktor.deskripsi) && (
                                        <p className="text-[13px] text-zinc-500 mt-0.5">
                                            {faktor.keterangan ?? faktor.deskripsi}
                                        </p>
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

export default function Panen({ lahans, varietyRefs, prefill, result }) {
    const { data, setData, post, processing, errors } = useForm({
        lahan_id:             '',
        variety_id:           '',
        kondisi_penyakit:     '',
        kesesuaian_pemupukan: '',
        ketersediaan_air:     '',
        kondisi_cuaca:        '',
    });

    const [autofilled, setAutofilled] = useState(false);

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
            <Head title="Perkiraan Hasil Panen" />

            {/* ── Page Header ── */}
            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Perkiraan Hasil Panen
                </h1>
                <p className="text-[13px] text-green-200">
                    Masukkan kondisi pertanamanmu untuk memperkirakan hasil dan pendapatan musim ini.
                </p>
            </div>

            {/* ── 2-Kolom: Form Kiri | Hasil Kanan ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Form — 2/5 */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-zinc-200 rounded-xl">
                        <div className="px-5 py-4 border-b border-zinc-100">
                            <h2 className="text-[15px] font-medium text-zinc-900">Isi Data Pertanaman</h2>
                            <p className="text-[13px] text-zinc-500 mt-0.5">Sesuaikan dengan kondisi di lapangan.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                            {autofilled && (
                                <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-3.5 py-2.5 rounded-lg text-[12px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#166534] shrink-0" />
                                    Kondisi penyakit terisi otomatis dari hasil scan terbaru
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

                            <FormField label="Varietas Padi" required error={errors.variety_id}>
                                <SelectField value={data.variety_id} onChange={(e) => setData('variety_id', e.target.value)} error={errors.variety_id}>
                                    <option value="">— Pilih Varietas —</option>
                                    {(varietyRefs ?? []).map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.nama}{v.potensi_hasil_ton_ha != null ? ` (potensi ${v.potensi_hasil_ton_ha} ton/ha)` : ''}
                                        </option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <FormField label="Kondisi Penyakit" required error={errors.kondisi_penyakit}>
                                <SelectField value={data.kondisi_penyakit} onChange={(e) => setData('kondisi_penyakit', e.target.value)} error={errors.kondisi_penyakit}>
                                    <option value="">— Pilih Kondisi Penyakit —</option>
                                    {Object.entries(LABEL_PENYAKIT).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                                {autofilled && data.kondisi_penyakit && (
                                    <p className="mt-1 text-[12px] text-zinc-400">Terisi dari data scan terbaru</p>
                                )}
                            </FormField>

                            <FormField label="Kesesuaian Pemupukan" required error={errors.kesesuaian_pemupukan}>
                                <SelectField value={data.kesesuaian_pemupukan} onChange={(e) => setData('kesesuaian_pemupukan', e.target.value)} error={errors.kesesuaian_pemupukan}>
                                    <option value="">— Pilih Kesesuaian Pemupukan —</option>
                                    {Object.entries(LABEL_PEMUPUKAN).map(([val, label]) => (
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

                            <FormField label="Kondisi Cuaca" required error={errors.kondisi_cuaca}>
                                <SelectField value={data.kondisi_cuaca} onChange={(e) => setData('kondisi_cuaca', e.target.value)} error={errors.kondisi_cuaca}>
                                    <option value="">— Pilih Kondisi Cuaca —</option>
                                    {Object.entries(LABEL_CUACA).map(([val, label]) => (
                                        <option key={val} value={val}>{label}</option>
                                    ))}
                                </SelectField>
                            </FormField>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#166534] text-white text-[14px] font-medium px-4 py-[10px] rounded-lg hover:bg-[#15803d] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Memproses...' : 'Hitung Perkiraan Panen'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hasil — 3/5 */}
                <div className="lg:col-span-3">
                    {result ? (
                        <HasilPrediksi result={result} />
                    ) : (
                        <div className="bg-white border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[320px]">
                            <div className="w-12 h-12 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <p className="text-[14px] font-medium text-zinc-700 mb-1">Perkiraan Hasil Panen</p>
                            <p className="text-[13px] text-zinc-400">Isi form di sebelah kiri untuk menghitung perkiraan panen.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
