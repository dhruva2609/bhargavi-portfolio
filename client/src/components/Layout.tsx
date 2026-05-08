import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-pearl font-sans text-charcoal">
            <nav className="fixed top-0 w-full z-50 bg-white/30 backdrop-blur-md border-b border-white/20 px-8 py-4 flex justify-between items-center">
                <h1 className="font-serif text-2xl tracking-tighter text-rosegold">Bhargavi</h1>
                <div className="flex gap-8 text-xs uppercase tracking-[0.2em] font-medium text-sage">
                    <a href="/" className="hover:text-rosegold transition-colors">The Narrative</a>
                    <a href="/feed" className="hover:text-rosegold transition-colors">Snippets</a>
                    <a href="/muse" className="hover:text-rosegold transition-colors">The Muse</a>
                </div>
            </nav>
            <main className="pt-20">{children}</main>
            <footer className="py-12 text-center border-t border-blush/30 mt-20">
                <p className="font-serif italic text-sage">Curated by the ink of Bhargavi</p>
            </footer>
        </div>
    );
};

export default Layout;