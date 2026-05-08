import Masonry from 'react-masonry-css';
import SnippetCard from '../components/SnippetCard';
import { useNarrative } from '../hooks/useNarrative';

const Feed = () => {
    const { data: posts, loading } = useNarrative('snippets');

    const breakpointColumns = {
        default: 3,
        1100: 2,
        700: 1
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="font-serif text-3xl italic text-dream-purple animate-pulse tracking-widest">Gathering echoes...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 min-h-screen">
            <header className="text-center mb-24">
                <h1 className="font-serif text-7xl text-dream-purple italic mb-4">Recent Echoes</h1>
                <p className="font-sans text-dream-purple/60 tracking-[0.4em] uppercase text-[10px] font-bold">Selected fragments from the archive</p>
            </header>

            <Masonry
                breakpointCols={breakpointColumns}
                className="flex w-auto -ml-8"
                columnClassName="pl-8 bg-clip-padding"
            >
                {posts.map((post: any, idx: number) => (
                    <div key={post._id || idx} className="mb-12">
                        <SnippetCard 
                            content={post.content || post.body} 
                            date={post.date || new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} 
                        />
                    </div>
                ))}
            </Masonry>
        </div>
    );
};

export default Feed;