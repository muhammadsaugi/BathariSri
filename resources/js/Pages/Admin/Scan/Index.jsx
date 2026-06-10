import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ScanIndex({ scans, filters }) {
    const { flash } = usePage().props;
    const [form, setForm] = useState({
        predicted_class: filters?.predicted_class ?? '',
        date_from: filters?.date_from ?? '',
        date_to: filters?.date_to ?? '',
    });

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.scan.index'), form, { preserveScroll: true });
    };

    const handleReset = () => {
        setForm({ predicted_class: '', date_from: '', date_to: '' });
        router.get(route('admin.scan.index'), {});
    };

    const severityBadge = (severity) => {
        if (!severity) return <span className="text-gray-400">-</span>;
        const map = {
            mild: 'bg-yellow-100 text-yellow-700',
            moderate: 'bg-orange-100 text-orange-700',
            severe: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[severity] ?? 'bg-gray-100 text-gray-600'}`}>
                {severity}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Scan Penyakit</h1>
                        <p className="text-sm text-gray-500 mt-1">Semua hasil scan penyakit dari seluruh petani</p>
                    </div>
                    <Link
                        href={route('admin.scan.export')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        Export CSV
                    </Link>
                </div>
            }
        >
            <Head title="Riwayat Scan Penyakit" />

            <div className="space-y-5">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                {/* Form Filter */}
                <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                                Penyakit
                            </label>
                            <input
                                type="text"
                                value={form.predicted_class}
                                onChange={(e) => setForm({ ...form, predicted_class: e.target.value })}
                                placeholder="Misal: blast"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={form.date_from}
                                onChange={(e) => setForm({ ...form, date_from: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={form.date_to}
                                onChange={(e) => setForm({ ...form, date_to: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                            >
                                Filter
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                {/* Tabel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-5 py-3">ID Scan</th>
                                    <th className="px-5 py-3">Nama Petani</th>
                                    <th className="px-5 py-3">Lahan</th>
                                    <th className="px-5 py-3">Penyakit</th>
                                    <th className="px-5 py-3">Confidence</th>
                                    <th className="px-5 py-3">Severity</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {scans.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                                            Tidak ada data scan.
                                        </td>
                                    </tr>
                                ) : (
                                    scans.data.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3 text-gray-500 font-mono text-xs">{scan.id}</td>
                                            <td className="px-5 py-3 font-medium text-gray-900">
                                                {scan.user?.name ?? '-'}
                                            </td>
                                            <td className="px-5 py-3 text-gray-600">
                                                {scan.lahan?.nama_lahan ?? '-'}
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">
                                                {scan.predicted_class ?? '-'}
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">
                                                {scan.confidence != null
                                                    ? `${(scan.confidence * 100).toFixed(1)}%`
                                                    : '-'}
                                            </td>
                                            <td className="px-5 py-3">
                                                {severityBadge(scan.severity)}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500">
                                                {scan.scanned_at
                                                    ? new Date(scan.scanned_at).toLocaleDateString('id-ID', {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {scans.links && scans.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-1">
                            {scans.links.map((link, i) => (
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
