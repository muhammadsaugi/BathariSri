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
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}




function ArtikelCard({ artikel }) {
    const badgeClass = KATEGORI_COLORS[artikel.category] ?? KATEGORI_COLORS.umum;
    const badgeLabel = KATEGORI_LABELS[artikel.category] ?? artikel.category;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {}
            {artikel.thumbnail ? (
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                        src={artikel.thumbnail}
                        alt={artikel.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-emerald-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                    </svg>
                </div>
            )}

            {}
            <div className="flex flex-col flex-1 p-5">
                {}
                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${badgeClass}`}>
                    {badgeLabel}
                </span>

                {}
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
                    {artikel.title}
                </h3>

                {}
                <p className="text-xs text-gray-400 mb-4">
                    {formatTanggal(artikel.published_at)}
                </p>

                {}
                <div className="mt-auto">
                    <Link
                        href={route('petani.artikel.show', artikel.slug)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                        Baca Selengkapnya
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}




function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1.5 mt-8">
            {links.map((link, idx) => {
                if (link.url === null) {
                    return (
                        <span
                            key={idx}
                            className="px-3 py-1.5 text-sm rounded-lg text-gray-400 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={idx}
                        href={link.url}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            link.active
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}




export default function Index({ artikels }) {
    const hasData = artikels?.data?.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Artikel & Tips Pertanian
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Baca panduan dan informasi terkini seputar budidaya padi.
                    </p>
                </div>
            }
        >
            <Head title="Artikel Pertanian" />

            <div className="max-w-6xl mx-auto w-full">
                {hasData ? (
                    <>
                        {}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {artikels.data.map((artikel) => (
                                <ArtikelCard key={artikel.id} artikel={artikel} />
                            ))}
                        </div>
                        {}
                        <Pagination links={artikels.links} />
                    </>
                ) : (
                    
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-7 h-7 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-700 mb-1">Belum ada artikel</h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Artikel pertanian belum tersedia saat ini. Silakan kembali lagi nanti.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
