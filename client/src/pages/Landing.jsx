import FloatingBook from "../components/FloatingBook";
import SnippetCard from "../components/SnippetCard";

const Landing = () => {
    return (
        <div className="min-h-screen bg-pearl selection:bg-blush">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4">
                <h1 className="font-serif text-7xl md:text-9xl text-charcoal mb-4 opacity-90">Bhargavi</h1>
                <p className="font-sans text-sage tracking-[0.3em] uppercase text-sm mb-12">The Narrative Archive</p>
                <div className="flex gap-12 flex-wrap justify-center">
                    <FloatingBook title="Shattered Petals" />
                    <FloatingBook title="Midnight Ghazals" />
                </div>
            </section>

            {/* Snippets Section */}
            <section className="max-w-5xl mx-auto py-24 px-6">
                <h2 className="font-serif text-4xl text-charcoal mb-12 text-center">Recent Echoes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SnippetCard content="The ink knows secrets the tongue is too afraid to whisper." date="May 08" />
                    <SnippetCard content="In the silence of the library, I found my loudest voice." date="May 05" />
                    <SnippetCard content="Moonlight is just the sun's way of telling a softer story." date="May 01" />
                </div>
            </section>
        </div>
    );
};

export default Landing;