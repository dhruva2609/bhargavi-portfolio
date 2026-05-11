import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Sparkles, Music, Send, Mail } from 'lucide-react';
import { useMotionValue, useSpring, useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Scene3D from './Scene3D';
import FloatingGarden from './FloatingGarden';
import Stardust from './Stardust';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const [email, setEmail] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [subscribed, setSubscribed] = React.useState(false);
    const [cursorPos, setCursorPos] = React.useState({ x: -500, y: -500 });
    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile
    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Cursor glow tracking
    React.useEffect(() => {
        if (isMobile) return;
        const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [isMobile]);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/content/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) setSubscribed(true);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const newsletterConfig: Record<string, { title: string; desc: string }> = {
        '/snippets': { title: "Join the Archive", desc: "Receive archival notes and literary fragments whenever the vault is updated." },
        '/muse': { title: "The Muse's Library", desc: "Get a digital wax-sealed notification whenever a new volume is added to the bookshelf." },
        '/melodies': { title: "Lyricist's Circle", desc: "Original songs and written melodies delivered to your digital sanctuary." },
        '/creator': { title: "Creator Insights", desc: "Behind-the-scenes thoughts on the narrative craft and worldbuilding." },
    };

    const currentConfig = newsletterConfig[location.pathname] || {
        title: "Subscribe to the Archive",
        desc: "Receive updates from Bhargavi's digital sanctuary.",
    };

    // Lenis smooth scroll
    React.useEffect(() => {
        let lenis: any;
        const initLenis = async () => {
            try {
                const LenisModule = await import('lenis');
                const LenisConstructor = (LenisModule as any).default || LenisModule;
                lenis = new LenisConstructor({
                    duration: 1.5,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    touchMultiplier: 1.8,
                    smoothTouch: false,
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
            {!isMobile && (
                <div
                    className="cursor-glow"
                    style={{ left: cursorPos.x, top: cursorPos.y }}
                />
            )}

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

            <FloatingGarden />
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

            {/* ── Footer ── */}
            <footer className="relative z-10 pt-8 pb-4 border-t border-dream-purple/5 bg-gradient-to-b from-transparent to-off-white/80 backdrop-blur-sm overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 text-center space-y-6 md:space-y-8">
                    {/* Subscribe form — only on relevant pages */}
                    {['/snippets', '/muse', '/songs'].includes(location.pathname) && (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9 }}
                            className="space-y-4 max-w-2xl mx-auto"
                        >
                            <span className="metadata-precise text-[9px] md:text-[10px] tracking-[0.5em] text-muted-rosegold block">
                                The Midnight Bulletin
                            </span>
                            <h2 className="font-serif text-2xl md:text-3xl italic text-charcoal">
                                {currentConfig.title}
                            </h2>
                            <p className="text-charcoal/50 font-serif italic text-sm md:text-base leading-relaxed">
                                {currentConfig.desc}
                            </p>

                            <form
                                onSubmit={handleSubscribe}
                                className="flex flex-col sm:flex-row items-stretch gap-3 md:gap-4 max-w-lg mx-auto"
                            >
                                <div className="relative flex-1 group">
                                    <Mail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/25 group-focus-within:text-cherry transition-colors"
                                        size={16}
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={subscribed ? "Subscription confirmed ✓" : "Your email…"}
                                        disabled={submitting || subscribed}
                                        className="w-full bg-white/50 backdrop-blur border border-dream-purple/10 pl-10 pr-4 py-3 md:py-4 rounded-full outline-none focus:border-cherry/30 transition-all font-serif italic text-base md:text-lg shadow-sm disabled:opacity-50 text-charcoal placeholder:text-charcoal/25"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || subscribed}
                                    className="btn-editorial whitespace-nowrap disabled:opacity-40 py-3 md:py-4 px-6 md:px-8"
                                >
                                    <span>{subscribed ? "Joined" : submitting ? "…" : "Join"}</span> <Send size={12} />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Bottom bar */}
                    <div className="flex flex-col items-center gap-4 pt-0 md:pt-0">
                        <div className="flex items-center gap-4 text-dream-purple/30">
                            <a
                                href="https://instagram.com/scenarios.to.scenes"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-cherry transition-colors duration-300 hover:scale-110 inline-flex"
                                aria-label="Instagram"
                            >
                                <InstagramIcon size={18} />
                            </a>
                        </div>
                        <p className="font-serif text-charcoal/20 italic text-sm tracking-widest">
                            © 2026 Bhargavi — All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;