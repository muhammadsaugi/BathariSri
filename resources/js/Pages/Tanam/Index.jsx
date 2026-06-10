import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const faseColors = {
    vegetatif_awal:  'bg-blue-100 text-blue-700',
    vegetatif_aktif: 'bg-emerald-100 text-emerald-700',
    reproduktif:     'bg-yellow-100 text-yellow-700',
    pemasakan:       'bg-orange-100 text-orange-700',
    panen:           'bg-purple-100 text-purple-700',
};

function FaseBadge({ fase, label }) {
    const cls = faseColors[fase] ?? 'bg-gray-100 text-gray-600';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {label ?? fase}
        </span>
    );
}

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function Index({ plantings }) {
    const { flash } = usePage().props;

    function handleHapus(planting) {
        const nama = planting.varietas ?? 'jadwal tanam';
        if (confirm(`Hapus jadwal tanam "${nama}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('petani.tanam.destroy', planting.id));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal Tanam Saya" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-medium">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm font-medium">
                        <svg className="w-5 h-5 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {flash.error}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Jadwal Tanam Saya</h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Pantau fase pertumbuhan dan jadwal pemupukan musim tanam Anda.
                        </p>
                    </div>
                    <Link
                        href={route('petani.tanam.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        + Musim Tanam Baru
                    </Link>
                </div>

                {/* Empty State */}
                {plantings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada jadwal tanam</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            Mulai musim tanam baru untuk melacak fase pertumbuhan dan jadwal pemupukan padi Anda.
                        </p>
                        <Link
                            href={route('petani.tanam.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Mulai Musim Tanam Pertama
                        </Link>
                    </div>
                ) : (
                    /* Grid kartu musim tanam */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {plantings.map((planting) => {
                            const ts = planting.today_status;
                            const fase = ts?.fase ?? null;
                            const faseLabel = ts?.fase_label ?? '-';
                            const progress = ts?.progress_pct ?? 0;
                            const hst = ts?.hst ?? 0;
                            const alerts = ts?.alerts ?? [];

                            return (
                                <div
                                    key={planting.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                                >
                                    {/* Judul + fase */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base leading-tight">
                                                {planting.varietas}
                                            </h3>
                                            {planting.lahan?.nama_lahan && (
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {planting.lahan.nama_lahan}
                                                </p>
                                            )}
                                        </div>
                                        {fase && <FaseBadge fase={fase} label={faseLabel.split(' ')[1] ?? faseLabel} />}
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress Musim Tanam</span>
                                            <span className="font-semibold text-gray-700">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-emerald-500 h-2 rounded-full transition-all"
                                                style={{ width: `${Math.min(100, progress)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                                            <p className="text-gray-400 font-medium">Hari Ini</p>
                                            <p className="text-gray-800 font-bold mt-0.5">HST ke-{hst}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                                            <p className="text-gray-400 font-medium">Estimasi Panen</p>
                                            <p className="text-gray-800 font-bold mt-0.5">
                                                {formatTanggal(planting.estimasi_panen)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Alert pemupukan */}
                                    {alerts.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {alerts.map((alert, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-full"
                                                >
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {alert}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Aksi */}
                                    <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                                        <Link
                                            href={route('petani.tanam.show', planting.id)}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Lihat Detail
                                        </Link>
                                        <button
                                            onClick={() => handleHapus(planting)}
                                            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
