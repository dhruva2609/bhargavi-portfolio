import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

export const Inkwell = ({ progress }: { progress: any }) => {
    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh>
                    <cylinderGeometry args={[0.5, 0.7, 1, 32]} />
                    <meshStandardMaterial color="#74549A" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.51, 0]}>
                    <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                    <meshStandardMaterial color="#4A3469" />
                </mesh>
            </Float>
        </group>
    );
};

export const RoseGoldSphere = ({ y }: { y: any }) => {
    return (
        <motion.group position-y={y}>
            <Sphere args={[0.2, 32, 32]}>
                <meshStandardMaterial color="#B76E79" metalness={0.9} roughness={0.1} />
            </Sphere>
        </motion.group>
    );
};

export const MorphingPeony = ({ progress }: { progress: any }) => {
    return (
        <group>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere args={[1, 64, 64]}>
                    <MeshDistortMaterial
                        color="#F49191"
                        speed={2}
                        distort={0.4}
                        radius={1}
                    />
                </Sphere>
                <Sphere args={[1.05, 32, 32]}>
                    <meshStandardMaterial wireframe color="#74549A" transparent opacity={0.1} />
                </Sphere>
            </Float>
        </group>
    );
};
