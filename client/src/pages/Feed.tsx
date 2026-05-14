import Masonry from 'react-masonry-css';
import SnippetCard from '../components/SnippetCard';
import { useNarrative } from '../hooks/useNarrative';
import bookSvg from '../assets/book.svg';
import SubscribeForm from '../components/SubscribeForm';

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
        <div className="max-w-7xl mx-auto px-6 py-32 bg-transparent min-h-screen relative">
            <header className="text-center mb-24 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] opacity-[0.03] pointer-events-none -z-10">
                    <img src={bookSvg} alt="Book Background" className="w-full h-auto" />
                </div>
                <h1 className="font-serif text-[clamp(3.5rem,8vw,8rem)] text-dream-purple italic mb-4 leading-none relative z-10">Recent Echoes</h1>
                <p className="metadata-precise text-dream-purple/60 block mt-6">Selected fragments from the archive</p>
            </header>

            <Masonry
                breakpointCols={breakpointColumns}
                className="flex w-auto -ml-8"
                columnClassName="pl-8 bg-clip-padding"
            >
                {posts.map((post: any, idx: number) => (
                    <div key={post._id || idx} className="mb-12">
                        <SnippetCard 
                            id={post._id}
                            content={post.content || post.body} 
                            date={post.date || new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} 
                            initialLikes={post.likes || 0}
                        />
                    </div>
                ))}
            </Masonry>

            <div className="mt-32">
                <SubscribeForm 
                    source="Archive (Echoes)" 
                    title="Whispers of the Archive"
                    subtitle="Subscribe to receive new fragments and echoes as they are unearthed from the silence."
                />
            </div>
        </div>
    );
};

export default Feed;