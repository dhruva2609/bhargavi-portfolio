import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, PenTool, Sparkles } from 'lucide-react';

const InstagramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-transparent relative overflow-x-hidden">
            {/* Floating Pill Navbar */}
            <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] px-6 md:px-8 py-3 bg-dream-purple rounded-full shadow-2xl flex items-center gap-6 md:gap-10 border border-white/20 backdrop-blur-md w-[90%] md:w-auto justify-center">
                <Link to="/" className="flex items-center gap-2 text-white hover:text-dream-pink transition-colors group">
                    <Home size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[9px] uppercase tracking-widest font-bold hidden md:inline">Home</span>
                </Link>
                <Link to="/snippets" className="flex items-center gap-2 text-white hover:text-dream-pink transition-colors group">
                    <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[9px] uppercase tracking-widest font-bold hidden md:inline">Archive</span>
                </Link>
                <Link to="/muse" className="flex items-center gap-2 text-white hover:text-dream-pink transition-colors group">
                    <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[9px] uppercase tracking-widest font-bold hidden md:inline">Muse</span>
                </Link>
                <Link to="/write" className="flex items-center gap-2 text-white hover:text-dream-pink transition-colors group">
                    <PenTool size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-[9px] uppercase tracking-widest font-bold hidden md:inline">Create</span>
                </Link>
            </nav>

            {/* Left Social Pill - Hide on very small mobile, show on tablet+ */}
            <div className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-[100] p-3 bg-white/40 backdrop-blur-md rounded-full border border-white flex flex-col gap-6 shadow-xl hidden md:flex">
                <a href="https://instagram.com/scenarios.to.scenes" target="_blank" rel="noreferrer" className="text-dream-purple hover:text-cherry transition-colors">
                    <InstagramIcon size={18} />
                </a>
                <div className="w-4 h-[1px] bg-dream-purple/20 mx-auto" />
                <Sparkles size={18} className="text-dream-purple/40" />
            </div>

            <main>{children}</main>
        </div>
    );
};

export default Layout;