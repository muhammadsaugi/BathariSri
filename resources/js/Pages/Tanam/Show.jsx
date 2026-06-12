import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


const faseColors = {
    vegetatif_awal:  'bg-blue-100 text-blue-700',
    vegetatif_aktif: 'bg-emerald-100 text-emerald-700',
    reproduktif:     'bg-yellow-100 text-yellow-700',
    pemasakan:       'bg-orange-100 text-orange-700',
    panen:           'bg-purple-100 text-purple-700',
};


const statusColors = {
    selesai:   'bg-gray-100 text-gray-500',
    aktif:     'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300',
    mendatang: 'bg-blue-50 text-blue-600',
};

const statusLabels = {
    selesai:   'Selesai',
    aktif:     'Aktif',
    mendatang: 'Mendatang',
};


function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function hitungCountdown(estimasiPanen) {
    if (!estimasiPanen) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const panen = new Date(estimasiPanen);
    panen.setHours(0, 0, 0, 0);
    const diff = Math.round((panen - today) / (1000 * 60 * 60 * 24));
    return diff;
}


function FaseBadge({ fase, label }) {
    const cls = faseColors[fase] ?? 'bg-gray-100 text-gray-600';
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${cls}`}>
            {label ?? fase}
        </span>
    );
}

function JadwalEvent({ event }) {
    const statusCls = statusColors[event.status] ?? 'bg-gray-100 text-gray-500';
    const statusLabel = statusLabels[event.status] ?? event.status;
    const isAktif = event.status === 'aktif';

    return (
        <div className={`flex flex-col items-center text-center min-w-[130px] ${isAktif ? 'scale-105' : ''} transition-transform`}>
            {}
            <p className="text-xs font-bold text-gray-700 mb-1.5 leading-tight">{event.event}</p>
            {}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${statusCls} ${isAktif ? 'animate-pulse' : ''}`}>
                {isAktif && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                )}
                {statusLabel}
            </span>
            {}
            <p className="text-xs text-gray-500 leading-snug">
                {formatTanggal(event.tanggal_mulai)}
                {' – '}
                {formatTanggal(event.tanggal_selesai)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">HST {event.hst_mulai}–{event.hst_selesai}</p>
        </div>
    );
}


export default function Show({ planting, schedule, today_status }) {
    const { flash } = usePage().props;
    const ts = today_status ?? {};

    const fase        = ts.fase ?? null;
    const faseLabel   = ts.fase_label ?? '-';
    const hst         = ts.hst ?? 0;
    const progress    = ts.progress_pct ?? 0;
    const alerts      = ts.alerts ?? [];
    const countdown   = hitungCountdown(planting.estimasi_panen);

    function handleHapus() {
        if (confirm('Hapus jadwal tanam ini? Semua data terkait akan dihapus dan tidak dapat dikembalikan.')) {
            router.delete(route('petani.tanam.destroy', planting.id));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Jadwal Tanam — ${planting.varietas}`} />

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {}
                {flash?.success && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {flash.success}
                    </div>
                )}

                {}
                <div>
                    <Link
                        href={route('petani.tanam.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Jadwal Tanam
                    </Link>
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    {}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{planting.varietas}</h1>
                            {planting.lahan?.nama_lahan && (
                                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {planting.lahan.nama_lahan}
                                </p>
                            )}
                        </div>
                        {fase && <FaseBadge fase={fase} label={faseLabel} />}
                    </div>

                    {}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                            <span className="font-semibold">HST ke-{hst} dari {planting.umur_panen_hari} hari</span>
                            <span className="font-bold text-emerald-600">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all"
                                style={{ width: `${Math.min(100, progress)}%` }}
                            />
                        </div>
                    </div>

                    {}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">Estimasi Panen:</span>
                            <span className="text-sm font-bold text-gray-900">{formatTanggal(planting.estimasi_panen)}</span>
                        </div>
                        {countdown !== null && (
                            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                countdown > 0
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-purple-50 text-purple-700'
                            }`}>
                                {countdown > 0 ? `${countdown} hari lagi` : 'Sudah panen'}
                            </span>
                        )}
                    </div>
                </div>

                {}
                {alerts.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-bold text-amber-800 mb-1">Perhatian — Jadwal Pemupukan Aktif</p>
                            <ul className="space-y-0.5">
                                {alerts.map((alert, i) => (
                                    <li key={i} className="text-sm text-amber-700">{alert}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Timeline Jadwal Pupuk
                    </h2>

                    {schedule && schedule.length > 0 ? (
                        <div className="relative">
                            {}
                            <div className="absolute top-5 left-[calc(130px/2)] right-[calc(130px/2)] h-0.5 bg-gray-200 hidden sm:block" />

                            <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-2 overflow-x-auto pb-2">
                                {schedule.map((event, i) => (
                                    <div key={i} className="relative flex sm:flex-col items-start sm:items-center gap-3 sm:gap-0">
                                        {}
                                        <div className={`w-3 h-3 rounded-full border-2 shrink-0 sm:mb-3 ${
                                            event.status === 'aktif'
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : event.status === 'selesai'
                                                ? 'bg-gray-400 border-gray-400'
                                                : 'bg-white border-blue-400'
                                        }`} />
                                        {}
                                        <JadwalEvent event={event} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Jadwal pupuk belum tersedia.</p>
                    )}
                </div>

                {}
                {planting.lahan && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Informasi Lahan
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="bg-gray-50 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-400 font-medium">Nama Lahan</p>
                                <p className="text-sm font-bold text-gray-800 mt-0.5">{planting.lahan.nama_lahan}</p>
                            </div>
                            {planting.lahan.luas_are && (
                                <div className="bg-gray-50 rounded-xl px-4 py-3">
                                    <p className="text-xs text-gray-400 font-medium">Luas</p>
                                    <p className="text-sm font-bold text-gray-800 mt-0.5">{planting.lahan.luas_are} are</p>
                                </div>
                            )}
                            {(planting.lahan.desa || planting.lahan.kecamatan) && (
                                <div className="bg-gray-50 rounded-xl px-4 py-3">
                                    <p className="text-xs text-gray-400 font-medium">Lokasi</p>
                                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                                        {[planting.lahan.desa, planting.lahan.kecamatan].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-bold text-gray-800 mb-4">Aksi Cepat</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href={route('petani.scan.index')}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Deteksi Penyakit Sekarang
                        </Link>
                        <Link
                            href={route('petani.spk.pupuk')}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Rekomendasi Pupuk
                        </Link>
                    </div>
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <h2 className="text-base font-bold text-red-700 mb-1">Hapus Jadwal Tanam</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Setelah dihapus, semua data musim tanam ini tidak dapat dikembalikan.
                    </p>
                    <button
                        onClick={handleHapus}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus Jadwal Tanam
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
