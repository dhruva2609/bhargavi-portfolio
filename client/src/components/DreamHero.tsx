import { motion } from "framer-motion";
import { Cloud, BubblyTree, UniCat, LayeredCloudWave } from "./BubblyIllustrations";

const DreamHero = ({ mouse }: { mouse: { x: number, y: number } }) => {
    return (
        <section className="relative h-full w-full flex flex-col items-center justify-center pt-20 md:pt-32 overflow-hidden bg-transparent">

            {/* Background Split: Large Purple Hill */}
            <motion.div
                animate={{
                    x: mouse.x * -20,
                    y: mouse.y * -20
                }}
                className="absolute top-0 right-0 w-full md:w-1/2 h-[120%] bg-dream-purple rounded-l-[5rem] md:rounded-l-[10rem] rotate-6 md:rotate-12 translate-x-1/4 -translate-y-20 -z-10"
            />

            {/* Scattered Bubbles - hidden on mobile for clarity */}
            <div className="hidden md:block absolute top-40 left-20 w-6 h-6 bg-white/40 rounded-full" />
            <div className="hidden md:block absolute top-60 left-40 w-4 h-4 bg-white/20 rounded-full" />
            <div className="hidden md:block absolute bottom-40 right-20 w-10 h-10 bg-white/10 rounded-full" />

            {/* Layered Clouds Top */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-5 left-5 md:top-10 md:left-10 z-0">
                <Cloud className="w-64 md:w-96 text-white/40" />
            </motion.div>

            {/* Main Hero Content */}
            <div className="relative z-10 w-full max-w-7xl px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">

                {/* Left Side: Text and Buttons */}
                <motion.div
                    style={{ x: mouse.x * 30, y: mouse.y * 30 }}
                    className="flex flex-col items-center md:items-start text-center md:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 md:mb-8"
                    >
                        <h1 className="font-serif text-6xl md:text-[10rem] text-white leading-[0.9] md:leading-[0.8] drop-shadow-[5px_5px_0px_rgba(116,84,154,0.3)] md:drop-shadow-[10px_10px_0px_rgba(116,84,154,0.3)]">
                            Secret<br />Box
                        </h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 md:mt-12 max-w-sm md:max-w-md border-l-0 md:border-l-2 border-cherry/40 md:pl-6"
                        >
                            <p className="font-serif text-lg md:text-2xl text-white/90 italic leading-relaxed">
                                "Every word is a heartbeat, every sentence a breath of a soul longing to be heard."
                            </p>
                            <cite className="block mt-4 font-sans text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 not-italic font-bold">
                                — The Muse's Whisper
                            </cite>
                        </motion.div>

                        <div className="flex items-center justify-center md:justify-start gap-4 mt-8 md:mt-12">
                            <div className="h-[1px] w-12 md:w-20 bg-cherry/60" />
                            <p className="font-sans text-white/80 tracking-[0.4em] uppercase text-[8px] md:text-[10px] font-bold">
                                Scenarios to Scenes
                            </p>
                        </div>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-4 w-full sm:w-auto">
                        <button className="px-10 py-4 md:px-14 md:py-6 bg-[#FF4D8D] text-white rounded-full font-sans font-bold shadow-[0_6px_0_#D1326D] md:shadow-[0_8px_0_#D1326D] hover:translate-y-1 hover:shadow-[0_3px_0_#D1326D] md:hover:shadow-[0_4px_0_#D1326D] transition-all uppercase tracking-widest text-[9px] md:text-[10px] active:translate-y-2">
                            Collect the Box
                        </button>
                        <button className="px-10 py-4 md:px-14 md:py-6 bg-white/10 border-2 border-white/40 text-white rounded-full font-sans font-bold hover:bg-white/30 transition-all uppercase tracking-widest text-[9px] md:text-[10px] backdrop-blur-sm active:translate-y-1">
                            Enter Archive
                        </button>
                    </div>
                </motion.div>

                {/* Right Side: Floating Box and Mascot */}
                <motion.div
                    style={{ x: mouse.x * -30, y: mouse.y * -30 }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-none md:w-auto"
                >
                    {/* The Box */}
                    <div className="aspect-square w-full md:w-[450px] bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl flex items-center justify-center relative transform -rotate-3 p-4 md:p-8">
                        <div className="w-full h-full bg-[#D1326D] rounded-[2rem] md:rounded-[3rem] shadow-[inner_0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center p-6 md:p-12">
                            <div className="w-full h-full border-4 border-white/20 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center">
                                <UniCat className="w-20 h-20 md:w-32 md:h-32 mb-2 md:mb-4" />
                                <span className="font-serif text-white text-xl md:text-3xl italic">Katy</span>
                            </div>
                        </div>

                        {/* Lid of the box effect */}
                        <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-full h-full bg-[#FF4D8D] rounded-[3rem] md:rounded-[4rem] -z-10 transform rotate-12 shadow-xl" />
                    </div>

                    {/* Mascot sitting on cloud nearby */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -bottom-10 -left-10 md:-bottom-20 md:-left-20 w-32 h-32 md:w-48 md:h-48 z-20"
                    >
                        <Cloud className="absolute inset-0 text-white" />
                        <UniCat className="absolute inset-0 scale-50 -translate-y-5 md:-translate-y-10" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Transition Layer Bottom */}
            <div className="absolute bottom-0 w-full z-20 leading-[0]">
                <LayeredCloudWave fill="fill-white" />
            </div>
        </section>
    );
};

export default DreamHero;
