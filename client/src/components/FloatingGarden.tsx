import React from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

const RealPeony = ({ className, style }: { className?: string, style?: React.CSSProperties }) => {
    const outerAngles = Array.from({ length: 8 }).map((_, i) => i * 45);
    const midAngles = Array.from({ length: 8 }).map((_, i) => i * 45 + 22.5);
    const innerAngles = Array.from({ length: 6 }).map((_, i) => i * 60 + 10);

    return (
        <svg viewBox="0 0 200 200" className={className} style={style} preserveAspectRatio="xMidYMid meet">
            <defs>
                <radialGradient id="peonyGrad" cx="50%" cy="80%" r="80%">
                    <stop offset="0%" stopColor="var(--flower-peony)" stopOpacity="0.95"/>
                    <stop offset="60%" stopColor="var(--flower-peony)" stopOpacity="0.85"/>
                    <stop offset="100%" stopColor="var(--bg-primary)" stopOpacity="0.1"/>
                </radialGradient>
                <radialGradient id="peonyCenter" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--flower-center)" stopOpacity="0.9"/>
                    <stop offset="50%" stopColor="var(--flower-center)" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="var(--flower-peony)" stopOpacity="0"/>
                </radialGradient>
                <path id="petal" d="M100 100 C 60 30, 20 50, 100 5 C 180 50, 140 30, 100 100" fill="url(#peonyGrad)" />
            </defs>

            <g>
                {outerAngles.map((angle) => (
                    <use key={`l1-${angle}`} href="#petal" style={{ transformOrigin: '100px 100px', transform: `rotate(${angle}deg)` }} />
                ))}
                {midAngles.map((angle) => (
                    <use key={`l2-${angle}`} href="#petal" style={{ transformOrigin: '100px 100px', transform: `rotate(${angle}deg) scale(0.85)` }} />
                ))}
                {innerAngles.map((angle) => (
                    <use key={`l3-${angle}`} href="#petal" style={{ transformOrigin: '100px 100px', transform: `rotate(${angle}deg) scale(0.6)` }} />
                ))}
                {outerAngles.map((angle) => (
                    <use key={`l4-${angle}`} href="#petal" style={{ transformOrigin: '100px 100px', transform: `rotate(${angle + 15}deg) scale(0.4)` }} />
                ))}
                <circle cx="100" cy="100" r="12" fill="url(#peonyCenter)" />
            </g>
        </svg>
    );
};

const RealLily = ({ className, style }: { className?: string, style?: React.CSSProperties }) => {
    const mainAngles = [0, 60, 120, 180, 240, 300];
    const offsetAngles = [30, 90, 150, 210, 270, 330];

    return (
        <svg viewBox="0 0 200 200" className={className} style={style} preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="lilyGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="var(--flower-lily)" stopOpacity="0.85"/>
                    <stop offset="40%" stopColor="var(--flower-lily)" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="var(--bg-primary)" stopOpacity="0.1"/>
                </linearGradient>
                <linearGradient id="lilyCenter" x1="50%" y1="50%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="var(--text-primary)" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="var(--flower-center)" stopOpacity="0.5"/>
                </linearGradient>
                <path id="lilyPetal" d="M100 100 Q 80 50, 100 0 Q 120 50, 100 100" fill="url(#lilyGrad)" />
                <path id="lilyStamen" d="M100 100 L 100 40" stroke="url(#lilyCenter)" strokeWidth="1.5" fill="none" />
                <circle id="lilyAnther" cx="100" cy="40" r="2.5" fill="var(--flower-center)" />
            </defs>

            <g>
                {offsetAngles.map((angle) => (
                    <use key={`back-${angle}`} href="#lilyPetal" style={{ transformOrigin: '100px 100px', transform: `rotate(${angle}deg) scale(0.9)` }} />
                ))}
                {mainAngles.map((angle) => (
                    <use key={`front-${angle}`} href="#lilyPetal" style={{ transformOrigin: '100px 100px', transform: `rotate(${angle}deg)` }} />
                ))}
                
                {[15, 75, 135, 195, 255, 315].map((angle) => (
                    <g key={`stamen-${angle}`} style={{ transformOrigin: '100px 100px', transform: `rotate(${angle}deg) scale(0.7)` }}>
                        <use href="#lilyStamen" />
                        <use href="#lilyAnther" />
                    </g>
                ))}

                <circle cx="100" cy="100" r="5" fill="var(--flower-lily)" />
                <circle cx="100" cy="100" r="2" fill="var(--bg-primary)" />
            </g>
        </svg>
    );
};

const FloatingGarden = ({ mouse }: { mouse: { x: MotionValue<number>, y: MotionValue<number> } }) => {
    const { scrollYProgress } = useScroll();
    
    // Dissolving Effects: Simplified to just opacity for performance
    const opacityEffect = useTransform(scrollYProgress, [0.1, 0.25], [0.85, 0]);

    const springX = useSpring(mouse.x, { stiffness: 40, damping: 20 });
    const springY = useSpring(mouse.y, { stiffness: 40, damping: 20 });

    const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", "-30vh"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0vh", "-60vh"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["0vh", "-45vh"]);
    const y4 = useTransform(scrollYProgress, [0, 1], ["0vh", "-80vh"]);

    const rotate1 = useTransform(springX, [-0.5, 0.5], [-15, 15]);
    const rotate2 = useTransform(springX, [-0.5, 0.5], [10, -10]);
    const swayX1 = useTransform(springX, [-0.5, 0.5], [-30, 30]);
    const swayX2 = useTransform(springY, [-0.5, 0.5], [20, -20]);

    return (
        <motion.div 
            style={{ opacity: opacityEffect }}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        >
            <motion.div style={{ y: y1, x: swayX1, rotate: rotate1 }} className="absolute top-[5%] left-[-5%] w-96 h-96 md:w-[45rem] md:h-[45rem] will-change-transform">
                <RealPeony className="w-full h-full opacity-90" />
            </motion.div>
            
            <motion.div style={{ y: y2, x: swayX2, rotate: rotate2 }} className="absolute top-[25%] right-[-10%] w-80 h-80 md:w-[35rem] md:h-[35rem] will-change-transform">
                <RealLily className="w-full h-full opacity-70" />
            </motion.div>

            <motion.div style={{ y: y3, x: swayX1, rotate: rotate2 }} className="absolute top-[60%] left-[5%] w-72 h-72 md:w-[30rem] md:h-[30rem] will-change-transform">
                <RealPeony className="w-full h-full opacity-60" style={{ transform: 'scaleX(-1)' }} />
            </motion.div>

            <motion.div style={{ y: y4, x: swayX2, rotate: rotate1 }} className="absolute top-[80%] right-[5%] w-96 h-96 md:w-[40rem] md:h-[40rem] will-change-transform">
                <RealLily className="w-full h-full opacity-80" style={{ transform: 'scaleY(-1)' }} />
            </motion.div>
        </motion.div>
    );
};

export default FloatingGarden;
