import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

// Custom Instagram Icon as lucide-react might have versioning issues
const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

interface InstagramPostProps {
    url: string;
    label: string;
    placeholderImage: string;
}

const InstagramPost: React.FC<InstagramPostProps> = ({ url, label, placeholderImage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const embedRef = useRef<HTMLQuoteElement>(null);

    // Extract shortcode for visual feedback (optional)
    // const shortcode = url.split('/p/')[1]?.split('/')[0];

    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                const targetUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`;
                const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
                const data = await response.json();
                const embedData = JSON.parse(data.contents);
                if (embedData.thumbnail_url) {
                    setThumbnail(embedData.thumbnail_url);
                }
            } catch (err) {
                console.warn("Could not fetch Instagram thumbnail dynamically, using archive fallback.");
            }
        };
        fetchThumbnail();
    }, [url]);

    useEffect(() => {
        if (isOpen && !isLoaded) {
            // Load Instagram embed script
            const script = document.createElement('script');
            script.src = "//www.instagram.com/embed.js";
            script.async = true;
            document.body.appendChild(script);
            
            script.onload = () => {
                if ((window as any).instgrm) {
                    (window as any).instgrm.Embeds.process();
                }
                setIsLoaded(true);
            };
        }
    }, [isOpen, isLoaded]);

    const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

    return (
        <>
            <motion.div
                variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 1.2, ease: editorialEase }
                    }
                }}
                className="editorial-card group relative aspect-[4/5] overflow-hidden flex-none w-[80vw] sm:w-[50vw] md:w-[400px] snap-center cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={thumbnail || placeholderImage}
                    alt={label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out pointer-events-none"
                    loading="lazy"
                />
                
                {/* Visual Grammar Overlay */}
                <div className="absolute inset-0 bg-dream-purple/[0.15] group-hover:bg-dream-purple/0 transition-colors duration-700 pointer-events-none" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-dream-purple/80 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 text-dream-pink/80 metadata-precise mb-4">
                        <InstagramIcon size={14} />
                        <span>Live Fragment</span>
                    </div>
                    <h3 className="text-white text-4xl italic font-serif tracking-tight">{label}</h3>
                    <p className="text-white/60 text-xs mt-4 uppercase tracking-[0.2em]">Click to expand fragment</p>
                </div>

                <div className="absolute top-8 right-8 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-cherry group-hover:border-cherry transition-all duration-500 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
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
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ ease: editorialEase, duration: 0.8 }}
                            className="relative w-full max-w-4xl h-[85vh] flex flex-col md:flex-row bg-white shadow-2xl rounded-sm overflow-hidden border border-dream-purple/5"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-6 right-6 z-[210] p-3 rounded-full bg-white/80 backdrop-blur-sm border border-dream-purple/10 text-dream-purple hover:text-cherry transition-colors duration-500"
                            >
                                <X size={24} />
                            </button>

                            {/* Sidebar / Info */}
                            <div className="w-full md:w-80 p-8 md:p-12 border-r border-dream-purple/5 flex flex-col justify-between bg-off-white/30">
                                <div>
                                    <span className="metadata-precise text-muted-rosegold mb-8 block">Instagram Fragment</span>
                                    <h2 className="text-4xl font-serif italic text-dream-purple mb-6">{label}</h2>
                                    <div className="w-12 h-[1px] bg-dream-purple/20 mb-8" />
                                    <p className="text-charcoal/60 leading-relaxed italic font-serif">
                                        Part of the "Visual Grammar" series—exploring the silent language of architecture and space.
                                    </p>
                                </div>
                                
                                <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-dream-purple/40 hover:text-cherry transition-colors group"
                                >
                                    <span className="metadata-precise text-xs uppercase tracking-widest">View on Instagram</span>
                                    <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            </div>

                            {/* Embed Area */}
                            <div className="flex-1 bg-white overflow-y-auto p-4 md:p-8 custom-scrollbar flex justify-center items-center">
                                <div className="w-full max-w-[540px] min-h-[450px] flex items-center justify-center">
                                    <blockquote 
                                        className="instagram-media w-full" 
                                        data-instgrm-permalink={url}
                                        data-instgrm-version="14"
                                        ref={embedRef}
                                    >
                                        <div className="p-12 flex flex-col items-center justify-center">
                                            <div className="animate-spin text-dream-purple/20 mb-4">
                                                <InstagramIcon size={48} />
                                            </div>
                                            <p className="text-muted-rosegold metadata-precise animate-pulse uppercase tracking-[0.2em] text-[10px]">Syncing with Instagram...</p>
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
