import React from 'react';
import { Box, Html, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function PNJunction({ currentStep, controlValues }) {
  const mode = controlValues.mode || 'forward'; // forward, reverse
  const depletionWidth = mode === 'forward' ? 0.2 : 1.2;

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* P-Type Layer */}
      <Box args={[3, 2, 2]} position={[-1.5 - depletionWidth/2, 0, 0]}>
        <meshStandardMaterial color="#ff4d6d" transparent opacity={0.6} />
        <Html position={[0, 1.2, 0]} center><div className="mono">P-TYPE (Holes)</div></Html>
      </Box>

      {/* N-Type Layer */}
      <Box args={[3, 2, 2]} position={[1.5 + depletionWidth/2, 0, 0]}>
        <meshStandardMaterial color="#00e5ff" transparent opacity={0.6} />
        <Html position={[0, 1.2, 0]} center><div className="mono">N-TYPE (Electrons)</div></Html>
      </Box>

      {/* Depletion Region */}
      <Box args={[depletionWidth, 2, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#fff" transparent opacity={0.2} />
        <Html position={[0, -1.2, 0]} center><div className="mono" style={{ fontSize: '0.7rem' }}>DEPLETION REGION</div></Html>
      </Box>

      {/* Mobile Ions (Static markers) */}
      {[...Array(6)].map((_, i) => (
        <group key={i}>
           <Sphere args={[0.1, 8, 8]} position={[-1 - Math.random()*2, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5]}><meshBasicMaterial color="#ff4d6d" /></Sphere>
           <Sphere args={[0.1, 8, 8]} position={[1 + Math.random()*2, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5]}><meshBasicMaterial color="#00e5ff" /></Sphere>
        </group>
      ))}

      <Html position={[0, 4, 0]} center>
         <div className="label glass syne-bold">PN JUNCTION DIODE: {mode.toUpperCase()} BIAS</div>
      </Html>

      <Html position={[0, -3.5, 0]} center>
         <div className="glass mono" style={{ color: mode === 'forward' ? '#32d74b' : '#ff4d6d' }}>
           {mode === 'forward' ? 'Current Flows (On)' : 'Current Blocked (Off)'}
         </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4.5, 0]} />
    </group>
  );
};
