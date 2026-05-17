import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Sparkles, Music, Mail, Menu, X } from 'lucide-react';
import { InstagramIcon } from './InstagramPost';
import { useMotionValue, useSpring, useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Scene3D from './Scene3D';
import FloatingGarden from './FloatingGarden';
import Stardust from './Stardust';
import axios from 'axios';

import { API_URL } from '../config';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const [isMobile, setIsMobile] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Detect mobile
    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Close menu on navigation
    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Track views
    React.useEffect(() => {
        const trackView = async () => {
            try {
                await axios.post(`${API_URL}/api/content/track`, { path: location.pathname });
            } catch (err) {
                // Silently fail view tracking
            }
        };
        trackView();
    }, [location.pathname]);

    // Lenis smooth scroll
    React.useEffect(() => {
        let lenis: any;
        const initLenis = async () => {
            try {
                const LenisModule = await import('lenis');
                const LenisConstructor = (LenisModule as any).default || LenisModule;
                lenis = new LenisConstructor({
                    duration: 2.2,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    touchMultiplier: 2,
                    smoothTouch: false,
                    infinite: false,
                });
                function raf(time: number) {
                    if (lenis) lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            } catch {
                // graceful fallback to native scroll
            }
        };
        initLenis();
        return () => { if (lenis) lenis.destroy(); };
    }, []);

    const navLinks = [
        { path: '/', label: 'Home', icon: <Home size={17} className="stroke-[1.5]" /> },
        { path: '/snippets', label: 'Archive', icon: <BookOpen size={17} className="stroke-[1.5]" /> },
        { path: '/muse', label: 'Muse', icon: <Sparkles size={17} className="stroke-[1.5]" /> },

        { path: '/songs', label: 'Melodies', icon: <Music size={17} className="stroke-[1.5]" /> }
    ];

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const { scrollYProgress } = useScroll();
    const signatureOpacity = useTransform(scrollYProgress, [0, 0.15], [0.025, 0]);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set((e.clientX / window.innerWidth) - 0.5);
        mouseY.set(-(e.clientY / window.innerHeight) + 0.5);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-transparent relative overflow-x-hidden selection:bg-dream-pink/20"
        >
            {/* ── Magnetic cursor glow (desktop only) ── */}
            {!isMobile && <CursorGlow />}

            {/* ── Ambient orbs ── */}
            <div
                className="ambient-orb w-[700px] h-[700px] bg-dream-purple"
                style={{ top: '-15%', right: '-10%' }}
            />
            <div
                className="ambient-orb w-[500px] h-[500px] bg-cherry"
                style={{ bottom: '10%', left: '-8%', animationDelay: '4s' }}
            />

            {/* ── Grain texture ── */}
            <div
                className="fixed inset-0 pointer-events-none z-[999] opacity-[0.018] mix-blend-overlay"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
                    backgroundSize: '180px 180px',
                }}
            />

            <FloatingGarden mouse={{ x: mouseX, y: mouseY }} />
            <Stardust />
            <Scene3D mouse={{ x: springX, y: springY }} scroll={scrollYProgress} />

            {/* ── Global Watermark ── */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
                <motion.h1
                    style={{ opacity: signatureOpacity, transform: "translateZ(0)" }}
                    className="text-[clamp(5rem,18vw,20rem)] font-serif italic tracking-tighter text-dream-purple will-change-[opacity] whitespace-nowrap"
                >
                    Bhargavi
                </motion.h1>
            </div>

            {/* ── Scroll Progress Bar ── */}
            <motion.div
                className="scroll-progress"
                style={{ scaleX: scrollYProgress }}
            />

            {/* ── Persistent Desktop Floating Pill Navbar (Desktop Only) ── */}
            {!isMobile && (
                <nav
                    className="glass-pill fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 flex items-center gap-10 w-auto justify-center shadow-lg"
                >
                    {navLinks.map((link) => {
                        const active = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative flex items-center gap-2.5 transition-all duration-500 group ${active ? 'text-dream-purple scale-105' : 'text-dream-purple/35 hover:text-cherry'
                                    }`}
                            >
                                {/* active dot indicator */}
                                <AnimatePresence>
                                    {active && (
                                        <motion.span
                                            layoutId="nav-indicator-desktop"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cherry"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        />
                                    )}
                                </AnimatePresence>
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    {link.icon}
                                </div>
                                <span className="hidden sm:inline metadata-precise text-[9px] tracking-[0.3em]">
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            )}

            {/* ── Mobile Sidebar Menu (Mobile Only) ── */}
            {isMobile && (
                <>
                    {/* Clean Toggle Trigger in Top-Right without solid white circle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="fixed top-6 right-6 z-[150] p-2 text-dream-purple/70 hover:text-cherry transition-colors cursor-pointer select-none active:scale-95 flex items-center justify-center bg-transparent border-none outline-none"
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={22} className="stroke-[1.5]" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={22} className="stroke-[1.5]" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Dark Backdrop Overlay */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.25 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-black z-[130]"
                            />
                        )}
                    </AnimatePresence>

                    {/* Sliding Sidebar Drawer */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="fixed top-0 right-0 h-full w-[260px] bg-white/90 backdrop-blur-2xl border-l border-dream-purple/5 shadow-2xl z-[140] flex flex-col justify-between p-8 pt-24"
                            >
                                {/* Navigation Content */}
                                <div className="flex flex-col gap-10">
                                    <div className="flex flex-col gap-1.5 pl-4">
                                        <span className="metadata-precise text-[7px] tracking-[0.4em] uppercase text-muted-rosegold/50">Navigation</span>
                                        <div className="w-8 h-[1px] bg-dream-purple/10" />
                                    </div>
                                    <div className="flex flex-col gap-5">
                                        {navLinks.map((link) => {
                                            const active = location.pathname === link.path;
                                            return (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    className={`relative py-3 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 group ${active ? 'bg-dream-purple/5 text-dream-purple font-medium' : 'text-dream-purple/40 hover:text-cherry'
                                                        }`}
                                                >
                                                    <div className="group-hover:scale-110 transition-transform duration-300">
                                                        {link.icon}
                                                    </div>
                                                    <span className="text-xs font-serif italic tracking-[0.1em]">
                                                        {link.label}
                                                    </span>
                                                    {active && (
                                                        <motion.div
                                                            layoutId="sidebar-active-dot"
                                                            className="absolute left-0 w-1 h-4 rounded-r bg-cherry"
                                                        />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Sidebar Footer */}
                                <div className="flex flex-col gap-4 pl-4 border-t border-dream-purple/5 pt-6">
                                    <span className="metadata-precise text-[7px] tracking-[0.2em] text-muted-rosegold/30 uppercase">Bhargavi</span>
                                    <span className="text-[6px] tracking-widest text-dream-purple/20">© {new Date().getFullYear()} ARCHIVE</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* ── Main Content ── */}
            <main className="relative">{children}</main>

            {/* ── Professional Editorial Footer ── */}
            <footer className="relative z-10 pt-12 pb-8 bg-white/40 backdrop-blur-md border-t border-dream-purple/5 overflow-hidden">
                {/* ── Background Watermark ── */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none select-none">
                    <h2 className="text-[20rem] font-serif italic text-dream-purple leading-none">B</h2>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-16 md:gap-0 mb-10">
                        {/* ── Brand Identity ── */}
                        <div className="flex flex-col gap-6 max-w-sm">
                            <Link to="/" className="inline-block group">
                                <h2 className="font-serif italic text-4xl text-dream-purple group-hover:text-cherry transition-colors duration-500">Bhargavi</h2>
                            </Link>
                            <p className="font-serif italic text-charcoal/50 text-sm leading-relaxed">
                                A sanctuary of digital fragments, where narrative meets archival elegance. Each story is an etched memory within the sanctuary of the midnight ink.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <a 
                                    href="https://instagram.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-10 h-10 rounded-full border border-dream-purple/10 flex items-center justify-center text-dream-purple/40 hover:text-cherry hover:border-cherry/30 hover:scale-110 transition-all duration-500 group"
                                    title="Instagram"
                                >
                                    <InstagramIcon size={16} />
                                </a>
                                <a 
                                    href="mailto:hello@bhargavi.com" 
                                    className="w-10 h-10 rounded-full border border-dream-purple/10 flex items-center justify-center text-dream-purple/40 hover:text-cherry hover:border-cherry/30 hover:scale-110 transition-all duration-500 group"
                                    title="Email Me"
                                >
                                    <Mail size={16} />
                                </a>
                                <div className="h-[1px] w-8 bg-dream-purple/10" />
                                <span className="metadata-precise text-[8px] text-dream-purple/30 uppercase tracking-[0.2em]">Contact</span>
                            </div>
                        </div>

                        {/* ── The Archive (Links) ── */}
                        <div className="flex flex-col gap-8 min-w-[200px]">
                            <h4 className="metadata-precise text-[10px] text-dream-purple/60 tracking-[0.4em] uppercase">The Archive</h4>
                            <ul className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link 
                                            to={link.path}
                                            className="font-serif italic text-charcoal/40 hover:text-cherry text-base transition-colors duration-500 flex items-center gap-2 group"
                                        >
                                            <span className="w-0 group-hover:w-4 h-[1px] bg-cherry transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <a href="#subscribe" className="font-serif italic text-charcoal/40 hover:text-cherry text-base transition-colors duration-500 flex items-center gap-2 group">
                                        <span className="w-0 group-hover:w-4 h-[1px] bg-cherry transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                        Bulletin
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* ── Footer Bottom ── */}
                    <div className="pt-8 border-t border-dream-purple/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <p className="metadata-precise text-[10px] text-charcoal/30 uppercase">
                                © 2026 Bhargavi
                            </p>
                            <div className="h-4 w-[1px] bg-dream-purple/10" />
                            <p className="metadata-precise text-[8px] text-charcoal/20 uppercase tracking-[0.3em]">
                                All Fragments Reserved
                            </p>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="metadata-precise text-[9px] text-muted-rosegold/40 uppercase tracking-widest px-3 py-1 border border-muted-rosegold/10 rounded-full">
                                Editorial Grade
                            </span>
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="group flex items-center gap-2 metadata-precise text-[8px] text-charcoal/30 hover:text-cherry transition-colors"
                            >
                                Back to top
                                <div className="w-6 h-6 rounded-full border border-dream-purple/5 flex items-center justify-center group-hover:border-cherry/20 transition-all">
                                    <span className="mb-0.5 group-hover:-translate-y-0.5 transition-transform">↑</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
const CursorGlow = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    React.useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="cursor-glow fixed pointer-events-none z-[1000] w-96 h-96 rounded-full opacity-40 mix-blend-soft-light filter blur-[80px]"
            style={{
                left: mouseX,
                top: mouseY,
                x: '-50%',
                y: '-50%',
                background: 'radial-gradient(circle, rgba(183, 110, 121, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
                willChange: 'transform'
            }}
        />
    );
};

export default Layout;