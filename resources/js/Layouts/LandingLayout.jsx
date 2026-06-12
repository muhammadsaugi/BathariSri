import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function LandingLayout({ auth, children }) {
    return (
        <div className="min-h-screen flex flex-col bg-dark-bg text-cream-100">
            {}
            <Navbar auth={auth} />

            {}
            <main id="main-content" className="flex-1">
                {children}
            </main>

            {}
            <Footer />
        </div>
    );
}
