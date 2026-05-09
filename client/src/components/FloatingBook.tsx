import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

interface FloatingBookProps {
    title: string;
    subtitle?: string;
}

const FloatingBook: React.FC<FloatingBookProps> = ({ title, subtitle }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

    const mouseRotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);

    // Tie scrolling to the book's vertical position and slight tilt
    const { scrollYProgress } = useScroll(); // Use global scroll
    
    // Parallax values: travels along a curved trajectory (simulated via X/Y)
    const scrollY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 300, 600]);
    const scrollX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, -200]);
    const scrollRotateZ = useTransform(scrollYProgress, [0, 1], ["-5deg", "35deg"]);
    const scrollRotateY = useTransform(scrollYProgress, [0, 1], ["0deg", "180deg"]);

    // Flip pages effect tied to scroll
    const page1Rotate = useTransform(scrollYProgress, [0, 0.3], ["0deg", "-160deg"]);
    const page2Rotate = useTransform(scrollYProgress, [0.1, 0.4], ["0deg", "-150deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    return (
        <div ref={containerRef} className="perspective-[1000px] flex items-center justify-center p-10">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{ 
                    rotateX: mouseRotateX, 
                    rotateY: scrollRotateY, // Override with scroll-driven physics rotation
                    rotateZ: scrollRotateZ,
                    y: scrollY,
                    x: scrollX,
                    transformStyle: "preserve-3d" 
                }}
                className="relative w-72 h-[450px] editorial-card cursor-pointer group bg-white/40 shadow-2xl"
            >
                {/* 3D Content Layers */}
                <div 
                    style={{ transform: "translateZ(60px)" }} 
                    className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center z-20"
                >
                    <span className="font-sans text-[8px] tracking-[0.6em] text-muted-rosegold uppercase font-bold mb-6 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                        The Masterpiece
                    </span>
                    <h3 className="font-serif text-5xl text-dream-purple italic font-light leading-tight">
                        {title}
                    </h3>
                    <div className="mt-8 w-12 h-[1px] bg-cherry/30 group-hover:w-24 transition-all duration-1000" />
                    {subtitle && (
                        <p className="mt-8 font-serif text-dream-purple/40 italic text-lg opacity-0 group-hover:opacity-100 transition-all duration-700">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Decorative 3D elements */}
                <div 
                    style={{ transform: "translateZ(30px)" }} 
                    className="absolute inset-4 border border-dream-purple/5 rounded-[1rem] pointer-events-none"
                />

                {/* Flipping Pages */}
                <motion.div
                    style={{ rotateY: page1Rotate, transformOrigin: "left", transformStyle: "preserve-3d", translateZ: "10px" }}
                    className="absolute inset-0 bg-white/60 border border-white/40 rounded-r-[1.5rem] pointer-events-none"
                />
                <motion.div
                    style={{ rotateY: page2Rotate, transformOrigin: "left", transformStyle: "preserve-3d", translateZ: "20px" }}
                    className="absolute inset-0 bg-white/40 border border-white/20 rounded-r-[1.5rem] pointer-events-none"
                />
                
                {/* Book Spine Shadow effect */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dream-purple/5 to-transparent pointer-events-none" />
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cherry/5 via-transparent to-dream-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>
        </div>
    );
};

export default FloatingBook;
