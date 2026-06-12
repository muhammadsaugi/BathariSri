import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    PiPlant,
    PiRecycle,
    PiMicroscope,
    PiArrowUpRight,
    PiChartLineUp,
    PiCalendarCheck,
} from 'react-icons/pi';

export default function FeatureSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const el = sectionRef.current;
        if (!el) return;

        el.querySelectorAll('.reveal').forEach((item) => {
            observer.observe(item);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="fitur"
            ref={sectionRef}
            aria-labelledby="fitur-heading"
            className="relative py-24 bg-[#f8faf6] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="reveal opacity-0 translate-y-10 transition-all duration-700 ease-out mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="lg:w-7/12">
                        <p className="text-forest-600 font-semibold text-sm uppercase tracking-widest mb-4">
                            Fitur Unggulan
                        </p>
                        <h2 id="fitur-heading" className="text-5xl md:text-6xl lg:text-[64px] font-medium tracking-tight leading-[1.15]">
                            <span className="text-forest-600">Semua yang kamu butuhkan</span>{' '}
                            <br className="hidden md:block" />
                            <span className="text-gray-900">ada di satu tempat</span>
                        </h2>
                    </div>

                    <div className="lg:w-5/12 flex flex-col items-start lg:items-end text-left lg:text-right gap-6">
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md">
                            Dari mendeteksi penyakit padi, merencanakan pemupukan, memperkirakan panen, hingga mengolah limbah — BathariSri hadir untuk menemani setiap langkah musim tanammu.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center gap-2 bg-forest-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-forest-700 transition-colors"
                        >
                            Coba Gratis Sekarang
                            <span className="bg-white text-forest-700 rounded-full p-1"><PiArrowUpRight className="w-4 h-4" /></span>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-7 reveal opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out">
                        <div className="flex flex-col bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all h-full p-3">
                            <div className="w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-square xl:aspect-[4/5] rounded-[1.5rem] bg-[#f8faf6] overflow-hidden group cursor-pointer border border-gray-50 mb-8">
                                <img
                                    src="/images/daun.jpeg"
                                    alt="Deteksi penyakit padi dengan AI"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="px-6 pb-8 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-2 bg-forest-50 text-forest-700 text-xs font-bold px-3 py-1.5 rounded-full border border-forest-100">
                                        <PiMicroscope className="text-base" />
                                        Deteksi Penyakit
                                    </span>
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 mb-4 leading-tight">
                                    Foto Daun, Langsung Tahu Penyakitnya
                                </h3>
                                <p className="text-gray-500 text-base leading-relaxed mb-8 flex-grow">
                                    Daun padi menguning, berbercak, atau layu? Ambil foto, unggah ke BathariSri, dan dalam hitungan detik kamu akan tahu apa yang terjadi dan langkah apa yang harus dilakukan.
                                </p>
                                <div className="mt-auto">
                                    <Link href={route('register')} className="inline-flex items-center gap-1.5 text-forest-600 hover:text-forest-700 font-bold text-base transition-colors group/link border-b-2 border-forest-600 pb-0.5">
                                        Coba Diagnosis Sekarang
                                        <PiArrowUpRight className="text-xl group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-8">

                        <div className="reveal opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out flex-1">
                            <div className="flex flex-col bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all h-full p-3">
                                <div className="w-full aspect-[16/9] rounded-[1.5rem] bg-[#f8faf6] overflow-hidden group cursor-pointer border border-gray-50 mb-6">
                                    <img
                                        src="/images/semai.jpeg"
                                        alt="Jadwal tanam dan pantau fase pertumbuhan padi"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="px-5 pb-6 flex flex-col flex-grow">
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-100">
                                            <PiCalendarCheck className="text-base" />
                                            Jadwal Tanam
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-medium text-gray-900 mb-2 leading-tight">
                                        Pantau Fase Tumbuh Padi Setiap Hari
                                    </h4>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        Catat tanggal tanam, dan BathariSri akan otomatis menghitung fase pertumbuhan, jadwal pemupukan, dan perkiraan tanggal panen.
                                    </p>
                                    <div className="mt-auto">
                                        <Link href={route('register')} className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors group/link border-b-2 border-emerald-600 pb-0.5">
                                            Pelajari selengkapnya
                                            <PiArrowUpRight className="text-lg group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="reveal opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out flex-1">
                            <div className="flex flex-col bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all h-full p-3">
                                <div className="w-full aspect-[16/9] rounded-[1.5rem] bg-[#f8faf6] overflow-hidden group cursor-pointer border border-gray-50 mb-6">
                                    <img
                                        src="/images/jerami.jpg"
                                        alt="Olah limbah jerami menjadi nilai ekonomi"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="px-5 pb-6 flex flex-col flex-grow">
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                                            <PiRecycle className="text-base" />
                                            Kelola Limbah
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-medium text-gray-900 mb-2 leading-tight">
                                        Jerami Bekas Panen = Uang Tambahan
                                    </h4>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        Jangan bakar jerami. BathariSri akan bantu kamu mengolahnya menjadi kompos, pakan ternak, atau briket yang bisa dijual — sekaligus mengurangi polusi udara.
                                    </p>
                                    <div className="mt-auto">
                                        <Link href={route('register')} className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold text-sm transition-colors group/link border-b-2 border-orange-600 pb-0.5">
                                            Pelajari selengkapnya
                                            <PiArrowUpRight className="text-lg group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">

                    <div className="reveal opacity-0 translate-y-10 transition-all duration-700 delay-400 ease-out">
                        <div className="flex flex-col sm:flex-row bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all h-full p-6 gap-6 items-start">
                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center text-3xl">
                                <PiPlant />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full border border-sky-100 self-start mb-3">
                                    Rekomendasi Pupuk
                                </span>
                                <h4 className="text-xl font-medium text-gray-900 mb-2 leading-tight">
                                    Pupuk Tepat, Biaya Hemat
                                </h4>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
                                    Dapatkan rekomendasi jenis dan dosis pupuk yang sesuai dengan kondisi lahanmu — bukan perkiraan, tapi berdasarkan data nyata.
                                </p>
                                <Link href={route('register')} className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-bold text-sm transition-colors group/link border-b-2 border-sky-600 pb-0.5 self-start">
                                    Pelajari selengkapnya
                                    <PiArrowUpRight className="text-lg group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="reveal opacity-0 translate-y-10 transition-all duration-700 delay-500 ease-out">
                        <div className="flex flex-col sm:flex-row bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all h-full p-6 gap-6 items-start">
                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center text-3xl">
                                <PiChartLineUp />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-100 self-start mb-3">
                                    Estimasi Panen
                                </span>
                                <h4 className="text-xl font-medium text-gray-900 mb-2 leading-tight">
                                    Perkiraan Hasil Panen & Pendapatan
                                </h4>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
                                    Rencanakan keuanganmu lebih matang. BathariSri akan menghitung perkiraan hasil panen dalam ton dan nilai jualnya berdasarkan harga pasar terkini.
                                </p>
                                <Link href={route('register')} className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold text-sm transition-colors group/link border-b-2 border-amber-600 pb-0.5 self-start">
                                    Pelajari selengkapnya
                                    <PiArrowUpRight className="text-lg group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
