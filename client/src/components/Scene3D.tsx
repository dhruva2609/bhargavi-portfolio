import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

const Embers = () => {
    const ref = useRef<THREE.Points>(null);
    const count = 400;
    
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 60;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.getElapsedTime();
        ref.current.rotation.y = time * 0.04;
        ref.current.rotation.z = Math.sin(time * 0.2) * 0.05;
        // Organic sin wave drift
        ref.current.position.y = Math.sin(time * 0.3) * 0.5;
        ref.current.position.x = Math.cos(time * 0.2) * 0.3;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#B76E79"
                size={0.04}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
            />
        </Points>
    );
};

const FloatingGlassPages = () => {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();
        groupRef.current.position.y = Math.sin(time * 0.2) * 0.5;
        groupRef.current.rotation.y = time * 0.05;
        
        groupRef.current.children.forEach((child, i) => {
            // Give them a subtle floating flutter
            child.rotation.x = Math.sin(time * 0.5 + i) * 0.1;
            child.rotation.z = Math.cos(time * 0.3 + i) * 0.05;
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, -12]} rotation={[0.2, -0.5, 0]}>
            {/* Multiple glass pages peeling away */}
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[i * 0.5, i * 0.2, i * -1.5]} rotation={[-Math.PI/6 + (i*0.1), Math.PI/4 + (i*0.05), 0]}>
                    <boxGeometry args={[6, 8, 0.05]} />
                    <meshPhysicalMaterial 
                        color={i % 2 === 0 ? "#FBD7D1" : "#FAF9F6"}
                        transmission={0.9}
                        opacity={1}
                        metalness={0.1}
                        roughness={0.05}
                        ior={1.5}
                        thickness={1}
                        clearcoat={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
};

const SceneContent = ({ mouse, scroll }: { 
    mouse: { x: MotionValue<number>, y: MotionValue<number> },
    scroll: MotionValue<number>
}) => {
    const spotRef = useRef<THREE.SpotLight>(null);

    useFrame((state) => {
        const x = mouse.x.get();
        const y = mouse.y.get();
        const s = scroll.get();
        
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 2, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 2 - (s * 5), 0.05);
        state.camera.lookAt(0, 0, 0);

        if (spotRef.current) {
            spotRef.current.position.x = x * 10;
            spotRef.current.position.y = 10 + (y * 5);
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            {/* Cinematic Lighting: High-intensity SpotLight with long penumbra */}
            <spotLight
                ref={spotRef}
                position={[10, 15, 10]}
                angle={0.4}
                penumbra={0.5}
                intensity={200}
                color="#FBD7D1"
            />
            <pointLight position={[-10, -10, -10]} intensity={50} color="#74549A" />
            
            <Embers />
            <FloatingGlassPages />
        </>
    );
};

const Scene3D = ({ mouse, scroll }: { 
    mouse: { x: MotionValue<number>, y: MotionValue<number> },
    scroll: MotionValue<number>
}) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-transparent">
            <Canvas shadows camera={{ position: [0, 0, 15], fov: 45 }}>
                <SceneContent mouse={mouse} scroll={scroll} />
            </Canvas>
        </div>
    );
};

export default Scene3D;