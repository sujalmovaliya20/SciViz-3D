import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function PhotoelectricEffect({ currentStep, controlValues, isPlaying }) {
  const freq = controlValues.frequency || 1; // 1 to 10
  const threshold = 5;
  const electrons = useRef([]);

  useFrame((state, delta) => {
    if (isPlaying && freq > threshold) {
      if (Math.random() > 0.9) {
          electrons.current.push({ pos: new THREE.Vector3(0, 0, 0), vel: (freq - threshold) * 2 });
      }
      electrons.current.forEach(e => {
          e.pos.x += e.vel * delta;
          if (e.pos.x > 5) {
             e.pos.x = 10; // mark for removal
          }
      });
      electrons.current = electrons.current.filter(e => e.pos.x < 10);
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* Photon Source (Conceptual) */}
      <group position={[-5, 2, 0]}>
         <Html center><div className="mono" style={{ color: '#00e5ff' }}>PHOTONS (hÎ½)</div></Html>
         <Line points={[new THREE.Vector3(0,0,0), new THREE.Vector3(4.5, -2, 0)]} color="#00e5ff" lineWidth={1} transparent opacity={0.3} />
      </group>

      {/* Metal Surface */}
      <Box args={[0.5, 4, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#888" metalness={0.9} />
        <Html position={[0, 2.2, 0]} center><div className="mono">METAL PLATE</div></Html>
      </Box>

      {/* Emitted Electrons */}
      {electrons.current.map((e, i) => (
        <Sphere key={i} args={[0.08, 8, 8]} position={[e.pos.x, 0, 0]}>
           <meshBasicMaterial color="#ffff00" />
        </Sphere>
      ))}

      <Html position={[0, 4, 0]} center>
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
          <div style={{ fontSize: '10px', color: '#4a5a7a', marginBottom: '4px', fontFamily: 'monospace', letterSpacing: '1px' }}>PHOTOELECTRIC EFFECT</div>
          <div>KE<sub>max</sub> = h&#x3BD; &minus; &#x3C6;</div>
        </div>
      </Html>

      <Html position={[4, 2, 0]} center>
         <div className="glass mono">
           {freq > threshold ? 'Emission Active' : 'Below Threshold Freq.'}
         </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
    </group>
  );
};
