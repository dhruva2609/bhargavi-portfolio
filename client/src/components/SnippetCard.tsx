import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Quote } from 'lucide-react';

const SnippetCard = ({ content, date }: { content: string; date: string }) => {
    const [liked, setLiked] = useState(false);

    return (
        <motion.div
            variants={{
                hidden:  { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="group relative editorial-card p-6 md:p-10 hover:shadow-editorial transition-all duration-700 overflow-hidden"
        >
            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-dream-pink/0 to-dream-purple/0 group-hover:from-dream-pink/4 group-hover:to-dream-purple/3 transition-all duration-700 pointer-events-none rounded-inherit" />

            {/* Large quote mark */}
            <div className="absolute top-3 left-4 text-dream-purple/4 group-hover:text-dream-purple/8 transition-opacity duration-700 pointer-events-none select-none">
                <Quote size={56} />
            </div>

            <div className="relative z-10">
                <p className="font-serif text-lg md:text-2xl text-dream-purple mb-6 md:mb-8 leading-[1.7] italic pl-4">
                    "{content}"
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 md:w-8 h-[1px] bg-muted-rosegold/25" />
                        <span className="metadata-precise text-[7px] md:text-[8px] text-muted-rosegold/50">
                            {date}
                        </span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
                        className="text-dream-purple/15 hover:text-cherry transition-colors duration-300 active:scale-90"
                        aria-label="Like this snippet"
                    >
                        <Heart
                            size={13}
                            className={`transition-all duration-300 ${liked ? 'fill-cherry text-cherry scale-110' : ''}`}
                        />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SnippetCard;