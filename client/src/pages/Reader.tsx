import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Heart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const Reader: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [work, setWork] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [stamps, setStamps] = useState<{ id: number, x: number, y: number, spread: number }[]>([]);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleStamp = (e: React.MouseEvent) => {
        if (!isOpen) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStamps([...stamps, { id: Date.now(), x, y, spread: currentPage }]);
    };

    useEffect(() => {
        const fetchWork = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/api/content/stories/${slug}`);
                if (!res.data) throw new Error("Narrative missing");
                setWork(res.data);
                setLikes(res.data.likes || 0);
            } catch (err) {
                console.error("The archive was silent:", err);
                setWork(null);
            } finally {
                setLoading(false);
            }
        };
        fetchWork();
    }, [slug]);

    const handleLike = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/content/stories/${work._id}/like`, {
                unlike: isLiked
            });
            setLikes(res.data.likes);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error("Could not echo your appreciation:", err);
        }
    };

    const pages = useMemo(() => {
        if (!work?.body) return [];
        const content = work.body.includes('Chapter') ? work.body : `Chapter I: The Beginning\n\n${work.body}`;
        const words = content.split(' ');
        const result: string[] = [];
        let currentChunk = "";
        words.forEach((word: string) => {
            if ((currentChunk + word).length > 700) {
                result.push(currentChunk.trim());
                currentChunk = word + " ";
            } else {
                currentChunk += word + " ";
            }
        });
        if (currentChunk) result.push(currentChunk.trim());
        if (result.length % 2 !== 0) result.push("");
        return result;
    }, [work]);

    const totalSpreads = Math.ceil(pages.length / 2);
    const progress = totalSpreads > 0 ? ((currentPage + 1) / totalSpreads) * 100 : 0;
    const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-off-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-dream-purple opacity-20"
            >
                <BookOpen size={48} />
            </motion.div>
        </div>
    );

    if (!work) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-off-white px-6 text-center">
            <span className="metadata-precise text-muted-rosegold text-[10px] tracking-[0.8em] uppercase mb-8">The Page is Blank</span>
            <h1 className="font-serif text-4xl italic text-dream-purple mb-8">This narrative has been lost to the archive.</h1>
            <button
                onClick={() => navigate('/muse')}
                className="btn-editorial"
            >
                Return to the Bookshelf
            </button>
        </div>
    );

    return (
        <div className="min-h-screen book-container flex flex-col items-center justify-center overflow-hidden p-6 md:p-12 relative bg-[#FAF9F6]">
            {/* Premium Texture Overlay — inline SVG, zero network requests */}
            <div
                className="fixed inset-0 pointer-events-none z-[200] opacity-[0.015] mix-blend-overlay"
                style={{ backgroundImage: NOISE_SVG, backgroundSize: '200px 200px' }}
            />

            {/* Top Navigation & Progress Bar */}
            <div className="fixed top-24 md:top-0 left-0 right-0 z-[150] p-6 md:p-10 flex flex-col gap-6">
                <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-dream-purple/40 hover:text-cherry transition-colors duration-500"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="metadata-precise text-[10px]">Back to Archive</span>
                    </button>

                    <div className="text-center">
                        <h2 className="font-serif italic text-dream-purple text-lg md:text-2xl tracking-tight leading-none">
                            {work?.title}
                        </h2>
                        <span className="metadata-precise text-[8px] text-muted-rosegold/50 mt-2 block tracking-[0.4em]">
                            Reading Progress: {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${isLiked ? 'text-cherry bg-cherry/5' : 'text-dream-purple/30 hover:text-cherry hover:bg-cherry/5'}`}
                        >
                            <Heart size={22} className={isLiked ? 'fill-cherry' : ''} />
                            <span className="metadata-precise text-[12px]">{likes}</span>
                        </button>
                        <BookOpen size={18} className="text-dream-purple/20 hidden md:block" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-2xl mx-auto h-[1px] bg-dream-purple/5 relative overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: editorialEase }}
                        className="absolute top-0 left-0 h-full bg-cherry/40"
                    />
                </div>
            </div>

            {/* 3D Book Architecture */}
            <div className={`relative w-full ${isMobile ? 'max-w-md aspect-[1/1.5]' : 'max-w-6xl aspect-[4/3] md:aspect-[3/2]'} flex items-center justify-center mt-56 md:mt-40 px-6`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: editorialEase }}
                    className="book-perspective relative w-full h-full flex items-center justify-center"
                >
                    {/* Hardcover */}
                    <motion.div
                        animate={{
                            rotateY: isOpen ? -180 : 0,
                            zIndex: isOpen ? 0 : 100,
                            x: isOpen ? '0%' : (isMobile ? '0%' : '25%'),
                        }}
                        transition={{ duration: 1.8, ease: editorialEase }}
                        onClick={() => !isOpen && setIsOpen(true)}
                        style={{ transformOrigin: 'left center' }}
                        className={`absolute ${isMobile ? 'left-0 w-full' : 'left-1/4 w-1/2'} top-0 h-full cover-texture rounded-r-lg cursor-pointer shadow-[20px_40px_80px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-8 md:p-12 border-l-8 border-black/10 z-100`}
                    >
                        <div className="border border-white/5 w-full h-full flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <span className="metadata-precise text-white/30 mb-8 block">Fragments of the Soul</span>
                            <h1 className="text-4xl md:text-7xl font-serif italic text-dream-pink leading-tight mb-8 tracking-tighter">
                                {work?.title}
                            </h1>
                            <div className="w-16 h-[1px] bg-white/10 mb-8" />
                            <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] animate-pulse">
                                {isMobile ? 'Tap to Read' : 'Touch to Begin'}
                            </p>
                        </div>
                    </motion.div>

                    {/* Spine */}
                    <motion.div
                        animate={{ opacity: isOpen ? 0 : 1 }}
                        className={`absolute ${isMobile ? 'left-0' : 'left-1/4'} top-0 -translate-x-full w-12 h-full book-spine z-[60] rounded-l-lg border-r border-white/5`}
                    />

                    {/* Inner Pages */}
                    <motion.div
                        animate={{ opacity: isOpen ? 1 : 0 }}
                        className="absolute inset-0 flex shadow-[0_50px_100px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden bg-[#FDFBF7]"
                    >
                        {isMobile ? (
                            /* Mobile: single-page vertical scroll */
                            <div className="w-full h-full bg-paper-texture relative flex flex-col p-6 overflow-hidden">
                                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-20">
                                    <div className="prose prose-dream">
                                        {pages.map((page, pIdx) => (
                                            <div key={pIdx}>
                                                {page.split('\n').map((para, i) => (
                                                    <p
                                                        key={`${pIdx}-${i}`}
                                                        className={para.startsWith('Chapter') ? 'chapter-title' : `text-charcoal/90 text-lg leading-[1.8] text-justify font-serif mb-6 ${pIdx === 0 && i === 0 ? 'drop-cap' : ''}`}
                                                    >
                                                        {para}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Desktop: two-page spread */
                            <>
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/[0.05] to-transparent z-30" />

                                {/* Left Page */}
                                <div className="w-1/2 h-full bg-paper-texture relative flex flex-col p-12 md:p-24 overflow-hidden border-r border-black/[0.05]">
                                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/[0.12] to-transparent pointer-events-none" />
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-6 relative z-10">
                                        <div className="prose prose-dream">
                                            {pages[currentPage * 2]?.split('\n').map((para, i) => (
                                                <p
                                                    key={i}
                                                    className={para.startsWith('Chapter') ? 'chapter-title' : `text-charcoal/90 text-lg md:text-xl leading-[1.8] text-justify font-serif mb-6 ${i === 0 && currentPage === 0 ? 'drop-cap' : ''}`}
                                                >
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-between items-center metadata-precise text-muted-rosegold/30 text-[9px] relative z-10">
                                        <span>{(currentPage * 2) + 1}</span>
                                        {currentPage > 0 && (
                                            <button
                                                onClick={() => setCurrentPage(c => Math.max(0, c - 1))}
                                                className="hover:text-cherry transition-colors flex items-center gap-2 tracking-[0.2em]"
                                            >
                                                <ArrowLeft size={10} /> Prev
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Gutter */}
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1px] h-full bg-black/10 z-20 shadow-[0_0_10px_rgba(0,0,0,0.1)]" />
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-4 h-full bg-gradient-to-r from-black/[0.05] via-transparent to-black/[0.05] z-20" />

                                {/* Right Page */}
                                <div
                                    onDoubleClick={handleStamp}
                                    className="w-1/2 h-full bg-paper-texture relative flex flex-col p-10 md:p-20 overflow-hidden cursor-crosshair"
                                >
                                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/[0.08] to-transparent pointer-events-none" />
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pl-6 relative z-10">
                                        <div className="prose prose-dream">
                                            {pages[(currentPage * 2) + 1]?.split('\n').map((para, i) => (
                                                <p
                                                    key={i}
                                                    className={para.startsWith('Chapter') ? 'chapter-title' : `text-charcoal/90 text-lg md:text-xl leading-[1.8] text-justify font-serif mb-6`}
                                                >
                                                    {para}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    {stamps.filter(s => s.spread === currentPage && s.x >= 0).map(stamp => (
                                        <motion.div
                                            key={stamp.id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 0.4 }}
                                            className="absolute pointer-events-none text-cherry"
                                            style={{ left: stamp.x, top: stamp.y }}
                                        >
                                            <Sparkles size={14} className="animate-pulse" />
                                        </motion.div>
                                    ))}
                                    <div className="mt-8 flex justify-between items-center metadata-precise text-muted-rosegold/30 text-[9px] relative z-10">
                                        {currentPage < totalSpreads - 1 ? (
                                            <button
                                                onClick={() => setCurrentPage(c => Math.min(totalSpreads - 1, c + 1))}
                                                className="hover:text-cherry transition-colors flex items-center gap-2 tracking-[0.2em]"
                                            >
                                                Next <ArrowRight size={10} />
                                            </button>
                                        ) : (
                                            <span className="italic text-cherry/40">Finis</span>
                                        )}
                                        <span>{(currentPage * 2) + 2}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Float Navigation Controls (Desktop Only) */}
            {!isMobile && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-12 bg-white/40 backdrop-blur-md px-12 py-4 rounded-full border border-dream-purple/5 shadow-editorial">
                    <button
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(c => Math.max(0, c - 1))}
                        className="text-dream-purple/40 hover:text-cherry disabled:opacity-10 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="metadata-precise text-[8px] text-muted-rosegold tracking-[0.4em]">Archive Spread</span>
                        <span className="font-serif italic text-dream-purple text-lg">{currentPage + 1} / {totalSpreads}</span>
                    </div>
                    <button
                        disabled={currentPage === totalSpreads - 1}
                        onClick={() => setCurrentPage(c => Math.min(totalSpreads - 1, c + 1))}
                        className="text-dream-purple/40 hover:text-cherry disabled:opacity-10 transition-all"
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Reader;