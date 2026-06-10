import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function LimbahIndex({ limbah }) {
    const { flash } = usePage().props;

    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const confirmDelete = (id, nama) => {
        setItemToDelete({ id, nama });
        setConfirmingDeletion(true);
    };

    const deleteItem = () => {
        if (!itemToDelete) return;
        router.delete(route('admin.referensi.limbah.destroy', itemToDelete.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setConfirmingDeletion(false);
        setTimeout(() => setItemToDelete(null), 200);
    };

    const jenisLabel = {
        jerami: 'Jerami',
        sekam: 'Sekam',
        dedak: 'Dedak',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Referensi Harga Limbah</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data harga dan metode pengolahan limbah padi</p>
                    </div>
                    <Link
                        href={route('admin.referensi.limbah.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        + Tambah Limbah
                    </Link>
                </div>
            }
        >
            <Head title="Referensi Harga Limbah" />

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
                                    <th className="px-5 py-3">Jenis Limbah</th>
                                    <th className="px-5 py-3">Metode Pengolahan</th>
                                    <th className="px-5 py-3">Harga per kg</th>
                                    <th className="px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {limbah.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                                            Belum ada data limbah.
                                        </td>
                                    </tr>
                                ) : (
                                    limbah.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                                            <td className="px-5 py-3">
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                                                    {jenisLabel[item.jenis_limbah] ?? item.jenis_limbah}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-gray-700">{item.metode_pengolahan}</td>
                                            <td className="px-5 py-3 text-gray-700">
                                                Rp {Number(item.harga_per_kg).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-5 py-3 flex gap-2">
                                                <Link
                                                    href={route('admin.referensi.limbah.edit', item.id)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(item.id, jenisLabel[item.jenis_limbah] ?? item.jenis_limbah)}
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

                    {limbah.links && limbah.links.length > 3 && (
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-1">
                            {limbah.links.map((link, i) => (
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
                        Apakah Anda yakin ingin menghapus data referensi limbah <span className="font-semibold text-gray-800">"{itemToDelete?.nama}"</span>? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua referensi yang terkait.
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
