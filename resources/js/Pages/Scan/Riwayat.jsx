import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const diseaseLabels = {
    bacterial_leaf_blight: 'Hawar Daun Bakteri',
    brown_spot:            'Bercak Coklat',
    leaf_blast:            'Blas Daun',
    tungro:                'Tungro',
    healthy:               'Sehat',
};

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ConfidenceBadge({ confidence }) {
    const pct = (confidence * 100).toFixed(1);
    const cls = confidence >= 0.8 ? 'bg-[#dcfce7] text-[#166534]' : confidence >= 0.6 ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#fee2e2] text-[#991b1b]';
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{pct}%</span>;
}

const severityConfig = {
    mild:     { label: 'Ringan', cls: 'bg-[#fef3c7] text-[#92400e]' },
    moderate: { label: 'Sedang', cls: 'bg-[#ffedd5] text-[#9a3412]' },
    severe:   { label: 'Parah',  cls: 'bg-[#fee2e2] text-[#991b1b]' },
};

function SeverityBadge({ severity }) {
    if (!severity) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#166534]">Sehat</span>;
    const { label, cls } = severityConfig[severity] ?? { label: severity, cls: 'bg-zinc-100 text-zinc-700' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

function ScanCard({ scan }) {
    const namaLabel = diseaseLabels[scan.predicted_class] ?? scan.predicted_class;
    const isHealthy = scan.predicted_class === 'healthy';

    return (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-[#166534]/30 hover:shadow-md transition-all group">
            <div className="relative bg-zinc-50 h-40 overflow-hidden">
                <img
                    src={`/storage/${scan.image_path}`}
                    alt={namaLabel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute top-2.5 left-2.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm text-white ${isHealthy ? 'bg-[#166534]' : 'bg-red-600'}`}>
                        {isHealthy ? '✓ Sehat' : '⚠ Penyakit'}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-[14px] font-semibold text-zinc-900 leading-tight mb-2">{namaLabel}</h3>
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <ConfidenceBadge confidence={scan.confidence} />
                    <SeverityBadge severity={scan.severity} />
                </div>
                {scan.lahan?.nama_lahan && (
                    <p className="text-[12px] text-zinc-400 flex items-center gap-1 mb-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {scan.lahan.nama_lahan}
                    </p>
                )}
                <p className="text-[12px] text-zinc-400 mb-3">{formatTanggal(scan.scanned_at)}</p>
                <Link
                    href={route('petani.scan.show', scan.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#166534] font-semibold px-4 py-2 rounded-lg transition-colors text-[12px]"
                >
                    Lihat Detail
                </Link>
            </div>
        </div>
    );
}

export default function Riwayat({ scans = [] }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Scan Penyakit" />

            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            Riwayat Scan Penyakit
                        </h1>
                        <p className="text-[13px] text-green-200">Semua hasil analisis penyakit daun padi tersimpan di sini.</p>
                    </div>
                    <Link
                        href={route('petani.scan.create')}
                        className="shrink-0 inline-flex items-center gap-2 bg-white text-[#166534] font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-green-50 transition-colors"
                    >
                        + Scan Baru
                    </Link>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-4 flex items-center gap-3 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-xl text-[13px] font-medium">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[13px] font-medium">
                    {flash.error}
                </div>
            )}

            {scans.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-zinc-200 py-16 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-[16px] font-semibold text-zinc-800 mb-1">Belum ada riwayat scan</h3>
                    <p className="text-[13px] text-zinc-500 mb-6 max-w-xs">Upload foto daun padi untuk mendeteksi penyakit secara otomatis.</p>
                    <Link
                        href={route('petani.scan.create')}
                        className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#15803d] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-[14px]"
                    >
                        Mulai Scan Pertama
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {scans.map((scan) => (
                        <ScanCard key={scan.id} scan={scan} />
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
