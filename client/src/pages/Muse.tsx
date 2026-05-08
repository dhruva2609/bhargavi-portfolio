// client/src/pages/Muse.tsx
import { motion } from 'framer-motion';

const Muse = () => {
    return (
        <div className="bg-transparent min-h-screen pt-48 pb-32 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="w-48 h-48 editorial-card rounded-full mx-auto mb-20 flex items-center justify-center relative group overflow-hidden">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t border-dream-purple/20 rounded-full"
                        />
                        <span className="font-serif text-8xl text-dream-purple/10 select-none relative z-10">B</span>
                    </div>

                    <span className="metadata-precise text-muted-rosegold mb-8 block">
                        The Narrative
                    </span>
                    <h2 className="font-serif text-[clamp(3rem,8vw,8rem)] text-dream-purple mb-20 italic font-light tracking-tighter leading-none">
                        The Woman <br/> Behind the <i className="text-cherry font-normal">Ink</i>
                    </h2>

                    <div className="space-y-16 font-serif text-2xl md:text-3xl leading-[1.8] text-charcoal/70 italic max-w-2xl mx-auto relative px-8 md:px-0">
                        <p className="relative">
                            <span className="absolute -left-12 -top-12 text-[12rem] text-dream-pink/30 font-serif select-none">“</span>
                            Bhargavi is not a name; she is a mood. She lives in the quiet space between
                            a thought and its expression, favoring the scent of old paper and the
                            melancholy of a setting sun.
                        </p>
                        <p className="relative">
                            Her writing is a bridge between the classic elegance of Urdu poetry
                            and the visceral emotions of modern storytelling. Here, every word is
                            chosen with grace, and every story is a fragment of a soul.
                            <span className="absolute -right-12 -bottom-12 text-[12rem] text-dream-pink/30 font-serif select-none rotate-180">“</span>
                        </p>
                    </div>

                    <div className="mt-48 flex justify-center gap-12 items-center opacity-20">
                        <div className="h-[1px] w-24 bg-dream-purple"></div>
                        <p className="font-sans text-[9px] uppercase tracking-[0.6em] text-dream-purple font-bold">Finis</p>
                        <div className="h-[1px] w-24 bg-dream-purple"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Muse;