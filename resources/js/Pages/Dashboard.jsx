import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
    FiSearch, 
    FiBell, 
    FiMoreVertical, 
    FiPlus, 
    FiCamera, 
    FiWind, 
    FiCloudDrizzle,
    FiCheckCircle
} from 'react-icons/fi';

export default function Dashboard() {
    const user = usePage().props.auth.user;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="w-full px-2 lg:px-4 pb-4 lg:pb-0 lg:h-full flex flex-col lg:min-h-0">
                <div className="hidden lg:flex items-center justify-between mb-8 shrink-0">
                    <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
                        <div className="bg-blue-50 p-2 rounded-full text-blue-500">
                            <FiCloudDrizzle size={18} />
                        </div>
                        <span className="font-medium text-gray-700 text-sm">24°C, Hujan Ringan (Kediri)</span>
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
                    <motion.div variants={itemVariants} className="lg:col-span-5 bg-white rounded-[2rem] shadow-sm relative overflow-hidden">
                        <div className="lg:absolute lg:inset-0 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <h2 className="text-2xl font-black font-sans text-gray-900 tracking-tight">Status Pembibitan</h2>
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                    <FiPlus size={20} />
                                </button>
                            </div>
                            
                            {}
                            <div className="flex flex-wrap gap-2 mb-6 shrink-0">
                                <button className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-sm font-medium">Semua Bibit</button>
                                <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">Butuh Air</button>
                                <button className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50">Siap Tanam</button>
                            </div>

                            {}
                            <div className="space-y-6 lg:flex-1 lg:overflow-y-auto pr-2 lg:min-h-0 relative">
                            {}
                            <div className="group border-b border-gray-50 pb-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-forest-600 transition-colors">Padi Ciherang (Batch A)</h3>
                                        <p className="text-sm text-gray-500">Mulai: 12 Mei 2026</p>
                                    </div>
                                    <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-md">Butuh Air</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                                    <span>Hari ke-14</span>
                                    <span>3 Tindakan</span>
                                </div>
                                {}
                                <div className="flex h-2.5 gap-1">
                                    <div className="w-[66%] bg-green-400 rounded-full relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 stripe-pattern"></div>
                                    </div>
                                    <div className="w-[34%] bg-gray-100 rounded-full border border-gray-200/60"></div>
                                </div>
                            </div>
                            
                            {}
                            <div className="group border-b border-gray-50 pb-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-forest-600 transition-colors">Padi IR64 (Batch B)</h3>
                                        <p className="text-sm text-gray-500">Mulai: 20 Mei 2026</p>
                                    </div>
                                    <span className="bg-forest-100 text-forest-700 text-xs font-semibold px-2.5 py-1 rounded-md">Optimal</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                                    <span>Hari ke-6</span>
                                    <span>0 Tindakan</span>
                                </div>
                                {}
                                <div className="flex h-2.5 gap-1">
                                    <div className="w-[28%] bg-blue-400 rounded-full"></div>
                                    <div className="w-[72%] bg-gray-100 rounded-full border border-gray-200/60"></div>
                                </div>
                            </div>

                             {}
                             <div className="group pb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-forest-600 transition-colors">Padi Inpari (Batch C)</h3>
                                        <p className="text-sm text-gray-500">Mulai: 01 Mei 2026</p>
                                    </div>
                                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-md">Siap Tanam</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                                    <span>Hari ke-21</span>
                                    <span>Selesai</span>
                                </div>
                                {}
                                <div className="flex h-2.5 gap-1">
                                    <div className="w-full bg-forest-500 rounded-full"></div>
                                </div>
                            </div>
                            </div>

                            <button className="w-full mt-4 py-3 border border-gray-200 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors shrink-0">
                                Lihat Semua Bibit
                            </button>
                        </div>
                    </motion.div>

                    {}
                    <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
                        
                        {}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm shrink-0">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black font-sans text-gray-900 tracking-tight">Aksi Cepat</h2>
                                <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                                    <FiPlus size={20} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {}
                                <motion.div whileHover={{ scale: 1.02 }} className="bg-forest-500 rounded-3xl p-5 text-white shadow-lg shadow-forest-500/30 cursor-pointer relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform">
                                        <FiCamera size={100} />
                                    </div>
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <h3 className="font-bold text-lg leading-tight">AI Diagnosis<br/>Penyakit Padi</h3>
                                        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                            <FiMoreVertical size={16} />
                                        </div>
                                    </div>
                                    <p className="text-forest-100 text-sm leading-relaxed mb-6 relative z-10 pr-4">
                                        Ambil foto daun padi Anda untuk mendeteksi penyakit seketika dengan kecerdasan buatan.
                                    </p>
                                    <div className="text-forest-200 text-xs font-medium relative z-10">Akurasi AI 98%</div>
                                </motion.div>

                                {}
                                <motion.div whileHover={{ scale: 1.02 }} className="bg-[#e4ebf5] rounded-3xl p-5 text-gray-800 shadow-sm cursor-pointer relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-110 transition-transform text-blue-900">
                                        <FiWind size={100} />
                                    </div>
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <h3 className="font-bold text-lg leading-tight">Mulai<br/>Pembibitan Baru</h3>
                                        <div className="bg-white/50 p-2 rounded-full backdrop-blur-sm text-gray-500">
                                            <FiMoreVertical size={16} />
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 relative z-10 pr-4">
                                        Catat dan pantau jadwal persemaian bibit padi Anda dari awal hingga siap tanam.
                                    </p>
                                    <div className="text-blue-500 text-xs font-medium relative z-10">Smart IoT Terhubung</div>
                                </motion.div>
                            </div>
                        </div>

                        {}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm flex-1 relative overflow-hidden min-h-[300px]">
                            <div className="lg:absolute lg:inset-0 p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-6 shrink-0">
                                    <h2 className="text-2xl font-black font-sans text-gray-900 tracking-tight">Riwayat Aktivitas</h2>
                                    <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-1.5 focus:ring-forest-500 focus:border-forest-500 outline-none font-medium">
                                        <option>Minggu Ini</option>
                                        <option>Bulan Ini</option>
                                    </select>
                                </div>
                                
                                <div className="lg:flex-1 relative lg:min-h-0">
                                    <div className="lg:absolute lg:inset-0 overflow-x-auto lg:overflow-y-auto hide-scrollbar">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-400 uppercase font-semibold border-b border-gray-100 lg:sticky lg:top-0 bg-white z-10">
                                                <tr>
                                                    <th className="px-2 py-3">Waktu</th>
                                                    <th className="px-4 py-3">Aktivitas</th>
                                                    <th className="px-4 py-3">Status / Lokasi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-2 py-4 font-medium text-gray-900">08:30 AM</td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-semibold text-gray-900">Diagnosis AI</div>
                                                        <div className="text-gray-500 text-xs">Pendeteksian Daun Padi</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                            <span className="font-medium text-gray-700">Bercak Coklat</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-2 py-4 font-medium text-gray-900">Kemarin</td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-semibold text-gray-900">Penyiraman Bibit</div>
                                                        <div className="text-gray-500 text-xs">Batch A (Padi Ciherang)</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <FiCheckCircle className="text-forest-500" />
                                                            <span className="font-medium text-gray-700">Selesai</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-2 py-4 font-medium text-gray-900">12 Mei</td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-semibold text-gray-900">Log Limbah Baru</div>
                                                        <div className="text-gray-500 text-xs">Jerami Padi</div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                                                50
                                                            </div>
                                                            <span className="font-medium text-gray-700">Kilogram</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
