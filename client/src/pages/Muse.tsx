import { motion } from 'framer-motion';

const Muse = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="w-32 h-32 bg-blush rounded-full mx-auto mb-8 border-4 border-white shadow-inner flex items-center justify-center">
                    <span className="font-serif text-4xl text-rosegold italic">B</span>
                </div>
                <h2 className="font-serif text-4xl text-charcoal mb-8 italic">The Woman Behind the Ink</h2>
                <div className="space-y-6 font-serif text-xl leading-relaxed text-charcoal/70 italic">
                    <p>
                        Bhargavi is not a name; she is a mood. She lives in the quiet space between
                        a thought and its expression, favoring the scent of old paper and the
                        melancholy of a setting sun.
                    </p>
                    <p>
                        Her writing is a bridge between the classic elegance of Urdu poetry
                        and the visceral emotions of modern storytelling. Here, every word is
                        chosen with grace, and every story is a fragment of a soul.
                    </p>
                </div>
                <div className="mt-16 flex justify-center gap-4">
                    <div className="h-[1px] w-12 bg-sage self-center"></div>
                    <p className="text-xs uppercase tracking-widest text-sage">End of Chapter</p>
                    <div className="h-[1px] w-12 bg-sage self-center"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default Muse;