import { motion } from 'framer-motion';
import { useMemo } from 'react';

const Stardust = () => {
    const stars = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
    })), []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-cherry/40 dark:bg-gold/40"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        backgroundColor: 'var(--color-cherry)',
                        boxShadow: '0 0 15px var(--color-gold)',
                        opacity: 0.6
                    }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.2, 0],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default Stardust;
