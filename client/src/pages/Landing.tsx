import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Scene3D from "../components/Scene3D";
import SnippetCard from '../components/SnippetCard';
import FloatingBook from '../components/FloatingBook';
import { useNarrative } from '../hooks/useNarrative';

const Landing = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const { data: posts, loading } = useNarrative('snippets');
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Signature Intro Animations
    const introOpacity = useTransform(scrollYProgress, [0, 0.15], [0.08, 0]);
    const introBlur = useTransform(scrollYProgress, [0, 0.15], [0, 20]);
    const introScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.2]);

    const handleMouseMove = (e: React.MouseEvent) => {
        setMouse({
            x: (e.clientX / window.innerWidth) - 0.5,
            y: -(e.clientY / window.innerHeight) + 0.5,
        });
    };

    const instagramPosts = [
        { url: "https://www.instagram.com/p/DXk-g6sk62h/", label: "First Bloom", image: "/assets/images/arch.png" },
        { url: "https://www.instagram.com/p/DXsshDvE8u9/", label: "Soul Echoes", image: "/assets/images/flower.png" },
        { url: "https://www.instagram.com/p/DX3HzD1jC_C/", label: "Secret Verse", image: "/assets/images/desk.png" },
        { url: "https://www.instagram.com/p/DX-sfYmistG/", label: "Final Chapter", image: "/assets/images/abstract.png" }
    ];

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative bg-off-white min-h-[400vh] selection:bg-dream-pink/20"
        >
            <Scene3D mouse={mouse} />

            {/* Signature Intro: Fixed Title */}
            <motion.div
                style={{ 
                    opacity: introOpacity, 
                    filter: `blur(${introBlur}px)`,
                    scale: introScale,
                    pointerEvents: 'none'
                }}
                className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            >
                <h1 className="text-[clamp(4rem,20vw,20rem)] font-serif font-black tracking-tighter text-dream-purple select-none uppercase">
                    Bhargavi
                </h1>
            </motion.div>

            {/* Content Layers */}
            <div className="relative z-10">
                
                {/* Section 1: Hero / Minimal Start */}
                <section className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-24 gap-12 pt-32 md:pt-0">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-4xl text-center md:text-left flex-1"
                    >
                        <span className="font-sans text-[10px] tracking-[0.6em] text-muted-rosegold uppercase font-bold mb-8 block">
                            Editorial Archive 2024
                        </span>
                        <h2 className="text-[clamp(2.5rem,8vw,8rem)] text-charcoal mb-12 leading-none">
                            Architect of <br/> <i className="text-dream-purple font-light">Unspoken</i> Scenes
                        </h2>
                        <p className="font-serif italic text-dream-purple/40 text-lg md:text-2xl max-w-md">
                            Curating the intersections of narrative, space, and silence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1 flex justify-center"
                    >
                        <FloatingBook title="Fragments" subtitle="Selected Echoes 2024" />
                    </motion.div>
                </section>

                {/* Section 2: Echoes (Split Screen Archive) */}
                <section className="min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-dream-purple/5">
                    <div className="lg:col-span-4 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center p-8 md:p-24 border-r border-dream-purple/5">
                        <span className="font-sans text-[10px] tracking-[0.6em] text-muted-rosegold uppercase font-bold mb-6 block">01 / Echoes</span>
                        <h2 className="text-6xl md:text-8xl text-dream-purple italic mb-8">Echoes</h2>
                        <p className="text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-sm">
                            A vertically curated feed of architectural fragments and literary snapshots.
                        </p>
                    </div>
                    
                    <div className="lg:col-span-8 p-6 md:p-24 bg-dream-pink/[0.03]">
                        <div className="flex flex-col gap-12 md:gap-24 max-w-2xl mx-auto">
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
                        </div>
                    </div>
                </section>

                {/* Section 3: Scenes (Asymmetric Grid) */}
                <section className="py-24 md:py-64 px-6 md:px-24">
                    <div className="mb-24 md:mb-48 text-center md:text-left">
                        <span className="font-sans text-[10px] tracking-[0.6em] text-muted-rosegold uppercase font-bold mb-6 block">02 / Scenes</span>
                        <h2 className="text-[clamp(3rem,9vw,9rem)] text-charcoal">Visual <i className="text-cherry font-light">Grammar</i></h2>
                    </div>

                    <div className="grid-asymmetric">
                        {instagramPosts.map((post, i) => (
                            <motion.a
                                key={i}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className={`editorial-card group relative aspect-[4/5] overflow-hidden ${
                                    i % 4 === 0 ? 'col-span-12 md:col-span-7' :
                                    i % 4 === 1 ? 'col-span-12 md:col-span-5 lg:mt-24' :
                                    i % 4 === 2 ? 'col-span-12 md:col-span-4' :
                                    'col-span-12 md:col-span-8 lg:-mt-24'
                                }`}
                            >
                                <img 
                                    src={post.image} 
                                    alt={post.label} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                                />
                                <div className="absolute inset-0 bg-dream-purple/[0.05] group-hover:bg-dream-purple/0 transition-colors duration-700" />
                                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-dream-purple/40 to-transparent">
                                    <span className="text-white font-sans text-[10px] tracking-[0.4em] uppercase mb-4">Instagram</span>
                                    <h3 className="text-white text-4xl italic">{post.label}</h3>
                                </div>
                                <div className="absolute top-8 right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-cherry group-hover:text-white transition-all duration-500">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* Section 4: The Sanctuary (Final Reveal) */}
                <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-dream-purple text-off-white overflow-hidden relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 text-center"
                    >
                        <span className="font-sans text-[10px] tracking-[0.6em] text-dream-pink uppercase font-bold mb-12 block">The Final Note</span>
                        <h2 className="text-[clamp(3.5rem,12vw,12rem)] mb-12 leading-none italic font-light tracking-tighter">Sanctuary</h2>
                        
                        <p className="font-serif text-dream-pink/60 text-lg md:text-2xl mb-16 max-w-lg mx-auto leading-relaxed italic">
                            Where every fragment finds its place in the grand narrative of the self.
                        </p>

                        <button className="group relative px-12 py-6 border border-dream-pink/20 hover:border-dream-pink transition-colors duration-500 overflow-hidden">
                            <span className="relative z-10 font-sans text-[10px] tracking-[0.5em] uppercase font-bold text-dream-pink">Enter the Dream</span>
                            <div className="absolute inset-0 bg-dream-pink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-editorial" />
                            <span className="absolute inset-0 flex items-center justify-center font-sans text-[10px] tracking-[0.5em] uppercase font-bold text-dream-purple opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20">Enter the Dream</span>
                        </button>
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
                                transition={{ duration: 3, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>
                </section>
            </div>
            
            {/* Scroll Progress Indicator */}
            <motion.div 
                style={{ scaleX: scrollYProgress }}
                className="fixed bottom-0 left-0 right-0 h-[2px] bg-cherry origin-left z-50"
            />
        </div>
    );
};

export default Landing;