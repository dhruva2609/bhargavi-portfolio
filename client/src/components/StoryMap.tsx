import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Float, Line, Sphere, PerspectiveCamera, OrbitControls } from '@react-three/drei';

const StoryNode = ({ position, title, type, color }: any) => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                <Sphere args={[0.2, 32, 32]}>
                    <meshStandardMaterial 
                        color={color} 
                        emissive={color} 
                        emissiveIntensity={2} 
                        toneMapped={false} 
                    />
                </Sphere>
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.15}
                    font="/CormorantGaramond-Italic.ttf"
                    color="#4A4A4A"
                    anchorX="center"
                    anchorY="middle"
                >
                    {title}
                </Text>
                <Text
                    position={[0, -0.3, 0]}
                    fontSize={0.08}
                    color="#A08B8D"
                    fillOpacity={0.5}
                    anchorX="center"
                    anchorY="middle"
                >
                    {type}
                </Text>
            </group>
        </Float>
    );
};

const Connections = ({ nodes }: { nodes: any[] }) => {
    return (
        <>
            {nodes.map((node) => (
                node.connections?.map((targetId: number) => {
                    const target = nodes.find(n => n.id === targetId);
                    if (!target) return null;
                    return (
                        <Line
                            key={`${node.id}-${targetId}`}
                            points={[node.position, target.position]}
                            color="#B76E79"
                            lineWidth={0.5}
                            transparent
                            opacity={0.2}
                        />
                    );
                })
            ))}
        </>
    );
};

const StoryMap = () => {
    const nodes = useMemo(() => [
        { id: 1, position: [0, 0, 0], title: "The Midnight Library", type: "Location", color: "#6B4E71", connections: [2, 3, 4] },
        { id: 2, position: [-2, 1, -1], title: "Evelyn Thorne", type: "Protagonist", color: "#B76E79", connections: [1] },
        { id: 3, position: [2, -1, 1], title: "The Lost Manuscript", type: "Artifact", color: "#D4AF37", connections: [1, 5] },
        { id: 4, position: [1, 2, -2], title: "Whispering Pines", type: "Location", color: "#B8C5B3", connections: [1] },
        { id: 5, position: [3, 1, 2], title: "Cillian Vane", type: "Antagonist", color: "#4A4A4A", connections: [3] },
    ], []);

    return (
        <div className="w-full h-[600px] editorial-card bg-white/20 relative overflow-hidden group">
            <div className="absolute top-10 left-10 z-10 pointer-events-none">
                <span className="metadata-precise text-[10px] tracking-[0.5em] text-muted-rosegold uppercase">The World Schema</span>
                <h3 className="font-serif text-3xl italic text-dream-purple mt-2">Interconnected Narratives</h3>
                <p className="text-charcoal/40 text-sm font-serif italic mt-2">Drag to explore the web of stories.</p>
            </div>

            <Canvas gl={{ alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                
                <group scale={1.2}>
                    {nodes.map(node => (
                        <StoryNode key={node.id} {...node} />
                    ))}
                    <Connections nodes={nodes} />
                </group>
                
                {/* Subtle Dust Particles */}
                <points>
                    <bufferGeometry>
                        <float32BufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array(300).map(() => (Math.random() - 0.5) * 15), 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial size={0.02} color="#B76E79" transparent opacity={0.3} />
                </points>
            </Canvas>

            <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex items-center gap-4 text-dream-purple/30">
                    <div className="w-8 h-[1px] bg-current" />
                    <span className="metadata-precise text-[8px] uppercase tracking-widest">3D Narrative Mapper</span>
                </div>
            </div>
        </div>
    );
};

export default StoryMap;
