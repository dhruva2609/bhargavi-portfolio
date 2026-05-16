import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Quote } from 'lucide-react';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const SnippetCard = ({ id, content, date, initialLikes }: { id: string; content: string; date: string; initialLikes: number }) => {
    const [likes, setLikes] = useState(initialLikes || 0);
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!id) return;
        try {
            const res = await axios.post(`${API_URL}/api/content/snippets/${id}/like`, { 
                unlike: isLiked 
            });
            setLikes(res.data.likes);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error("The echo remains unappreciated:", err);
        }
    };

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
                        onClick={handleLike}
                        className="text-dream-purple/15 hover:text-cherry transition-colors duration-300 active:scale-90 flex items-center gap-1.5"
                        aria-label="Like this snippet"
                    >
                        <Heart
                            size={22}
                            className={`transition-all duration-300 ${isLiked ? 'fill-cherry text-cherry scale-110' : ''}`}
                        />
                        <span className="metadata-precise text-[12px]">{likes}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SnippetCard;
