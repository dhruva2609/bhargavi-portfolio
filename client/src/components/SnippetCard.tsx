// client/src/components/SnippetCard.tsx
import { motion } from 'framer-motion';

const SnippetCard = ({ content, date }: { content: string, date: string }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
                }
            }}
            className="p-8 md:p-12 editorial-card group hover:shadow-editorial transition-all"
        >
            <p className="font-serif text-xl md:text-2xl text-dream-purple mb-8 leading-[1.6]">
                "{content}"
            </p>
            <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-muted-rosegold/30" />
                <span className="font-sans text-[10px] tracking-[0.4em] text-muted-rosegold uppercase font-bold">
                    {date}
                </span>
            </div>
        </motion.div>
    );
};

export default SnippetCard;