import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/* ── Mapping predicted_class → nama Indonesia ─────────────────────────── */

const diseaseLabels = {
    bacterial_leaf_blight: 'Hawar Daun Bakteri',
    brown_spot:            'Bercak Coklat',
    leaf_blast:            'Blas Daun',
    tungro:                'Tungro',
    healthy:               'Sehat',
};

/* ── Helpers ──────────────────────────────────────────────────────────── */

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/* ── Badge Confidence ─────────────────────────────────────────────────── */

function ConfidenceBadge({ confidence }) {
    const pct = (confidence * 100).toFixed(1);
    let cls = '';
    if (confidence >= 0.8) {
        cls = 'bg-emerald-100 text-emerald-800';
    } else if (confidence >= 0.6) {
        cls = 'bg-yellow-100 text-yellow-800';
    } else {
        cls = 'bg-red-100 text-red-800';
    }
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {pct}%
        </span>
    );
}

/* ── Badge Severity ───────────────────────────────────────────────────── */

const severityConfig = {
    mild:     { label: 'Ringan', cls: 'bg-green-100 text-green-800' },
    moderate: { label: 'Sedang', cls: 'bg-yellow-100 text-yellow-800' },
    severe:   { label: 'Parah',  cls: 'bg-red-100 text-red-800' },
};

function SeverityBadge({ severity }) {
    if (!severity) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Sehat
            </span>
        );
    }
    const { label, cls } = severityConfig[severity] ?? { label: severity, cls: 'bg-gray-100 text-gray-700' };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {label}
        </span>
    );
}

/* ── Halaman Utama ────────────────────────────────────────────────────── */

export default function Riwayat({ scans = [] }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Scan Penyakit" />

            <div className="max-w-5xl mx-auto px-4 py-8">

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
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Riwayat Scan Penyakit
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Semua hasil analisis penyakit daun padi Anda tersimpan di sini.
                        </p>
                    </div>
                    <Link
                        href={route('petani.scan.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        + Scan Baru
                    </Link>
                </div>

                {/* Empty State */}
                {scans.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada riwayat scan</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            Upload foto daun padi Anda untuk mendeteksi penyakit secara otomatis menggunakan AI.
                        </p>
                        <Link
                            href={route('petani.scan.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Mulai Scan Pertama
                        </Link>
                    </div>
                ) : (
                    /* Grid Riwayat */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scans.map((scan) => (
                            <ScanCard key={scan.id} scan={scan} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

/* ── Kartu Scan ───────────────────────────────────────────────────────── */

function ScanCard({ scan }) {
    const namaLabel = diseaseLabels[scan.predicted_class] ?? scan.predicted_class;
    const isHealthy = scan.predicted_class === 'healthy';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-emerald-100 transition-all group">
            {/* Thumbnail */}
            <div className="relative bg-gray-50 h-44 overflow-hidden">
                <img
                    src={`/storage/${scan.image_path}`}
                    alt={`Scan — ${namaLabel}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                {/* Fallback jika gambar gagal load */}
                <div
                    className="hidden w-full h-full items-center justify-center text-gray-300"
                    style={{ display: 'none' }}
                >
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                {/* Badge di atas thumbnail */}
                <div className="absolute top-2.5 left-2.5">
                    {isHealthy ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                            ✓ Sehat
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm">
                            ⚠ Penyakit
                        </span>
                    )}
                </div>
            </div>

            {/* Konten */}
            <div className="p-4">
                {/* Nama Penyakit */}
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">
                    {namaLabel}
                </h3>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <ConfidenceBadge confidence={scan.confidence} />
                    <SeverityBadge severity={scan.severity} />
                </div>

                {/* Lahan */}
                {scan.lahan?.nama_lahan && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {scan.lahan.nama_lahan}
                    </p>
                )}

                {/* Tanggal */}
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatTanggal(scan.scanned_at)}
                </p>

                {/* Link Detail */}
                <Link
                    href={route('petani.scan.show', scan.id)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4 py-2 rounded-xl transition-colors text-xs"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Lihat Detail
                </Link>
            </div>
        </div>
    );
}
