import { Canvas } from '@react-three/fiber';
import { Float, PresentationControls, Text } from '@react-three/drei';

interface BookProps {
    title: string;
}

const Book3D: React.FC<BookProps> = ({ title }) => {
    return (
        <div className="h-[400px] w-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#FFE4E1" />

                <PresentationControls global rotation={[0.1, 0.3, 0]} polar={[-0.4, 0.4]} azimuth={[-1, 1]}>
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        {/* Simple Box representing the book */}
                        <mesh scale={[2, 3, 0.3]}>
                            <boxGeometry />
                            <meshStandardMaterial color="#FFE4E1" roughness={0.3} metalness={0.1} />
                            <Text
                                position={[0, 0, 0.51]}
                                fontSize={0.2}
                                color="#333333"
                                font="https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYpHtK.woff"
                                anchorX="center"
                                anchorY="middle"
                                maxWidth={1.5}
                                textAlign="center"
                            >
                                {title}
                            </Text>
                        </mesh>
                    </Float>
                </PresentationControls>
            </Canvas>
        </div>
    );
};

export default Book3D;