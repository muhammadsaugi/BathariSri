import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ArtikelCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: '',
        thumbnail: '',
        is_published: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.artikel.store'));
    };

    const inputClass =
        'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.artikel.index')}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← Kembali
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tulis Artikel Baru</h1>
                        <p className="text-sm text-gray-500 mt-1">Buat konten edukasi pertanian untuk petani</p>
                    </div>
                </div>
            }
        >
            <Head title="Tulis Artikel Baru" />

            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Judul Artikel <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={inputClass}
                            placeholder="Masukkan judul artikel..."
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                <option value="penyakit">Penyakit</option>
                                <option value="pemupukan">Pemupukan</option>
                                <option value="pasca_panen">Pasca Panen</option>
                                <option value="teknologi">Teknologi</option>
                                <option value="umum">Umum</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                URL Thumbnail (opsional)
                            </label>
                            <input
                                type="text"
                                value={data.thumbnail}
                                onChange={(e) => setData('thumbnail', e.target.value)}
                                className={inputClass}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Konten Artikel <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={14}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y"
                            placeholder="Tulis isi artikel di sini..."
                        />
                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={data.is_published}
                            onChange={(e) => setData('is_published', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Publikasikan artikel sekarang
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Artikel'}
                        </button>
                        <Link
                            href={route('admin.artikel.index')}
                            className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
