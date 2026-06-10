import { Head } from '@inertiajs/react';
import LandingLayout from '@/Layouts/LandingLayout';
import HeroSection from '@/Components/Sections/HeroSection';
import FeatureSection from '@/Components/Sections/FeatureSection';
import AboutSection from '@/Components/Sections/AboutSection';
import ImpactSection from '@/Components/Sections/ImpactSection';

/**
 * BathariSri — Welcome (Landing Page)
 *
 * Halaman Utama Publik. Kita akan membangun tiap Section satu per satu:
 *  ✅ Tahap 4: HeroSection
 *  ⬜ Tahap 5: FeatureSection (Bento Grid)
 *  ⬜ Tahap 6: ImpactSection (SDGs Counter)
 */
export default function Welcome({ auth }) {
    return (
        <LandingLayout auth={auth}>
            <Head>
                <title>BathariSri - Platform Pertanian Cerdas Berbasis AI</title>
                <meta
                    name="description"
                    content="BathariSri adalah platform smart farming berbasis AI untuk petani muda Indonesia. Deteksi penyakit padi instan, pantau bibit real-time, dan ubah limbah menjadi nilai ekonomi."
                />
                <meta name="keywords" content="smart farming, AI pertanian, deteksi penyakit padi, sistem pakar limbah, BathariSri" />
                <meta property="og:title" content="BathariSri - Platform Pertanian Cerdas Berbasis AI" />
                <meta property="og:description" content="Deteksi penyakit padi instan, pantau bibit, dan ubah limbah menjadi nilai ekonomi dengan teknologi AI." />
                <meta property="og:type" content="website" />
            </Head>

            <HeroSection auth={auth} />

            <FeatureSection />

            <AboutSection />

            <ImpactSection />
        </LandingLayout>
    );
}
