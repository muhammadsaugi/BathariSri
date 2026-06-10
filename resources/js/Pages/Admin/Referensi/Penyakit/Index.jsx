import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function PenyakitIndex({ penyakit }) {
    const { flash } = usePage().props;

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const confirmDelete = (id, nama) => {
        setItemToDelete({ id, nama });
        setConfirmingDeletion(true);
    };

    const deleteItem = () => {
        if (!itemToDelete) return;
        router.delete(route('admin.referensi.penyakit.destroy', itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setTimeout(() => setItemToDelete(null), 200);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Referensi Penyakit</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data referensi penyakit padi</p>
                    </div>
                    <Link
                        href={route('admin.referensi.penyakit.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        + Tambah Penyakit
                    </Link>
                </div>
            }
        >
            <Head title="Referensi Penyakit" />

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
                                    <th className="px-5 py-3">Disease Key</th>
                                    <th className="px-5 py-3">Nama (ID)</th>
                                    <th className="px-5 py-3">Nama Ilmiah</th>
                                    <th className="px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {penyakit.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                                            Belum ada data penyakit.
                                        </td>
                                    </tr>
                                ) : (
                                    penyakit.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3 font-mono text-xs text-emerald-700 font-semibold">
                                                {item.disease_key}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-gray-900">{item.nama_id}</td>
                                            <td className="px-5 py-3 text-gray-500 italic">
                                                {item.nama_ilmiah ?? '-'}
                                            </td>
                                            <td className="px-5 py-3 flex gap-2">
                                                <Link
                                                    href={route('admin.referensi.penyakit.edit', item.id)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(item.id, item.nama_id)}
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

                    {penyakit.links && penyakit.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-1">
                            {penyakit.links.map((link, i) => (
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

            <Modal show={confirmingDeletion} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">
                        Konfirmasi Hapus Data
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Apakah Anda yakin ingin menghapus data penyakit <span className="font-semibold text-gray-800">"{itemToDelete?.nama}"</span>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua referensi yang terkait.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <DangerButton onClick={deleteItem}>
                            Ya, Hapus Data
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
