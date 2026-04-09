import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function NuclearFission({ currentStep, controlValues, isPlaying }) {
  const [fissioned, setFissioned] = useState(false);
  const products = useRef([]);

  const triggerFission = () => {
    setFissioned(true);
    products.current = [
      { pos: new THREE.Vector3(0,0,0), vel: new THREE.Vector3(1, 0.5, 0), color: '#32d74b', label: 'Kr' },
      { pos: new THREE.Vector3(0,0,0), vel: new THREE.Vector3(-0.8, -0.6, 0.5), color: '#ff9f0a', label: 'Ba' },
      { pos: new THREE.Vector3(0,0,0), vel: new THREE.Vector3(0.2, -1, -0.5), color: '#fff', label: 'n' },
      { pos: new THREE.Vector3(0,0,0), vel: new THREE.Vector3(0.5, 1, 0.2), color: '#fff', label: 'n' },
      { pos: new THREE.Vector3(0,0,0), vel: new THREE.Vector3(-0.5, 0.2, -1), color: '#fff', label: 'n' },
    ];
  };

  useFrame((state, delta) => {
    if (isPlaying && fissioned) {
      products.current.forEach(p => {
        p.pos.add(p.vel.clone().multiplyScalar(delta * 2));
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {!fissioned ? (
        <group onClick={triggerFission} style={{ cursor: 'pointer' }}>
          <Sphere args={[1.5, 32, 32]}>
            <meshStandardMaterial color="#ff4d6d" metalness={0.2} roughness={0.8} />
            <Html position={[0, 1.8, 0]} center><div className="label mono">U-235</div></Html>
          </Sphere>
          {/* Incoming Neutron */}
          <Sphere args={[0.2, 16, 16]} position={[-5, 0, 0]}>
             <meshStandardMaterial color="white" />
             <Html position={[0, -0.4, 0]} center><div className="mono">n</div></Html>
          </Sphere>
        </group>
      ) : (
        <group>
          {products.current.map((p, i) => (
            <mesh key={i} position={[p.pos.x, p.pos.y, p.pos.z]}>
              <sphereGeometry args={[p.label === 'n' ? 0.2 : 0.8, 16, 16]} />
              <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.5} />
              <Html position={[0, 1, 0]} center><div className="mono">{p.label}</div></Html>
            </mesh>
          ))}
          {/* Energy Burst */}
          <Sphere args={[3, 32, 32]}>
            <meshBasicMaterial color="#ffff00" transparent opacity={0.1} />
          </Sphere>
        </group>
      )}

      <Html position={[0, 4.5, 0]} center>
         <div className="label glass syne-bold">NUCLEAR FISSION: U-235 + n â†’ Kr + Ba + 3n + Energy</div>
      </Html>

      <gridHelper args={[40, 40, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
};
