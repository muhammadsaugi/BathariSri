import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    FiTrash2, 
    FiSearch,
    FiBell,
    FiMoreVertical,
    FiPlus,
    FiThermometer,
    FiRefreshCcw,
    FiCheckCircle,
    FiArrowRight,
    FiAward,
    FiTrendingUp
} from 'react-icons/fi';

export default function SmartWaste() {
    const user = usePage().props.auth.user;

    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Smart Waste" />

            <div className="w-full px-2 lg:px-4 pb-4 lg:pb-0 lg:h-full flex flex-col lg:min-h-0">
                {}
                <div className="hidden lg:flex items-center justify-between mb-8 shrink-0">
                    <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
                        <div className="bg-orange-50 p-2 rounded-full text-orange-500">
                            <FiTrash2 size={18} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">Manajemen Limbah Pintar</span>
                    </div>
                    
                    {}
                    <div className="flex items-center gap-3 ml-auto">
                        <button className="w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-[1.25rem] shadow-md hover:bg-gray-800 transition-colors">
                            <FiSearch size={20} />
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center bg-forest-100 text-forest-600 rounded-[1.25rem] shadow-sm hover:bg-forest-200 transition-colors relative">
                            <FiBell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-forest-100"></span>
                        </button>
                        <div className="flex items-center gap-3 bg-white p-1 pr-4 rounded-[1.25rem] shadow-sm cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-600 font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                            <FiMoreVertical className="text-gray-400 ml-2" />
                        </div>
                    </div>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:flex-1 lg:min-h-0"
                >
                    {}
                    <motion.div variants={itemVariants} className="lg:col-span-7 bg-white rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col lg:min-h-[500px]">
                        <div className="lg:absolute lg:inset-0 p-6 sm:p-8 flex flex-col lg:overflow-y-auto hide-scrollbar">
                            
                            {}
                            <div className="bg-gradient-to-br from-forest-500 to-forest-700 rounded-[1.5rem] p-6 text-white shadow-lg shadow-forest-500/20 mb-8 shrink-0 relative overflow-hidden group">
                                <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <FiAward size={150} />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-forest-100 font-medium mb-1 uppercase tracking-wider text-xs">Pencapaian Eco-Farming</p>
                                        <h2 className="text-4xl sm:text-5xl font-black font-sans tracking-tight mb-2">520 Kg</h2>
                                        <p className="text-forest-50 text-sm max-w-sm leading-relaxed">
                                            Jerami diselamatkan bulan ini. Anda telah secara signifikan mengurangi polusi udara dengan tidak membakarnya!
                                        </p>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px] border border-white/10 shrink-0">
                                        <FiTrendingUp size={24} className="mb-2 text-green-300" />
                                        <span className="text-xs text-forest-100 mb-1">Target Bulan Ini</span>
                                        <span className="text-xl font-bold">85%</span>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <h3 className="text-xl font-bold font-sans text-gray-900 tracking-tight">Tong Kompos Utama</h3>
                                <div className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    Fermentasi Aktif
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-[1.5rem] p-6 flex-1 border border-gray-100 flex flex-col justify-center min-h-[250px] relative">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 mb-1">Tumpukan Jerami & Sekam (Sawah A)</p>
                                        <p className="text-3xl font-black text-gray-900 tracking-tight">60% <span className="text-sm font-medium text-gray-500 ml-1">Matang</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">Estimasi Selesai</p>
                                        <p className="text-lg font-bold text-gray-900">14 Hari lagi</p>
                                    </div>
                                </div>

                                {}
                                <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex relative shadow-inner mb-6">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 relative"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "60%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 stripe-pattern"></div>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
                                            <FiThermometer size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Suhu Inti</p>
                                            <p className="font-bold text-gray-900 text-lg">62°C</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                                            <FiRefreshCcw size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Pembalikan</p>
                                            <p className="font-bold text-gray-900 text-lg">3 Hari Lalu</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:min-h-0">
                        
                        {}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 shadow-sm shrink-0 border-t-4 border-orange-500">
                            <h3 className="font-bold text-gray-900 mb-5 text-lg">Manajemen Harian</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-3 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-orange-100 shadow-sm">
                                    <FiPlus size={18} />
                                    Limbah Baru
                                </button>
                                <button className="py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-gray-200 shadow-sm">
                                    <FiThermometer size={18} />
                                    Catat Suhu
                                </button>
                            </div>
                        </motion.div>

                        {}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm lg:flex-1 relative overflow-hidden">
                            <div className="lg:absolute lg:inset-0 p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-4 shrink-0">
                                    <h2 className="text-xl font-bold font-sans text-gray-900 tracking-tight">Daftar Pengolahan</h2>
                                    <button className="text-sm font-medium text-forest-600 hover:text-forest-700 flex items-center gap-1 group">
                                        Lihat Semua 
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                
                                <div className="lg:overflow-y-auto hide-scrollbar lg:flex-1 relative lg:min-h-0">
                                    <div className="lg:absolute lg:inset-0">
                                        <div className="space-y-3 pr-2">
                                            
                                            {}
                                            <div className="p-4 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">Kompos Bokashi Sekam</h4>
                                                        <p className="text-xs text-gray-500">Masuk: 10 April 2026</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                                                        <FiCheckCircle size={10} /> Siap Pakai
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                                    <span className="text-xs font-semibold text-gray-500">Tersedia: <span className="text-gray-900">150 Kg</span></span>
                                                    <button className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg shadow-sm">Gunakan</button>
                                                </div>
                                            </div>

                                            {}
                                            <div className="p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Sisa Jerami Panen B</h4>
                                                        <p className="text-xs text-gray-500">Masuk: Kemarin</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded-md">
                                                        Baru Masuk
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-4">
                                                        <div className="bg-gray-400 h-1.5 rounded-full" style={{width: '5%'}}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900">5%</span>
                                                </div>
                                            </div>
                                            
                                            {}
                                            <div className="p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Campuran Kotoran Sapi</h4>
                                                        <p className="text-xs text-gray-500">Masuk: 02 Mei 2026</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md">
                                                        Fermentasi
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-4">
                                                        <div className="bg-amber-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-900">85%</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
