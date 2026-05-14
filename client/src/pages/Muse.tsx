import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, BookOpen, Heart } from 'lucide-react';
import typewriterSvg from '../assets/violettypewriter.svg';
import featherSvg from '../assets/Feather.svg';
import SubscribeForm from '../components/SubscribeForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const editorialEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const MOCK_BOOKS = [
    {
        _id: 'mock-1', title: "The Architecture of Silence", slug: "the-architecture-of-silence",
        category: "Poetic Essay", readTime: 12,
        body: `Chapter I: The First Breath\n\nThere is a specific kind of silence that only exists in the heart of a library at midnight. It is not the absence of sound, but the presence of a thousand unread thoughts. I have spent my life building walls out of these silences, architectural wonders made of paper and ink.\n\nTo understand silence, one must first understand its weight. It is not hollow. It is dense, like the air before a summer storm, carrying the scent of things about to happen but never quite arriving.\n\nChapter II: The Stone Foundation\n\nWe often forget that silence is a material. It can be carved like marble, layered like bricks, and polished until it reflects the viewer's own soul. In the quiet of my study, I began to draft the blueprints for a home that needs no doors, for the wind is the only guest I ever truly invited.`
    },
    {
        _id: 'mock-2', title: "Petrichor & Paper", slug: "petrichor-and-paper",
        category: "Narrative Fragment", readTime: 8,
        body: `Chapter I: The Scent of Rain\n\nRain on a hot pavement has a way of reminding you of everything you've ever lost. But rain on old parchment? That is the scent of potential. Every drop that smudges a word creates a new story, a secondary layer of meaning that the author never intended.\n\nChapter II: The Drying Ink\n\nI watched as the storm passed, leaving the garden heavy with the smell of wet earth. My notebook sat open on the windowsill, its edges curled like dried petals.`
    },
    {
        _id: 'mock-3', title: "The Unwritten Letter", slug: "the-unwritten-letter",
        category: "Short Story", readTime: 10,
        body: `Chapter I: The Blank Page\n\nThe most difficult words to write are the ones that never leave the pen. They pool like shadows at the tip, heavy and dark, waiting for a courage that usually arrives too late. I have a drawer full of these shadows.\n\nChapter II: The Envelope's Seal\n\nI often wonder where the letters go if you don't address them. Do they find a way to the person they were meant for, or do they simply dissolve into the ether?`
    },
    {
        _id: 'mock-4', title: "Garden of Half-Truths", slug: "garden-of-half-truths",
        category: "Prose Poem", readTime: 6,
        body: `Chapter I: The Seed\n\nThere is a garden at the edge of every honest conversation—a place where the unsaid things grow wild and unkempt, watered by silence and fertilized by the things we meant to say.\n\nChapter II: Bloom\n\nI walked through this garden once, in the middle of a sentence that never finished. The roses there are black, not from death, but from being loved too intensely.`
    },
];

