import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function ArtikelIndex({ artikel }) {
    const { flash } = usePage().props;

    const handleDelete = (id, judul) => {
        if (!confirm(`Hapus artikel "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        router.delete(route('admin.artikel.destroy', id));
    };

    const kategoriLabel = {
        penyakit: 'Penyakit',
        pemupukan: 'Pemupukan',
        pasca_panen: 'Pasca Panen',
        teknologi: 'Teknologi',
        umum: 'Umum',
    };

    const kategoriColor = {
        penyakit: 'bg-red-50 text-red-700',
        pemupukan: 'bg-emerald-50 text-emerald-700',
        pasca_panen: 'bg-orange-50 text-orange-700',
        teknologi: 'bg-blue-50 text-blue-700',
        umum: 'bg-gray-100 text-gray-700',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola artikel edukasi pertanian</p>
                    </div>
                    <Link
                        href={route('admin.artikel.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        + Tulis Artikel
                    </Link>
                </div>
            }
        >
            <Head title="Manajemen Artikel" />

            <div className="space-y-5">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-5 py-3">Judul</th>
                                    <th className="px-5 py-3">Kategori</th>
                                    <th className="px-5 py-3">Penulis</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                    <th className="px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {artikel.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                            Belum ada artikel.
                                        </td>
                                    </tr>
                                ) : (
                                    artikel.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3 font-medium text-gray-900 max-w-xs">
                                                <span className="line-clamp-2">{item.title}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        kategoriColor[item.category] ?? 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {kategoriLabel[item.category] ?? item.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">
                                                {item.author?.name ?? '-'}
                                            </td>
                                            <td className="px-5 py-3">
                                                {item.is_published ? (
                                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                        Publish
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">
                                                {item.created_at
                                                    ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '-'}
                                            </td>
                                            <td className="px-5 py-3 flex gap-2">
                                                <Link
                                                    href={route('admin.artikel.edit', item.id)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.title)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {artikel.links && artikel.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-1">
                            {artikel.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        link.active
                                            ? 'bg-emerald-500 text-white'
                                            : link.url
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
