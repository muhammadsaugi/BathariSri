import { usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PetaniLayout({ children, header }) {
    const { has_lahan } = usePage().props;

    return (
        <AuthenticatedLayout header={header}>

            {has_lahan === false && (
                <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium">
                    <svg
                        className="w-5 h-5 text-amber-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        Anda belum memiliki lahan aktif.{' '}
                        <Link
                            href={route('petani.lahan.create')}
                            className="font-bold underline underline-offset-2 hover:text-amber-900"
                        >
                            Tambah lahan sekarang
                        </Link>{' '}
                        untuk menggunakan semua fitur analitik.
                    </span>
                </div>
            )}

            {children}
        </AuthenticatedLayout>
    );
}
