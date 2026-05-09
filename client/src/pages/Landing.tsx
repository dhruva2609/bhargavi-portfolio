import { useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import type { BezierDefinition } from "framer-motion";
import SnippetCard from '../components/SnippetCard';
import { useNarrative } from '../hooks/useNarrative';
import bookSvg from '../assets/book.svg';
import rosepenSvg from '../assets/rosepenhand.svg';


const Landing = () => {
    const { data: posts, loading } = useNarrative('snippets');
    const { scrollYProgress } = useScroll();
    const smoothScroll = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
            mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const parallaxX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
    const parallaxY = useTransform(smoothMouseY, [-1, 1], [-20, 20]);

    const instagramPosts = [
        { url: "https://www.instagram.com/p/DXk-g6sk62h/", label: "First Bloom", image: "/assets/images/arch.png" },
        { url: "https://www.instagram.com/p/DXsshDvE8u9/", label: "Soul Echoes", image: "/assets/images/flower.png" },
        { url: "https://www.instagram.com/p/DX3HzD1jC_C/", label: "Secret Verse", image: "/assets/images/desk.png" },
        { url: "https://www.instagram.com/p/DX-sfYmistG/", label: "Final Chapter", image: "/assets/images/abstract.png" }
    ];

    const editorialEase: BezierDefinition = [0.22, 1, 0.36, 1];

    // Cinematic Signature dissolve mapped to scroll
    const signatureOpacity = useTransform(scrollYProgress, [0, 0.15], [0.08, 0]);

    return (
        <div
            className="relative min-h-[300vh] selection:bg-dream-pink/20 overflow-hidden"
        >
            {/* Cinematic Signature */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
                <motion.h1
                    style={{ opacity: signatureOpacity }}
                    className="text-[clamp(4rem,12vw,15rem)] font-serif italic tracking-tighter text-dream-purple uppercase whitespace-nowrap will-change-[opacity]"
                >
                    Bhargavi
                </motion.h1>
            </div>

            {/* Content Layers */}
            <div className="relative z-10">

                {/* Section 1: Hero / Architectural Intro */}
                <section className="min-h-[85vh] flex flex-col md:flex-row items-center justify-center px-6 md:px-24 gap-12 pt-32 md:pt-0 relative">

                    {/* Vintage Typewriter Animation (Moved to Section 2) */}

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: editorialEase }}
                        style={{ x: parallaxX, y: parallaxY }}
                        className="max-w-4xl text-center md:text-left flex-1"
                    >
                        <span className="metadata-precise text-muted-rosegold mb-8 block">
                            Editorial Archive 2026
                        </span>
                        <h2 className="text-[clamp(2.5rem,5vw,5rem)] text-charcoal mb-12 leading-none">
                            Architect of <br /> <i className="text-dream-purple font-light">Unspoken</i> Scenes
                        </h2>
                        <p className="font-serif italic text-dream-purple/40 text-lg md:text-2xl max-w-md mb-12">
                            Curating the intersections of narrative, space, and silence.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <a href="mailto:bhargavi@example.com" className="editorial-card px-8 py-3 bg-dream-purple text-white hover:bg-cherry transition-all duration-500 metadata-precise uppercase tracking-widest text-xs shadow-editorial">
                                Collaborate
                            </a>
                        </div>
                    </motion.div>
                    {/* Right side - The Rose Pen */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="flex-1 flex justify-center mt-12 md:mt-0 z-10"
                    >
                        <motion.img
                            src={rosepenSvg}
                            alt="Vintage Rose Pen"
                            style={{ x: parallaxX, y: parallaxY }}
                            className="w-full max-w-[280px] md:max-w-[500px] mx-auto z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    </motion.div>
                </section>

                {/* Section 2: Split-Screen Archive (The Echoes) */}
                <section className="h-screen grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-dream-purple/5 relative overflow-hidden">

                    {/* Left: Static Massive Title */}
                    <div className="lg:col-span-5 h-full flex flex-col justify-start p-8 md:p-24 pt-16 md:pt-24 border-r border-dream-purple/5 bg-off-white z-10 relative">
                        <div className="relative z-20">
                            <span className="metadata-precise text-muted-rosegold mb-4 block">01 / Echoes</span>
                            <h2 className="text-[clamp(4rem,10vw,10rem)] text-dream-purple italic mb-4 font-serif tracking-tighter leading-none">Echoes</h2>
                            <p className="text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-sm font-serif italic mb-8">
                                A curated feed of architectural fragments and literary snapshots.
                            </p>
                        </div>

                        {/* The Vintage Book SVG */}
                        <motion.div
                            style={{ y: parallaxY, x: parallaxX }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 1.5, ease: editorialEase }}
                            className="absolute bottom- lg:-bottom-4 right-0 lg:right-32 w-full max-w-[200px] md:max-w-[350px] z-10 hover:scale-105 transition-transform duration-700 ease-out hidden lg:block opacity-90"
                        >
                            <img
                                src={bookSvg}
                                alt="Vintage Book"
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Scrollable Feed */}
                    <div className="lg:col-span-7 h-full overflow-y-auto custom-scrollbar p-6 md:p-24 bg-transparent">
                        <motion.div
                            variants={{
                                visible: { transition: { staggerChildren: 0.15 } }
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.1 }}
                            className="flex flex-col gap-12 md:gap-24 max-w-xl mx-auto pb-48"
                        >
                            {loading ? (
                                <div className="h-screen flex items-center justify-center">
                                    <p className="text-muted-rosegold animate-pulse tracking-widest uppercase text-xs">Curating fragments...</p>
                                </div>
                            ) : (
                                posts.map((post: any, idx: number) => (
                                    <SnippetCard
                                        key={post._id || idx}
                                        content={post.content || post.body}
                                        date={post.date || new Date(post.createdAt).toLocaleDateString()}
                                    />
                                ))
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* Section 3: Visual Grammar */}
                <section className="py-8 md:py-16 border-t border-dream-purple/5 relative overflow-hidden">

                    <div className="mb-4 md:mb-8 text-center md:text-left px-6 md:px-24">
                        <span className="metadata-precise text-muted-rosegold mb-4 block">02 / Scenes</span>
                        <h2 className="text-[clamp(3rem,6vw,6rem)] text-charcoal">Visual <i className="text-cherry font-light">Grammar</i></h2>
                    </div>

                    <motion.div
                        variants={{
                            visible: { transition: { staggerChildren: 0.1, ease: editorialEase } }
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        className="flex overflow-x-auto gap-6 md:gap-12 px-6 md:px-24 pb-16 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
                    >
                        {instagramPosts.map((post, i) => (
                            <motion.a
                                key={i}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.95 },
                                    visible: {
                                        opacity: 1,
                                        scale: 1,
                                        transition: { duration: 1.2, ease: editorialEase }
                                    }
                                }}
                                className="editorial-card group relative aspect-[4/5] overflow-hidden flex-none w-[80vw] sm:w-[50vw] md:w-[400px] snap-center cursor-grab active:cursor-grabbing"
                            >
                                <img
                                    src={post.image}
                                    alt={post.label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out pointer-events-none"
                                />
                                <div className="absolute inset-0 bg-dream-purple/[0.05] group-hover:bg-dream-purple/0 transition-colors duration-700 pointer-events-none" />
                                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-dream-purple/40 to-transparent pointer-events-none">
                                    <span className="text-white metadata-precise mb-4">Instagram</span>
                                    <h3 className="text-white text-4xl italic">{post.label}</h3>
                                </div>
                                <div className="absolute top-8 right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-cherry group-hover:border-cherry transition-all duration-500 pointer-events-none">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </section>

                {/* Section 4: The Sanctuary */}
                <section className="flex flex-col items-center justify-center py-16 md:py-32 px-6 bg-dream-purple text-off-white overflow-hidden relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: editorialEase }}
                        className="relative z-10 text-center"
                    >
                        <span className="metadata-precise text-dream-pink mb-12 block">The Final Note</span>
                        <h2 className="text-[clamp(3rem,8vw,8rem)] mb-12 leading-none italic font-light tracking-tighter">Sanctuary</h2>

                        <p className="font-serif text-dream-pink/60 text-lg md:text-2xl mb-16 max-w-lg mx-auto leading-relaxed italic">
                            Where every fragment finds its place in the grand narrative of the self.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button className="group relative px-12 py-6 border border-dream-pink/20 hover:border-dream-pink transition-colors duration-500 overflow-hidden interactive">
                                <span className="relative z-10 metadata-precise text-dream-pink">Enter the Dream</span>
                                <div className="absolute inset-0 bg-dream-pink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-editorial" />
                                <span className="absolute inset-0 flex items-center justify-center metadata-precise text-dream-purple opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">Enter the Dream</span>
                            </button>
                            <a href="mailto:hello@example.com" className="group relative px-12 py-6 border border-transparent hover:border-dream-pink/20 transition-colors duration-500 overflow-hidden interactive">
                                <span className="relative z-10 metadata-precise text-dream-pink">Collaborate</span>
                                <div className="absolute inset-0 bg-dream-pink/10 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-700 ease-editorial" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Abstract SVG Background element */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <motion.path
                                d="M0,50 Q25,0 50,50 T100,50"
                                fill="none"
                                stroke="var(--color-dream-pink)"
                                strokeWidth="0.1"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 3, ease: editorialEase }}
                            />
                        </svg>
                    </div>
                </section>
            </div>

            {/* Scroll Progress Indicator */}
            <motion.div
                style={{ scaleX: smoothScroll }}
                className="fixed bottom-0 left-0 right-0 h-[2px] bg-cherry origin-left z-50"
            />
        </div>
    );
};

export default Landing;