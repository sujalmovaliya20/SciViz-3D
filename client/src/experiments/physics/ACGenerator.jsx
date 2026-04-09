import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Html, Line, Torus } from '@react-three/drei';
import * as THREE from 'three';

export default function ACGenerator({ currentStep, controlValues, isPlaying }) {
  const coilRef = useRef();
  const freq = controlValues.frequency || 1;

  useFrame((state) => {
    if (isPlaying && coilRef.current) {
      coilRef.current.rotation.x += 0.05 * freq;
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* Magnets */}
      <Box args={[2, 4, 3]} position={[-4, 0, 0]}><meshStandardMaterial color="#f44336" /><Html position={[0,2.2,0]} center>N</Html></Box>
      <Box args={[2, 4, 3]} position={[4, 0, 0]}><meshStandardMaterial color="#3f51b5" /><Html position={[0,2.2,0]} center>S</Html></Box>

      {/* Rotating Coil */}
      <group ref={coilRef}>
        <Box args={[0.05, 3, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#b87333" metalness={0.9} />
        </Box>
        <Cylinder args={[0.05, 0.05, 4]} rotation={[0, 0, Math.PI/2]} position={[2, 0, 0]}>
           <meshStandardMaterial color="#999" />
        </Cylinder>
      </group>

      {/* Sine Wave Graph Placeholder */}
      <Html position={[6, 3, 0]}>
        <div className="glass mono" style={{ padding: '0.5rem', border: '1px solid #00e5ff' }}>
          EMF: {Math.sin(Date.now() * 0.005 * freq).toFixed(2)}V
        </div>
      </Html>

      <Html position={[0, 4.5, 0]} center>
         <div className="label glass syne-bold">AC GENERATOR: ε = NBAω sin(ωt)</div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
    </group>
  );
};
