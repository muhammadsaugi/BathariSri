import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { PiArrowUpRight, PiCheckCircleFill } from 'react-icons/pi';

export default function HeroSection({ auth }) {
    const heroRef = useRef(null);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const items = el.querySelectorAll('.hero-anim');
        let delay = 0;
        items.forEach((item) => {
            setTimeout(() => item.classList.add('is-visible'), delay);
            delay += 120;
        });
    }, []);

    return (
        <section
            id="beranda"
            ref={heroRef}
            className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-sky-50"
        >
            {/* ── Background Image & Gradient ──────────────────────────────── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    // Menggunakan gambar 7.jpeg dengan crop super tipis di bagian bawah (tinggi 102%)
                    src="/images/7.jpeg"
                    alt="Pemandangan sawah dan langit cerah"
                    className="absolute top-0 left-0 w-full h-[140%] object-cover object-[center_80%]"
                    loading="eager"
                />
                {/* Gradasi agar teks di atas tetap terbaca jika langit kurang terang */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-transparent" />
                {/* Gradasi bawah agar pill box lebih terlihat */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* ── Main Content (Centered) ──────────────────────────────────── */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center -mt-32 md:mt-10">

                {/* Headline */}
                <h1 className="hero-anim opacity-0 translate-y-6 transition-all duration-700 ease-out font-sans font-medium tracking-tight text-gray-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] md:leading-[1.1] [text-shadow:0_0_40px_rgba(255,255,255,1),0_0_15px_rgba(255,255,255,0.8)]">
                    Teknologi AI untuk <br className="hidden md:block" />
                    Pertanian Padi yang Lebih Cerdas
                </h1>

                {/* Subheadline */}
                <p className="hero-anim opacity-0 translate-y-6 transition-all duration-700 ease-out text-gray-700 text-base sm:text-lg md:text-xl font-medium mt-6 max-w-2xl leading-relaxed">
                    BathariSri hadir untuk membantu petani Indonesia dengan Sistem Pendukung Keputusan cerdas: deteksi penyakit instan, rekomendasi pupuk presisi, prediksi hasil panen, dan pengelolaan limbah bernilai ekonomi.
                </p>

                {/* Buttons */}
                <div className="hero-anim opacity-0 translate-y-6 transition-all duration-700 ease-out mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href={route('register')}
                        className="inline-flex items-center gap-3 bg-forest-600 text-white px-7 py-3.5 rounded-full text-base font-semibold hover:bg-forest-700 transition-colors"
                    >
                        Mulai Sekarang
                        <span className="bg-white text-forest-700 rounded-full p-1">
                            <PiArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>

                    <a
                        href="#fitur"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/50 text-gray-900 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-white/40 transition-colors"
                    >
                        Lihat Fitur
                    </a>
                </div>
            </div>

            {/* ── Bottom Overlays ─────────────────────────────────────────── */}
            <div className="absolute bottom-6 md:bottom-10 left-4 md:left-10 right-4 md:right-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 z-10">

                {/* Kiri: Clients Pill */}
                {/* <div className="hero-anim opacity-0 translate-y-6 transition-all duration-700 ease-out delay-[400ms] flex items-center gap-3 bg-dark-bg/60 backdrop-blur-md border border-white/10 rounded-full py-2 px-3 pr-5 shadow-lg">
                        <div className="flex -space-x-2.5">
                        <img src="https://i.pravatar.cc/100?img=11" alt="Petani 1" className="w-10 h-10 rounded-full border-[2px] border-dark-card object-cover" />
                        <img src="https://i.pravatar.cc/100?img=33" alt="Petani 2" className="w-10 h-10 rounded-full border-[2px] border-dark-card object-cover" />
                        <img src="https://i.pravatar.cc/100?img=68" alt="Petani 3" className="w-10 h-10 rounded-full border-[2px] border-dark-card object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-gray-300 text-[11px] leading-none mb-0.5">Telah membantu</span>
                        <span className="text-white text-sm font-semibold leading-none">10.000+ Petani</span>
                    </div>
                </div> */}

                {/* Kanan: Badges removed */}

            </div>

            {/* ── Shape Divider (Transisi Organik ke Fitur) ───────────────── */}
            <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none"
                    className="w-full h-[40px] sm:h-[60px] md:h-[90px] lg:h-[100px]"
                >
                    <path
                        fill="#f8faf6"
                        fillOpacity="1"
                        d="M0,224L60,202.7C120,181,240,139,360,144C480,149,600,203,720,208C840,213,960,171,1080,144C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                    ></path>
                </svg>
            </div>

            {/* Custom style for specific animation so it doesn't conflict with app.css hero-animate */}
            <style jsx="true">{`
                .hero-anim.is-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </section>
    );
}
