import { Link } from '@inertiajs/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            heading: 'Platform',
            links: [
                { label: 'Smart Nursery',      href: '#fitur' },
                { label: 'Diagnosis AI',        href: '#fitur' },
                { label: 'Kalkulator Limbah',   href: '#fitur' },
                { label: 'Dashboard Petani',    href: '#' },
            ],
        },
        {
            heading: 'Tentang',
            links: [
                { label: 'Tentang BathariSri', href: '#tentang' },
                { label: 'Dampak & SDGs',       href: '#dampak'  },
                { label: 'Tim Pengembang',      href: '#tentang' },
                { label: 'Panduan Pengguna',    href: '#'        },
            ],
        },
        {
            heading: 'Akun',
            links: [
                { label: 'Masuk',        href: route('login')    },
                { label: 'Daftar',       href: route('register') },
            ],
        },
    ];

    const sdgsBadges = [
        { label: 'SDG 2',  title: 'Zero Hunger',            color: 'bg-amber-50 text-amber-600 border-amber-200' },
        { label: 'SDG 12', title: 'Responsible Consumption', color: 'bg-orange-50 text-orange-600 border-orange-200' },
        { label: 'SDG 13', title: 'Climate Action',         color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        { label: 'SDG 15', title: 'Life on Land',           color: 'bg-green-50 text-green-600 border-green-200' },
    ];

    return (
        <footer
            id="footer"
            role="contentinfo"
            className="relative bg-[#f8faf6] pt-20 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* ── Konten Atas Footer (Grid) ─────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    
                    {/* Kolom Kiri — Brand (5 kolom di desktop) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Logo */}
                        <a
                            href="#beranda"
                            className="flex items-center gap-3 group w-fit"
                            aria-label="BathariSri Home"
                        >
                            <img src="/images/Logo_BathariSri.png" alt="BathariSri Logo" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                            <div className="leading-none mt-2">
                                <span className="block text-[11px] text-gray-400 tracking-[0.2em] uppercase font-bold mt-1">
                                    Smart Farming
                                </span>
                            </div>
                        </a>

                        {/* Deskripsi */}
                        <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                            Platform pertanian cerdas berbasis AI untuk petani Indonesia. Membantu dari benih hingga panen — dan mengolah limbah menjadi nilai yang bermakna.
                        </p>

                        {/* SDGs Badges */}
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">
                                Mendukung SDGs
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sdgsBadges.map((sdg) => (
                                    <span
                                        key={sdg.label}
                                        title={sdg.title}
                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide border ${sdg.color}`}
                                    >
                                        {sdg.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden lg:block lg:col-span-1"></div>

                    {/* Kolom Kanan — Navigasi (6 kolom di desktop) */}
                    <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {footerLinks.map((group) => (
                            <div key={group.heading} className="flex flex-col gap-5">
                                <h3 className="text-sm uppercase tracking-widest text-gray-900 font-bold">
                                    {group.heading}
                                </h3>
                                <ul className="flex flex-col gap-3" role="list">
                                    {group.links.map((item) => (
                                        <li key={item.label}>
                                            <a
                                                href={item.href}
                                                className="text-base text-gray-500 hover:text-forest-600 font-medium transition-colors duration-200"
                                            >
                                                {item.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Divider & Baris Tengah ─────────────────────────────────── */}
                <div className="border-t border-gray-200 pt-8 pb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 font-medium text-center sm:text-left">
                        &copy; {currentYear} BathariSri. Dikembangkan dengan <span className="text-red-500">♥</span> untuk petani Indonesia.
                    </p>
                    
                </div>
            </div>

            {/* ── Massive Bottom Text (Seperti Referensi) ─────────────────── */}
            <div className="w-full relative overflow-hidden pointer-events-none -mt-4 md:-mt-8 flex justify-center border-t border-gray-100 bg-[#f8faf6]">
                <h1 className="text-[17vw] font-bold text-gray-900 tracking-tighter leading-[0.8] select-none whitespace-nowrap opacity-[0.97] mt-8 mb-[-3%]">
                    BathariSri
                </h1>
            </div>
        </footer>
    );
}
