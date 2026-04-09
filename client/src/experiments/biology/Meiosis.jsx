import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function Meiosis({ currentStep = 0 }) {
  const stepConfigs = [
    { cellLayout: 1, cX: 0, swap: 0, pullX: 0, splitCellY: 0, label: "Interphase -> Prophase I", desc: "Diploid (2n=4) start. Homologous chromosomes pair up." },
    { cellLayout: 1, cX: 0, swap: 1, pullX: 0, splitCellY: 0, label: "Crossing Over (Prophase I)", desc: "Homologous chromosomes exchange genetic material (recombination)." },
    { cellLayout: 2, cX: 2, swap: 1, pullX: 2, splitCellY: 0, label: "Meiosis I Completes", desc: "Homologs separate. Cell divides into TWO haploid cells." },
    { cellLayout: 2, cX: 2, swap: 1, pullX: 5, splitCellY: 2, label: "Meiosis II (Anaphase II)", desc: "Sister chromatids separate in both cells." },
    { cellLayout: 4, cX: 4, swap: 1, pullX: 6, splitCellY: 4, label: "Gametes Formed", desc: "Result: FOUR unique haploid (n=2) cells (gametes)." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { swapCol, pX, sY } = useSpring({
      swapCol: config.swap,
      pX: config.pullX,
      sY: config.splitCellY,
      config: { tension: 60, friction: 15 }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* MAIN DIPLOID CELL START / DIVISIONS */}
      <animated.group scale-x={pX.to(p => p < 2 ? 1 + p*0.2 : 1)}>
         {config.cellLayout === 1 && (
            <Sphere args={[4, 32, 32]}>
               <meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} />
            </Sphere>
         )}
      </animated.group>

      {/* Meiosis 1 completion (2 cells) */}
      {config.cellLayout >= 2 && config.cellLayout < 4 && (
         <animated.group>
            <Sphere args={[2.5, 32, 32]} position={[-3, 0, 0]}><meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} /></Sphere>
            <Sphere args={[2.5, 32, 32]} position={[3, 0, 0]}><meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} /></Sphere>
         </animated.group>
      )}

      {/* Meiosis 2 completion (4 cells) */}
      {config.cellLayout === 4 && (
         <animated.group>
            <Sphere args={[1.8, 32, 32]} position={[-3, 2.5, 0]}><meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} /></Sphere>
            <Sphere args={[1.8, 32, 32]} position={[-3, -2.5, 0]}><meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} /></Sphere>
            <Sphere args={[1.8, 32, 32]} position={[3, 2.5, 0]}><meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} /></Sphere>
            <Sphere args={[1.8, 32, 32]} position={[3, -2.5, 0]}><meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} transmission={0.9} /></Sphere>
         </animated.group>
      )}

      {/* X CHROMOSOMES */}
      {/* Pair 1 (Large) */}
      <animated.group position-x={pX.to(p => p < 2 ? -p : -3)} position-y={sY.to(y => y)}>
         {/* Top arms */}
         <mesh position={[0.5, 0.8, 0]} rotation={[0,0,Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><animated.meshStandardMaterial color={swapCol.to(s=>`rgba(${255}, ${77}, ${109}, 1)`)} /></mesh>
         <mesh position={[-0.5, 0.8, 0]} rotation={[0,0,-Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><animated.meshStandardMaterial color={swapCol.to(s=>`rgba(${Math.round(255 - 200*s)}, ${Math.round(77 + 100*s)}, ${Math.round(109 + 100*s)}, 1)`)} /></mesh>
         {/* Bottom arms */}
         <mesh position={[0.5, -0.8, 0]} rotation={[0,0,-Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><meshStandardMaterial color="#ff4d6d" /></mesh>
         <mesh position={[-0.5, -0.8, 0]} rotation={[0,0,Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><animated.meshStandardMaterial color={swapCol.to(s=>`rgba(${255}, ${77}, ${109}, 1)`)} /></mesh>
         {/* Centromere */}
         <Sphere args={[0.2]}><meshStandardMaterial color="#fff" /></Sphere>
      </animated.group>

      {/* Pair 1 Homolog (Large Blue) */}
      <animated.group position-x={pX.to(p => p < 2 ? p : 3)} position-y={sY.to(y => y)}>
         {/* Top arms */}
         <mesh position={[-0.5, 0.8, 0]} rotation={[0,0,-Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><animated.meshStandardMaterial color={swapCol.to(s=>`rgba(${56}, ${189}, ${248}, 1)`)} /></mesh>
         <mesh position={[0.5, 0.8, 0]} rotation={[0,0,Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><animated.meshStandardMaterial color={swapCol.to(s=>`rgba(${Math.round(56 + 150*s)}, ${Math.round(189 - 100*s)}, ${Math.round(248 - 100*s)}, 1)`)} /></mesh>
         {/* Bottom arms */}
         <mesh position={[-0.5, -0.8, 0]} rotation={[0,0,Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><meshStandardMaterial color="#38bdf8" /></mesh>
         <mesh position={[0.5, -0.8, 0]} rotation={[0,0,-Math.PI/6]}><cylinderGeometry args={[0.1,0.1,1.5]}/><animated.meshStandardMaterial color={swapCol.to(s=>`rgba(${56}, ${189}, ${248}, 1)`)} /></mesh>
         <Sphere args={[0.2]}><meshStandardMaterial color="#fff" /></Sphere>
      </animated.group>

      {/* Pair 2 (Small Red) */}
      <animated.group position-x={pX.to(p => p < 2 ? -p : -3)} position-y={sY.to(y => -y)}>
         <mesh position={[0.4, 0.4, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#fca5a5" /></mesh>
         <mesh position={[-0.4, 0.4, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#fca5a5" /></mesh>
         <mesh position={[0.4, -0.4, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#fca5a5" /></mesh>
         <mesh position={[-0.4, -0.4, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#fca5a5" /></mesh>
         <Sphere args={[0.15]}><meshStandardMaterial color="#fff" /></Sphere>
      </animated.group>

      {/* Pair 2 Homolog (Small Cyan) */}
      <animated.group position-x={pX.to(p => p < 2 ? p : 3)} position-y={sY.to(y => -y)}>
         <mesh position={[-0.4, 0.4, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#7dd3fc" /></mesh>
         <mesh position={[0.4, 0.4, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#7dd3fc" /></mesh>
         <mesh position={[-0.4, -0.4, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#7dd3fc" /></mesh>
         <mesh position={[0.4, -0.4, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.08,0.08,1]}/><meshStandardMaterial color="#7dd3fc" /></mesh>
         <Sphere args={[0.15]}><meshStandardMaterial color="#fff" /></Sphere>
      </animated.group>

      {/* Labels */}
      {config.currentStep === 0 && (
         <Html position={[0, -5, 0]} center><div style={{ color:'#e0eaff', fontSize:'14px', fontWeight:'bold' }}>Diploid Parent Cell (2n = 4)</div></Html>
      )}
      {config.currentStep === 2 && (
         <Html position={[0, -4, 0]} center><div style={{ color:'#e0eaff', fontSize:'14px', fontWeight:'bold', display:'flex', gap:'120px' }}>
            <span>Haploid (n = 2)</span>
            <span>Haploid (n = 2)</span>
         </div></Html>
      )}
      {config.currentStep >= 4 && (
         <Html position={[0, 0, 0]} center><div style={{ color:'#e0eaff', fontSize:'24px', fontWeight:'bold', letterSpacing:'4px' }}>4 Gametes Generated</div></Html>
      )}

      {/* UI Overlay */}
      <Html position={[0, 5, 0]} center>
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
