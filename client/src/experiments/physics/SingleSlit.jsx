import React, { useMemo } from 'react';
import { Box, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

export default function SingleSlit({ currentStep, controlValues }) {
  const slitWidth = controlValues.width || 0.1;
  const lambda = controlValues.wavelength || 500;
  const color = new THREE.Color(`hsl(${360 - (lambda - 380) / (750 - 380) * 280}, 100%, 50%)`);

  const diffractionPattern = useMemo(() => {
    const points = [];
    for (let i = -5; i <= 5; i += 0.05) {
      // Intensity: I = I0 (sinc(alpha))^2 where alpha = pi*a*sin(theta)/lambda
      const alpha = (Math.PI * slitWidth * i * 5) / (lambda * 0.001);
      const intensity = alpha === 0 ? 1 : Math.pow(Math.sin(alpha) / alpha, 2);
      points.push({ y: i, intensity });
    }
    return points;
  }, [slitWidth, lambda]);

  return (
    <group>
      <ambientLight intensity={1.5} />

      {/* Slit Plate */}
      <Box args={[0.1, 6, 4]} position={[-4, 0, 0]}>
        <meshStandardMaterial color="#333" />
        <Box args={[0.2, slitWidth * 20, 1.5]} position={[0.1, 0, 0]}><meshStandardMaterial color="white" emissive="white" /></Box>
      </Box>

      {/* Screen */}
      <group position={[4, 0, 0]}>
        <Box args={[0.1, 8, 5]}><meshStandardMaterial color="#111" /></Box>
        {diffractionPattern.map((p, i) => (
          <mesh key={i} position={[0.06, p.y, 0]}>
             <boxGeometry args={[0.01, 0.05, 3]} />
             <meshBasicMaterial color={color} transparent opacity={p.intensity} />
          </mesh>
        ))}
      </group>

      <Html position={[0, 4.5, 0]} center>
         <div className="label glass syne-bold">SINGLE SLIT DIFFRACTION</div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4.5, 0]} />
    </group>
  );
};
