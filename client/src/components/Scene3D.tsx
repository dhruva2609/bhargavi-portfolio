import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { MotionValue } from "framer-motion";

const Embers = ({ mouse }: { mouse: { x: MotionValue<number>, y: MotionValue<number> } }) => {
    const ref = useRef<THREE.Points>(null);
    const count = 1500; // 1,500 rose-gold dust particles
    
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

        // Reacting to mouse movement and organic drift
        ref.current.rotation.y = time * 0.02 + mx * 0.1;
        ref.current.rotation.x = time * 0.01 - my * 0.1;
        ref.current.rotation.z = Math.sin(time * 0.1) * 0.05;
        
        ref.current.position.y = Math.sin(time * 0.2) * 0.5;
        ref.current.position.x = Math.cos(time * 0.15) * 0.3;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#B76E79"
                size={0.06}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.7}
            />
        </Points>
    );
};

const FloatingGlassPages = ({ scroll }: { scroll: MotionValue<number> }) => {
    const groupRef = useRef<THREE.Group>(null);
    
    // Curved path using Catmull-Rom spline to travel to Archive grid
    const curve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(5, 5, -15),    // Starting high up
        new THREE.Vector3(0, 0, -10),    // Mid-scroll center
        new THREE.Vector3(-6, -8, -5),   // Landing in Archive section
    ]), []);

    useFrame((state) => {
        if (!groupRef.current) return;
        // scroll value from 0 to 1
        const s = Math.min(Math.max(scroll.get(), 0), 1);
        
        // Position along the spline
        const point = curve.getPoint(s);
        groupRef.current.position.lerp(point, 0.05);

        // Physics-Based Rotation
        const targetRotY = s * Math.PI * 2; // Full spin
        const targetRotZ = Math.sin(s * Math.PI) * 0.5;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);
        
        // Flip pages dynamically based on scroll
        groupRef.current.children.forEach((child, i) => {
            const targetChildRotY = s > 0.05 ? (i * Math.PI) / 6 + s * 2 : 0;
            const targetChildRotX = Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.05;
            child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, targetChildRotY, 0.05);
            child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, targetChildRotX, 0.05);
        });
    });

    return (
        <group ref={groupRef}>
            {/* Multiple glass pages flipping along the scroll path */}
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[i * 0.05, i * 0.02, i * -0.5]}>
                    <boxGeometry args={[4, 5.5, 0.02]} />
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
            <ambientLight intensity={0.3} />
            {/* Cinematic Lighting: High-intensity SpotLight with long penumbra */}
            <spotLight
                ref={spotRef}
                position={[15, 25, 10]}
                angle={0.6}
                penumbra={1}
                intensity={400}
                color="#FBD7D1"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
            />
            <pointLight position={[-10, -10, -10]} intensity={80} color="#74549A" />
            
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
            <Canvas shadows camera={{ position: [0, 0, 15], fov: 45 }}>
                <SceneContent mouse={mouse} scroll={scroll} />
            </Canvas>
        </div>
    );
};

export default Scene3D;