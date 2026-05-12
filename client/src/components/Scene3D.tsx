import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

const Embers = ({ mouse }: { mouse: { x: MotionValue<number>, y: MotionValue<number> } }) => {
    const ref = useRef<THREE.Points>(null);
    const count = 600; // Optimized from 1000 for performance
    
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
        const mx = mouse.x.get();
        const my = mouse.y.get();

        ref.current.rotation.y = time * 0.02 + mx * 0.05;
        ref.current.rotation.x = time * 0.01 - my * 0.05;
        
        ref.current.position.y = Math.sin(time * 0.2) * 0.3;
    });

    // Hardcoded for Editorial Pearl (Light Luxury)
    const emberColor = '#B76E79';

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={true}>
            <PointMaterial
                transparent
                color={emberColor}
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
            />
        </Points>
    );
};

const FloatingGlassPages = ({ scroll }: { scroll: MotionValue<number> }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    const curve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(4, 4, -12),
        new THREE.Vector3(0, 0, -8),
        new THREE.Vector3(-4, -6, -4),
    ]), []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const s = Math.min(Math.max(scroll.get(), 0), 1);
        
        const point = curve.getPoint(s);
        groupRef.current.position.lerp(point, 0.1);

        const targetRotY = s * Math.PI * 2 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
        const targetRotZ = Math.sin(s * Math.PI) * 0.4 + Math.cos(state.clock.getElapsedTime() * 0.3) * 0.05;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
        groupRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 0.5) * 0.002;
        
        groupRef.current.children.forEach((child, i) => {
            const targetChildRotY = s > 0.05 ? (i * Math.PI) / 6 + s * 2 : 0;
            const targetChildRotX = Math.sin(state.clock.getElapsedTime() * 0.4 + i) * 0.04;
            child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, targetChildRotY, 0.1);
            child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, targetChildRotX, 0.1);
        });
    });


    
    return (
        <group ref={groupRef}>
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[i * 0.04, i * 0.01, i * -0.4]}>
                    <boxGeometry args={[3.8, 5.2, 0.01]} />
                    <meshStandardMaterial 
                        color={i % 2 === 0 ? "#F4D0D0" : "#FAF9F6"}
                        transparent
                        opacity={0.98}
                        metalness={0.02}
                        roughness={0.9}
                        emissive={i % 2 === 0 ? "#F4D0D0" : "#FAF9F6"}
                        emissiveIntensity={0.05}
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
        
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 1.5, 0.1);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 1.5 - (s * 4), 0.1);
        state.camera.lookAt(0, 0, 0);

        if (spotRef.current) {
            spotRef.current.position.x = x * 8;
            spotRef.current.position.y = 8 + (y * 4);
        }
    });

    return (
        <>
            <ambientLight intensity={0.8} />
            <spotLight
                ref={spotRef}
                position={[10, 20, 10]}
                angle={0.5}
                penumbra={1}
                intensity={800}
                color="#FBD7D1"
                castShadow
                shadow-mapSize={[512, 512]}
                shadow-bias={-0.0005}
            />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#FBD7D1" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#E6E6FA" />
            
            <Embers mouse={mouse} />
            <FloatingGlassPages scroll={scroll} />
        </>
    );
};

const Scene3D = ({ mouse, scroll }: { 
    mouse: { x: MotionValue<number>, y: MotionValue<number> },
    scroll: MotionValue<number>
}) => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-transparent">
            <Canvas 
                shadows 
                camera={{ position: [0, 0, 15], fov: 45 }}
                gl={{ 
                    powerPreference: "high-performance",
                    antialias: true,
                    stencil: false,
                    depth: true
                }}
                dpr={[1, 1.5]} // Limit pixel ratio for high-res screens
            >
                <SceneContent mouse={mouse} scroll={scroll} />
            </Canvas>
        </div>
    );
};

export default Scene3D;