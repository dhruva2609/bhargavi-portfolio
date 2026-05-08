import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Sparkles, Music } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const CustomCursor = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
    const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 20);
            mouseY.set(e.clientY - 20);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            style={{ x: springX, y: springY }}
            className="fixed top-0 left-0 w-10 h-10 border border-dream-purple/20 bg-dream-pink/5 rounded-full pointer-events-none z-[9999] hidden md:block"
        />
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={15} /> },
        { path: '/snippets', label: 'Archive', icon: <BookOpen size={15} /> },
        { path: '/muse', label: 'Muse', icon: <Sparkles size={15} /> },
        { path: '/songs', label: 'Melodies', icon: <Music size={15} /> },
        { path: '/write', label: 'Create', icon: <PenTool size={15} /> },
    ];

    return (
        <div className="min-h-screen bg-transparent relative overflow-x-hidden selection:bg-dream-pink/20">
            <CustomCursor />
            {/* Floating Pill Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 editorial-card flex items-center gap-8 md:gap-12 bg-white/60">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 transition-all duration-500 hover:text-cherry group ${
                            location.pathname === link.path ? 'text-dream-purple' : 'text-dream-purple/40'
                        }`}
                    >
                        <div className="group-hover:scale-110 transition-transform">
                            {link.icon}
                        </div>
                        <span className="font-sans text-[9px] uppercase tracking-[0.3em] font-bold hidden md:inline">
                            {link.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Left Social Pill */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 z-[100] p-4 editorial-card flex flex-col gap-8 shadow-editorial hidden lg:flex bg-white/80">
                <a href="https://instagram.com/scenarios.to.scenes" target="_blank" rel="noreferrer" className="text-dream-purple/60 hover:text-cherry transition-colors">
                    <InstagramIcon size={18} />
                </a>
                <div className="w-4 h-[1px] bg-dream-purple/10 mx-auto" />
                <Sparkles size={18} className="text-dream-purple/20" />
            </div>

            <main>{children}</main>

            {/* Minimal Footer */}
            <footer className="relative z-10 py-20 px-6 text-center border-t border-dream-purple/5 bg-off-white">
                <p className="font-serif text-dream-purple/30 italic text-xl">
                    © 2024 Bhargavi. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Layout;