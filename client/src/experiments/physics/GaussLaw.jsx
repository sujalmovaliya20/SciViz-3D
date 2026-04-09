import React, { useMemo } from 'react';
import { Sphere, Box, Cylinder, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function GaussLaw({ currentStep, controlValues }) {
  const surfaceType = controlValues.surface || 'sphere'; // sphere, cylinder, box
  const enclosedCharge = controlValues.charge || 1;

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* Central Charge */}
      <Sphere args={[0.2, 16, 16]}>
        <meshStandardMaterial color="#ff9f0a" emissive="#ff9f0a" />
        <Html position={[0, 0.4, 0]} center><div className="label mono">Q</div></Html>
      </Sphere>

      {/* flux arrows */}
      {[...Array(12)].map((_, i) => {
        const phi = (i / 12) * Math.PI * 2;
        const dir = new THREE.Vector3(Math.cos(phi), 0, Math.sin(phi));
        return (
          <Line key={i} points={[new THREE.Vector3(0,0,0), dir.multiplyScalar(3)]} color="#00e5ff" lineWidth={1} transparent opacity={0.3} />
        );
      })}

      {/* Gaussian Surface */}
      <group>
        {surfaceType === 'sphere' && (
          <Sphere args={[2, 32, 32]}>
            <meshStandardMaterial transparent opacity={0.2} color="#00e5ff" wireframe />
          </Sphere>
        )}
        {surfaceType === 'cylinder' && (
          <Cylinder args={[1.5, 1.5, 4, 32]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial transparent opacity={0.2} color="#00e5ff" wireframe />
          </Cylinder>
        )}
        {surfaceType === 'box' && (
          <Box args={[3, 3, 3]}>
            <meshStandardMaterial transparent opacity={0.2} color="#00e5ff" wireframe />
          </Box>
        )}
      </group>

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
          <div style={{ fontSize: '10px', color: '#4a5a7a', marginBottom: '4px', fontFamily: 'monospace', letterSpacing: '1px' }}>GAUSS LAW</div>
          <div>Φ = Q / ε₀</div>
        </div>
      </Html>
      
      <Html position={[3, 0, 0]}>
        <div className="glass mono" style={{ padding: '0.5rem', fontSize: '1rem', color: '#00e5ff' }}>
          Flux: {(enclosedCharge / 1).toFixed(2)} units
        </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -2.5, 0]} />
    </group>
  );
};
