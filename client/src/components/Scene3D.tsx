import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Inkwell, MorphingPeony, RoseGoldSphere } from './ScrollNarrative3D';
import { useTransform } from 'framer-motion';
import { motion as motion3d } from 'framer-motion-3d';

const motion = {
    group: motion3d.group,
};

const Scene3D = ({ mouse, progress }: { mouse: { x: number, y: number }, progress: any }) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
                <SceneContent mouse={mouse} progress={progress} />
            </Canvas>
        </div>
    );
};

const SceneContent = ({ mouse, progress }: { mouse: { x: number, y: number }, progress: any }) => {
    // Narrative Transforms
    const inkwellRotation = useTransform(progress, [0, 0.15], [0, -Math.PI / 4]);
    const sphereY = useTransform(progress, [0.15, 0.4], [2, -2]);
    const flowerScale = useTransform(progress, [0.4, 0.7], [0, 1.5]);

    useFrame((state) => {
        // Camera Parallax
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 2.5, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 2.5, 0.05);
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <ambientLight intensity={0.9} />
            <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} color="#FBD7D1" />
            <pointLight position={[-10, -10, -10]} color="#B76E79" intensity={1} />
            
            <Sparkles count={60} scale={20} size={1.5} speed={0.4} color="#FBD7D1" />

            {/* Inkwell (at the top) */}
            <group position={[0, 2.5, 0]}>
                <motion.group rotation-z={inkwellRotation}>
                    <Inkwell progress={progress} />
                </motion.group>
            </group>

            {/* Released Sphere */}
            <RoseGoldSphere y={sphereY} />

            {/* Blooming Peony (at the bottom) */}
            <group position={[0, -2.5, 0]}>
                <motion.group scale={flowerScale}>
                    <MorphingPeony progress={progress} />
                </motion.group>
            </group>

            {/* Background Atmosphere */}
            {[...Array(6)].map((_, i) => (
                <Float key={i} speed={0.8} position={[(i - 2.5) * 6, (i % 2) * 3 - 1.5, -12]}>
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#FBD7D1" transparent opacity={0.15} />
                    </mesh>
                </Float>
            ))}
        </>
    );
};

export default Scene3D;