import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid,
    FiCamera,
    FiSettings,
    FiLogOut,
    FiX,
    FiMapPin,
    FiCalendar,
    FiBookOpen,
    FiBarChart2,
    FiUsers,
    FiSliders,
    FiFileText,
} from 'react-icons/fi';

// ─── Menu per role ────────────────────────────────────────────────────────────

function getPetaniMenu() {
    return [
        { name: 'Dashboard',         icon: FiGrid,      href: route('petani.dashboard') },
        { name: 'Lahan Saya',        icon: FiMapPin,    href: route('petani.lahan.index') },
        { name: 'Jadwal Tanam',      icon: FiCalendar,  href: route('petani.tanam.index') },
        { name: 'Deteksi Penyakit',  icon: FiCamera,    href: route('petani.scan.index') },
        { name: 'Rekomendasi Pupuk', icon: FiBarChart2, href: route('petani.spk.pupuk') },
        { name: 'Prediksi Panen',    icon: FiBarChart2, href: route('petani.spk.panen') },
        { name: 'Kelola Limbah',     icon: FiBarChart2, href: route('petani.spk.limbah') },
    ];
}

function getAdminMenu() {
    return [
        { name: 'Dashboard',         icon: FiGrid,       href: route('admin.dashboard') },
        { name: 'Pengguna',          icon: FiUsers,      href: route('admin.users.index') },
        { name: 'Riwayat Scan',      icon: FiCamera,     href: route('admin.scan.index') },
        { name: 'Referensi Pupuk',   icon: FiSettings,   href: route('admin.referensi.pupuk.index') },
        { name: 'Referensi Penyakit', icon: FiSettings,  href: route('admin.referensi.penyakit.index') },
        { name: 'Referensi Varietas', icon: FiSettings,  href: route('admin.referensi.varietas.index') },
        { name: 'Harga Komoditas',   icon: FiBarChart2,  href: route('admin.referensi.harga.index') },
        { name: 'Harga Limbah',      icon: FiBarChart2,  href: route('admin.referensi.limbah.index') },
        { name: 'Bobot SPK',         icon: FiSliders,    href: route('admin.spk.index') },
    ];
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onClose }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const role = user?.role ?? 'petani';

    const menuItems = role === 'admin' ? getAdminMenu() : getPetaniMenu();

    const isActive = (href) => {
        try {
            const path = new URL(href, window.location.origin).pathname;
            return url === path || url.startsWith(path + '/');
        } catch {
            return false;
        }
    };

    function SidebarContent() {
        return (
            <div className="flex h-full flex-col justify-between">
                {/* Top: Logo + Menu */}
                <div>
                    {/* Logo */}
                    <div className="flex items-center justify-between px-2 mb-6">
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <img src="/images/Logo_BathariSri.png" alt="BathariSri Logo" className="h-9 w-auto object-contain" />
                            <span className="text-xl font-bold text-gray-900 tracking-tight">Bathari<span className="text-forest-600">Sri</span></span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-gray-500 hover:text-gray-800 transition-colors p-1"
                        >
                            <FiX size={22} />
                        </button>
                    </div>



                    {/* Nav Items */}
                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                                        active
                                            ? 'bg-forest-600 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-forest-50'
                                    }`}
                                >
                                    <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom: Settings, Logout, Profile */}
                <div>
                    <div className="border-t border-gray-100 my-4" />

                    <Link
                        href={route('profile.edit')}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-gray-500 hover:text-gray-900 hover:bg-forest-50 transition-all duration-200"
                    >
                        <FiSettings size={18} className="text-gray-400" />
                        <span>Pengaturan</span>
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <FiLogOut size={18} className="text-red-400" />
                        <span>Keluar</span>
                    </Link>

                    {/* Mini Profile Card */}
                    {user && (
                        <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                                <span className="text-forest-600 font-bold text-base">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 h-[calc(100vh-2rem)] shrink-0 m-4">
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full h-full bg-white rounded-[2rem] shadow-sm p-5 overflow-y-auto hide-scrollbar"
                >
                    <SidebarContent />
                </motion.div>
            </div>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white p-6 z-50 lg:hidden shadow-xl rounded-r-[2rem]"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
