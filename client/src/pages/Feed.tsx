import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';

const Feed = () => {
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    const posts = [
        { id: 1, text: "Some stories aren't meant to be told; they are meant to be felt in the silence between heartbeats.", date: "May 8" },
        { id: 2, text: "The moon is a poet, writing in silver on the dark canvas of our dreams.", date: "May 5" },
        { id: 3, text: "Old letters smell like forgotten promises and dusty sunlight.", date: "April 29" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="font-serif text-5xl text-center mb-16 text-charcoal">Fragmented Thoughts</h2>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-8"
                columnClassName="pl-8 bg-clip-padding"
            >
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-8 p-8 bg-white/60 backdrop-blur-sm border border-blush rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                        <p className="font-serif text-xl italic leading-relaxed text-charcoal/80 mb-6">"{post.text}"</p>
                        <div className="flex justify-between items-center text-[10px] tracking-[0.2em] text-sage uppercase">
                            <span>{post.date}</span>
                            <span className="bg-blush px-3 py-1 rounded-full text-rosegold font-bold">Snippet</span>
                        </div>
                    </motion.div>
                ))}
            </Masonry>
        </div>
    );
};

export default Feed;