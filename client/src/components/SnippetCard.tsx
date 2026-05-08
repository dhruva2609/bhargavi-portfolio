// client/src/components/SnippetCard.tsx
import { motion } from 'framer-motion';

const SnippetCard = ({ content, date }: { content: string, date: string }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-10 dream-glass shadow-soft group transition-all"
        >
            <p className="font-serif text-2xl italic text-dream-purple/90 mb-6 leading-relaxed">
                "{content}"
            </p>
            <div className="flex items-center gap-3">
                <div className="w-6 h-[1px] bg-dream-purple/30" />
                <span className="font-sans text-[9px] tracking-[0.4em] text-dream-purple/50 uppercase font-bold">
                    {date}
                </span>
            </div>
        </motion.div>
    );
};

export default SnippetCard;