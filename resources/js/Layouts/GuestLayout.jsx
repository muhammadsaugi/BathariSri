import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Kiri: Area Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-24 relative z-10 py-12">
                <div className="w-full max-w-[400px] mx-auto">
                    {/* Logo */}
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 group shrink-0">
                            <img src="/images/Logo_BathariSri.png" alt="BathariSri Logo" className="h-10 w-auto object-contain" />
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">Bathari<span className="text-forest-600">Sri</span></span>
                        </Link>
                    </div>

                    {title && (
                        <h2 className="text-3xl sm:text-[34px] font-semibold text-gray-900 mb-2 tracking-tight leading-tight">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className="text-gray-500 mb-8 text-[15px]">
                            {subtitle}
                        </p>
                    )}
                    
                    {children}
                </div>
                
                {/* Footer Copy */}
                <div className="absolute bottom-8 left-8 sm:left-12 lg:left-16 text-xs font-medium text-gray-400">
                    &copy; {new Date().getFullYear()} BathariSri. All rights reserved.
                </div>
            </div>

            {/* Kanan: Area Gambar (Vibrant Nature + Glassmorphism) */}
            <div className="hidden lg:flex w-[55%] p-4">
                <div className="w-full h-full relative rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(0,0,0,0.2)]">
                    {/* Foto Alam Cerah */}
                    <img 
                        src="/images/7.jpeg" 
                        alt="Background" 
                        className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
                    />
                    
                    {/* Kotak Kaca (Glassmorphism) */}
                    <div className="relative z-10 p-10 m-8 mb-auto rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl">
                        <h3 className="text-3xl font-medium text-white mb-3 leading-tight max-w-lg tracking-tight [text-shadow:0_4px_20px_rgba(0,0,0,0.3)]">
                            Kendalikan masa depan panen Anda secara digital.
                        </h3>
                        <p className="text-white/95 text-base max-w-md leading-relaxed font-medium">
                            Bergabunglah dengan ribuan pahlawan pangan yang telah mendigitalisasi pengelolaan sawah mereka dengan cerdas dan efisien.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
