import { motion } from "framer-motion";

export const Cloud = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 100" className={className}>
        <circle cx="40" cy="60" r="30" fill="currentColor" />
        <circle cx="80" cy="50" r="40" fill="currentColor" />
        <circle cx="130" cy="60" r="35" fill="currentColor" />
        <circle cx="170" cy="70" r="25" fill="currentColor" />
    </svg>
);

export const BubblyCloud = Cloud;

export const BubblyTree = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 300" className={className}>
        {/* Trunk */}
        <path d="M100 280C100 280 90 230 90 180C90 130 110 130 110 180C110 230 100 280 100 280Z" fill="#74549A" />
        <path d="M100 220C100 220 120 200 130 200" stroke="#74549A" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 200C100 200 80 180 70 180" stroke="#74549A" strokeWidth="4" strokeLinecap="round" />
        
        {/* Foliage - Layered circles like the image */}
        <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            <circle cx="100" cy="110" r="65" fill="#F49191" />
            <circle cx="60" cy="140" r="45" fill="#FBD7D1" />
            <circle cx="140" cy="140" r="45" fill="#FBD7D1" />
            <circle cx="100" cy="150" r="40" fill="#F49191" opacity="0.6" />
            <circle cx="85" cy="90" r="12" fill="white" opacity="0.2" />
        </motion.g>
    </svg>
);

export const UniCat = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* Ears */}
        <path d="M30,40 L20,20 L40,35 Z" fill="#FFFFFF" stroke="#74549A" strokeWidth="2" />
        <path d="M70,40 L80,20 L60,35 Z" fill="#FFFFFF" stroke="#74549A" strokeWidth="2" />
        {/* Horn */}
        <path d="M50,10 L45,30 L55,30 Z" fill="#FFD700" />
        {/* Face */}
        <circle cx="50" cy="50" r="30" fill="#FFFFFF" stroke="#74549A" strokeWidth="2" />
        {/* Eyes */}
        <circle cx="40" cy="45" r="3" fill="#74549A" />
        <circle cx="60" cy="45" r="3" fill="#74549A" />
        {/* Nose */}
        <path d="M48,55 L52,55 L50,58 Z" fill="#F49191" />
        {/* Cheeks */}
        <circle cx="35" cy="55" r="5" fill="#FBD7D1" opacity="0.5" />
        <circle cx="65" cy="55" r="5" fill="#FBD7D1" opacity="0.5" />
    </svg>
);

export const CloudWave = ({ className, opacity = 1 }: { className?: string, opacity?: number }) => (
    <svg viewBox="0 0 1440 320" className={className} style={{ opacity }}>
        <path d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,213.3C672,203,768,149,864,149.3C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="currentColor"></path>
    </svg>
);

export const LayeredCloudWave = ({ className, position = "bottom", fill = "fill-white" }: { className?: string, position?: "top" | "bottom", fill?: string }) => {
    const rotation = position === "top" ? "rotate-180" : "";
    return (
        <div className={`relative w-full ${className} ${rotation}`}>
            <CloudWave className={`absolute w-full ${fill} translate-y-4`} opacity={0.3} />
            <CloudWave className={`absolute w-full ${fill} translate-y-2`} opacity={0.6} />
            <CloudWave className={`relative w-full ${fill}`} opacity={1} />
        </div>
    );
};
