import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Curated placeholder set — will swap to real image once fetched
const PLACEHOLDERS = [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
];

export const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

interface InstagramPostProps {
    url: string;
    label: string;
    placeholderImage?: string;
    index?: number;
}

const InstagramPost: React.FC<InstagramPostProps> = ({ url, label, placeholderImage, index = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [thumbnail, setThumbnail] = useState<string>(
        placeholderImage || PLACEHOLDERS[index % PLACEHOLDERS.length]
    );
    const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

    useEffect(() => {
        // Start with placeholder, then try to fetch the real thumbnail from our backend proxy
        const fetchThumbnail = async () => {
            try {
                const sanitizedUrl = url.split('?')[0];
                const res = await fetch(
                    `${API_URL}/api/content/instagram/thumbnail?url=${encodeURIComponent(sanitizedUrl)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.thumbnail) {
                        setThumbnail(data.thumbnail);
                    }
                }
            } catch (err) {
                // Keep showing placeholder — no visual disruption
                console.warn('Thumbnail fetch failed, keeping placeholder for:', url);
            }
        };

        fetchThumbnail();
    }, [url]);

    // Load Instagram embed script when modal opens
    useEffect(() => {
        if (isOpen) {
            if (!(window as any).instgrm) {
                const script = document.createElement('script');
                script.src = "//www.instagram.com/embed.js";
                script.async = true;
                document.body.appendChild(script);
                script.onload = () => {
                    (window as any).instgrm?.Embeds.process();
                };
            } else {
                (window as any).instgrm?.Embeds.process();
            }
        }
    }, [isOpen]);

    const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

    return (
        <>
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 20 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { duration: 1.2, ease: editorialEase }
                    }
                }}
                className="editorial-card group relative aspect-[4/5] overflow-hidden flex-none w-[80vw] sm:w-[50vw] md:w-[400px] snap-center cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                {/* Shimmer while loading */}
                {!thumbnailLoaded && (
                    <div className="absolute inset-0 shimmer z-10" />
                )}

                <img
                    src={thumbnail}
                    alt={label}
                    className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out pointer-events-none group-hover:scale-105 ${thumbnailLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    onLoad={() => setThumbnailLoaded(true)}
                    onError={() => {
                        // If the real thumbnail fails, fall back to placeholder
                        setThumbnail(placeholderImage || PLACEHOLDERS[index % PLACEHOLDERS.length]);
                        setThumbnailLoaded(true);
                    }}
                />

                {/* Purple tint overlay */}
                <div className="absolute inset-0 bg-dream-purple/[0.12] group-hover:bg-dream-purple/0 transition-colors duration-700 pointer-events-none" />

                {/* Hover reveal */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-dream-purple/85 via-dream-purple/20 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 text-dream-pink/80 metadata-precise mb-3">
                        <InstagramIcon size={12} />
                        <span>Visual Fragment</span>
                    </div>
                    <h3 className="text-white text-3xl italic font-serif tracking-tight leading-tight">{label}</h3>
                    <p className="text-white/50 text-[9px] mt-3 uppercase tracking-[0.25em]">Tap to expand</p>
                </div>

                {/* Corner arrow */}
                <div className="absolute top-6 right-6 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-cherry group-hover:border-cherry transition-all duration-500 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                </div>

                {/* Instagram badge */}
                <div className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center text-white/60 group-hover:text-white transition-colors duration-500 pointer-events-none">
                    <InstagramIcon size={18} />
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-off-white/95 backdrop-blur-xl"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ ease: editorialEase, duration: 0.8 }}
                            className="relative w-full max-w-4xl h-[88vh] flex flex-col md:flex-row bg-white shadow-2xl rounded-sm overflow-hidden border border-dream-purple/5"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-5 right-5 z-[210] p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-dream-purple/10 text-dream-purple hover:text-cherry transition-colors duration-300"
                            >
                                <X size={20} />
                            </button>

                            {/* Left sidebar */}
                            <div className="w-full md:w-72 p-8 md:p-10 border-r border-dream-purple/5 flex flex-col justify-between bg-off-white/50 shrink-0">
                                <div>
                                    <span className="metadata-precise text-muted-rosegold mb-6 block">Instagram Fragment</span>
                                    <h2 className="text-3xl font-serif italic text-dream-purple mb-5 leading-tight">{label}</h2>
                                    <div className="w-10 h-[0.5px] bg-dream-purple/20 mb-6" />
                                    <p className="text-charcoal/55 leading-relaxed italic font-serif text-sm">
                                        Part of the "Visual Grammar" series—exploring the silent language of architecture, light, and space.
                                    </p>
                                </div>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-dream-purple/40 hover:text-cherry transition-colors group mt-8"
                                >
                                    <span className="metadata-precise text-[9px] uppercase tracking-widest">View on Instagram</span>
                                    <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>

                            {/* Embed area */}
                            <div className="flex-1 bg-white overflow-y-auto p-4 md:p-8 custom-scrollbar flex justify-center items-start pt-8">
                                <div className="w-full max-w-[540px]">
                                    <blockquote
                                        className="instagram-media w-full"
                                        data-instgrm-permalink={url}
                                        data-instgrm-version="14"
                                    >
                                        <div className="p-16 flex flex-col items-center justify-center">
                                            <div className="animate-spin text-dream-purple/20 mb-5">
                                                <InstagramIcon size={48} />
                                            </div>
                                            <p className="text-muted-rosegold metadata-precise animate-pulse uppercase tracking-[0.2em] text-[10px]">Syncing with Instagram…</p>
                                        </div>
                                    </blockquote>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default InstagramPost;
