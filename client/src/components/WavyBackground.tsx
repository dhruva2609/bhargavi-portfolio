import React from 'react';
import { motion } from 'framer-motion';

const WavyBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-80">
            {/* Top Wave: Lavender/Pink */}
            <motion.div 
                initial={{ x: -100, y: -50 }}
                animate={{ 
                    x: [ -100, -50, -100 ],
                    y: [ -50, -30, -50 ]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-[150vw] h-[60vh] bg-dream-pink/40"
                style={{ 
                    borderRadius: "0 0 100% 100% / 0 0 50% 50%",
                    transform: "rotate(-5deg) scale(1.2)",
                    filter: "blur(40px)"
                }}
            />

            {/* Middle Wave: Purple */}
            <motion.div 
                initial={{ x: 100, y: 300 }}
                animate={{ 
                    x: [ 100, 150, 100 ],
                    y: [ 300, 320, 300 ]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 right-0 w-[120vw] h-[50vh] bg-dream-purple/20"
                style={{ 
                    borderRadius: "100% 100% 0 0 / 50% 50% 0 0",
                    transform: "rotate(10deg) scale(1.5)",
                    filter: "blur(50px)"
                }}
            />

            {/* Bottom Wave: Cherry/Orange */}
            <motion.div 
                initial={{ x: -200, y: 800 }}
                animate={{ 
                    x: [ -200, -150, -200 ],
                    y: [ 800, 780, 800 ]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-[180vw] h-[55vh] bg-cherry/5"
                style={{ 
                    borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
                    transform: "rotate(-8deg) scale(1.3)",
                    filter: "blur(100px)"
                }}
            />

            {/* Floating Flowers (Drawn Aesthetic) */}
            <div className="absolute inset-0 opacity-20 mix-blend-multiply">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                            opacity: [0.3, 0.6, 0.3],
                            y: [0, -30, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ 
                            duration: 10 + i * 2, 
                            repeat: Infinity, 
                            delay: i * 2 
                        }}
                        className="absolute"
                        style={{
                            top: `${15 + i * 15}%`,
                            left: `${(i * 23) % 90}%`,
                        }}
                    >
                        <img 
                            src="/assets/images/flower.png" 
                            alt="Flower" 
                            className="w-48 h-48 object-contain filter grayscale sepia brightness-110"
                            style={{ filter: "hue-rotate(280deg) saturate(1.5)" }}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WavyBackground;
