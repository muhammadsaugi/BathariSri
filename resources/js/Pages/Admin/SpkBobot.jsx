import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const MODULS = ['M3', 'M4', 'M5'];

const MODUL_LABEL = {
    M3: 'M3 — Rekomendasi Pemupukan',
    M4: 'M4 — Prediksi Panen',
    M5: 'M5 — Pengelolaan Limbah',
};

function isValid(total) {
    return Math.abs(total - 1.0) < 0.001;
}

export default function SpkBobot({ configs }) {
    const { flash, errors: serverErrors } = usePage().props;

    
    const buildInitialWeights = () => {
        const map = {};
        MODULS.forEach((modul) => {
            const items = configs[modul] ?? [];
            map[modul] = items.map((item) => ({
                id: item.id,
                kriteria_nama: item.kriteria_nama,
                bobot: String(item.bobot),
                jenis: item.jenis,
            }));
        });
        return map;
    };

    const [weights, setWeights] = useState(buildInitialWeights);
    const [submitting, setSubmitting] = useState(false);
    const [resetting, setResetting] = useState(null);

    
    useEffect(() => {
        setWeights(buildInitialWeights());
    }, [configs]);

    const updateField = (modul, idx, field, value) => {
        setWeights((prev) => {
            const updated = prev[modul].map((item, i) =>
                i === idx ? { ...item, [field]: value } : item
            );
            return { ...prev, [modul]: updated };
        });
    };

    const getTotalBobot = (modul) => {
        return weights[modul]?.reduce((sum, w) => sum + (parseFloat(w.bobot) || 0), 0) ?? 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        
        for (const modul of MODULS) {
            const total = getTotalBobot(modul);
            if (!isValid(total)) {
                alert(`Total bobot ${modul} = ${total.toFixed(4)}. Harus tepat 1.000.`);
                return;
            }
        }

        const allWeights = MODULS.flatMap((modul) =>
            weights[modul].map((w) => ({
                id: w.id,
                bobot: parseFloat(w.bobot),
                jenis: w.jenis,
            }))
        );

        setSubmitting(true);
        router.put(
            route('admin.spk.update'),
            { weights: allWeights },
            {
                onFinish: () => setSubmitting(false),
                preserveScroll: true,
            }
        );
    };

    const handleReset = (modul) => {
        if (!confirm(`Reset bobot ${modul} ke nilai default?`)) return;
        setResetting(modul);
        router.post(
            route('admin.spk.reset'),
            { modul },
            {
                onFinish: () => setResetting(null),
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Bobot SPK</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Atur bobot kriteria Algoritma SPK untuk setiap modul. Total bobot per modul harus tepat 1.000.
                    </p>
                </div>
            }
        >
            <Head title="Konfigurasi Bobot SPK" />

            <div className="space-y-5">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                        {flash.success}
                    </div>
                )}
                {serverErrors?.weights && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                        {serverErrors.weights}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {MODULS.map((modul) => {
                        const total = getTotalBobot(modul);
                        const valid = isValid(total);
                        const items = weights[modul] ?? [];

                        return (
                            <div key={modul} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-gray-800">{MODUL_LABEL[modul]}</h2>
                                        <p className={`text-sm font-semibold mt-0.5 ${valid ? 'text-emerald-600' : 'text-red-600'}`}>
                                            Total bobot: {total.toFixed(4)}
                                            {!valid && ' ⚠ Tidak valid'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleReset(modul)}
                                        disabled={resetting === modul}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60"
                                    >
                                        {resetting === modul ? 'Mereset...' : 'Reset ke Default'}
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                                            <tr>
                                                <th className="px-5 py-3 text-left">Kriteria</th>
                                                <th className="px-5 py-3 text-left">Bobot</th>
                                                <th className="px-5 py-3 text-left">Jenis</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {items.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-gray-50/60">
                                                    <td className="px-5 py-3 font-medium text-gray-800 capitalize">
                                                        {item.kriteria_nama.replace(/_/g, ' ')}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <input
                                                            type="number"
                                                            step="0.001"
                                                            min="0.01"
                                                            max="0.99"
                                                            value={item.bobot}
                                                            onChange={(e) =>
                                                                updateField(modul, idx, 'bobot', e.target.value)
                                                            }
                                                            className="w-28 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                        />
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <select
                                                            value={item.jenis}
                                                            onChange={(e) =>
                                                                updateField(modul, idx, 'jenis', e.target.value)
                                                            }
                                                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                        >
                                                            <option value="benefit">Benefit</option>
                                                            <option value="cost">Cost</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan Semua Bobot'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
