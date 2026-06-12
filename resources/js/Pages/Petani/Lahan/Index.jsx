import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const labelTanah = { liat: 'Tanah Liat', lempung: 'Tanah Lempung', pasir: 'Tanah Pasir' };
const labelAir   = { irigasi_teknis: 'Irigasi Teknis', tadah_hujan: 'Tadah Hujan', pompa: 'Pompa Air' };

export default function Index({ lahans }) {
    const { flash } = usePage().props;

    const handleHapus = (lahan) => {
        if (confirm(`Hapus lahan "${lahan.nama_lahan}"?`)) router.delete(route('petani.lahan.destroy', lahan.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lahan Saya" />

            <div className="rounded-2xl bg-gradient-to-br from-[#166534] to-[#15803d] px-6 py-5 mb-5 text-white">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[20px] font-semibold mb-0.5" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Lahan Saya</h1>
                        <p className="text-[13px] text-green-200">Kelola data sawah Anda untuk analitik pertanian yang akurat.</p>
                    </div>
                    <Link href={route('petani.lahan.create')} className="shrink-0 inline-flex items-center gap-2 bg-white text-[#166534] font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-green-50 transition-colors">
                        + Tambah Lahan
                    </Link>
                </div>
            </div>

            {flash?.success && <div className="mb-4 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-4 py-3 rounded-xl text-[13px] font-medium">{flash.success}</div>}
            {flash?.error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[13px] font-medium">{flash.error}</div>}

            {lahans.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-zinc-200 py-16 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-[#f0fdf4] rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-[16px] font-semibold text-zinc-800 mb-1">Belum ada lahan</h3>
                    <p className="text-[13px] text-zinc-500 mb-6 max-w-xs">Tambah lahan pertama Anda untuk mulai menggunakan fitur analitik pertanian.</p>
                    <Link href={route('petani.lahan.create')} className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#15803d] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-[14px]">
                        Tambah Lahan Pertama
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px] text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-100">
                                <tr>
                                    {['Nama Lahan', 'Luas', 'Lokasi', 'Jenis Tanah', 'Sumber Air', 'Aksi'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {lahans.map((lahan) => (
                                    <tr key={lahan.id} className="hover:bg-zinc-50/60 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className="font-semibold text-zinc-900">{lahan.nama_lahan}</span>
                                            {lahan.varietas_default && (
                                                <span className="ml-2 text-[11px] bg-[#f0fdf4] text-[#166534] px-2 py-0.5 rounded-full font-medium">{lahan.varietas_default}</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-zinc-700 font-medium">
                                            {lahan.luas_m2 ? (lahan.luas_m2 / 10000).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : 0} Ha
                                            <div className="text-[11px] text-zinc-400">{lahan.luas_m2 ? Number(lahan.luas_m2).toLocaleString('id-ID') : 0} m²</div>
                                        </td>
                                        <td className="px-5 py-3.5 text-zinc-600">
                                            <div>{lahan.desa}</div>
                                            <div className="text-[12px] text-zinc-400">{lahan.kecamatan}, {lahan.kabupaten}</div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700">
                                                {labelTanah[lahan.jenis_tanah] ?? lahan.jenis_tanah}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700">
                                                {labelAir[lahan.sumber_air] ?? lahan.sumber_air}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <Link href={route('petani.lahan.edit', lahan.id)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#166534] bg-[#f0fdf4] hover:bg-[#dcfce7] px-3 py-1.5 rounded-lg transition-colors">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleHapus(lahan)} className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
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
        </AuthenticatedLayout>
    );
}
