import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PiArrowRight, PiMicroscope, PiPlant, PiChartLineUp, PiMapPin } from 'react-icons/pi';

const DISEASE_NAMES = {
    bacterial_leaf_blight: 'Hawar Daun Bakteri',
    brown_spot:            'Bercak Coklat',
    leaf_blast:            'Blas Daun',
    tungro:                'Tungro',
    healthy:               'Tanaman Sehat',
};

const FASE_META = {
    vegetatif_awal  : { color: '#166534', bg: '#dcfce7', label: 'Vegetatif Awal'  },
    vegetatif_aktif : { color: '#166534', bg: '#dcfce7', label: 'Vegetatif Aktif' },
    reproduktif     : { color: '#1e40af', bg: '#dbeafe', label: 'Reproduktif'     },
    pemasakan       : { color: '#92400e', bg: '#fef3c7', label: 'Pemasakan'       },
    panen           : { color: '#9a3412', bg: '#ffedd5', label: 'Siap Panen'      },
};

const SEVERITY = {
    mild     : { label: 'Ringan', cls: 'bg-[#fef3c7] text-[#92400e]' },
    moderate : { label: 'Sedang', cls: 'bg-[#ffedd5] text-[#9a3412]' },
    severe   : { label: 'Parah',  cls: 'bg-[#fee2e2] text-[#991b1b]' },
};

