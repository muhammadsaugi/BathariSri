import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function AdminLayout({ children, header }) {
    return (
        <AuthenticatedLayout header={header}>
            {children}
        </AuthenticatedLayout>
    );
}
