import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage, Link } from '@inertiajs/react';

export default function UsersIndex({ users }) {
    const { flash } = usePage().props;

    const handleToggle = (user) => {
        const action = user.is_active ? 'nonaktifkan' : 'aktifkan';
        if (!confirm(`Apakah Anda yakin ingin ${action} pengguna ${user.name}?`)) return;
        router.patch(route('admin.users.toggle', user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola akun petani yang terdaftar di platform</p>
                </div>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="space-y-5">
                {/* Flash Message */}
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
                                    <th className="px-5 py-3">ID</th>
                                    <th className="px-5 py-3">Nama</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Jumlah Lahan</th>
                                    <th className="px-5 py-3">Jumlah Scan</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                                            Belum ada pengguna terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3 text-gray-500 font-mono text-xs">{user.id}</td>
                                            <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-5 py-3 text-gray-600">{user.email}</td>
                                            <td className="px-5 py-3 text-gray-700 text-center">
                                                {user.lahans_count ?? 0}
                                            </td>
                                            <td className="px-5 py-3 text-gray-700 text-center">
                                                {user.disease_scans_count ?? 0}
                                            </td>
                                            <td className="px-5 py-3">
                                                {user.is_active ? (
                                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                                                        Nonaktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <button
                                                    onClick={() => handleToggle(user)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                        user.is_active
                                                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    }`}
                                                >
                                                    {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-1">
                            {users.links.map((link, i) => (
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
