import { useParams } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';

const Reader = () => {
    const { slug } = useParams();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    return (
        <div className="bg-pearl min-h-screen">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-rosegold origin-left z-[100]"
                style={{ scaleX }}
            />

            <article className="max-w-2xl mx-auto pt-32 pb-20 px-6">
                <header className="mb-16 text-center">
                    <h1 className="font-serif text-5xl text-charcoal mb-4">Shattered Petals</h1>
                    <p className="font-sans text-xs tracking-widest text-sage uppercase italic">Chapter One: The First Frost</p>
                </header>

                <div className="font-serif text-lg leading-loose text-charcoal/90 space-y-8 first-letter:text-5xl first-letter:font-bold first-letter:text-rosegold first-letter:mr-3 first-letter:float-left">
                    <p>
                        The ink flowed like a slow river, dark and heavy with the weight of things left unsaid.
                        Bhargavi sat by the window, the amber light of the evening casting long, skeletal shadows
                        across her desk...
                    </p>
                    {/* Content would be dynamically rendered here */}
                </div>
            </article>
        </div>
    );
};

export default Reader;