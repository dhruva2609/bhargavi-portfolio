// client/src/pages/Landing.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BubblyTree, BubblyCloud } from "../components/BubblyIllustrations";

const Landing = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Floating animations for depth
    const floatY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const signatureY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
    const signatureOpacity = useTransform(scrollYProgress, [0, 0.2], [0.1, 0]);
    const signatureScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-dream-pink overflow-hidden">

            {/* BACKGROUND LAYER: Organic Gradient & Illustrations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-dream-pink via-white to-dream-blush" />

                {/* The "Bhargavi" dwelling signature */}
                <motion.div 
                    style={{ y: signatureY, opacity: signatureOpacity, scale: signatureScale }}
                    className="absolute top-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                    <h1 className="text-[30vw] font-serif italic text-dream-purple/10 select-none">
                        Bhargavi
                    </h1>
                </motion.div>

                {/* The Cherry Blossom Trees from the image */}
                <BubblyTree className="absolute top-[10%] left-[-5%] w-[30vw] opacity-80" />
                <BubblyTree className="absolute bottom-[-10%] right-[-5%] w-[35vw] opacity-60 flip-x" />

                {/* Floating Clouds */}
                <motion.div style={{ y: floatY }}>
                    <BubblyCloud className="absolute top-[20%] right-[10%] w-64" />
                    <BubblyCloud className="absolute top-[60%] left-[5%] w-80 opacity-40" />
                </motion.div>
            </div>

            {/* CONTENT LAYER: The Sticker Containers */}
            <main className="relative z-10 flex flex-col items-center pt-24 pb-48 px-4 md:px-6">

                {/* Hero Sticker (The Box at the top of the image) */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="dream-sticker w-full max-w-4xl p-8 md:p-16 text-center mb-24 md:mb-32"
                >
                    <div className="inline-block px-6 py-2 bg-dream-blush rounded-full mb-6">
                        <span className="font-sans text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-dream-purple/60">
                            The Secret Archive
                        </span>
                    </div>

                    <h1 className="font-serif text-[14vw] md:text-[8vw] text-dream-purple leading-[0.9] italic mb-10">
                        Blooming <br /> Narratives
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="bubbly-button px-10 py-4 md:px-14 md:py-6 text-[8px] md:text-[10px]">
                            Read the Verse
                        </button>
                        <a 
                            href="mailto:pandyabhargavi@gmail.com"
                            className="px-10 py-4 md:px-14 md:py-6 bg-white/60 border-2 border-dream-purple/10 text-dream-purple rounded-full font-sans font-bold hover:bg-white/80 transition-all uppercase tracking-widest text-[8px] md:text-[10px] backdrop-blur-sm"
                        >
                            Collaborate
                        </a>
                    </div>

                    <div className="mt-12 pt-8 border-t border-dream-purple/5">
                        <p className="font-sans text-[9px] uppercase tracking-widest text-dream-purple/40 font-bold mb-2">Get in Touch</p>
                        <a href="mailto:pandyabhargavi@gmail.com" className="font-serif text-xl md:text-2xl text-dream-purple hover:text-rosegold transition-colors">
                            pandyabhargavi@gmail.com
                        </a>
                    </div>
                </motion.div>

                {/* Section Divider: The Bubbly SVG Wave from the image */}
                <div className="w-screen -mx-6 h-64 relative">
                    <svg viewBox="0 0 1440 320" className="absolute bottom-0 fill-white/80 scale-y-125">
                        <path d="M0,128L80,144C160,160,320,192,480,181.3C640,171,800,117,960,117.3C1120,117,1280,171,1360,197.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Archive Sticker (The bottom floating box) */}
                <motion.div
                    whileInView={{ y: [-20, 0, -20] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="dream-sticker w-full max-w-5xl p-6 md:p-12 mt-10 md:mt-20"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="aspect-[4/5] bg-dream-pink/30 rounded-[2rem] md:rounded-[3rem] border-4 border-white overflow-hidden shadow-inner">
                            {/* Image Placeholder like the nail polish boxes */}
                            <div className="w-full h-full flex items-center justify-center italic text-dream-purple/40 text-sm">
                                Snippet Preview
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="font-serif text-4xl md:text-5xl text-dream-purple italic mb-4 md:mb-6">Shattered Petals</h2>
                            <p className="font-serif text-lg md:text-xl text-dream-deep/70 leading-relaxed mb-6 md:mb-8">
                                A collection of fragments that bloom only in the moonlight.
                            </p>
                            <button className="bubbly-button !bg-dream-purple !shadow-[#4A3469] px-10 py-4 md:px-14 md:py-6 text-[8px] md:text-[10px]">
                                Unveil
                            </button>
                        </div>
                    </div>
                </motion.div>
                {/* Featured Scenarios (Instagram Links) */}
                <div className="w-full max-w-6xl mt-32">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-5xl text-dream-purple italic mb-4">Featured Scenes</h2>
                        <p className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-dream-purple/40">From Scenarios to Scenes</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { url: "https://www.instagram.com/p/DXk-g6sk62h/", title: "First Bloom", desc: "A narrative journey through the early stages of creative awakening." },
                            { url: "https://www.instagram.com/p/DXsshDvE8u9/", title: "Soul Echoes", desc: "Fragments of poetry captured in the digital ether." },
                            { url: "https://www.instagram.com/p/DX3HzD1jC_C/", title: "Secret Verse", desc: "The hidden language of emotions, unveiled." },
                            { url: "https://www.instagram.com/p/DX-sfYmistG/", title: "Final Chapter", desc: "Where every ending is just a new beginning." }
                        ].map((post, i) => (
                            <motion.a
                                key={i}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -10 }}
                                className="dream-sticker p-6 flex flex-col group hover:bg-white/60 transition-all border-2 border-white/50"
                            >
                                <div className="aspect-square bg-dream-pink/20 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-rosegold/10 to-transparent" />
                                    <svg className="w-10 h-10 text-rosegold/40 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </div>
                                <h3 className="font-serif text-xl text-dream-purple mb-2">{post.title}</h3>
                                <p className="font-sans text-[10px] text-dream-purple/60 leading-relaxed uppercase tracking-wider mb-4">
                                    {post.desc}
                                </p>
                                <div className="mt-auto pt-4 flex items-center gap-2 text-rosegold font-bold text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Scenario <span>→</span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;