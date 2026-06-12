import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const faseMeta = {
    vegetatif_awal:  { bg: '#dbeafe', color: '#1e40af' },
    vegetatif_aktif: { bg: '#dcfce7', color: '#166534' },
    reproduktif:     { bg: '#fef3c7', color: '#92400e' },
    pemasakan:       { bg: '#ffedd5', color: '#9a3412' },
    panen:           { bg: '#f3e8ff', color: '#6b21a8' },
};

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function TanamCard({ planting, onHapus }) {
    const ts = planting.today_status;
    const fase = ts?.fase ?? null;
    const meta = fase ? (faseMeta[fase] ?? faseMeta.vegetatif_awal) : null;
    const progress = ts?.progress_pct ?? 0;
    const hst = ts?.hst ?? 0;
    const alerts = ts?.alerts ?? [];
    const faseLabel = ts?.fase_label ?? fase;

    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-col gap-3 hover:border-[#166534]/30 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-zinc-900 leading-tight truncate">{planting.varietas}</h3>
                    {planting.lahan?.nama_lahan && (
                        <p className="text-[12px] text-zinc-400 mt-0.5 flex items-center gap-1">
                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {planting.lahan.nama_lahan}
                        </p>
                    )}
                </div>
                {meta && (
                    <span className="shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>
                        {faseLabel?.split('(')[0]?.trim() ?? faseLabel}
                    </span>
                )}
            </div>

            {ts && meta ? (
                <div>
                    <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="text-zinc-500">HST ke-{hst}</span>
                        <span className="font-medium text-zinc-700">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#166534] transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
                    </div>
                </div>
            ) : (
                <p className="text-[12px] text-zinc-400 italic">Belum ada musim tanam aktif</p>
            )}

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-zinc-400 font-medium">Est. Panen</p>
                    <p className="text-[13px] font-semibold text-zinc-800 mt-0.5">{formatTanggal(planting.estimasi_panen)}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-zinc-400 font-medium">Umur Varietas</p>
                    <p className="text-[13px] font-semibold text-zinc-800 mt-0.5">{planting.umur_panen_hari} hari</p>
                </div>
            </div>

            {alerts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {alerts.map((alert, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-[#fee2e2] text-[#991b1b] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            ⚠ {alert}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                <Link
                    href={route('petani.tanam.show', planting.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-[#166534] bg-[#f0fdf4] hover:bg-[#dcfce7] px-3 py-2 rounded-lg transition-colors"
                >
                    Lihat Detail
                </Link>
                <button
                    onClick={() => onHapus(planting)}
                    className="inline-flex items-center justify-center text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                >
                    Hapus
                </button>
            </div>
        </div>
    );
}

export default function Index({ plantings }) {
    const { flash } = usePage().props;

    const handleHapus = (planting) => {
        if (confirm(`Hapus jadwal tanam "${planting.varietas}"? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('petani.tanam.destroy', planting.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Jadwal Tanam Saya" />

            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Jadwal Tanam Saya</h1>
                        <p className="text-[13px] text-green-200">Pantau fase pertumbuhan dan jadwal pemupukan musim tanam Anda.</p>
                    </div>
                    <Link href={route('petani.tanam.create')} className="shrink-0 inline-flex items-center gap-2 bg-white text-[#166534] font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-green-50 transition-colors">
                        + Musim Tanam Baru
                    </Link>
                </div>
            </div>

            {flash?.success && <div className="mb-4 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-xl text-[13px] font-medium">{flash.success}</div>}
            {flash?.error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[13px] font-medium">{flash.error}</div>}

            {plantings.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-zinc-200 py-16 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-[16px] font-semibold text-zinc-800 mb-1">Belum ada jadwal tanam</h3>
                    <p className="text-[13px] text-zinc-500 mb-6 max-w-xs">Mulai musim tanam baru untuk melacak pertumbuhan padi Anda.</p>
                    <Link href={route('petani.tanam.create')} className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#15803d] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-[14px]">
                        Mulai Musim Tanam Pertama
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {plantings.map((p) => <TanamCard key={p.id} planting={p} onHapus={handleHapus} />)}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
