import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ lahans }) {
    const { flash } = usePage().props;

    function handleHapus(lahan) {
        if (confirm(`Hapus lahan "${lahan.nama_lahan}"? Lahan tidak akan ditampilkan lagi.`)) {
            router.delete(route('petani.lahan.destroy', lahan.id));
        }
    }

    const labelJenisTanah = {
        liat: 'Tanah Liat',
        lempung: 'Tanah Lempung',
        pasir: 'Tanah Pasir',
    };

    const labelSumberAir = {
        irigasi_teknis: 'Irigasi Teknis',
        tadah_hujan: 'Tadah Hujan',
        pompa: 'Pompa Air',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lahan Saya" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Flash Message */}
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
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Lahan Saya</h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Kelola data sawah Anda untuk analitik pertanian yang akurat.
                        </p>
                    </div>
                    <Link
                        href={route('petani.lahan.create')}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Lahan
                    </Link>
                </div>

                {/* Empty State */}
                {lahans.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 flex flex-col items-center text-center shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Belum ada lahan</h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-xs">
                            Tambah lahan pertama Anda untuk mulai menggunakan modul analitik pertanian BathariSri.
                        </p>
                        <Link
                            href={route('petani.lahan.create')}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Lahan Pertama
                        </Link>
                    </div>
                ) : (
                    /* Tabel Lahan */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Lahan</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Luas Lahan</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lokasi</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Jenis Tanah</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sumber Air</th>
                                        <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {lahans.map((lahan) => (
                                        <tr key={lahan.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-4">
                                                <span className="font-semibold text-gray-900">{lahan.nama_lahan}</span>
                                                {lahan.varietas_default && (
                                                    <span className="ml-2 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                                        {lahan.varietas_default}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-gray-700 font-medium">
                                                {lahan.luas_m2 ? (lahan.luas_m2 / 10000).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 4 }) : 0} Ha
                                                <div className="text-xs text-gray-400">
                                                    ({lahan.luas_m2 ? Number(lahan.luas_m2).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0} m²)
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                <div>{lahan.desa}</div>
                                                <div className="text-xs text-gray-400">{lahan.kecamatan}, {lahan.kabupaten}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                    {labelJenisTanah[lahan.jenis_tanah] ?? lahan.jenis_tanah}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {labelSumberAir[lahan.sumber_air] ?? lahan.sumber_air}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('petani.lahan.edit', lahan.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleHapus(lahan)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
