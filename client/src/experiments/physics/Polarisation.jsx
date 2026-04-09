import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, Line, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export default function Polarisation({ currentStep, controlValues, isPlaying }) {
  const angle = controlValues.rotation || 0; // 0 to Math.PI

  return (
    <group>
      <ambientLight intensity={1.5} />

      {/* Unpolarised Light Source */}
      <group position={[-5, 0, 0]}>
        {[...Array(8)].map((_, i) => (
          <Line 
            key={i} 
            points={[new THREE.Vector3(0,0,0), new THREE.Vector3(0, Math.sin(i*Math.PI/4), Math.cos(i*Math.PI/4))]} 
            color="#ffff00" 
            lineWidth={2}
          />
        ))}
        <Html position={[0, -1.5, 0]} center><div className="mono">UNPOLARISED</div></Html>
      </group>

      {/* Polariser 1 (Fixed Vertical) */}
      <group position={[-2, 0, 0]}>
        <Box args={[0.1, 3, 3]}><meshStandardMaterial color="#333" transparent opacity={0.6} /></Box>
        <Box args={[0.05, 2.5, 0.05]}><meshStandardMaterial color="#fff" /></Box>
        <Html position={[0, 2, 0]} center><div className="mono">POLARISER 1</div></Html>
      </group>

      {/* Analyser (Rotating) */}
      <group position={[2, 0, 0]} rotation={[angle, 0, 0]}>
        <Box args={[0.1, 3, 3]}><meshStandardMaterial color="#333" transparent opacity={0.6} /></Box>
        <Box args={[0.05, 2.5, 0.05]}><meshStandardMaterial color="#fff" /></Box>
        <Html position={[0, 2, 0]} center><div className="mono">ANALYSER (Î¸)</div></Html>
      </group>

      {/* Transmission Path */}
      <Line points={[new THREE.Vector3(-5,0,0), new THREE.Vector3(5,0,0)]} color="#00e5ff" lineWidth={1} transparent opacity={0.2} />

      {/* Intensity Output */}
      <group position={[5, 0, 0]}>
         <Box args={[0.1, 2, 0.1]} rotation={[angle, 0, 0]}>
            <meshBasicMaterial color="#ffff00" transparent opacity={Math.pow(Math.cos(angle), 2)} />
         </Box>
         <Html position={[0, -1.8, 0]} center>
           <div className="glass mono" style={{ fontSize: '1rem', color: '#ffff00' }}>
             Intensity: {(Math.pow(Math.cos(angle), 2) * 100).toFixed(0)}%
           </div>
         </Html>
      </group>

      <Html position={[0, 4, 0]} center>
         <div className="label glass syne-bold">MALUS'S LAW: I = Iâ‚€ cosÂ²Î¸</div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
    </group>
  );
};
