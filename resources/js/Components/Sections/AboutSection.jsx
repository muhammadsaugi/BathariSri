import React, { useEffect, useRef } from 'react';
import { PiQuotesFill } from 'react-icons/pi';

export default function AboutSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const reveals = entry.target.querySelectorAll('.reveal');
                        reveals.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.remove('opacity-0', 'translate-y-10');
                                el.classList.add('opacity-100', 'translate-y-0');
                            }, index * 150);
                        });
                    }
                });
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="tentang"
            ref={sectionRef}
            aria-labelledby="tentang-heading"
            className="relative py-24 bg-white overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    <div className="w-full lg:w-1/2 reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-forest-50 rounded-[4rem] transform -rotate-3 z-0"></div>
                            <div className="absolute -inset-4 bg-emerald-50/50 rounded-[4rem] transform rotate-2 z-0"></div>

                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-forest-900/10 aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                                <img
                                    src="/images/dewisri.webp"
                                    alt="Petani muda menggunakan teknologi di sawah"
                                    className="w-full h-full object-cover object-[center_65%] hover:scale-105 transition-transform duration-[2s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 via-transparent to-transparent mix-blend-multiply"></div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100 ease-out">
                            <p className="text-forest-600 font-semibold text-sm uppercase tracking-widest mb-4">
                                Tentang BathariSri
                            </p>
                            <h2
                                id="tentang-heading"
                                className="text-4xl sm:text-5xl lg:text-[52px] font-medium text-gray-900 leading-[1.15] tracking-tight mb-8"
                            >
                                Lahir dari Sawah, <br/>
                                Dibesarkan oleh <span className="text-forest-600 font-serif italic">Teknologi</span>.
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200 ease-out">
                            <p>
                                Nama <strong>BathariSri</strong> terinspirasi dari sosok <strong>Dewi Sri</strong> — dewi kesuburan dan pelindung panen dalam budaya Nusantara. Kami percaya bahwa kearifan lokal dan teknologi modern bisa berjalan bersama.
                            </p>
                            <p>
                                Kami membangun BathariSri khusus untuk petani muda Indonesia yang ingin bertani lebih efisien, lebih cerdas, dan menghasilkan lebih banyak — tanpa harus bergantung pada cara-cara lama yang melelahkan.
                            </p>
                        </div>

                        <div className="mt-10 p-8 rounded-2xl bg-[#f8faf6] border-l-4 border-forest-500 relative reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300 ease-out">
                            <PiQuotesFill className="absolute top-6 right-6 w-12 h-12 text-forest-600/10" />
                            <p className="text-xl font-serif italic text-gray-800 leading-snug relative z-10">
                                "Teknologi terhebat bukan yang menggantikan tangan petani, melainkan yang membuat mereka berani bermimpi lebih besar."
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