const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function LahanCard({ lahan }) {
    const faseKey  = lahan.today_status?.fase ?? null;
    const meta     = faseKey ? (FASE_META[faseKey] ?? FASE_META.vegetatif_awal) : null;
    const progress = lahan.today_status?.progress_pct ?? 0;
    const hst      = lahan.today_status?.hst ?? null;

    return (
        <div className="bg-white border border-zinc-200 rounded-[10px] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="text-[15px] font-medium text-zinc-900 leading-tight truncate">{lahan.nama_lahan}</h3>
                    <p className="text-[12px] text-zinc-400 mt-0.5">
                        {lahan.luas_m2 ? (lahan.luas_m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : 0} Ha
                    </p>
                </div>
                {meta && (
                    <span
                        className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full max-w-[130px] truncate"
                        style={{ background: meta.bg, color: meta.color }}
                        title={lahan.today_status?.fase_label ?? meta.label}
                    >
                        {lahan.today_status?.fase_label ?? meta.label}
                    </span>
                )}
            </div>

            {lahan.today_status && meta ? (
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[12px] text-zinc-500">
                            {hst !== null ? `HST ke-${hst}` : '—'}
                        </span>
                        <span className="text-[12px] font-medium text-zinc-700">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full h-[6px] bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#166534] transition-all duration-500"
                            style={{ width: `${Math.min(100, progress)}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50 rounded-[7px] border border-dashed border-zinc-200">
                    <p className="text-[12px] text-zinc-400">Belum ada musim tanam aktif</p>
                </div>
            )}

            {lahan.latest_planting && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100">
                    {lahan.latest_planting.varietas && (
                        <div>
                            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.05em] mb-0.5">Varietas</p>
                            <p className="text-[13px] font-medium text-zinc-700">{lahan.latest_planting.varietas}</p>
                        </div>
                    )}
                    {lahan.latest_planting.estimasi_panen && (
                        <div>
                            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.05em] mb-0.5">Est. Panen</p>
                            <p className="text-[13px] font-medium text-zinc-700">{fmtDate(lahan.latest_planting.estimasi_panen)}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-auto pt-1">
                <Link
                    href={route('petani.tanam.index')}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-zinc-500 hover:text-[#166534] transition-colors group"
                >
                    Lihat jadwal tanam
                    <PiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>
        </div>
    );
}

function ScanWidget({ scan }) {
    const nama       = DISEASE_NAMES[scan.predicted_class] ?? scan.predicted_class;
    const confidence = scan.confidence ? Math.round(parseFloat(scan.confidence) * 100) : null;
    const sev        = scan.severity ? (SEVERITY[scan.severity] ?? null) : null;
    const isHealthy  = scan.predicted_class === 'healthy';

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
                <PiMicroscope weight="regular" className="w-[18px] h-[18px] text-zinc-400" />
                <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
                    Deteksi Terakhir
                </span>
            </div>

            <div className="flex-1">
                <p className="text-[20px] font-semibold text-zinc-900 leading-tight mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {nama}
                </p>
                <p className="text-[12px] text-zinc-400 mb-4">{fmtDate(scan.scanned_at)}</p>

                <div className="flex flex-wrap gap-1.5">
                    {confidence !== null && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1e40af]">
                            {confidence}% akurasi
                        </span>
                    )}
                    {!isHealthy && sev && (
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${sev.cls}`}>
                            {sev.label}
                        </span>
                    )}
                </div>
            </div>

            <Link
                href={route('petani.scan.index')}
                className="mt-5 inline-flex items-center gap-1 text-[12px] font-medium text-[#166534] hover:text-[#15803d] transition-colors group"
            >
                Riwayat Scan
                <PiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>
    );
}

function AksiCepatItem({ href, icon, title, subtitle, isPrimary }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 p-3 rounded-[7px] transition-colors ${
                isPrimary
                    ? 'bg-[#f0fdf4] hover:bg-[#dcfce7]'
                    : 'bg-zinc-50 hover:bg-zinc-100'
            }`}
        >
            <div className="w-9 h-9 rounded-[7px] bg-white border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-500">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[13px] font-medium text-zinc-900 leading-tight">{title}</p>
                <p className="text-[12px] text-zinc-500 truncate mt-0.5">{subtitle}</p>
            </div>
        </Link>
    );
}

function EmptyState({ userName }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <div className="bg-white border border-zinc-200 rounded-[10px] p-10 sm:p-14 text-center max-w-md w-full">
                    <div className="w-14 h-14 bg-zinc-50 border border-zinc-200 rounded-[10px] flex items-center justify-center mx-auto mb-6">
                        <PiMapPin className="w-6 h-6 text-zinc-400" />
                    </div>
                    <h2 className="text-[22px] font-semibold text-zinc-900 mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Selamat datang, {userName}
                    </h2>
                    <p className="text-zinc-500 text-[14px] mb-8 leading-relaxed max-w-[320px] mx-auto">
                        Kamu belum punya lahan terdaftar. Daftarkan lahan sawahmu untuk mulai menggunakan semua fitur BathariSri.
                    </p>
                    <Link
                        href={route('petani.lahan.create')}
                        className="inline-flex items-center justify-center gap-2 bg-[#166534] text-white text-[14px] font-medium px-[18px] py-[9px] rounded-[7px] hover:bg-[#15803d] transition-colors w-full"
                    >
                        Daftarkan Lahan Pertama
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default function Dashboard({ lahans_data, scan_terbaru, latest_fertilizer, latest_harvest }) {
    const { auth, has_lahan } = usePage().props;
    const userName = auth?.user?.name ?? 'Petani';
    const today    = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    if (has_lahan === false) return <EmptyState userName={userName} />;

    const totalLahan  = lahans_data?.length ?? 0;
    const lahanAktif  = lahans_data?.filter(l => l.today_status).length ?? 0;
    const scanAkurasi = scan_terbaru?.confidence ? Math.round(parseFloat(scan_terbaru.confidence) * 100) : null;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {}
            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <p className="text-[12px] font-medium text-green-200 uppercase tracking-[0.07em] mb-1">{today}</p>
                        <h1 className="text-[22px] font-semibold leading-tight mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Selamat pagi, <span className="text-green-100">{userName}</span>
                        </h1>
                        <p className="text-[14px] text-green-200">Berikut ringkasan kondisi lahanmu hari ini.</p>
                    </div>

                    {}
                    <div className="flex gap-2.5 flex-wrap">
                        <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 min-w-[80px]">
                            <p className="text-[11px] font-medium text-green-200 uppercase tracking-[0.05em] mb-1">Total Lahan</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[20px] font-semibold text-white leading-none">{totalLahan}</span>
                                <span className="text-[12px] text-green-200">petak</span>
                            </div>
                        </div>
                        <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 min-w-[80px]">
                            <p className="text-[11px] font-medium text-green-200 uppercase tracking-[0.05em] mb-1">Lahan Aktif</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[20px] font-semibold text-white leading-none">{lahanAktif}</span>
                                <span className="text-[12px] text-green-200">tanam</span>
                            </div>
                        </div>
                        {scanAkurasi !== null && (
                            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 min-w-[80px]">
                                <p className="text-[11px] font-medium text-green-200 uppercase tracking-[0.05em] mb-1">Scan Terakhir</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[20px] font-semibold text-white leading-none">{scanAkurasi}%</span>
                                    <span className="text-[12px] text-green-200">akurasi</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Lahan Anda
                        </h2>
                        <Link
                            href={route('petani.lahan.index')}
                            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#166534] hover:text-[#15803d] transition-colors group"
                        >
                            Kelola Semua
                            <PiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {lahans_data && lahans_data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {lahans_data.slice(0, 4).map((lahan) => (
                                <LahanCard key={lahan.id} lahan={lahan} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-dashed border-zinc-200 rounded-xl p-10 text-center">
                            <p className="text-[13px] text-zinc-400">Belum ada data lahan aktif.</p>
                        </div>
                    )}
                </div>

                {}
                <div className="space-y-3">
                    <h2 className="text-[16px] font-semibold text-zinc-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Sorotan
                    </h2>

                    {}
                    <div className="bg-white border border-zinc-200 rounded-xl p-4">
                        {scan_terbaru ? (
                            <ScanWidget scan={scan_terbaru} />
                        ) : (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <PiMicroscope weight="regular" className="w-[18px] h-[18px] text-zinc-400" />
                                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
                                        Deteksi Terakhir
                                    </span>
                                </div>
                                <p className="text-[14px] font-medium text-zinc-700 mb-1">Belum Ada Deteksi</p>
                                <p className="text-[13px] text-zinc-400 mb-3">Tidak ada scan dalam 7 hari terakhir.</p>
                                <Link
                                    href={route('petani.scan.create')}
                                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#166534] hover:text-[#15803d] transition-colors group"
                                >
                                    Scan Sekarang
                                    <PiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="bg-white border border-zinc-200 rounded-xl p-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400 mb-3">Aksi Cepat</p>
                        <div className="space-y-2">
                            <AksiCepatItem
                                href={route('petani.spk.pupuk')}
                                icon={<PiPlant weight="regular" className="w-4 h-4" />}
                                title="Rekomendasi Pupuk"
                                subtitle={latest_fertilizer ? 'Lihat hasil terakhir' : 'Dapatkan rekomendasi dosis'}
                                isPrimary={!!latest_fertilizer}
                            />
                            <AksiCepatItem
                                href={route('petani.spk.panen')}
                                icon={<PiChartLineUp weight="regular" className="w-4 h-4" />}
                                title="Perkiraan Hasil Panen"
                                subtitle={latest_harvest ? 'Cek estimasi panen' : 'Hitung perkiraan panen'}
                                isPrimary={!!latest_harvest}
                            />
                        </div>
                    </div>

                    {}
                    <Link
                        href={route('petani.scan.create')}
                        className="flex items-center gap-3 bg-[#166534] text-white rounded-xl px-4 py-3.5 hover:bg-[#15803d] transition-colors group"
                    >
                        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                            <PiMicroscope className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold leading-tight">Deteksi Penyakit</p>
                            <p className="text-[12px] text-green-200">Upload foto daun padi</p>
                        </div>
                        <PiArrowRight className="w-4 h-4 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
