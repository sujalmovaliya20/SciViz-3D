import React, { useState } from 'react';
import { Box, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function LogicGates({ currentStep, controlValues }) {
  const gateType = controlValues.gate || 'AND';
  const [valA, setValA] = useState(0);
  const [valB, setValB] = useState(0);

  const getOutput = () => {
    const A = valA === 1;
    const B = valB === 1;
    switch(gateType) {
      case 'AND': return A && B;
      case 'OR': return A || B;
      case 'NOT': return !A;
      case 'NAND': return !(A && B);
      case 'NOR': return !(A || B);
      case 'XOR': return A !== B;
      case 'XNOR': return A === B;
      default: return false;
    }
  };

  const output = getOutput();

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* Input Buttons (3D) */}
      <group position={[-4, 1, 0]} onClick={() => setValA(valA ? 0 : 1)} style={{ cursor: 'pointer' }}>
        <Box args={[0.8, 0.8, 0.2]}><meshStandardMaterial color={valA ? '#32d74b' : '#333'} /></Box>
        <Html position={[0, 0.6, 0]} center><div className="mono">A: {valA}</div></Html>
      </group>

      {gateType !== 'NOT' && (
        <group position={[-4, -1, 0]} onClick={() => setValB(valB ? 0 : 1)} style={{ cursor: 'pointer' }}>
          <Box args={[0.8, 0.8, 0.2]}><meshStandardMaterial color={valB ? '#32d74b' : '#333'} /></Box>
          <Html position={[0, -0.6, 0]} center><div className="mono">B: {valB}</div></Html>
        </group>
      )}

      {/* Gate Shape (Simplified Symbolic Box) */}
      <group position={[0, 0, 0]}>
        <Box args={[2, 2, 0.5]}>
           <meshStandardMaterial color="#444" wireframe />
        </Box>
        <Html center><div className="syne-bold" style={{ fontSize: '1.5rem' }}>{gateType}</div></Html>
      </group>

      {/* Output LED */}
      <group position={[4, 0, 0]}>
         <Sphere args={[0.4, 32, 32]}>
            <meshStandardMaterial color={output ? '#32d74b' : '#222'} emissive={output ? '#32d74b' : '#000'} emissiveIntensity={1} />
         </Sphere>
         <Html position={[0, 0.8, 0]} center><div className="mono">OUTPUT: {output ? 1 : 0}</div></Html>
      </group>

      {/* Connection Lines */}
      <Line points={[new THREE.Vector3(-3.5, 1, 0), new THREE.Vector3(-1, 0.3, 0)]} color="#999" />
      {gateType !== 'NOT' && <Line points={[new THREE.Vector3(-3.5, -1, 0), new THREE.Vector3(-1, -0.3, 0)]} color="#999" />}
      <Line points={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(3.5, 0, 0)]} color="#999" />

      <Html position={[0, 4, 0]} center>
         <div className="label glass syne-bold">DIGITAL ELECTRONICS: {gateType} GATE</div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
};
