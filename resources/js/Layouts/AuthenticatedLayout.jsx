import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '@/Components/Sidebar';
import gsap from 'gsap';

export default function AuthenticatedLayout({ header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Simple GSAP entrance animation for the main content
        gsap.fromTo(".dashboard-content", 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
        );
    }, []);

    return (
        <div className="flex h-[100dvh] w-full bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar Component */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Mobile Header (Hamburger Menu) */}
                <div className="lg:hidden flex items-center justify-between bg-white px-6 py-4 shadow-sm z-30 rounded-3xl mb-4 mt-4 mx-4">
                    <div className="font-bold text-forest-600 text-xl tracking-tight">BathariSri</div>
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 hover:text-forest-600 focus:outline-none p-2 -mr-2 rounded-xl bg-gray-50 transition-colors"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>

                {/* Main Scrollable Content */}
                <main className="flex-1 overflow-y-auto hide-scrollbar p-4 lg:p-8 flex flex-col min-h-0">
                    {header && (
                        <header className="mb-6 dashboard-content shrink-0">
                            {header}
                        </header>
                    )}
                    <div className="dashboard-content flex flex-col relative pb-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
