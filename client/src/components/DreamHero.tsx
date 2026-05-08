import { motion } from "framer-motion";
import { Cloud, BubblyTree, UniCat, LayeredCloudWave } from "./BubblyIllustrations";

const DreamHero = ({ mouse }: { mouse: { x: number, y: number } }) => {
  return (
    <section className="relative h-full w-full flex flex-col items-center pt-32 overflow-hidden bg-transparent">
      
      {/* Background Split: Large Blush Hill on the right */}
      <motion.div 
        animate={{ 
            x: mouse.x * -15,
            y: mouse.y * -15
        }}
        className="absolute top-0 right-0 w-1/2 h-[130%] bg-blush rounded-l-[15rem] rotate-6 translate-x-1/4 -translate-y-20 -z-10" 
      />

      {/* Scattered Bubbles */}
      <div className="absolute top-40 left-20 w-6 h-6 bg-dream-purple/5 rounded-full" />
      <div className="absolute top-60 left-40 w-4 h-4 bg-rosegold/10 rounded-full" />
      <div className="absolute bottom-40 right-20 w-10 h-10 bg-blush/20 rounded-full" />

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side: Text and Buttons */}
        <motion.div 
            style={{ x: mouse.x * 40, y: mouse.y * 40 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="font-serif text-[18vw] md:text-[9rem] text-dream-purple leading-[0.9] italic drop-shadow-sm">
                    Secret<br/>Verse
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
                    <div className="h-[2px] w-12 md:w-16 bg-rosegold rounded-full" />
                    <p className="font-sans text-dream-purple/40 tracking-[0.3em] md:tracking-[0.5em] uppercase text-[8px] md:text-[10px] font-black">
                        Narratives in Bloom
                    </p>
                </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-8 md:mt-12 w-full sm:w-auto">
                <button className="px-10 md:px-14 py-4 md:py-6 bg-rosegold text-white rounded-full font-sans font-bold shadow-[0_6px_0_#96525C] md:shadow-[0_8px_0_#96525C] hover:translate-y-1 hover:shadow-[0_3px_0_#96525C] transition-all uppercase tracking-widest text-[9px] md:text-[10px]">
                    Explore
                </button>
                <button className="px-10 md:px-14 py-4 md:py-6 bg-white/40 border-2 border-dream-purple/10 text-dream-purple rounded-full font-sans font-bold hover:bg-white/60 transition-all uppercase tracking-widest text-[9px] md:text-[10px] backdrop-blur-sm">
                    The Archive
                </button>
            </div>
        </motion.div>

        {/* Right Side: Floating "Box" Asset */}
        <motion.div 
            style={{ x: mouse.x * -40, y: mouse.y * -40 }}
            animate={{ y: [0, -25, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative mt-16 md:mt-0"
        >
            {/* The Inkwell/Box Placeholder */}
            <div className="w-[85vw] h-[85vw] max-w-[400px] max-h-[400px] md:w-[480px] md:h-[480px] bg-white rounded-[3rem] md:rounded-[5rem] shadow-2xl flex items-center justify-center relative transform -rotate-2 p-6 md:p-10">
                <div className="w-full h-full bg-pearl rounded-[2.5rem] md:rounded-[4rem] flex flex-col items-center justify-center p-6 md:p-12 border-2 border-blush/50">
                     <UniCat className="w-24 h-24 md:w-40 md:h-40 mb-4 md:mb-6 drop-shadow-lg" />
                     <span className="font-serif text-dream-purple text-2xl md:text-4xl italic opacity-80 underline decoration-blush decoration-4 underline-offset-8">Bhargavi</span>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 bg-rosegold rounded-full -z-10 shadow-lg flex items-center justify-center">
                    <span className="text-white font-serif italic text-xl md:text-2xl">M</span>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Transition Layer Bottom */}
      <div className="absolute bottom-0 w-full z-20 leading-[0]">
          <LayeredCloudWave fill="fill-pearl" />
      </div>
    </section>
  );
};

export default DreamHero;
