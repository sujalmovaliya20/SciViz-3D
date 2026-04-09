import React, { useMemo } from 'react';
import { Sphere, Cylinder, Html, Line, Box } from '@react-three/drei';
import * as THREE from 'three';

export default function YoungDoubleSlit({ currentStep, controlValues }) {
  const lambda = controlValues.wavelength || 500; // nm
  const d = controlValues.separation || 0.1; // mm
  const color = new THREE.Color(`hsl(${360 - (lambda - 380) / (750 - 380) * 280}, 100%, 50%)`);

  const interferencePattern = useMemo(() => {
    const scale = 0.5;
    const points = [];
    for (let i = -5; i <= 5; i += 0.1) {
      // Intensity formula: I = I0 cos^2(pi*d*y / lambda*D)
      const intensity = Math.pow(Math.cos((Math.PI * d * i * 10) / (lambda * 0.001)), 2);
      points.push({ y: i, intensity });
    }
    return points;
  }, [lambda, d]);

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* Slit Plate */}
      <Box args={[0.1, 4, 3]} position={[-4, 0, 0]}>
        <meshStandardMaterial color="#333" />
        {/* Two Slits */}
        <Box args={[0.15, 0.05, 1]} position={[0.1, d*5, 0]}><meshStandardMaterial color="white" emissive="white" /></Box>
        <Box args={[0.15, 0.05, 1]} position={[0.1, -d*5, 0]}><meshStandardMaterial color="white" emissive="white" /></Box>
      </Box>

      {/* Screen */}
      <Box args={[0.1, 6, 4]} position={[4, 0, 0]}>
        <meshStandardMaterial color="#111" />
        {/* Interference Fringes */}
        {interferencePattern.map((p, i) => (
          <mesh key={i} position={[0.06, p.y, 0]}>
             <boxGeometry args={[0.01, 0.1, 2]} />
             <meshBasicMaterial color={color} transparent opacity={p.intensity} />
          </mesh>
        ))}
      </Box>

      {/* Waves (Conceptual lines) */}
      {[...Array(10)].map((_, i) => (
        <Line 
           key={i} 
           points={[new THREE.Vector3(-4, d*5, 0), new THREE.Vector3(4, i-4.5, 0)]} 
           color={color} 
           lineWidth={0.5} 
           transparent 
           opacity={0.1} 
        />
      ))}

      <Html position={[0, 4.5, 0]} center>
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
          <div style={{ fontSize: '10px', color: '#4a5a7a', marginBottom: '4px', fontFamily: 'monospace', letterSpacing: '1px' }}>YOUNG'S DOUBLE SLIT</div>
          <div>&#x3B2; = &#x3BB;D / d</div>
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
};
