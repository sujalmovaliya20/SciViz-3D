import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Sphere } from '@react-three/drei';

export default function DigestiveSystem({ currentStep, controlValues, isPlaying }) {
  const groupRef = useRef();

  useFrame(() => {
    if (isPlaying && groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      <Float speed={1.5} floatIntensity={0.3}>
        {/* Stomach representation */}
        <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ff9f0a" transparent opacity={0.7} wireframe={currentStep >= 1} />
        </Sphere>
      </Float>

      <Html position={[0, 2.5, 0]} center>
        <div style={{
          color: '#00e5ff',
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          background: 'rgba(6,8,15,0.85)',
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid #1e2a3a',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ fontSize: '10px', color: '#4a5a7a', marginBottom: '4px', fontFamily: 'monospace', letterSpacing: '1px' }}>DIGESTIVE SYSTEM</div>
          <div>Coming Soon</div>
        </div>
      </Html>

      <Html position={[0, -1.5, 0]} center>
        <div style={{ color: '#4a5a7a', fontFamily: 'monospace', fontSize: '12px', textAlign: 'center' }}>
          Step {currentStep + 1}: Full 3D model in development
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2, 0]} />
    </group>
  );
}
