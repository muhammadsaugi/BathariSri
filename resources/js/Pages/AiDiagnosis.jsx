import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { 
    FiCamera, 
    FiUploadCloud, 
    FiCpu, 
    FiCheckCircle, 
    FiAlertCircle, 
    FiInfo,
    FiSearch,
    FiBell,
    FiMoreVertical,
    FiCloudDrizzle,
    FiArrowRight
} from 'react-icons/fi';

export default function AiDiagnosis() {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null);

    
    const [scanState, setScanState] = useState('idle');
    const [selectedImage, setSelectedImage] = useState(null);

    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            startAnalysis();
        }
    };

    const startAnalysis = () => {
        setScanState('analyzing');
        
        setTimeout(() => {
            setScanState('result');
        }, 3000); 
    };

    const resetScan = () => {
        setScanState('idle');
        setSelectedImage(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="AI Diagnosis" />

            <div className="w-full px-2 lg:px-4 pb-4 lg:pb-0 lg:h-full flex flex-col lg:min-h-0">
                {}
                <div className="hidden lg:flex items-center justify-between mb-8 shrink-0">
                    <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
                        <div className="bg-forest-50 p-2 rounded-full text-forest-500">
                            <FiCamera size={18} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">Diagnosis Penyakit Padi</span>
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
                        <div className="lg:absolute lg:inset-0 p-8 flex flex-col lg:overflow-y-auto hide-scrollbar">
                            
                            {}
                            {scanState === 'idle' && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="w-32 h-32 bg-forest-50 rounded-full flex items-center justify-center text-forest-500 mb-6 shadow-inner relative">
                                        <div className="absolute inset-0 border-4 border-forest-200 border-dashed rounded-full animate-[spin_10s_linear_infinite]"></div>
                                        <FiUploadCloud size={48} className="relative z-10" />
                                    </div>
                                    <h2 className="text-3xl font-bold font-sans text-gray-900 mb-4 tracking-tight">Upload Foto Daun</h2>
                                    <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
                                        Ambil foto daun padi yang bermasalah atau unggah dari galeri. AI kami akan mendeteksi penyakit secara otomatis.
                                    </p>
                                    
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        capture="environment"
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 py-4 bg-forest-600 text-white font-bold rounded-2xl shadow-lg shadow-forest-600/30 hover:bg-forest-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                                        >
                                            <FiCamera size={20} />
                                            Buka Kamera
                                        </button>
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex-1 py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FiUploadCloud size={20} />
                                            Pilih File
                                        </button>
                                    </div>
                                </div>
                            )}

                            {}
                            {scanState === 'analyzing' && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="relative w-64 h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl border-4 border-white">
                                        <img src={selectedImage} alt="Daun Padi" className="w-full h-full object-cover" />
                                        
                                        {}
                                        <motion.div 
                                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-forest-500/10 via-forest-500/30 to-forest-500/5 border-b-2 border-forest-500"
                                            animate={{ 
                                                y: ["-100%", "100%"]
                                            }}
                                            transition={{ 
                                                repeat: Infinity, 
                                                duration: 1.5, 
                                                ease: "linear"
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 text-forest-600 mb-2">
                                        <FiCpu className="animate-pulse" size={24} />
                                        <h3 className="text-xl font-bold">AI Sedang Menganalisa...</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">Mohon tunggu beberapa detik, BathariSri sedang bekerja.</p>
                                </div>
                            )}

                            {}
                            {scanState === 'result' && (
                                <div className="flex-1 flex flex-col text-left">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-lg mb-3 border border-red-100">
                                                <span className="relative flex h-2 w-2">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                                Ditemukan Anomali
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Hawar Daun Bakteri</h2>
                                            <p className="text-gray-500 flex items-center gap-2">
                                                <FiCheckCircle className="text-forest-500" />
                                                Akurasi AI: <span className="font-bold text-gray-900">96.8%</span>
                                            </p>
                                        </div>
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-gray-100 shrink-0">
                                            <img src={selectedImage} alt="Daun Padi" className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 rounded-[1.5rem] p-6 mb-6 border border-orange-100/50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                                            <FiAlertCircle className="text-orange-500" />
                                            Solusi Cepat
                                        </h3>
                                        <ul className="space-y-3 relative z-10">
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                                                <span className="text-gray-700 text-sm leading-relaxed">Segera buang daun atau bibit yang menunjukkan gejala agar tidak menular.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                                                <span className="text-gray-700 text-sm leading-relaxed">Hindari penggunaan pupuk Nitrogen (Urea) secara berlebihan untuk sementara waktu.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                                                <span className="text-gray-700 text-sm leading-relaxed">Semprotkan bakterisida (misal: berbahan aktif tembaga hidroksida) sesuai dosis yang dianjurkan.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="mt-auto pt-4 flex gap-3">
                                        <button onClick={resetScan} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                                            Periksa Foto Lain
                                        </button>
                                        <button className="flex-1 py-3 bg-forest-600 text-white font-bold rounded-2xl hover:bg-forest-700 transition-colors shadow-lg shadow-forest-600/20">
                                            Simpan ke Riwayat
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:min-h-0">
                        
                        {}
                        <motion.div variants={itemVariants} className="bg-sky-50 rounded-[2rem] p-6 shadow-sm shrink-0 border border-sky-100">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiInfo className="text-sky-500" />
                                Cara Kerja AI
                            </h3>
                            <div className="space-y-4 relative before:absolute before:inset-y-2 before:left-[1.1rem] before:w-0.5 before:bg-sky-200 before:z-0">
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 font-bold">1</div>
                                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm text-sm font-medium text-gray-700 flex-1 border border-sky-50">
                                        Foto daun secara jelas
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 font-bold">2</div>
                                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm text-sm font-medium text-gray-700 flex-1 border border-sky-50">
                                        Sistem memindai pola penyakit
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/30 font-bold">3</div>
                                    <div className="bg-white px-4 py-3 rounded-xl shadow-sm text-sm font-medium text-gray-700 flex-1 border border-sky-50">
                                        Terima solusi penanganan
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {}
                        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm lg:flex-1 relative overflow-hidden">
                            <div className="lg:absolute lg:inset-0 p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-6 shrink-0">
                                    <h2 className="text-xl font-bold font-sans text-gray-900 tracking-tight">Riwayat Terbaru</h2>
                                    <button className="text-sm font-medium text-forest-600 hover:text-forest-700 flex items-center gap-1 group">
                                        Lihat Semua 
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                
                                <div className="lg:overflow-y-auto hide-scrollbar lg:flex-1 relative lg:min-h-0">
                                    <div className="lg:absolute lg:inset-0">
                                        <div className="space-y-4 pr-2">
                                            
                                            <div className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                                                    <FiCamera size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 truncate">Bercak Daun Sempit</h4>
                                                    <p className="text-xs text-gray-500 mb-1">Hari ini, 09:12 AM</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">Warning</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-gray-400">
                                                    <FiCamera size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 truncate">Padi Sehat</h4>
                                                    <p className="text-xs text-gray-500 mb-1">Kemarin, 14:30 PM</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">Aman</span>
                                                    </div>
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
