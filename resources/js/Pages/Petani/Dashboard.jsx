import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion } from 'framer-motion';

// ─── Constants ───────────────────────────────────────────────────────────────

const DISEASE_NAMES = {
    bacterial_leaf_blight: 'Hawar Daun Bakteri',
    brown_spot            : 'Bercak Coklat',
    leaf_blast            : 'Blas Daun',
    tungro                : 'Tungro',
    healthy               : 'Tanaman Sehat',
};

const FASE_META = {
    vegetatif_awal  : { color: '#10b981', bg: '#d1fae5', label: 'Vegetatif Awal'   },
    vegetatif_aktif : { color: '#0d9488', bg: '#ccfbf1', label: 'Vegetatif Aktif'  },
    reproduktif     : { color: '#3b82f6', bg: '#dbeafe', label: 'Reproduktif'      },
    pemasakan       : { color: '#f59e0b', bg: '#fef3c7', label: 'Pemasakan'        },
    panen           : { color: '#f97316', bg: '#ffedd5', label: 'Siap Panen'       },
};

const SEVERITY = {
    mild     : { label: 'Ringan', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    moderate : { label: 'Sedang', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
    severe   : { label: 'Parah' , cls: 'bg-red-50 text-red-700 border-red-200'          },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (s) =>
    s ? new Date(s).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) : '-';

// ─── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
    hidden : { opacity: 0, y: 24 },
    show   : (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatBadge({ label, value, accent = '#10b981' }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
            <span className="text-sm font-bold text-slate-800">{value}</span>
        </div>
    );
}

function LahanCard({ lahan, index }) {
    const faseKey  = lahan.today_status?.fase ?? null;
    const meta     = faseKey ? (FASE_META[faseKey] ?? FASE_META.vegetatif_awal) : null;
    const progress = lahan.today_status?.progress_pct ?? 0;
    const hst      = lahan.today_status?.hst ?? null;

    return (
        <motion.div
            variants={fadeUp}
            custom={index}
            initial="hidden"
            animate="show"
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            className="relative bg-white border border-slate-100 rounded-3xl p-6 flex flex-col gap-5 overflow-hidden cursor-default"
        >
            {/* Accent stripe */}
            {meta && (
                <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ background: meta.color }}
                />
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-2 pt-1">
                <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">{lahan.nama_lahan}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{lahan.luas_m2 ? (lahan.luas_m2 / 10000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 }) : 0} Ha</p>
                </div>
                {meta && (
                    <span
                        className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full border"
                        style={{ background: meta.bg, color: meta.color, borderColor: meta.color + '40' }}
                    >
                        {lahan.today_status?.fase_label ?? meta.label}
                    </span>
                )}
            </div>

            {/* Progress */}
            {lahan.today_status && meta ? (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-500">
                            {hst !== null ? `Hari Setelah Tanam ke-${hst}` : '—'}
                        </span>
                        <span className="text-xs font-bold" style={{ color: meta.color }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, progress)}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <span className="text-slate-300 text-lg">🌱</span>
                    <p className="text-xs text-slate-400 font-medium">Belum ada musim tanam aktif</p>
                </div>
            )}

            {/* Meta info */}
            {lahan.latest_planting && (
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-50">
                    {lahan.latest_planting.varietas && (
                        <StatBadge label="Varietas" value={lahan.latest_planting.varietas} />
                    )}
                    {lahan.latest_planting.estimasi_panen && (
                        <StatBadge label="Est. Panen" value={fmtDate(lahan.latest_planting.estimasi_panen)} />
                    )}
                </div>
            )}

            {/* CTA */}
            <div className="mt-auto">
                <Link
                    href={route('petani.tanam.index')}
                    className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                >
                    Lihat jadwal tanam
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </motion.div>
    );
}

function ScanWidget({ scan }) {
    const nama        = DISEASE_NAMES[scan.predicted_class] ?? scan.predicted_class;
    const confidence  = scan.confidence ? Math.round(parseFloat(scan.confidence) * 100) : null;
    const sev         = scan.severity ? (SEVERITY[scan.severity] ?? null) : null;
    const isHealthy   = scan.predicted_class === 'healthy';

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Deteksi Terakhir</span>
            </div>

            <div className="flex-1">
                <p className="text-2xl font-black text-slate-900 leading-tight mb-3">{nama}</p>
                <p className="text-xs text-slate-400 mb-4">{fmtDate(scan.scanned_at)}</p>

                <div className="flex flex-wrap gap-2">
                    {confidence !== null && (
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {confidence}% Akurasi
                        </span>
                    )}
                    {!isHealthy && sev && (
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${sev.cls}`}>
                            {sev.label}
                        </span>
                    )}
                </div>
            </div>

            <Link
                href={route('petani.scan.index')}
                className="mt-6 group inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
                Riwayat Scan
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    );
}

function QuickActionCard({ href, emoji, title, subtitle, variant = 'default' }) {
    const styles = {
        emerald : 'bg-emerald-600 hover:bg-emerald-700 text-white',
        amber   : 'bg-amber-500 hover:bg-amber-600 text-white',
        default : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-100',
    };

    return (
        <Link href={href} className={`group flex items-center gap-4 p-4 rounded-2xl transition-all ${styles[variant]}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-110 ${variant !== 'default' ? 'bg-white/20' : 'bg-white shadow-sm border border-slate-100'}`}>
                {emoji}
            </div>
            <div className="min-w-0">
                <p className={`text-sm font-bold leading-tight ${variant !== 'default' ? 'text-white' : 'text-slate-800'}`}>
                    {title}
                </p>
                <p className={`text-xs mt-0.5 font-medium truncate ${variant !== 'default' ? 'text-white/70' : 'text-slate-400'}`}>
                    {subtitle}
                </p>
            </div>
        </Link>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ userName }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="flex items-center justify-center min-h-[70vh] px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', duration: 0.7 }}
                    className="bg-white border border-slate-100 rounded-3xl shadow-xl p-10 sm:p-14 text-center max-w-md w-full"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        🌾
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                        Selamat datang, {userName}!
                    </h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Anda belum memiliki lahan aktif. Mulai daftarkan lahan sawah Anda untuk menikmati semua fitur cerdas BathariSri.
                    </p>
                    <Link
                        href={route('petani.lahan.create')}
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all w-full"
                    >
                        + Daftarkan Lahan Pertama
                    </Link>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Dashboard({ lahans_data, scan_terbaru, latest_fertilizer, latest_harvest }) {
    const { auth, has_lahan } = usePage().props;
    const userName             = auth?.user?.name ?? 'Petani';
    const today                = new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    if (has_lahan === false) return <EmptyState userName={userName} />;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* ── Hero Banner ── */}
                <motion.div
                    variants={fadeUp} custom={0} initial="hidden" animate="show"
                    className="relative bg-slate-900 rounded-3xl p-8 sm:p-10 overflow-hidden"
                >
                    {/* decorative blobs */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500 opacity-[0.12] blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 left-10 w-60 h-60 rounded-full bg-teal-400 opacity-[0.08] blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{today}</p>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                            Halo, <span className="text-emerald-400">{userName}</span> 👋
                        </h1>
                        <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl leading-relaxed">
                            Berikut ringkasan aktivitas pertanian Anda hari ini. Sistem siap membantu Anda mengambil keputusan yang lebih cerdas.
                        </p>

                        {/* Quick stats row */}
                        <div className="mt-8 flex flex-wrap gap-6 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Total Lahan</p>
                                <p className="text-2xl font-black text-white">{lahans_data?.length ?? 0} <span className="text-sm font-semibold text-slate-400">petak</span></p>
                            </div>
                            <div className="w-px bg-white/10 self-stretch" />
                            <div>
                                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Lahan Aktif</p>
                                <p className="text-2xl font-black text-white">
                                    {lahans_data?.filter(l => l.today_status).length ?? 0}
                                    <span className="text-sm font-semibold text-slate-400"> aktif tanam</span>
                                </p>
                            </div>
                            {scan_terbaru && (
                                <>
                                    <div className="w-px bg-white/10 self-stretch" />
                                    <div>
                                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Scan Terakhir</p>
                                        <p className="text-2xl font-black text-white">
                                            {scan_terbaru.confidence ? `${Math.round(parseFloat(scan_terbaru.confidence) * 100)}%`  : '—'}
                                            <span className="text-sm font-semibold text-slate-400"> akurasi</span>
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Bento Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT — Lahan cards (2/3 width) */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-900">Lahan Anda</h2>
                            <Link href={route('petani.lahan.index')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors">
                                Kelola Semua →
                            </Link>
                        </div>

                        {lahans_data && lahans_data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {lahans_data.slice(0, 4).map((lahan, i) => (
                                    <LahanCard key={lahan.id} lahan={lahan} index={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                                <p className="text-slate-400 text-sm font-medium">Belum ada data lahan aktif.</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Widgets (1/3 width) */}
                    <div className="space-y-5">
                        <h2 className="text-lg font-black text-slate-900">Sorotan</h2>

                        {/* Scan widget */}
                        <motion.div
                            variants={fadeUp} custom={2} initial="hidden" animate="show"
                            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
                        >
                            {scan_terbaru ? (
                                <ScanWidget scan={scan_terbaru} />
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🔍</div>
                                    <p className="text-sm font-bold text-slate-700 mb-1">Belum Ada Scan</p>
                                    <p className="text-xs text-slate-400 mb-5">Tidak ada deteksi dalam 7 hari terakhir.</p>
                                    <Link href={route('petani.scan.create')} className="text-xs font-bold text-emerald-600 hover:underline">
                                        Mulai Scan Sekarang →
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* SPK Quick Actions */}
                        <motion.div
                            variants={fadeUp} custom={3} initial="hidden" animate="show"
                            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Sistem Pendukung Keputusan</span>
                            </div>
                            <div className="space-y-3">
                                {latest_fertilizer ? (
                                    <QuickActionCard
                                        href={route('petani.spk.pupuk')}
                                        emoji="🌱"
                                        title="Rekomendasi Pupuk"
                                        subtitle="Lihat hasil analisis terakhir"
                                        variant="emerald"
                                    />
                                ) : (
                                    <QuickActionCard
                                        href={route('petani.spk.pupuk')}
                                        emoji="🌱"
                                        title="Mulai SPK Pupuk"
                                        subtitle="Dapatkan rekomendasi dosis pupuk"
                                    />
                                )}
                                {latest_harvest ? (
                                    <QuickActionCard
                                        href={route('petani.spk.panen')}
                                        emoji="🌾"
                                        title="Prediksi Panen"
                                        subtitle="Cek estimasi hasil panen Anda"
                                        variant="amber"
                                    />
                                ) : (
                                    <QuickActionCard
                                        href={route('petani.spk.panen')}
                                        emoji="🌾"
                                        title="Mulai SPK Panen"
                                        subtitle="Prediksi hasil akhir panen"
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
