import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader: React.FC<{ loading: boolean }> = ({ loading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + (100 - prev) * 0.1;
                });
            }, 200);
            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [loading]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-[2000] bg-off-white flex flex-col items-center justify-center pointer-events-none"
                >
                    {/* Top Progress Bar */}
                    <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: progress / 100 }}
                        className="fixed top-0 left-0 right-0 h-1 bg-dream-pink origin-left z-[2001]"
                    />

                    {/* Fading Signature */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                            opacity: [0, 0.4, 0.2, 0.6, 0.3],
                            y: 0 
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut" 
                        }}
                        className="text-center"
                    >
                        <h1 className="font-serif text-[clamp(4rem,15vw,15rem)] italic tracking-tighter text-dream-purple select-none opacity-10">
                            Bhargavi
                        </h1>
                        <span className="metadata-precise text-[10px] tracking-[0.8em] text-muted-rosegold uppercase block -mt-8">
                            Gathering Fragments...
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;
