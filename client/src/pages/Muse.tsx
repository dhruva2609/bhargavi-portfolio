import { useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import type { Easing } from 'framer-motion';
import typewriterSvg from '../assets/typewriter.svg';
import featherSvg from '../assets/Feather.svg';
const editorialEase: Easing | Easing[] = [0.22, 1, 0.36, 1];

const Muse = () => {
    const { scrollYProgress } = useScroll();

    // Watermark Dissolve
    const watermarkOpacity = useTransform(scrollYProgress, [0, 0.15], [0.08, 0]);

    const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

    // Weighted Physics for Micro-Motion
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // Heavy parallax transforms for mouse (X axis only to prevent overriding Y scroll)
    const parallaxX1 = useTransform(smoothMouseX, [-1, 1], [-20, 20]);



    return (
        <div className="bg-transparent min-h-screen relative overflow-hidden">

            {/* The Signature Watermark */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
                <motion.h1
                    style={{ opacity: watermarkOpacity }}
                    className="text-[clamp(8rem,25vw,25rem)] font-serif italic tracking-tighter text-dream-purple uppercase whitespace-nowrap will-change-[opacity]"
                >
                    Bhargavi
                </motion.h1>
            </div>



            {/* Editorial Grid Container */}
            <div className="max-w-[1600px] mx-auto grid-asymmetric relative z-10 pt-32 pb-48 px-6 md:px-12">

                {/* Left Narrative Column */}
                <div className="col-span-12 md:col-span-7 flex flex-col justify-center gap-24 pt-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: editorialEase }}
                    >
                        <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-muted-rosegold mb-8 block">
                            The Narrative
                        </span>
                        <h2 className="font-serif text-[clamp(4rem,8vw,8rem)] text-dream-purple mb-12 italic font-light tracking-tighter leading-none">
                            The Woman <br /> Behind the <i className="text-cherry font-normal">Ink</i>
                        </h2>
                    </motion.div>

                    <motion.div
                        style={{ opacity: textOpacity }}
                        className="space-y-12 font-serif text-lg md:text-2xl leading-[1.6] text-charcoal/80 italic max-w-2xl relative"
                    >
                        <p className="relative">
                            <span className="absolute -left-12 -top-12 text-[8rem] text-dream-pink/30 font-serif select-none pointer-events-none">“</span>
                            Bhargavi is not a name; she is a mood. She lives in the quiet space between
                            a thought and its expression, favoring the scent of old paper and the
                            melancholy of a setting sun.
                        </p>
                        <p className="relative mt-24">
                            Her writing is a bridge between the classic elegance of Urdu poetry
                            and the visceral emotions of modern storytelling. Here, every word is
                            chosen with grace, and every story is a fragment of a soul.
                            <span className="absolute -right-6 -bottom-12 text-[8rem] text-dream-pink/30 font-serif select-none rotate-180 pointer-events-none">“</span>
                        </p>
                    </motion.div>
                </div>

                {/* Right Visual Archive Column */}
                <div className="col-span-12 md:col-span-5 relative mt-16 md:mt-0 h-full">
                    <div className="relative md:sticky top-48 flex items-center justify-center">
                        {/* Vintage Typewriter SVG */}
                        <motion.div
                            style={{ x: parallaxX1 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1.5, ease: editorialEase }}
                            className="w-full max-w-[280px] md:max-w-[450px] z-20 hover:scale-105 transition-transform duration-700 ease-out"
                        >
                            <img
                                src={typewriterSvg}
                                alt="Vintage Typewriter"
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="mt-16 flex flex-col justify-center items-center pb-16">
                <motion.img
                    src={featherSvg}
                    alt="Feather"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.6, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 2, ease: editorialEase }}
                    className="w-20 md:w-32 mb-12 drop-shadow-lg"
                />
                <div className="flex justify-center gap-12 items-center opacity-30 w-full">
                    <div className="h-[1px] w-24 md:w-32 bg-dream-purple/50"></div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.6em] text-dream-purple font-bold">Finis</p>
                    <div className="h-[1px] w-24 md:w-32 bg-dream-purple/50"></div>
                </div>
            </div>
        </div>
    );
};

export default Muse;
