import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

const FloatingFragments = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    const fragments = [
        { word: "Ink", pos: [2, 2, -2] },
        { word: "Muse", pos: [-3, 1, -3] },
        { word: "Verse", pos: [4, -2, -4] },
        { word: "Echo", pos: [-2, -3, -2] },
        { word: "Soul", pos: [0, 3, -5] },
        { word: "Dream", pos: [-5, -1, -6] },
        { word: "Bloom", pos: [3, 4, -7] },
        { word: "Silence", pos: [-4, 3, -3] }
    ];

    const fontUrl = "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYpHtK.woff";

    return (
        <group ref={group}>
            {fragments.map((f, i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2} position={f.pos as [number, number, number]}>
                    <Text
                        font={fontUrl}
                        fontSize={0.5}
                        color="#74549A"
                        material-transparent
                        material-opacity={0.2}
                    >
                        {f.word}
                    </Text>
                </Float>
            ))}
            
            {/* Geometric Dream Blobs */}
            {[...Array(10)].map((_, i) => (
                <Float key={i} speed={1.5} position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, -10 - Math.random() * 10]}>
                    <mesh>
                        <sphereGeometry args={[Math.random() * 0.3, 16, 16]} />
                        <meshStandardMaterial color={i % 2 === 0 ? "#FBD7D1" : "#EAD7FB"} transparent opacity={0.3} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

export default FloatingFragments;