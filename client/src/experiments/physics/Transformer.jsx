import React from 'react';
import { Box, Cylinder, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Transformer({ currentStep, controlValues }) {
  const ratio = controlValues.ratio || 2; // Step Up (2) or Step Down (0.5)

  return (
    <group>
      <ambientLight intensity={1.5} />
      
      {/* Iron Core (Soft Iron Square) */}
      <group>
        <Box args={[5, 0.5, 2]} position={[0, 2, 0]}><meshStandardMaterial color="#444" /></Box>
        <Box args={[5, 0.5, 2]} position={[0, -2, 0]}><meshStandardMaterial color="#444" /></Box>
        <Box args={[0.5, 4.5, 2]} position={[-2.25, 0, 0]}><meshStandardMaterial color="#444" /></Box>
        <Box args={[0.5, 4.5, 2]} position={[2.25, 0, 0]}><meshStandardMaterial color="#444" /></Box>
      </group>

      {/* Primary Coil (Left) */}
      <group position={[-2.25, 0, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} rotation={[Math.PI/2, 0, 0]} position={[0, i * 0.3 - 1.35, 0]}>
             <torusGeometry args={[0.6, 0.05, 12, 24]} />
             <meshStandardMaterial color="#b87333" metalness={0.8} />
          </mesh>
        ))}
        <Html position={[-1, 0, 0]} center><div className="mono">PRIMARY (Nâ‚)</div></Html>
      </group>

      {/* Secondary Coil (Right) */}
      <group position={[2.25, 0, 0]}>
        {[...Array(Math.floor(10 * ratio))].map((_, i) => (
          <mesh key={i} rotation={[Math.PI/2, 0, 0]} position={[0, i * (3 / (10*ratio)) - 1.5, 0]}>
             <torusGeometry args={[0.6, 0.04, 12, 24]} />
             <meshStandardMaterial color="#b87333" metalness={0.8} />
          </mesh>
        ))}
        <Html position={[1.5, 0, 0]} center><div className="mono">SECONDARY (Nâ‚‚)</div></Html>
      </group>

      <Html position={[0, 4, 0]} center>
         <div className="label glass syne-bold">TRANSFORMER: Vâ‚‚/Vâ‚ = Nâ‚‚/Nâ‚</div>
      </Html>

      <Html position={[0, -3.5, 0]} center>
         <div className="glass mono" style={{ padding: '0.4rem 1rem' }}>
           V_in: 220V | V_out: {(220 * ratio).toFixed(0)}V
         </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4.5, 0]} />
    </group>
  );
};
