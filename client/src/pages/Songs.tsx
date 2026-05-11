import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Music, ArrowLeft, Sparkles, Feather, Play, Heart } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Mood pill colours ─────────────────────────────────────────────
const moodColour = (mood: string) => {
    const m = (mood || '').toLowerCase();
    if (m.includes('melanchol'))  return { bg: 'rgba(104,76,143,0.08)', text: '#684c8f', border: 'rgba(104,76,143,0.15)' };
    if (m.includes('hope'))       return { bg: 'rgba(255,77,141,0.08)', text: '#FF4D8D', border: 'rgba(255,77,141,0.15)' };
    if (m.includes('nostalg'))    return { bg: 'rgba(183,110,121,0.08)', text: '#B76E79', border: 'rgba(183,110,121,0.15)' };
    if (m.includes('celebr') || m.includes('joy')) return { bg: 'rgba(251,215,209,0.25)', text: '#B76E79', border: 'rgba(251,215,209,0.4)' };
    return { bg: 'rgba(104,76,143,0.06)', text: '#684c8f', border: 'rgba(104,76,143,0.12)' };
};

// ── Song List Card ────────────────────────────────────────────────
const SongCard = ({ song, onClick, index }: { song: any; onClick: () => void; index: number }) => {
    const [liked, setLiked] = useState(false);
    const clr = moodColour(song.mood);

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: editorialEase, delay: index * 0.08 }}
            onClick={onClick}
            className="editorial-card p-6 md:p-10 cursor-pointer group relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.45)' }}
        >
            {/* Hover gradient sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-dream-pink/0 to-dream-purple/0 group-hover:from-dream-pink/5 group-hover:to-dream-purple/5 transition-all duration-700 pointer-events-none" />

            {/* Decorative large feather */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
                <Feather size={80} className="rotate-45 text-dream-purple" />
            </div>

            <div className="relative z-10">
                {/* Header row */}
                <div className="flex justify-between items-start mb-6 md:mb-8 gap-3">
                    <span
                        className="metadata-precise text-[7px] md:text-[8px] px-3 py-1.5 rounded-full border"
                        style={{ background: clr.bg, color: clr.text, borderColor: clr.border }}
                    >
                        {song.mood || 'Lyric'}
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
                            className="text-dream-purple/20 hover:text-cherry transition-colors duration-300 active:scale-95"
                        >
                            <Heart
                                size={14}
                                className={liked ? 'fill-cherry text-cherry' : ''}
                            />
                        </button>
                        <span className="metadata-precise text-[7px] text-muted-rosegold/30">
                            {new Date(song.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl md:text-4xl italic text-dream-purple group-hover:text-cherry transition-colors duration-500 mb-4 leading-tight">
                    {song.title}
                </h3>

                {/* Lyric preview */}
                <p className="text-charcoal/40 font-serif italic text-sm md:text-base line-clamp-2 leading-relaxed mb-8">
                    {song.lyrics}
                </p>

                {/* Footer row */}
                <div className="pt-4 border-t border-dream-purple/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-dream-purple/30 group-hover:text-cherry transition-colors duration-500">
                        <Play size={12} />
                        <span className="metadata-precise text-[8px] uppercase tracking-[0.3em]">Read the Lyrics</span>
                    </div>
                    <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className="text-dream-purple/20 group-hover:text-cherry transition-colors"
                    >
                        <Sparkles size={12} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Song Viewer ───────────────────────────────────────────────────
const SongViewer = ({ song, onClose }: { song: any; onClose: () => void }) => {
    const clr = moodColour(song.mood);

    return (
        <motion.div
            key="viewer"
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.6, ease: editorialEase }}
            className="max-w-3xl mx-auto"
        >
            <button
                onClick={onClose}
                className="flex items-center gap-3 text-dream-purple/35 hover:text-cherry transition-colors mb-10 md:mb-16 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="metadata-precise text-[9px] tracking-widest uppercase">Return to Melodies</span>
            </button>

            <div className="editorial-card relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.6)' }}>
                {/* Top accent bar — mood colour */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${clr.text}, #FF4D8D)` }} />

                {/* Shimmer background */}
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${clr.bg} 0%, transparent 70%)` }}
                />

                <div className="relative z-10 p-8 md:p-16 lg:p-24 space-y-10 md:space-y-16 text-center">
                    {/* Header */}
                    <div className="space-y-4 md:space-y-6">
                        <span className="metadata-precise text-[9px] tracking-[0.5em]" style={{ color: clr.text }}>
                            Written Song
                        </span>
                        <h2 className="font-serif text-4xl md:text-7xl italic text-dream-purple tracking-tighter leading-none">
                            {song.title}
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-muted-rosegold/30">
                            <div className="h-[1px] w-6 md:w-8 bg-current" />
                            <span className="metadata-precise text-[7px] uppercase tracking-widest">{song.mood}</span>
                            <div className="h-[1px] w-6 md:w-8 bg-current" />
                        </div>
                    </div>

                    {/* Lyrics */}
                    <div className="space-y-8 md:space-y-12 max-w-xl mx-auto text-left">
                        {song.lyrics.split('\n\n').map((verse: string, i: number) => (
                            <motion.p
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1, ease: editorialEase }}
                                className="font-serif text-xl md:text-3xl italic text-charcoal/70 leading-relaxed whitespace-pre-wrap"
                            >
                                {verse}
                            </motion.p>
                        ))}
                    </div>

                    {/* Finis */}
                    <div className="pt-8 opacity-15 flex justify-center">
                        <Feather size={28} className="text-dream-purple" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────────
const Songs = () => {
    const [songs, setSongs] = useState<any[]>([]);
    const [selectedSong, setSelectedSong] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/content/songs`);
                setSongs(res.data);
            } catch (err) {
                console.error("Melodies lost in the void:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

    return (
        <div className="min-h-screen pt-28 md:pt-44 pb-24 md:pb-32 px-4 md:px-6 relative overflow-x-hidden">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 -right-24 w-[400px] h-[400px] morph-blob bg-dream-purple/4 blur-3xl" />
                <div className="absolute bottom-1/4 -left-16 w-[300px] h-[300px] morph-blob bg-cherry/4 blur-3xl" style={{ animationDelay: '6s' }} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    {!selectedSong ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.5, ease: editorialEase }}
                            className="space-y-12 md:space-y-20"
                        >
                            {/* Header */}
                            <motion.header
                                style={{ y: headerY }}
                                className="text-center space-y-4 md:space-y-6"
                            >
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, ease: editorialEase }}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-dream-purple/10 to-cherry/10 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <Music size={28} className="text-dream-purple/60" />
                                </motion.div>

                                <div className="space-y-2">
                                    <span className="metadata-precise text-[9px] md:text-[10px] tracking-[0.6em] text-muted-rosegold uppercase block">
                                        The Melodies
                                    </span>
                                    <h1 className="font-serif italic text-dream-purple tracking-tighter">
                                        Written Songs
                                    </h1>
                                </div>

                                <p className="text-charcoal/35 font-serif italic text-base md:text-xl max-w-xl mx-auto leading-relaxed">
                                    Lyrics, poetry, and rhythmic fragments born from the silence between volumes.
                                </p>

                                {/* Decorative divider */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1, delay: 0.4, ease: editorialEase }}
                                    className="mx-auto w-24 h-[1px] bg-gradient-to-r from-dream-purple to-cherry origin-center"
                                />
                            </motion.header>

                            {/* Song grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                {loading ? (
                                    <>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="shimmer h-44 rounded-2xl" />
                                        ))}
                                    </>
                                ) : songs.length === 0 ? (
                                    <div className="col-span-full py-32 text-center">
                                        <Feather size={32} className="mx-auto text-dream-purple/20 mb-6" />
                                        <p className="font-serif italic text-charcoal/30 text-xl">
                                            The melodies are still being written…
                                        </p>
                                    </div>
                                ) : (
                                    songs.map((song, idx) => (
                                        <SongCard
                                            key={song._id}
                                            song={song}
                                            index={idx}
                                            onClick={() => setSelectedSong(song)}
                                        />
                                    ))
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <SongViewer
                            song={selectedSong}
                            onClose={() => setSelectedSong(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Songs;
