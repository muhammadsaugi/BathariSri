import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/* ── Badge Confidence ─────────────────────────────────────────────────── */

function ConfidenceBadge({ confidence }) {
    const pct = (confidence * 100).toFixed(1);
    let cls = '';
    if (confidence >= 0.8) {
        cls = 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
    } else if (confidence >= 0.6) {
        cls = 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200';
    } else {
        cls = 'bg-red-100 text-red-800 ring-1 ring-red-200';
    }
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${cls}`}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Kepercayaan {pct}%
        </span>
    );
}

/* ── Badge Severity ───────────────────────────────────────────────────── */

const severityConfig = {
    mild:     { label: 'Ringan',  cls: 'bg-green-100 text-green-800 ring-1 ring-green-200' },
    moderate: { label: 'Sedang',  cls: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200' },
    severe:   { label: 'Parah',   cls: 'bg-red-100 text-red-800 ring-1 ring-red-200' },
};

function SeverityBadge({ severity }) {
    if (!severity) {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200">
                Sehat
            </span>
        );
    }
    const { label, cls } = severityConfig[severity] ?? { label: severity, cls: 'bg-gray-100 text-gray-700' };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${cls}`}>
            {label}
        </span>
    );
}

/* ── Section Wrapper ──────────────────────────────────────────────────── */

function InfoSection({ icon, title, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-emerald-500">{icon}</span>
                {title}
            </h2>
            {children}
        </div>
    );
}

/* ── Halaman Utama ────────────────────────────────────────────────────── */

export default function Hasil({ scan, diseaseRef, penanganan }) {
    const isHealthy = scan.predicted_class === 'healthy';
    const namaPenyakit = isHealthy
        ? 'Sehat'
        : (diseaseRef?.nama_id ?? scan.predicted_class);

    function handleHapus() {
        if (confirm('Hapus data scan ini? Tindakan ini tidak dapat dibatalkan.')) {
            router.delete(route('petani.scan.destroy', scan.id));
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Hasil Scan — ${namaPenyakit}`} />

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

                {/* Back */}
                <div>
                    <Link
                        href={route('petani.scan.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Riwayat
                    </Link>
                </div>

                {/* ── Card Utama: Hasil Deteksi ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Gambar */}
                    <div className="bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                        <img
                            src={`/storage/${scan.image_path}`}
                            alt="Daun padi yang dianalisis"
                            className="max-h-72 w-auto rounded-xl object-contain shadow-sm"
                        />
                    </div>

                    {/* Info Hasil */}
                    <div className="p-6">
                        {/* Judul */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {namaPenyakit}
                                </h1>
                                {!isHealthy && diseaseRef?.nama_ilmiah && (
                                    <p className="text-sm text-gray-500 italic mt-0.5">
                                        {diseaseRef.nama_ilmiah}
                                    </p>
                                )}
                                {scan.lahan?.nama_lahan && (
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {scan.lahan.nama_lahan}
                                    </p>
                                )}
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 shrink-0">
                                <ConfidenceBadge confidence={scan.confidence} />
                                <SeverityBadge severity={scan.severity} />
                            </div>
                        </div>

                        {/* Tanggal scan */}
                        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Dianalisis {formatTanggal(scan.scanned_at)}
                        </p>

                        {/* Tombol Aksi */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
                            <Link
                                href={route('petani.spk.pupuk')}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Minta Rekomendasi Pupuk
                            </Link>
                            <Link
                                href={route('petani.scan.index')}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Scan Baru
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Deskripsi Penyakit ── */}
                {diseaseRef?.deskripsi && (
                    <InfoSection
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        title="Tentang Penyakit Ini"
                    >
                        <p className="text-sm text-gray-600 leading-relaxed">{diseaseRef.deskripsi}</p>
                    </InfoSection>
                )}

                {/* ── Gejala Khas ── */}
                {diseaseRef?.gejala && (
                    <InfoSection
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        }
                        title="Gejala Khas"
                    >
                        <p className="text-sm text-gray-600 leading-relaxed">{diseaseRef.gejala}</p>
                    </InfoSection>
                )}

                {/* ── Rekomendasi Penanganan ── */}
                {penanganan && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                        <h2 className="text-base font-bold text-amber-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Rekomendasi Penanganan
                            {scan.severity && (
                                <SeverityBadge severity={scan.severity} />
                            )}
                        </h2>
                        <p className="text-sm text-amber-800 leading-relaxed">{penanganan}</p>
                    </div>
                )}

                {/* ── Pencegahan ── */}
                {diseaseRef?.pencegahan && (
                    <InfoSection
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        }
                        title="Pencegahan"
                    >
                        <p className="text-sm text-gray-600 leading-relaxed">{diseaseRef.pencegahan}</p>
                    </InfoSection>
                )}

                {/* ── Kondisi Sehat ── */}
                {isHealthy && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-emerald-800 mb-1">Tanaman Terdeteksi Sehat</h3>
                            <p className="text-sm text-emerald-700">
                                Tidak ditemukan tanda-tanda penyakit pada daun padi ini. Lanjutkan perawatan rutin dan pantau secara berkala untuk menjaga kesehatan tanaman.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Hapus Scan ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                    <h2 className="text-base font-bold text-red-700 mb-1">Hapus Data Scan</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Setelah dihapus, data scan dan gambar ini tidak dapat dikembalikan.
                    </p>
                    <button
                        onClick={handleHapus}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus Scan Ini
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
