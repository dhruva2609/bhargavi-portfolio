import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import type { BezierDefinition } from "framer-motion";
import SnippetCard from '../components/SnippetCard';
import { useNarrative } from '../hooks/useNarrative';
import bookSvg from '../assets/book.svg';
import rosepenSvg from '../assets/rosepenhand.svg';
import InstagramPost from '../components/InstagramPost';
import { ArrowRight, Sparkles } from "lucide-react";

const editorialEase: BezierDefinition = [0.22, 1, 0.36, 1];

// ── Typewriter component ──────────────────────────────────────────
const Typewriter = ({ words }: { words: string[] }) => {
    const [wordIdx, setWordIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        const current = words[wordIdx];
        const delay = deleting ? 50 : charIdx === current.length ? 1800 : 90;

        const t = setTimeout(() => {
            if (!deleting && charIdx < current.length) {
                setCharIdx(c => c + 1);
                setDisplayed(current.slice(0, charIdx + 1));
            } else if (!deleting && charIdx === current.length) {
                setDeleting(true);
            } else if (deleting && charIdx > 0) {
                setCharIdx(c => c - 1);
                setDisplayed(current.slice(0, charIdx - 1));
            } else {
                setDeleting(false);
                setWordIdx(i => (i + 1) % words.length);
            }
        }, delay);

        return () => clearTimeout(t);
    }, [charIdx, deleting, wordIdx, words]);

    return (
        <span className="text-cherry font-light italic">
            {displayed}
            <span className="typewriter-cursor" />
        </span>
    );
};

// ── Marquee strip ─────────────────────────────────────────────────
const marqueeItems = [
    "narrative", "◆", "silence", "◆", "architecture", "◆", "ink",
    "◆", "fragments", "◆", "poetry", "◆", "sanctuary", "◆", "echoes",
];

const Marquee = () => (
    <div className="overflow-hidden border-y border-dream-purple/5 py-3 md:py-4 relative select-none">
        <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            className="flex gap-8 md:gap-12 whitespace-nowrap"
        >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                    key={i}
                    className={`metadata-precise text-[8px] md:text-[9px] ${item === "◆" ? "text-cherry/40" : "text-dream-purple/25 hover:text-dream-purple/60 transition-colors"
                        }`}
                >
                    {item}
                </span>
            ))}
        </motion.div>
    </div>
);

// ── Stat counter ──────────────────────────────────────────────────
const StatCard = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: editorialEase, delay }}
        className="text-center space-y-1"
    >
        <p className="font-serif italic text-dream-purple text-3xl md:text-5xl tracking-tighter">{value}</p>
        <p className="metadata-precise text-[7px] md:text-[8px] text-muted-rosegold/60">{label}</p>
    </motion.div>
);

