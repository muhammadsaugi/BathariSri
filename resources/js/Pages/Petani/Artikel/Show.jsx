import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';




const KATEGORI_COLORS = {
    penyakit: 'bg-red-100 text-red-700',
    pemupukan: 'bg-emerald-100 text-emerald-700',
    pasca_panen: 'bg-amber-100 text-amber-700',
    teknologi: 'bg-blue-100 text-blue-700',
    umum: 'bg-gray-100 text-gray-700',
};

const KATEGORI_LABELS = {
    penyakit: 'Penyakit',
    pemupukan: 'Pemupukan',
    pasca_panen: 'Pasca Panen',
    teknologi: 'Teknologi',
    umum: 'Umum',
};

function formatTanggal(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}




export default function Show({ artikel }) {
    const badgeClass = KATEGORI_COLORS[artikel.category] ?? KATEGORI_COLORS.umum;
    const badgeLabel = KATEGORI_LABELS[artikel.category] ?? artikel.category;

    return (
        <AuthenticatedLayout>
            <Head title={artikel.title} />

            <div className="max-w-3xl mx-auto w-full px-4 py-6">

                {}
                <Link
                    href={route('petani.artikel.index')}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke Artikel
                </Link>

                {}
                {artikel.thumbnail && (
                    <div className="rounded-2xl overflow-hidden mb-7 aspect-[16/7] bg-gray-100">
                        <img
                            src={artikel.thumbnail}
                            alt={artikel.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {}
                <div className="mb-7">
                    {}
                    <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${badgeClass}`}
                    >
                        {badgeLabel}
                    </span>

                    {}
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-snug mb-4">
                        {artikel.title}
                    </h1>

                    {}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        {artikel.author?.name && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <svg
                                        className="w-3.5 h-3.5 text-emerald-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-medium text-gray-700">{artikel.author.name}</span>
                            </div>
                        )}
                        {artikel.published_at && (
                            <div className="flex items-center gap-1.5">
                                <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>{formatTanggal(artikel.published_at)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {}
                <hr className="border-gray-200 mb-7" />

                {}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    <div
                        className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line"
                        style={{ fontFamily: 'inherit' }}
                    >
                        {artikel.content}
                    </div>
                </div>

                {}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link
                        href={route('petani.artikel.index')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Artikel
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
