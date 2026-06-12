import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '@/Components/Sidebar';
import gsap from 'gsap';

export default function AuthenticatedLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        gsap.fromTo('.dashboard-content',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
        );
    }, []);

    return (
        <div className="flex h-[100dvh] w-full bg-[#f5f7f5] overflow-hidden font-sans">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {}
                <div className="lg:hidden flex items-center justify-between bg-white px-5 py-3.5 shadow-sm z-30 border-b border-zinc-100">
                    <span className="font-bold text-[#166534] text-lg tracking-tight">BathariSri</span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-zinc-600 hover:text-[#166534] p-2 rounded-lg bg-zinc-50 transition-colors"
                    >
                        <FiMenu size={22} />
                    </button>
                </div>

                {}
                <main className="flex-1 overflow-y-auto hide-scrollbar px-5 py-5 lg:px-6 lg:py-6">
                    {header && (
                        <header className="mb-4 dashboard-content shrink-0">
                            {header}
                        </header>
                    )}
                    <div className="dashboard-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
