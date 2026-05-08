import React from 'react';
import { motion } from 'framer-motion';
import Book3D from '../components/Book3D';
import SnippetCard from '../components/SnippetCard';

const Landing: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="font-serif text-[10vw] leading-none mb-4 text-charcoal opacity-90"
                >
                    Bhargavi
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="font-sans text-sage tracking-[0.3em] uppercase text-sm mb-12"
                >
                    The Narrative Archive
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
                    <Book3D title="The Silent Ghazal" />
                    <Book3D title="Amber Afternoons" />
                </div>
            </section>

            {/* Snippets Teaser Section */}
            <section className="max-w-5xl mx-auto py-24 px-6 w-full">
                <h2 className="font-serif text-4xl text-charcoal mb-12 text-center">Recent Echoes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SnippetCard content="The ink knows secrets the tongue is too afraid to whisper." date="May 08" />
                    <SnippetCard content="In the silence of the library, I found my loudest voice." date="May 05" />
                    <SnippetCard content="Moonlight is just the sun's way of telling a softer story." date="May 01" />
                </div>
                <div className="mt-16 text-center">
                    <a href="/feed" className="font-sans text-xs uppercase tracking-[0.2em] text-rosegold hover:text-sage transition-colors">
                        View all fragments →
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Landing;