// ─────────────────────────────────────────────────────────────────
const Landing = () => {
    const { data: posts, loading } = useNarrative('snippets');
    const { scrollYProgress } = useScroll();
    const smoothScroll = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
    const heroOpa = useTransform(heroProgress, [0, 0.6], [1, 0]);

    useEffect(() => {
        const handle = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
            mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("mousemove", handle, { passive: true });
        return () => window.removeEventListener("mousemove", handle);
    }, [mouseX, mouseY]);

    const parallaxX = useTransform(smoothMouseX, [-1, 1], [-18, 18]);
    const parallaxY = useTransform(smoothMouseY, [-1, 1], [-18, 18]);

    const { data: instagramPosts, loading: instaLoading } = useNarrative('instagram');

    return (
        <div className="relative selection:bg-dream-pink/20 overflow-x-hidden">

            {/* ───────────────────────────────────────────────────────
                HERO — Parallax cinematic entrance
            ─────────────────────────────────────────────────────── */}
            <section
                ref={heroRef}
                className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Morphing background gradient */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ y: heroY, opacity: heroOpa }}
                >
                    <div className="absolute inset-0 bg-gradient-radial from-dream-pink/20 via-transparent to-transparent"
                        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,215,209,0.25) 0%, transparent 70%)' }}
                    />
                    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] morph-blob bg-gradient-to-br from-dream-purple/8 to-cherry/5 blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-[400px] h-[400px] morph-blob bg-gradient-to-tr from-dream-pink/12 to-lavender/8 blur-3xl" style={{ animationDelay: '3s' }} />
                </motion.div>

                <motion.div
                    style={{ y: heroY }}
                    className="relative z-10 editorial-section w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 pt-20 md:pt-24"
                >
                    {/* Left: headline */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.6, ease: editorialEase }}
                        style={{ x: parallaxX, y: parallaxY }}
                        className="flex-1 text-center lg:text-left max-w-2xl"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: editorialEase }}
                            className="metadata-precise text-muted-rosegold mb-6 md:mb-8 block"
                        >
                            Editorial Archive · 2026
                        </motion.span>

                        <h2 className="text-charcoal mb-6 md:mb-10 leading-none hero-enter">
                            Architect of{" "}
                            <br className="hidden md:block" />
                            <Typewriter words={["Unspoken Scenes", "Quiet Luxury", "Ink & Silence", "Narrative Worlds"]} />
                        </h2>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.6, ease: editorialEase }}
                            className="font-serif italic text-dream-purple/40 text-lg md:text-2xl max-w-md mx-auto lg:mx-0 mb-10 md:mb-14 leading-relaxed"
                        >
                            Curating the intersections of narrative, space, and silence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.9, ease: editorialEase }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                             <a href="/muse" className="btn-editorial">
                                 <span>Enter the Muse</span> <ArrowRight size={12} />
                             </a>
                         </motion.div>
                    </motion.div>

                    {/* Right: Rose Pen */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, delay: 0.4, ease: editorialEase }}
                        style={{ x: parallaxX, y: parallaxY }}
                        className="flex-1 flex justify-center z-10 max-w-xs md:max-w-md lg:max-w-xl w-full"
                    >
                        <motion.img
                            src={rosepenSvg}
                            alt="Vintage Rose Pen"
                            className="w-full float-anim-slow drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 40px 60px rgba(104,76,143,0.15))' }}
                        />
                    </motion.div>
                </motion.div>

                {/* Scroll cue */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
                >
                    <span className="metadata-precise text-[7px] text-dream-purple/25">scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-[1px] h-8 bg-gradient-to-b from-dream-purple/30 to-transparent"
                    />
                </motion.div>
            </section>

            {/* ── Marquee separator ── */}
            <Marquee />

            {/* ── Stats bar ── */}
            <section className="py-10 md:py-12 px-6">
                <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 md:gap-12">
                    <StatCard value="∞" label="Fragments Written" delay={0} />
                    <StatCard value="2026" label="Archive Established" delay={0.12} />
                    <StatCard value="∅" label="Words Left Unspoken" delay={0.24} />
                </div>
            </section>

            <div className="section-divider mx-6 md:mx-24" />

            {/* ───────────────────────────────────────────────────────
                SECTION 2 — Echoes: Split-screen archive feed
            ─────────────────────────────────────────────────────── */}
            <section className="min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-dream-purple/5 relative overflow-hidden">

                {/* Left sticky panel */}
                <div className="lg:col-span-5 flex flex-col justify-start p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-dream-purple/5 bg-transparent relative overflow-hidden">
                    {/* Ambient blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-dream-pink/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="metadata-precise text-muted-rosegold mb-4 block"
                        >
                            01 / Echoes
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.1, ease: editorialEase }}
                            className="text-dream-purple italic mb-6 font-serif tracking-tighter leading-none"
                        >
                            Echoes
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="text-charcoal/50 text-base md:text-xl leading-relaxed max-w-sm font-serif italic mb-8 md:mb-12"
                        >
                            A curated feed of architectural fragments and literary snapshots.
                        </motion.p>
                    </div>

                    {/* Book SVG */}
                    <motion.div
                        style={{ y: parallaxY, x: parallaxX }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 1.5, ease: editorialEase }}
                        className="hidden lg:block absolute bottom-20 left-36 w-[200px] md:w-[300px] float-anim opacity-80"
                    >
                        <img
                            src={bookSvg}
                            alt="Vintage Book"
                            className="w-full h-auto drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 30px 40px rgba(104,76,143,0.12))' }}
                        />
                    </motion.div>
                </div>

                {/* Right: scrollable feed */}
                <div className="lg:col-span-7 h-full overflow-y-auto custom-scrollbar p-6 md:p-12 bg-transparent">
                    <motion.div
                        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.05 }}
                        className="flex flex-col gap-8 md:gap-16 max-w-xl mx-auto pb-32"
                    >
                        {loading ? (
                            <div className="flex flex-col gap-8 pt-16">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="shimmer h-40 w-full" />
                                ))}
                            </div>
                        ) : (
                            posts.map((post: any, idx: number) => (
                                <SnippetCard
                                    key={post._id || idx}
                                    id={post._id}
                                    content={post.content || post.body}
                                    date={post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                    initialLikes={post.likes || 0}
                                />
                            ))
                        )}
                    </motion.div>
                </div>
            </section>

            <div className="section-divider mx-6 md:mx-24" />

            {/* ───────────────────────────────────────────────────────
                SECTION 3 — Visual Grammar (Swipeable Instagram carousel)
            ─────────────────────────────────────────────────────── */}
            <section className="editorial-section border-t border-dream-purple/5 relative overflow-hidden z-[50]">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(251,215,209,0.12) 0%, transparent 70%)' }}
                />

                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 relative z-10 gap-6">
                    <div className="text-center lg:text-left">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="metadata-precise text-muted-rosegold mb-4 block"
                        >
                            02 / Scenes
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: editorialEase }}
                            className="text-charcoal"
                        >
                            Visual <i className="text-cherry font-light">Grammar</i>
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="metadata-precise text-[10px] text-cherry hover:text-dream-purple transition-colors flex items-center gap-2 group border-b border-cherry/20 pb-1">
                            Explore the Gallery <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex overflow-x-auto gap-6 md:gap-10 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full relative z-20"
                >
                    {instaLoading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="shimmer min-w-[300px] aspect-[4/5] rounded-xl" />)
                    ) : (
                        instagramPosts && instagramPosts.length > 0 ? (
                            instagramPosts.map((post: any, i: number) => (
                                <InstagramPost
                                    key={post._id || i}
                                    url={post.url}
                                    label={post.label}
                                    placeholderImage={post.image}
                                    index={i}
                                />
                            ))
                        ) : (
                            // Fallback if truly empty
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="editorial-card aspect-[4/5] w-[400px] bg-dream-purple/5 flex items-center justify-center">
                                    <span className="metadata-precise text-[8px] text-dream-purple/20 uppercase tracking-widest italic">Scene awaiting light</span>
                                </div>
                            ))
                        )
                    )}
                </motion.div>
            </section>

            <div className="section-divider mx-6 md:mx-24" />

            {/* ───────────────────────────────────────────────────────
                SECTION 4 — Sanctuary (full-bleed CTA)
            ─────────────────────────────────────────────────────── */}
            <section className="relative min-h-[80svh] flex flex-col items-center justify-center overflow-hidden bg-dream-purple text-off-white px-6 py-24 md:py-40 z-10">
                {/* Background wave SVG */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M0,50 Q25,0 50,50 T100,50"
                            fill="none"
                            stroke="var(--color-dream-pink)"
                            strokeWidth="0.08"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: editorialEase }}
                        />
                        <motion.path
                            d="M0,60 Q25,10 50,60 T100,60"
                            fill="none"
                            stroke="var(--color-dream-pink)"
                            strokeWidth="0.04"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 3.5, delay: 0.5, ease: editorialEase }}
                        />
                    </svg>
                </div>

                {/* Blobs */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] morph-blob bg-cherry/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] morph-blob bg-dream-pink/10 blur-3xl pointer-events-none" style={{ animationDelay: '5s' }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: editorialEase }}
                    className="relative z-10 text-center max-w-3xl mx-auto"
                >
                    <span className="metadata-precise text-dream-pink/60 mb-8 md:mb-12 block">The Final Note</span>

                    <h2 className="text-[clamp(3rem,10vw,8rem)] mb-8 md:mb-12 leading-none italic font-light tracking-tighter text-dream-pink">
                        Sanctuary
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="font-serif text-white/50 text-base md:text-2xl mb-12 md:mb-20 max-w-xl mx-auto leading-relaxed italic"
                    >
                        Where every fragment finds its place in the grand narrative of the self.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
                    >
                        <a
                            href="/muse"
                            className="group relative inline-flex items-center gap-3 px-8 md:px-14 py-4 md:py-5 border-2 border-dream-pink/20 hover:border-dream-pink rounded-full transition-all duration-700 overflow-hidden"
                        >
                            <span className="relative z-10 metadata-precise text-[9px] md:text-[10px] text-dream-pink/80 group-hover:text-dream-purple transition-colors duration-500">
                                Enter the Dream
                            </span>
                            <div className="absolute inset-0 bg-dream-pink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 rounded-full" />
                        </a>

                        <a
                            href="mailto:dhruvapandya86@gmail.com"
                            className="group relative inline-flex items-center gap-3 px-8 md:px-14 py-4 md:py-5 border-2 border-dream-pink/10 hover:border-dream-pink/40 rounded-full transition-all duration-700 overflow-hidden"
                        >
                            <span className="relative z-10 metadata-precise text-[9px] md:text-[10px] text-dream-pink/50 group-hover:text-dream-purple transition-colors">
                                Collaborate
                            </span>
                            <div className="absolute inset-0 bg-dream-pink scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-700 rounded-full" />
                        </a>
                    </motion.div>

                    {/* Decorative sparkles */}
                    <div className="flex justify-center gap-8 mt-12 md:mt-20 opacity-20">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles size={16} className="text-dream-pink" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── Scroll progress ── */}
            <motion.div
                style={{ scaleX: smoothScroll }}
                className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-dream-purple via-cherry to-muted-rosegold origin-left z-50"
            />
        </div>
    );
};

export default Landing;
