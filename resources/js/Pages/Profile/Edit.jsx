import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';



const panelVariants = {
    hidden : { opacity: 0, y: 16 },
    show   : { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit   : { opacity: 0, y: -8, transition: { duration: 0.2 } },
};



const NAV = [
    {
        id    : 'profil',
        label : 'Profil & Kontak',
        icon  : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        id    : 'keamanan',
        label : 'Keamanan',
        icon  : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
    },
    {
        id    : 'bahaya',
        label : 'Zona Bahaya',
        icon  : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        danger: true,
    },
];



function SectionCard({ title, subtitle, accent, children }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {}
            <div className={`px-8 py-6 border-b ${accent ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <h2 className={`text-lg font-black tracking-tight ${accent ? 'text-red-700' : 'text-slate-900'}`}>
                    {title}
                </h2>
                <p className={`text-sm font-medium mt-1 ${accent ? 'text-red-500/80' : 'text-slate-500'}`}>
                    {subtitle}
                </p>
            </div>
            {}
            <div className="px-8 py-8">
                {children}
            </div>
        </div>
    );
}



function AvatarBubble({ name, size = 'lg' }) {
    const initials = name
        ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
        : '?';

    const dim = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm';

    return (
        <div className={`${dim} rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-white shadow-lg shrink-0`}>
            {initials}
        </div>
    );
}



function InfoChip({ icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-400 text-sm">
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5 break-all">{value}</p>
            </div>
        </div>
    );
}



export default function Edit({ mustVerifyEmail, status }) {
    const user             = usePage().props.auth.user;
    const [active, setActive] = useState('profil');

    const memberSince = user.created_at
        ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
        : null;

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Akun" />

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-slate-900 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden"
                >
                    {}
                    <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500 opacity-[0.1] blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-10  w-56 h-56 rounded-full bg-teal-400  opacity-[0.08] blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {}
                        <AvatarBubble name={user.name} size="lg" />

                        {}
                        <div className="flex-1 min-w-0">
                            <p className="text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-1">
                                Akun {user.role ?? 'Petani'}
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                                {user.name}
                            </h1>
                            <p className="text-slate-400 text-sm font-medium mt-1 truncate">{user.email}</p>
                        </div>

                        {}
                        <div className="flex flex-wrap gap-2">
                            {memberSince && (
                                <span className="inline-flex items-center gap-1.5 bg-white/10 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    📅 Bergabung {memberSince}
                                </span>
                            )}
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.is_active !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                {user.is_active !== false ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

                    {}
                    <motion.aside
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="lg:col-span-4 space-y-5"
                    >
                        {}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-3">Menu</p>
                            <nav className="space-y-1">
                                {NAV.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActive(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                            active === item.id
                                                ? item.danger
                                                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                                                    : 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                                                : item.danger
                                                    ? 'text-red-500 hover:bg-red-50'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Info Kontak</p>
                            <InfoChip icon="📧" label="Email"   value={user.email}  />
                            <InfoChip icon="📱" label="Telepon" value={user.phone}  />
                            <InfoChip icon="📍" label="Alamat"  value={user.alamat} />
                            {!user.phone && !user.alamat && (
                                <p className="text-xs text-slate-400 font-medium italic text-center py-2">
                                    Lengkapi profil Anda agar informasi kontak muncul di sini.
                                </p>
                            )}
                        </div>
                    </motion.aside>

                    {}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">

                            {}
                            {active === 'profil' && (
                                <motion.div
                                    key="profil"
                                    variants={panelVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                >
                                    <SectionCard
                                        title="Informasi Profil & Kontak"
                                        subtitle="Perbarui nama, email, nomor telepon, dan alamat Anda."
                                    >
                                        <UpdateProfileInformationForm
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                        />
                                    </SectionCard>
                                </motion.div>
                            )}

                            {}
                            {active === 'keamanan' && (
                                <motion.div
                                    key="keamanan"
                                    variants={panelVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    <SectionCard
                                        title="Ubah Kata Sandi"
                                        subtitle="Gunakan kata sandi yang panjang dan acak agar akun Anda tetap aman."
                                    >
                                        <UpdatePasswordForm />
                                    </SectionCard>

                                    {}
                                    <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 space-y-3">
                                        <p className="text-sm font-bold text-slate-700">💡 Tips Keamanan Akun</p>
                                        <ul className="space-y-2">
                                            {[
                                                'Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.',
                                                'Jangan gunakan kata sandi yang sama dengan akun lain.',
                                                'Jangan bagikan kata sandi kepada siapapun termasuk admin.',
                                            ].map((tip, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                                                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            {}
                            {active === 'bahaya' && (
                                <motion.div
                                    key="bahaya"
                                    variants={panelVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                    className="space-y-6"
                                >
                                    {}
                                    <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-3xl px-6 py-5">
                                        <span className="text-2xl shrink-0">⚠️</span>
                                        <div>
                                            <p className="text-sm font-black text-red-800 mb-1">Tindakan ini tidak dapat dibatalkan</p>
                                            <p className="text-sm text-red-600 font-medium leading-relaxed">
                                                Setelah akun Anda dihapus, semua data pertanian, lahan, riwayat scan, dan rekomendasi SPK akan hilang secara permanen.
                                                Pastikan Anda telah menyimpan semua data penting sebelum melanjutkan.
                                            </p>
                                        </div>
                                    </div>

                                    <SectionCard
                                        title="Hapus Akun"
                                        subtitle="Hapus akun beserta seluruh data yang terkait secara permanen."
                                        accent
                                    >
                                        <DeleteUserForm />
                                    </SectionCard>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
