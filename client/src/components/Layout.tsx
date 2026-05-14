import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Sparkles, Music } from 'lucide-react';
import { InstagramIcon } from './InstagramPost';
import { useMotionValue, useSpring, useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Scene3D from './Scene3D';
import FloatingGarden from './FloatingGarden';
import Stardust from './Stardust';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile
    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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
        { path: '/', label: 'Home', icon: <Home size={15} /> },
        { path: '/snippets', label: 'Archive', icon: <BookOpen size={15} /> },
        { path: '/muse', label: 'Muse', icon: <Sparkles size={15} /> },
        { path: '/songs', label: 'Melodies', icon: <Music size={15} /> },
        { path: '/write', label: 'Create', icon: <PenTool size={15} /> },
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

            {/* ── Floating Pill Navbar ── */}
            <nav
                className="glass-pill fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] px-3 py-2 md:px-8 md:py-4 flex items-center gap-3 md:gap-10 w-[92%] md:w-auto max-w-[420px] md:max-w-none justify-around md:justify-center"
            >
                {navLinks.map((link) => {
                    const active = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative flex items-center gap-1.5 md:gap-2.5 transition-all duration-500 group ${active ? 'text-dream-purple' : 'text-dream-purple/35 hover:text-cherry'
                                }`}
                        >
                            {/* active dot indicator */}
                            <AnimatePresence>
                                {active && (
                                    <motion.span
                                        layoutId="nav-indicator"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cherry"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    />
                                )}
                            </AnimatePresence>
                            <div className="group-hover:scale-110 transition-transform duration-300">
                                {link.icon}
                            </div>
                            <span className="hidden sm:inline metadata-precise text-[7px] md:text-[9px] tracking-[0.2em] md:tracking-[0.3em]">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* ── Main Content ── */}
            <main>{children}</main>

            {/* ── Minimal Footer ── */}
            <footer className="relative z-10 py-10 md:py-12 border-t border-dream-purple/5 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <p className="metadata-precise text-[10px] md:text-[11px] tracking-[0.4em] text-charcoal/40 uppercase">
                            © 2026 Bhargavi
                        </p>
                        <p className="font-serif italic text-dream-purple/30 text-sm">
                            Fragments of a Narrative Archive
                        </p>
                    </div>

                    <div className="flex items-center gap-12">
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-cherry transition-all duration-500 flex items-center gap-3 group"
                        >
                            <InstagramIcon size={16} className="group-hover:scale-110 group-hover:text-cherry transition-all" />
                            <span className="metadata-precise text-[10px] md:text-[11px] tracking-[0.4em] text-charcoal/40 uppercase group-hover:text-cherry">Instagram</span>
                        </a>
                        <div className="h-8 w-[1px] bg-dream-purple/5 hidden md:block" />
                        <span className="metadata-precise text-[9px] text-muted-rosegold/30 uppercase tracking-widest hidden md:block">
                            Editorial Grade
                        </span>
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