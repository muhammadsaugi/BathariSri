import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    FiWind, 
    FiSearch,
    FiBell,
    FiMoreVertical,
    FiThermometer,
    FiDroplet,
    FiSun,
    FiPlus,
    FiCheckCircle,
    FiAlertTriangle,
    FiChevronRight
} from 'react-icons/fi';

export default function SmartNursery() {
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
            <Head title="Smart Nursery" />

            <div className="w-full px-2 lg:px-4 pb-4 lg:pb-0 lg:h-full flex flex-col lg:min-h-0">
                {}
                <div className="hidden lg:flex items-center justify-between mb-8 shrink-0">
                    <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
                        <div className="bg-forest-50 p-2 rounded-full text-forest-500">
                            <FiWind size={18} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">Manajemen Pembibitan</span>
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
                        <div className="lg:absolute lg:inset-0 p-6 lg:p-8 flex flex-col lg:overflow-y-auto hide-scrollbar">
                            <div className="flex items-center justify-between mb-8 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight">Batch Pembibitan Aktif</h2>
                                    <p className="text-gray-500 text-sm mt-1">Padi Ciherang (Batch A) - Sawah Petak 1</p>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-lg">
                                    Kondisi Optimal
                                </div>
                            </div>

                            {}
                            <div className="flex-1 flex flex-col items-center justify-center relative mb-8 shrink-0">
                                <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                                    {}
                                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" className="stroke-gray-100" strokeWidth="8" fill="none" />
                                        <motion.circle 
                                            cx="50" 
                                            cy="50" 
                                            r="45" 
                                            className="stroke-forest-500" 
                                            strokeWidth="8" 
                                            fill="none" 
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0, 300" }}
                                            animate={{ strokeDasharray: "190, 300" }} 
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="text-5xl sm:text-6xl font-black text-gray-900 font-sans tracking-tighter">14</span>
                                        <span className="text-gray-500 font-semibold text-sm uppercase tracking-wider mt-1">Hari</span>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="font-bold text-gray-900 text-lg">Fase Pertumbuhan Daun</p>
                                    <p className="text-sm text-gray-500">Estimasi siap pindah tanam: 7 hari lagi</p>
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 mt-auto">
                                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start gap-3">
                                    <div className="bg-orange-100 p-2 rounded-xl text-orange-500">
                                        <FiThermometer size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Suhu</p>
                                        <p className="text-xl font-bold text-gray-900">28°C</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Optimal</p>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-xl text-blue-500">
                                        <FiDroplet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Kelembapan</p>
                                        <p className="text-xl font-bold text-gray-900">65%</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Tanah Basah</p>
                                    </div>
                                </div>

                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                                    <div className="bg-amber-100 p-2 rounded-xl text-amber-500">
                                        <FiSun size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Cahaya</p>
                                        <p className="text-xl font-bold text-gray-900">Cerah</p>
                                        <p className="text-[10px] text-gray-500 mt-1">8 jam terpapar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:min-h-0">
                        
                        {}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 shadow-sm shrink-0">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Catat Aktivitas Hari Ini</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-blue-100">
                                    <FiDroplet size={18} />
                                    Siram Bibit
                                </button>
                                <button className="py-3 px-4 bg-forest-50 hover:bg-forest-100 text-forest-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-forest-100">
                                    <FiCheckCircle size={18} />
                                    Beri Pupuk
                                </button>
                                <button className="col-span-2 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-200 border-dashed">
                                    <FiPlus size={18} />
                                    Tambah Batch Baru
                                </button>
                            </div>
                        </motion.div>

                        {}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm lg:flex-1 relative overflow-hidden">
                            <div className="lg:absolute lg:inset-0 p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-4 shrink-0">
                                    <h2 className="text-xl font-bold font-sans text-gray-900 tracking-tight">Semua Batch</h2>
                                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                                        <FiMoreVertical size={16} />
                                    </button>
                                </div>
                                
                                <div className="lg:overflow-y-auto hide-scrollbar lg:flex-1 relative lg:min-h-0">
                                    <div className="lg:absolute lg:inset-0">
                                        <div className="space-y-3 pr-2">
                                            
                                            {}
                                            <div className="p-4 rounded-2xl border border-gray-100 hover:border-forest-200 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-forest-600 transition-colors">Padi Inpari (Batch C)</h4>
                                                        <p className="text-xs text-gray-500">Mulai: 01 Mei 2026</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-forest-100 text-forest-700 text-[10px] font-bold uppercase rounded-md">Siap Tanam</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                        <span className="w-2 h-2 rounded-full bg-forest-500"></span> Hari ke-21
                                                    </div>
                                                    <FiChevronRight className="text-gray-400 group-hover:text-forest-500 transition-colors" />
                                                </div>
                                            </div>

                                            {}
                                            <div className="p-4 rounded-2xl border border-gray-100 hover:border-forest-200 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 group-hover:text-forest-600 transition-colors">Padi IR64 (Batch B)</h4>
                                                        <p className="text-xs text-gray-500">Mulai: 20 Mei 2026</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[10px] font-bold uppercase rounded-md">Fase Semai</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                        <span className="w-2 h-2 rounded-full bg-sky-500"></span> Hari ke-6
                                                    </div>
                                                    <FiChevronRight className="text-gray-400 group-hover:text-forest-500 transition-colors" />
                                                </div>
                                            </div>

                                            {}
                                            <div className="p-4 rounded-2xl border border-red-100 bg-red-50/30 hover:shadow-md transition-all cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">Padi Ciherang (Batch D)</h4>
                                                        <p className="text-xs text-gray-500">Mulai: 22 Mei 2026</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                                                        <FiAlertTriangle size={10} /> Butuh Air
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Hari ke-4
                                                    </div>
                                                    <button className="text-xs font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 px-2 py-1 rounded">Siram Sekarang</button>
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
