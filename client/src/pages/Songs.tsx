import { useEffect } from 'react';
import { motion, useScroll, useMotionValue } from 'framer-motion';
import { Music, Play } from 'lucide-react';
import Scene3D from '../components/Scene3D';
import featherSvg from '../assets/Feather.svg';

const Songs = () => {
    const songs = [
        { title: "Midnight Whispers", year: "2024", theme: "Nostalgia" },
        { title: "Paper Hearts", year: "2023", theme: "Unspoken Love" },
        { title: "Ink & Rain", year: "2023", theme: "Solitude" },
        { title: "Echoes of You", year: "2022", theme: "Longing" },
        { title: "The Glass Observatory", year: "2024", theme: "Perspective" },
        { title: "Velvet Shadows", year: "2021", theme: "Mystery" },
        { title: "Amber Dreams", year: "2020", theme: "Wanderlust" },
    ];

    const { scrollYProgress } = useScroll();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = -(clientY / window.innerHeight) * 2 + 1;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-off-white pt-48 pb-32 px-6">
            <Scene3D mouse={{ x: mouseX, y: mouseY }} scroll={scrollYProgress} />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.header 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-32 text-center"
                >
                    <span className="font-sans text-[10px] tracking-[0.6em] text-muted-rosegold uppercase font-bold mb-8 block">
                        Composition Archive
                    </span>
                    <h1 className="text-7xl md:text-9xl text-dream-purple italic font-light tracking-tighter">Melodies</h1>
                </motion.header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                    {songs.map((song, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className={`editorial-card p-12 flex flex-col md:flex-row items-center justify-between group gap-8 ${
                                i % 3 === 0 ? 'md:col-span-12' : 
                                i % 3 === 1 ? 'md:col-span-7' : 'md:col-span-5 md:mt-24'
                            }`}
                        >
                            <div className="flex items-center gap-10">
                                <div className="w-20 h-20 border border-dream-purple/5 flex items-center justify-center text-dream-purple/30 group-hover:bg-dream-purple group-hover:text-white transition-all duration-700">
                                    <Music size={24} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-4xl text-dream-purple mb-4 italic font-light">{song.title}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-muted-rosegold font-bold">{song.year}</span>
                                        <div className="w-6 h-[1px] bg-dream-purple/10" />
                                        <span className="font-serif italic text-dream-purple/40 text-sm">{song.theme}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 rounded-full border border-cherry/10 flex items-center justify-center text-cherry hover:bg-cherry hover:text-white transition-all duration-500"
                            >
                                <Play size={18} fill="currentColor" strokeWidth={0} />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-64 text-center pb-12"
                >
                    <div className="flex justify-center mb-12">
                        <img src={featherSvg} alt="Feather" className="w-12 md:w-16 opacity-30 transform -rotate-12" />
                    </div>
                    <div className="w-24 h-[1px] bg-dream-purple/10 mx-auto mb-12" />
                    <p className="font-serif text-2xl text-dream-purple/30 italic max-w-lg mx-auto leading-relaxed">
                        "Lyrics are the poetry that found its rhythm in the silence of the night."
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Songs;
