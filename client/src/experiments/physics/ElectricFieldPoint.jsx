import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function ElectricFieldPoint({ currentStep, controlValues, isPlaying }) {
  const type = controlValues.chargeType || 'positive'; // positive or negative
  const chargeColor = type === 'positive' ? '#ff4d6d' : '#00e5ff';
  
  const fieldLines = useMemo(() => {
    const lines = [];
    const count = 24;
    const l = 4;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      for (let j = 0; j < 6; j++) {
        const phi = (j / 6) * Math.PI;
        const x = Math.sin(phi) * Math.cos(theta) * l;
        const y = Math.cos(phi) * l;
        const z = Math.sin(phi) * Math.sin(theta) * l;
        lines.push([new THREE.Vector3(0,0,0), new THREE.Vector3(x, y, z)]);
      }
    }
    return lines;
  }, []);

  return (
    <group>
      <ambientLight intensity={1} />
      
      {/* Point Charge */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial color={chargeColor} emissive={chargeColor} emissiveIntensity={2} />
        <Html position={[0, 0.6, 0]} center>
          <div className="label mono" style={{ color: chargeColor }}>{type === 'positive' ? 'Q+' : 'Q-'}</div>
        </Html>
      </Sphere>

      {/* Field Lines */}
      {currentStep >= 1 && (
        <group>
          {fieldLines.map((line, i) => (
            <Line 
              key={i} 
              points={line} 
              color={chargeColor} 
              lineWidth={1} 
              transparent 
              opacity={0.2} 
            />
          ))}
        </group>
      )}

      {/* Grid */}
      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
    </group>
  );
};
