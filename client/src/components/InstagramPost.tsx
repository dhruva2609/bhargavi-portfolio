import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

// Google Drive blocks direct embedding of images on third-party sites due to CORS.
// This transformer takes any Drive link and converts it to a thumbnail endpoint that IS allowed to be embedded.
const transformDriveUrl = (url: string) => {
    if (!url) return url;
    if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;
    
    const idMatch = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
    if (idMatch && idMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    return url;
};

export const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
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

const InstagramPost: React.FC<InstagramPostProps> = ({ url, label, placeholderImage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [thumbnail, setThumbnail] = useState<string>(
        transformDriveUrl(placeholderImage || "")
    );
    const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

    useEffect(() => {
        if (placeholderImage) {
            setThumbnail(transformDriveUrl(placeholderImage));
        }
    }, [placeholderImage]);

    useEffect(() => {
        console.log("Loading Visual Grammar image link:", thumbnail);
    }, [thumbnail]);

    useEffect(() => {
        const fetchThumbnail = async () => {
            if (placeholderImage) return; // Don't fetch if we already have a drive image or direct link

            try {
                const sanitizedUrl = url.split('?')[0];
                const res = await fetch(
                    `${API_URL}/api/content/instagram/thumbnail?url=${encodeURIComponent(sanitizedUrl)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.thumbnail) {
                        setThumbnail(transformDriveUrl(data.thumbnail));
                    }
                }
            } catch (err) {
                console.warn('Thumbnail fetch failed, keeping current for:', url);
            } finally {
                setThumbnailLoaded(true);
            }
        };
        fetchThumbnail();
    }, [url, placeholderImage]);

    useEffect(() => {
        let timeoutId: any;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const processEmbed = () => {
                if ((window as any).instgrm) {
                    (window as any).instgrm.Embeds.process();
                }
            };
            
            if (!(window as any).instgrm) {
                const script = document.createElement('script');
                script.src = "//www.instagram.com/embed.js";
                script.async = true;
                document.body.appendChild(script);
                script.onload = () => {
                    timeoutId = setTimeout(processEmbed, 400);
                };
            } else {
                timeoutId = setTimeout(processEmbed, 400);
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isOpen]);

    const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="instagram-modal-root" style={{ position: 'relative', zIndex: 9999 }}>
                            <motion.div
                                key="modal-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 cursor-zoom-out bg-white/98 backdrop-blur-xl"
                                style={{
                                    zIndex: 9998,
                                    position: 'fixed',
                                    top: 0, left: 0, right: 0, bottom: 0
                                }}
                            />

                            <div
                                className="fixed inset-0 flex items-center justify-center p-4 md:p-12"
                                style={{
                                    zIndex: 9999,
                                    pointerEvents: 'none',
                                    position: 'fixed',
                                    top: 0, left: 0, right: 0, bottom: 0
                                }}
                            >
                                <motion.div
                                    key="instagram-modal-content"
                                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.95, opacity: 0, y: 30 }}
                                    transition={{ ease: editorialEase, duration: 0.7 }}
                                    className="relative w-full max-w-5xl h-[90vh] flex flex-col md:flex-row bg-white shadow-[0_50px_150px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden border border-dream-purple/5"
                                    style={{ pointerEvents: 'auto' }}
                                >
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-6 right-6 z-[210] p-3 rounded-full bg-white/80 backdrop-blur-md border border-dream-purple/10 text-dream-purple hover:text-cherry hover:scale-110 transition-all duration-300 shadow-sm"
                                        aria-label="Close modal"
                                    >
                                        <X size={18} />
                                    </button>

                                    <div className="w-full md:w-80 p-10 border-r border-dream-purple/5 flex flex-col justify-between bg-white shrink-0 relative z-10">
                                        <div>
                                            <span className="metadata-precise text-muted-rosegold mb-8 block opacity-60">Visual Archive / Scene</span>
                                            <h2 className="text-4xl font-serif italic text-dream-purple mb-6 leading-tight tracking-tight">{label}</h2>
                                            <div className="w-12 h-[0.5px] bg-dream-purple/20 mb-8" />
                                            <p className="text-charcoal/50 leading-relaxed italic font-serif text-base">
                                                Exploring the silent language of architecture and light within the "Visual Grammar" series.
                                            </p>
                                        </div>
                                        
                                        <a
                                            href={url && url.includes('instagram.com') ? url : placeholderImage}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-dream-purple/30 hover:text-cherry transition-colors group mt-12 no-underline"
                                        >
                                            <span className="metadata-precise text-[10px] uppercase tracking-[0.3em]">{url && url.includes('instagram.com') ? "Open Instagram" : "Open Original Image"}</span>
                                            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>

                                    <div className="flex-1 bg-white overflow-y-auto p-4 md:p-12 custom-scrollbar flex justify-center items-start">
                                        <div className="w-full max-w-[540px] py-4">
                                            {url && url.includes('instagram.com') ? (
                                                <blockquote
                                                    key={`embed-${url}`}
                                                    className="instagram-media w-full"
                                                    data-instgrm-permalink={url}
                                                    data-instgrm-version="14"
                                                >
                                                    <div className="p-20 flex flex-col items-center justify-center bg-off-white/30 border border-dream-purple/5 rounded-sm min-h-[400px]">
                                                        <div className="animate-spin text-dream-purple/10 mb-6">
                                                            <InstagramIcon size={56} />
                                                        </div>
                                                        <p className="text-muted-rosegold/40 metadata-precise animate-pulse uppercase tracking-[0.4em] text-[9px]">Fetching fragment from cloud...</p>
                                                    </div>
                                                </blockquote>
                                            ) : (
                                                <div className="p-4 flex items-center justify-center bg-off-white/30 border border-dream-purple/5 rounded-sm min-h-[400px]">
                                                    <img src={thumbnail} alt={label} className="w-full h-auto object-contain rounded-sm" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                    hidden: { opacity: 0, scale: 0.98, y: 15 },
                    visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { duration: 1, ease: editorialEase }
                    }
                }}
                className="editorial-card group relative aspect-square overflow-hidden flex-none w-[85vw] sm:w-[50vw] md:w-[400px] snap-center cursor-pointer bg-white/50 border border-dream-purple/5"
                onClick={() => setIsOpen(true)}
            >
                {!thumbnailLoaded && (
                    <div className="absolute inset-0 shimmer z-10 bg-off-white/5" />
                )}

                <img
                    src={thumbnail}
                    alt={label}
                    className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out pointer-events-none group-hover:scale-105 ${thumbnailLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                    onLoad={() => setThumbnailLoaded(true)}
                    onError={() => {
                        setThumbnailLoaded(true);
                    }}
                />

                <div className="absolute inset-0 bg-dream-purple/[0.08] group-hover:bg-transparent transition-colors duration-700 pointer-events-none" />

                <div className="absolute inset-0 flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-dream-purple/90 via-dream-purple/20 to-transparent pointer-events-none">
                    <div className="flex items-center gap-2 text-dream-pink/70 metadata-precise mb-4">
                        <InstagramIcon size={12} />
                        <span>Visual Scene</span>
                    </div>
                    <h3 className="text-white text-3xl italic font-serif tracking-tight leading-tight mb-2">{label}</h3>
                    <div className="w-8 h-[1px] bg-white/20 mb-4" />
                    <p className="text-white/40 text-[8px] uppercase tracking-[0.4em]">Tap to explore</p>
                </div>

                <div className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center text-white/40 group-hover:text-white transition-colors duration-500 pointer-events-none">
                    <InstagramIcon size={20} />
                </div>
            </motion.div>
        </>
    );
};

export default InstagramPost;
