import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function Translation({ currentStep = 0 }) {
  const stepConfigs = [
    { riboScale: 0, trnaX: -8, ptX: -2, pepLen: 0, label: "mRNA outside Nucleus", desc: "mRNA strand has entered the cytoplasm." },
    { riboScale: 1, trnaX: -8, ptX: -2, pepLen: 0, label: "Ribosome Assembly", desc: "Small (40S) and Large (60S) ribosomal subunits enclose the mRNA." },
    { riboScale: 1, trnaX: -2, ptX: 0, pepLen: 1, label: "tRNA & Elongation", desc: "tRNA brings Amino Acids. Anticodons match mRNA codons." },
    { riboScale: 1, trnaX: 4, ptX: 2, pepLen: 4, label: "Polypeptide Growth", desc: "Ribosome shifts by one codon. Peptide bonds form chaining Amino Acids." },
    { riboScale: 0.5, trnaX: 8, ptX: 5, pepLen: 6, label: "Termination", desc: "Stop codon reached. Ribosome separates, releasing the synthesized protein." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { rS, tX, pX, pLen } = useSpring({
      rS: config.riboScale,
      tX: config.trnaX,
      pX: config.ptX,
      pLen: config.pepLen,
      config: { tension: 60, friction: 15 }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* mRNA STRAND */}
      <group position={[0, 0, 0]}>
         <Cylinder args={[0.2, 0.2, 16]} rotation={[0,0,Math.PI/2]}>
             <meshStandardMaterial color="#f97316" />
         </Cylinder>
         {/* Codon markers */}
         {[...Array(8)].map((_,i) => (
             <Html key={`cd-${i}`} position={[-6 + i*1.8, -0.8, 0]} center>
                <div style={{ color:'#fdba74', fontSize:'10px', width:'24px', textAlign:'center', borderTop:'2px solid #fdba74' }}>
                   {i===0 ? 'AUG' : i===7 ? 'UAA' : 'CGC'}
                </div>
             </Html>
         ))}
      </group>

      {/* RIBOSOME */}
      <animated.group scale={rS} position-x={pX}>
          {/* Large subunit (Top) */}
          <mesh position={[0, 1.5, 0]}>
             <sphereGeometry args={[2, 32, 32, 0, Math.PI*2, 0, Math.PI/2]} />
             <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
             <Html position={[0, 2.5, 0]} center><div style={{color:'#93c5fd', fontSize:'12px', fontWeight:'bold'}}>60S Large Subunit</div></Html>
          </mesh>
          {/* Small subunit (Bottom) */}
          <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
             <sphereGeometry args={[1.5, 32, 32, 0, Math.PI*2, 0, Math.PI/2]} />
             <meshStandardMaterial color="#22c55e" transparent opacity={0.8} />
             <Html position={[0, 2, 0]} center><div style={{color:'#86efac', fontSize:'12px', fontWeight:'bold'}}>40S Small Subunit</div></Html>
          </mesh>
      </animated.group>

      {/* CURRENT tRNA (Entering -> A site, shifting -> P site) */}
      <animated.group position-x={tX} position-y={1}>
          <group rotation={[Math.PI, 0, 0]}>
             <Torus args={[0.4, 0.1, 8, 16]} position={[0, 1, 0]}><meshStandardMaterial color="#c084fc" /></Torus>
             <Cylinder args={[0.1, 0.1, 1]} position={[0, 0.5, 0]}><meshStandardMaterial color="#c084fc" /></Cylinder>
             <Html position={[0, 1.5, 0]} center><div style={{color:'#d8b4fe', fontSize:'10px'}}>Anticodon</div></Html>
          </group>
          {/* Active Amino Acid brought by tRNA */}
          <Sphere args={[0.3, 16, 16]} position={[0, 1.5, 0]}>
             <meshStandardMaterial color="#ff4d6d" />
          </Sphere>
      </animated.group>

      {/* POLYPEPTIDE CHAIN GROWING OUT TOP OF RIBOSOME */}
      <animated.group position-x={pX} position-y={3} visible={pLen.to(l => l > 0)}>
         {/* Render up to N spheres based on pLen (use a hacky line/chain) */}
         <animated.mesh scale-y={pLen.to(l => l)} position-y={pLen.to(l=>l/2)}>
             <cylinderGeometry args={[0.1, 0.1, 1]} />
             <meshStandardMaterial color="#fda4af" />
         </animated.mesh>
         <animated.mesh position-y={pLen.to(l => l)}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#ff4d6d" />
            <Html position={[0, 0.8, 0]} center><div style={{color:'#fda4af', fontSize:'12px', fontWeight:'bold'}}>Growing Polypeptide Protein</div></Html>
         </animated.mesh>
      </animated.group>

      {/* UI Overlay */}
      <Html position={[0, -4.5, 0]} center>
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
    </group>
  );
}
