import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

/**
 * AdminLayout
 *
 * Wrapper di atas AuthenticatedLayout untuk halaman-halaman admin.
 * Saat ini berfungsi sebagai passthrough kompatibel — semua navigasi admin
 * sudah ditangani oleh Sidebar yang ada di AuthenticatedLayout.
 *
 * Di masa depan, layout ini bisa diperluas dengan navigasi atau
 * header khusus admin tanpa mengubah semua halaman yang sudah ada.
 */
export default function AdminLayout({ children, header }) {
    return (
        <AuthenticatedLayout header={header}>
            {children}
        </AuthenticatedLayout>
    );
}
