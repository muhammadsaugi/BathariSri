import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminDashboard({ stats, scanPerHari, distribusiPenyakit, scanTerbaru }) {
    const statCards = [
        {
            label: 'Petani Aktif',
            value: stats.totalPetaniAktif,
            color: 'bg-blue-50 text-blue-600',
            badge: 'bg-blue-100',
        },
        {
            label: 'Scan Bulan Ini',
            value: stats.totalScanBulanIni,
            color: 'bg-emerald-50 text-emerald-600',
            badge: 'bg-emerald-100',
        },
        {
            label: 'SPK Bulan Ini',
            value: stats.totalSpkBulanIni,
            color: 'bg-purple-50 text-purple-600',
            badge: 'bg-purple-100',
        },
        {
            label: 'Artikel Publish',
            value: stats.totalArtikelPublish,
            color: 'bg-orange-50 text-orange-600',
            badge: 'bg-orange-100',
        },
    ];

    // Hitung max total untuk skala bar chart
    const maxScan = scanPerHari.length > 0 ? Math.max(...scanPerHari.map(d => d.total), 1) : 1;

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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                    <p className="text-sm text-gray-500 mt-1">Ringkasan aktivitas platform BathariSri</p>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div key={card.label} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100`}>
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${card.badge}`}>
                                <span className={`text-lg font-bold ${card.color.split(' ')[1]}`}>
                                    {card.value}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart: Scan Per Hari */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800 mb-5">Scan Per Hari (7 Hari Terakhir)</h2>
                        {scanPerHari.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">Belum ada data scan.</p>
                        ) : (
                            <div className="flex items-end gap-3 h-40">
                                {scanPerHari.map((item) => {
                                    const heightPct = Math.round((item.total / maxScan) * 100);
                                    return (
                                        <div key={item.tanggal} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-xs font-semibold text-emerald-600">{item.total}</span>
                                            <div className="w-full bg-gray-100 rounded-t-lg flex items-end" style={{ height: '7rem' }}>
                                                <div
                                                    className="w-full bg-emerald-500 rounded-t-lg transition-all"
                                                    style={{ height: `${heightPct}%`, minHeight: '4px' }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-gray-400 text-center leading-tight">
                                                {item.tanggal?.slice(5)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Distribusi Penyakit */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800 mb-4">Distribusi Penyakit</h2>
                        {distribusiPenyakit.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">Belum ada data.</p>
                        ) : (
                            <ul className="space-y-3">
                                {distribusiPenyakit.map((item) => (
                                    <li key={item.predicted_class} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700 truncate max-w-[70%]">{item.predicted_class || 'Unknown'}</span>
                                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            {item.total}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Tabel Scan Terbaru */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-800">Scan Terbaru</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-5 py-3">Nama Petani</th>
                                    <th className="px-5 py-3">Lahan</th>
                                    <th className="px-5 py-3">Penyakit</th>
                                    <th className="px-5 py-3">Confidence</th>
                                    <th className="px-5 py-3">Severity</th>
                                    <th className="px-5 py-3">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {scanTerbaru.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                                            Belum ada data scan.
                                        </td>
                                    </tr>
                                ) : (
                                    scanTerbaru.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-gray-50/60 transition-colors">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
