import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const FloatingBook = ({ title, cover }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-64 h-80 bg-blush rounded-xl shadow-2xl cursor-pointer border-4 border-white/50 backdrop-blur-md"
        >
            <div style={{ transform: "translateZ(50px)" }} className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="font-serif text-2xl text-charcoal italic">{title}</h3>
                <div className="mt-4 w-12 h-1 bg-rosegold rounded-full" />
            </div>
        </motion.div>
    );
};

export default FloatingBook;