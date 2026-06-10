import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/UI';
import { PiArrowUpRight } from 'react-icons/pi';


export default function Navbar({ auth }) {
    const [scrolled, setScrolled]         = useState(false);
    const [menuOpen, setMenuOpen]         = useState(false);
    const [activeSection, setActiveSection] = useState('beranda');
    const menuRef                          = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = ['beranda', 'fitur', 'dampak', 'tentang'];
        const handleActiveSection = () => {
            const scrollPos = window.scrollY + 100;
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
                    setActiveSection(id);
                }
            }
        };
        window.addEventListener('scroll', handleActiveSection, { passive: true });
        return () => window.removeEventListener('scroll', handleActiveSection);
    }, []);

    const navLinks = [
        { href: '#beranda', label: 'Beranda',  id: 'beranda'  },
        { href: '#fitur',   label: 'Fitur',    id: 'fitur'    },
        { href: '#tentang', label: 'Tentang',  id: 'tentang'  },
        { href: '#dampak',  label: 'Dampak',   id: 'dampak'   },
    ];

    const handleNavClick = (e, href) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setMenuOpen(false);
    };

    return (
        <header
            role="banner"
            className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 flex justify-center transition-all duration-500"
        >
            <div
                ref={menuRef}
                className={`
                    w-full max-w-7xl
                    bg-white/95 backdrop-blur-md
                    border border-white/40
                    rounded-full
                    px-4 md:px-6 py-3
                    flex items-center justify-between
                    transition-all duration-500
                    ${scrolled ? 'shadow-lg shadow-black/5' : 'shadow-md shadow-black/5'}
                `}
            >
                {/* ── Logo ─────────────────────────────────── */}
                <a
                    href="#beranda"
                    onClick={(e) => handleNavClick(e, '#beranda')}
                    className="flex items-center gap-2 group shrink-0"
                    aria-label="BathariSri Home"
                >
                    <img src="/images/Logo_BathariSri.png" alt="BathariSri Logo" className="h-9 w-auto object-contain" />
                </a>

                {/* ── Nav Links (Desktop) ───────────────────── */}
                <ul className="hidden lg:flex items-center gap-8" role="list">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.id;
                        return (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className={`
                                        text-sm font-medium transition-colors duration-300
                                        ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'}
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {link.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {/* ── CTA + Hamburger (Kanan) ───────────────── */}
                <div className="flex items-center gap-3">
                    <div className="hidden lg:block">
                        {auth?.user ? (
                            <Link
                                href={auth.user.role === 'admin' ? route('admin.dashboard') : route('petani.dashboard')}
                                className="inline-flex items-center gap-2 bg-forest-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-700 transition-colors"
                            >
                                Dashboard
                                <span className="bg-white text-forest-700 rounded-full p-1"><PiArrowUpRight className="w-3 h-3" /></span>
                            </Link>
                        ) : (
                            <Link
                                href={route('register')}
                                className="inline-flex items-center gap-2 bg-forest-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-forest-700 transition-colors"
                            >
                                Mulai Sekarang
                                <span className="bg-white text-forest-700 rounded-full p-1"><PiArrowUpRight className="w-3 h-3" /></span>
                            </Link>
                        )}
                    </div>

                    {/* Hamburger Menu (Mobile) */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-gray-100 text-gray-800"
                    >
                        <span className={`block w-4 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-4 h-0.5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-4 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </button>
                </div>

                {/* ── Mobile Menu Dropdown ──────────────── */}
                <div className={`
                    absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 origin-top
                    lg:hidden
                    ${menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
                `}>
                    <div className="p-4 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="h-px bg-gray-100 my-2" />
                        {auth?.user ? (
                            <Link
                                href={auth.user.role === 'admin' ? route('admin.dashboard') : route('petani.dashboard')}
                                className="flex items-center justify-center gap-2 bg-forest-600 text-white px-4 py-3 rounded-xl font-medium"
                            >
                                Dashboard <PiArrowUpRight />
                            </Link>
                        ) : (
                            <Link
                                href={route('register')}
                                className="flex items-center justify-center gap-2 bg-forest-600 text-white px-4 py-3 rounded-xl font-medium"
                            >
                                Mulai Sekarang <PiArrowUpRight />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
