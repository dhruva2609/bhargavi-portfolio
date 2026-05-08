// client/src/pages/Muse.tsx
import { motion } from 'framer-motion';

const Muse = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-40 text-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <div className="w-40 h-40 dream-glass rounded-full mx-auto mb-16 shadow-soft flex items-center justify-center relative group">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-dream-purple/20 rounded-full"
                    />
                    <span className="font-serif text-6xl text-dream-purple italic relative z-10">B</span>
                </div>

                <h2 className="font-serif text-6xl text-dream-purple mb-16 italic">The Woman Behind the Ink</h2>

                <div className="space-y-10 font-serif text-2xl leading-relaxed text-charcoal/80 italic max-w-2xl mx-auto">
                    <p className="relative">
                        <span className="absolute -left-8 -top-8 text-8xl text-dream-purple/10 font-serif">“</span>
                        Bhargavi is not a name; she is a mood. She lives in the quiet space between
                        a thought and its expression, favoring the scent of old paper and the
                        melancholy of a setting sun.
                    </p>
                    <p>
                        Her writing is a bridge between the classic elegance of Urdu poetry
                        and the visceral emotions of modern storytelling. Here, every word is
                        chosen with grace, and every story is a fragment of a soul.
                        <span className="absolute -right-8 -bottom-8 text-8xl text-dream-purple/10 font-serif">”</span>
                    </p>
                </div>

                <div className="mt-32 flex justify-center gap-8 items-center opacity-30">
                    <div className="h-[1px] w-24 bg-dream-purple"></div>
                    <p className="text-[12px] uppercase tracking-[0.6em] text-dream-purple font-bold">Finis</p>
                    <div className="h-[1px] w-24 bg-dream-purple"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default Muse;