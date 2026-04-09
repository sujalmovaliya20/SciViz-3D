import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, Line, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function Capacitor({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { showBattery: false, qScale: 0, showField: false, dielT: 0, glow: 0, label: "Parallel Plates", desc: "Two uncharged parallel metal plates separated by air." },
    { showBattery: true, qScale: 1, showField: false, dielT: 0, glow: 0, label: "Charging", desc: "Battery connected. Top plate gains +Q, bottom plate gains -Q." },
    { showBattery: true, qScale: 1, showField: true, dielT: 0, glow: 0, label: "Electric Field", desc: "Uniform electric field forms pointing + to -." },
    { showBattery: true, qScale: 1.5, showField: true, dielT: 1, glow: 0, label: "Dielectric Insertion", desc: "Slab increases capacitance! Field weakens inside, plates pull MORE charge." },
    { showBattery: true, qScale: 0, showField: false, dielT: 1, glow: 1, label: "Discharging", desc: "Energy releases quickly as plates spark." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  // Spring interpolations
  const { batOp, chargesOpa, fieldLength, slabPos, cFactor, glowOp } = useSpring({
    batOp: config.showBattery ? 1 : 0,
    chargesOpa: config.qScale > 0 ? 1 : 0,
    fieldLength: config.showField ? 1 : 0,
    slabPos: config.dielT === 1 ? 0 : 5, // T=1: inserted (x=0). T=0: outside (x=5)
    cFactor: config.dielT === 1 ? (config.qScale === 0 ? 0 : 1.5) : (config.qScale === 0 ? 0 : 1.0),
    glowOp: config.glow,
    config: { tension: 60, friction: 15 }
  });

  const numCharges = 40;
  const chargeData = useMemo(() => {
    // Generate grid points on 6x4 plate
    const pts = [];
    for(let i=0; i<numCharges; i++) {
        pts.push([
            (Math.random() - 0.5) * 5.5,
            0,
            (Math.random() - 0.5) * 3.5
        ]);
    }
    return pts;
  }, []);

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1} color="#ffffff" />

      {/* Capacitor Plates */}
      {/* Top Plate */}
      <Box args={[6, 0.15, 4]} position={[0, 1.5, 0]}>
         <meshStandardMaterial color="#8b949e" metalness={0.9} roughness={0.1} />
      </Box>
      <animated.group opacity={chargesOpa} transparent>
         {chargeData.map((pos, i) => (
             <mesh key={`p-${i}`} position={[pos[0], 1.6, pos[2]]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#ff4d6d" />
             </mesh>
         ))}
      </animated.group>

      {/* Bottom Plate */}
      <Box args={[6, 0.15, 4]} position={[0, -1.5, 0]}>
         <meshStandardMaterial color="#8b949e" metalness={0.9} roughness={0.1} />
      </Box>
      <animated.group opacity={chargesOpa} transparent>
         {chargeData.map((pos, i) => (
             <mesh key={`n-${i}`} position={[pos[0], -1.6, pos[2]]}>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial color="#00e5ff" />
             </mesh>
         ))}
      </animated.group>

      {/* Spark / Glow Discharge effect */}
      <animated.group position={[0, 0, 0]} opacity={glowOp}>
         <pointLight color="#ffff00" intensity={glowOp.to(v => v * 10)} distance={10} />
         <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <animated.meshBasicMaterial color="#ffff00" transparent opacity={glowOp.to(v => v * 0.8)} />
         </mesh>
      </animated.group>

      {/* E-Field Lines */}
      {/* Start y = 1.4, End y = -1.4 */}
      <animated.group opacity={fieldLength} transparent>
         {[-2, 0, 2].map((x) => 
           [-1, 0, 1].map((z, idx) => (
             <group key={`ef-${x}-${z}`}>
                <animated.line>
                  <animated.bufferGeometry>
                    <animated.bufferAttribute
                      attach="attributes-position"
                      array={fieldLength.to(fl => new Float32Array([
                         x, 1.4, z,
                         x, 1.4 - (2.8 * fl), z
                      ]))}
                      itemSize={3}
                      count={2}
                    />
                  </animated.bufferGeometry>
                  <lineBasicMaterial color="#e0eaff" transparent opacity={0.5} lineWidth={2} />
                </animated.line>
                <mesh position={[x, 0, z]} rotation={[Math.PI, 0, 0]}>
                   <coneGeometry args={[0.1, 0.3, 8]} />
                   <animated.meshBasicMaterial color="#e0eaff" transparent opacity={fieldLength} />
                </mesh>
             </group>
           ))
         )}
      </animated.group>

      {/* Dielectric Slab */}
      <animated.group position-x={slabPos} position-y={0}>
        <Box args={[6, 2.8, 4]}>
           <meshPhysicalMaterial 
             color="#ff9900" 
             transmission={0.9} 
             transparent opacity={0.6} 
             ior={1.8} 
             metalness={0.1} 
             roughness={0.1} 
           />
        </Box>
        <Html position={[0, 0, 2]} center>
          <div style={{ color: '#ff9900', fontWeight: 'bold' }}>Dielectric Slab (κ)</div>
        </Html>
      </animated.group>

      {/* Circuit / Battery Assembly */}
      <animated.group opacity={batOp} transparent>
         {/* Battery */}
         <Box args={[1, 2, 1]} position={[-5, 0, 0]}>
            <meshStandardMaterial color="#2d3748" />
            <Html position={[0, 0, 0.6]} center>
              <div className="mono" style={{ color: '#00e5ff' }}>12V</div>
            </Html>
         </Box>
         {/* Top wire */}
         <Line points={[[-5, 1, 0], [-5, 3, 0], [0, 3, 0], [0, 1.6, 0]]} color="#333" lineWidth={3} />
         {/* Bottom wire */}
         <Line points={[[-5, -1, 0], [-5, -3, 0], [0, -3, 0], [0, -1.6, 0]]} color="#333" lineWidth={3} />
      </animated.group>

      {/* Physics Dashboard Overlay */}
      <Html position={[4, -2, 0]} center>
         <div style={{
           background: 'rgba(6,8,15,0.9)', border: '1px solid #1e2a3a', borderRadius: '8px',
           padding: '12px', color: '#e0eaff', fontFamily: 'Space Mono, monospace', fontSize: '12px'
         }}>
            <div style={{ color: '#00e5ff', borderBottom: '1px solid #334', paddingBottom: '4px', marginBottom: '8px' }}>Metrics</div>
            <animated.div>
               {cFactor.to(c => `V = ${c > 0 ? '12.0' : '0.0'} V`)}
            </animated.div>
            <animated.div style={{ color: '#22c55e', margin: '4px 0' }}>
               {cFactor.to(c => `C = ${c > 0 ? (config.dielT===1 ? '1.5 C₀' : '1.0 C₀') : '0.0 C₀'}`)}
            </animated.div>
            <animated.div style={{ color: '#ff4d6d' }}>
               {cFactor.to(c => `Q = ${c > 0 ? (config.dielT===1 ? '18.0 μC' : '12.0 μC') : '0.0 μC'}`)}
            </animated.div>
         </div>
      </Html>

      {/* Title / Desc Overlay */}
      <Html position={[0, 4.5, 0]} center>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4, 0]} />
    </group>
  );
}
