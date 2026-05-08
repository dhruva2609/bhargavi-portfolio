import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const NarrativeObject = () => {
    const solidRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const r1 = Math.sin(time * 0.5) * 0.5 + 0.5; // Auto-morphing for background effect

        if (solidRef.current && wireRef.current && groupRef.current) {
            // 1. Morphing Opacity (Wireframe to Solid)
            const solidMat = solidRef.current.material as THREE.MeshStandardMaterial;
            const wireMat = wireRef.current.material as THREE.MeshStandardMaterial;

            solidMat.opacity = r1;
            wireMat.opacity = 1 - r1;

            // 2. Movement (Moving closer/further like the truck video)
            groupRef.current.position.z = THREE.MathUtils.lerp(0, 2, r1);

            // 3. Gentle Rotation
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2 + (r1 * 2);
        }
    });

    return (
        <group ref={groupRef}>
            {/* The "Solid" Luxury Object (The Result) */}
            <mesh ref={solidRef}>
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <meshStandardMaterial
                    color="#FBD7D1"
                    roughness={0.1}
                    metalness={0.2}
                    transparent
                    opacity={0}
                />
            </mesh>

            {/* The "Wireframe" Technical Object (The Thought) */}
            <mesh ref={wireRef}>
                <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                <meshStandardMaterial
                    color="#74549A"
                    wireframe
                    transparent
                    opacity={1}
                />
            </mesh>
        </group>
    );
};

export default NarrativeObject;