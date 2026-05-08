import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

const RoseGoldDust = ({ mouse }: { mouse: { x: number, y: number } }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        // Smoothly lerp the group position based on mouse
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 2, 0.05);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 2, 0.05);
    });

    return (
        <group ref={groupRef}>
            <Sparkles 
                count={200} 
                scale={20} 
                size={1.5} 
                speed={0.3} 
                color="#B76E79" 
                opacity={0.5}
            />
            <Sparkles 
                count={100} 
                scale={25} 
                size={0.8} 
                speed={0.1} 
                color="#74549A" 
                opacity={0.3}
            />
        </group>
    );
};

const SceneContent = ({ mouse }: { mouse: { x: number, y: number } }) => {
    useFrame((state) => {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 0.5, 0.02);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 0.5, 0.02);
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#B76E79" />
            <RoseGoldDust mouse={mouse} />
            
            <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh scale={[10, 10, 10]} position={[0, 0, -10]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial 
                        color="#FBD7D1" 
                        metalness={0.1} 
                        roughness={0.9} 
                        transparent 
                        opacity={0.1} 
                    />
                </mesh>
            </Float>
        </>
    );
};

const Scene3D = ({ mouse }: { mouse: { x: number, y: number } }) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#FAF9F6]">
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <SceneContent mouse={mouse} />
            </Canvas>
        </div>
    );
};

export default Scene3D;