// ── Book card with 3D hover tilt ──────────────────────────────────
const BookCard = ({ story, index }: { story: any; index: number }) => {
    const [hovered, setHovered] = useState(false);
    const [likes, setLikes] = useState(story.likes || 0);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await axios.post(`${API_URL}/api/content/stories/${story._id}/like`, {
                unlike: isLiked
            });
            setLikes(res.data.likes);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error("The bookshelf remains unmoved:", err);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, ease: editorialEase, delay: index * 0.08 }}
                className="mini-book group"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <Link to={`/read/${story.slug}`} className="block w-full h-full">
                    <div className="mini-book-pages" />
                    <div className="mini-book-cover cover-texture flex flex-col items-center justify-center text-center p-4 border-l border-white/10 relative overflow-hidden">
                        <div className="mini-book-spine" />

                        {/* Shimmer on hover */}
                        <AnimatePresence>
                            {hovered && (
                                <motion.div
                                    initial={{ x: '-100%', skewX: '-20deg' }}
                                    animate={{ x: '200%' }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: editorialEase }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-30"
                                />
                            )}
                        </AnimatePresence>

                        <div className="border border-white/5 w-full h-full flex flex-col items-center justify-center p-3 relative z-10">
                            <span className="text-[7px] uppercase tracking-[0.4em] text-white/35 mb-3">{story.category}</span>
                            <h4 className="font-serif text-base md:text-xl text-dream-pink italic leading-tight mb-3">
                                {story.title}
                            </h4>
                            <div className="w-6 h-[1px] bg-white/10 mb-3" />
                            <p className="text-[7px] text-white/20 uppercase tracking-widest">{story.readTime} min</p>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -bottom-10 left-0 right-0 flex items-center justify-between px-2"
                    >
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 group/like ${isLiked ? 'text-cherry' : 'text-dream-purple/40 hover:text-cherry'} transition-colors duration-300`}
                        >
                            <Heart size={18} className={isLiked ? 'fill-cherry' : ''} />
                            <span className="text-[9px] metadata-precise">{likes}</span>
                        </button>
                        <div className="flex items-center gap-1">
                            <span className="metadata-precise text-dream-purple/40 text-[7px]">Read Fragment</span>
                            <ArrowRight size={10} className="text-cherry" />
                        </div>
                    </motion.div>
                </Link>
            </motion.div>
        </AnimatePresence>
    );
};

// ─────────────────────────────────────────────────────────────────
const Muse = () => {
    const { scrollYProgress } = useScroll();
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const watermarkOpacity = useTransform(scrollYProgress, [0, 0.15], [0.06, 0]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
    const parallaxX1 = useTransform(smoothMouseX, [-1, 1], [-16, 16]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);

        const handleMouseMove = (e: MouseEvent) => {
            if (!check) return;
            mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        const fetchStories = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/content/stories`);
                setStories(res.data?.length > 0 ? res.data : MOCK_BOOKS);
            } catch {
                setStories(MOCK_BOOKS);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener('resize', check);
        };
    }, [mouseX]);

    return (
        <div className="bg-transparent min-h-screen relative overflow-x-hidden">

            {/* Signature watermark */}
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                <motion.h1
                    style={{ opacity: watermarkOpacity }}
                    className="text-[clamp(6rem,22vw,22rem)] font-serif italic tracking-tighter text-dream-purple uppercase whitespace-nowrap will-change-[opacity] select-none"
                >
                    Bhargavi
                </motion.h1>
            </div>

            {/* ── Hero: Who She Is ── */}
            <div className="max-w-[1600px] mx-auto grid-asymmetric relative z-10 editorial-section pt-28 md:pt-36 pb-24 md:pb-48">
                {/* Left: text */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-8 md:gap-20 pt-8 md:pt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5, ease: editorialEase }}
                    >
                        <span className="metadata-precise text-muted-rosegold mb-6 md:mb-8 block">
                            The Narrative
                        </span>
                        <h2 className="font-serif text-[clamp(3rem,8vw,8rem)] text-dream-purple mb-8 md:mb-12 italic font-light tracking-tighter leading-none">
                            The Woman <br /> Behind the{" "}
                            <i className="text-cherry font-normal">Ink</i>
                        </h2>
                    </motion.div>

                    <motion.div
                        style={{ opacity: textOpacity }}
                        className="space-y-8 md:space-y-12 font-serif text-lg md:text-2xl leading-[1.7] text-charcoal/70 italic max-w-2xl relative px-4 md:px-0"
                    >
                        <p className="relative text-justify">
                            <span className="absolute -left-8 -top-8 text-[5rem] md:text-[8rem] text-dream-pink/25 font-serif select-none pointer-events-none leading-none">
                                "
                            </span>
                            Bhargavi is not a name; she is a mood. She lives in the quiet space between
                            a thought and its expression, favouring the scent of old paper and the
                            melancholy of a setting sun.
                        </p>
                        <p className="relative mt-8 text-justify">
                            Her writing bridges the classical elegance of Urdu poetry
                            and the visceral emotions of modern storytelling. Every word is
                            chosen with grace; every story is a fragment of a soul.
                            <span className="absolute -right-4 -bottom-8 text-[5rem] md:text-[8rem] text-dream-pink/25 font-serif select-none rotate-180 pointer-events-none leading-none">
                                "
                            </span>
                        </p>
                    </motion.div>

                    {/* Decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: editorialEase }}
                        className="h-[1px] w-32 bg-gradient-to-r from-dream-purple to-cherry origin-center lg:origin-left"
                    />
                </div>

                {/* Right: typewriter SVG */}
                <div className="col-span-12 lg:col-span-5 relative mt-4 lg:mt-0 flex items-center justify-center">
                    <div className="relative lg:sticky lg:top-40">
                        <motion.div
                            style={{ x: isMobile ? 0 : parallaxX1, filter: 'drop-shadow(0 40px 60px rgba(104,76,143,0.15))' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1.5, ease: editorialEase }}
                            className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[420px] float-anim"
                        >
                            <img src={typewriterSvg} alt="Vintage Typewriter" className="w-full h-auto" />
                        </motion.div>

                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5, ease: editorialEase }}
                            className="absolute -bottom-2 -right-2 md:-bottom-8 md:-right-8 glass-pill px-5 py-3 flex items-center gap-3 shadow-editorial"
                        >
                            <BookOpen size={14} className="text-dream-purple/50" />
                            <div>
                                <p className="metadata-precise text-[7px] text-muted-rosegold">Archive</p>
                                <p className="font-serif italic text-sm text-dream-purple">{stories.length} volumes</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── Bookshelf Archive ── */}
            <section className="relative z-10 px-6 md:px-16 lg:px-24 py-4 md:py-4 overflow-hidden">
                {/* Subtle gradient bg */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(251,215,209,0.06) 50%, transparent 100%)' }}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: editorialEase }}
                        className="mb-12 md:mb-24"
                    >
                        <span className="metadata-precise text-muted-rosegold mb-4 block">Archive Volume I</span>
                        <h3 className="font-serif text-[clamp(2.5rem,6vw,6rem)] text-dream-purple italic">
                            The <i className="text-cherry">Bookshelf</i>
                        </h3>
                        <p className="font-serif italic text-charcoal/40 text-base md:text-xl mt-4 max-w-lg">
                            Each volume a world. Click to enter.
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="archive-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="shimmer h-[320px] md:h-[400px] w-full max-w-[280px] mx-auto rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="archive-grid">
                            {stories.map((story, i) => (
                                <BookCard key={story._id} story={story} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Subscribe Form ── */}
            <section className="relative z-10 px-6 py-16 md:py-32">
                <SubscribeForm
                    source="Archive Muse"
                    title="The Midnight Bulletin"
                    subtitle="Subscribe to receive a fragment of the narrative whenever a new story is etched into the archive."
                />
            </section>

            {/* ── Finis ornament ── */}
            <div className="flex flex-col justify-center items-center pb-8 md:pb-8 relative z-10">
                <motion.img
                    src={featherSvg}
                    alt="Feather"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.5, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 2, ease: editorialEase }}
                    className="w-16 md:w-24 float-anim-slow"
                    style={{ filter: 'drop-shadow(0 8px 16px rgba(104,76,143,0.15))' }}
                />
                <div className="flex items-center gap-8 md:gap-12 opacity-25">
                    <div className="h-[1px] w-20 md:w-32 bg-dream-purple/50" />
                    <p className="metadata-precise text-[9px] text-dream-purple">Finish</p>
                    <div className="h-[1px] w-20 md:w-32 bg-dream-purple/50" />
                </div>
            </div>
        </div>
    );
};

export default Muse;
