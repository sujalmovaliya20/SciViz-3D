import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function FaradayInduction({ currentStep = 0 }) {
  const stepConfigs = [
    {
      pos: -5,
      springConfig: { tension: 170, friction: 26 },
      label: "Stationary Magnet",
      desc: "No relative motion between magnet and coil. Flux is constant, EMF = 0."
    },
    {
      pos: 2,
      springConfig: { tension: 20, friction: 14 },
      label: "Moving Toward Coil",
      desc: "Flux linked with coil increases. Galvanometer deflects right."
    },
    {
      pos: 2,
      springConfig: { tension: 170, friction: 26 },
      label: "Magnet Inside Coil",
      desc: "Motion stops. Flux is maximum but constant, so EMF drops to zero."
    },
    {
      pos: -5,
      springConfig: { tension: 20, friction: 14 },
      label: "Moving Away",
      desc: "Flux decreases. Galvanometer deflects left (Lenz's Law)."
    },
    {
      pos: 2,
      springConfig: { tension: 150, friction: 15 },
      label: "Faster Motion",
      desc: "Higher speed = greater rate of change of flux = larger EMF."
    }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { mx } = useSpring({
    mx: config.pos,
    config: config.springConfig
  });

  const magnetRef = useRef();
  const needleRef = useRef();
  const prevX = useRef(-5);
  const emf = useRef(0);
  const [displayEmf, setDisplayEmf] = useState(0);

  // Calculate EMF conceptually using the spring derivative (velocity)
  useFrame(() => {
    if (magnetRef.current) {
      const currentX = magnetRef.current.position.x;
      const dx = currentX - prevX.current;
      
      // If magnet is near coil (x is between -1 and 3), flux change is highest.
      // We apply a conceptual Gaussian falloff so EMF is only generated when near the coil.
      const distanceToCoilCenter = Math.abs(currentX - 2);
      const coupling = Math.exp(-Math.pow(distanceToCoilCenter, 2) / 4);
      
      const instantaneousEmf = -dx * 120 * coupling;
      
      emf.current = THREE.MathUtils.lerp(emf.current, instantaneousEmf, 0.2);
      
      if (needleRef.current) {
        // limit needle rotation
        let rot = emf.current;
        if (rot > Math.PI/3) rot = Math.PI/3;
        if (rot < -Math.PI/3) rot = -Math.PI/3;
        needleRef.current.rotation.z = rot;
      }
      
      setDisplayEmf(emf.current);
      prevX.current = currentX;
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* Coil */}
      <group position={[2, 0, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} rotation={[0, Math.PI/2, 0]} position={[i * 0.1 - 0.5, 0, 0]}>
             <torusGeometry args={[1, 0.05, 16, 32]} />
             <meshStandardMaterial color="#b87333" metalness={0.8} />
          </mesh>
        ))}
        <Html position={[0, 1.5, 0]} center><div className="label mono">COIL</div></Html>
      </group>

      {/* Animated Bar Magnet */}
      <animated.group ref={magnetRef} position-x={mx}>
        <mesh position={[-0.5, 0, 0]}>
           <boxGeometry args={[1, 0.8, 0.8]} />
           <meshStandardMaterial color="#3f51b5" />
           <Html position={[0, 0.6, 0]} center><div className="mono">S</div></Html>
        </mesh>
        <mesh position={[0.5, 0, 0]}>
           <boxGeometry args={[1, 0.8, 0.8]} />
           <meshStandardMaterial color="#f44336" />
           <Html position={[0, 0.6, 0]} center><div className="mono">N</div></Html>
        </mesh>
      </animated.group>

      {/* Galvanometer */}
      <group position={[2, -3, 0]}>
        <Box args={[1.5, 1, 0.5]}>
           <meshStandardMaterial color="#1e2a3a" />
           
           <Html position={[0, 0, 0.26]} center>
              <div style={{ color: '#00e5ff', fontSize: '12px', fontFamily: 'monospace', textAlign: 'center' }}>
                G
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: Math.abs(displayEmf) > 0.5 ? '#ff4d6d' : '#e0eaff' }}>
                  {displayEmf.toFixed(1)}
                </div>
              </div>
           </Html>
        </Box>
        
        {/* Needle */}
        <group position={[0, -0.2, 0.26]}>
          <group ref={needleRef}>
            <mesh position={[0, 0.4, 0]}>
              <coneGeometry args={[0.05, 0.8, 8]} />
              <meshBasicMaterial color="#ff4d6d" />
            </mesh>
          </group>
          <Sphere args={[0.1]}><meshBasicMaterial color="#ffffff" /></Sphere>
        </group>
      </group>

      {/* Connections (Wires) */}
      <mesh position={[1.5, -1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      <mesh position={[2.5, -1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3]} />
        <meshBasicMaterial color="#222" />
      </mesh>

      {/* UI Overlay */}
      <Html position={[0, 3.5, 0]} center>
        <div style={{
          background: 'rgba(6,8,15,0.9)', border: '1px solid #1e2a3a', borderRadius: '8px',
          padding: '10px 16px', color: '#e0eaff', fontFamily: 'Space Mono, monospace',
          fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'center'
        }}>
          <div style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '4px' }}>
            {config.label}
          </div>
          <div style={{ color: '#4a5a7a' }}>{config.description}</div>
        </div>
      </Html>

      <Html position={[0, 4.5, 0]} center>
         <div className="label glass syne-bold">FARADAY LAW: ε = -dΦ/dt</div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4, 0]} />
    </group>
  );
}
