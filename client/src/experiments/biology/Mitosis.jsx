import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Tube } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class SpindleFiber extends THREE.Curve {
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
  }
  getPoint(t) {
    return new THREE.Vector3().copy(this.start).lerp(this.end, t);
  }
}

export default function Mitosis({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { cellWidth: 1.0, nucleiOp: 1, cState: 0, label: "Interphase", desc: "Cell grows. DNA replicates (chromatin) inside the intact nucleus." },
    { cellWidth: 1.0, nucleiOp: 0, cState: 1, label: "Prophase", desc: "Chromatin condenses into visible X-shaped chromosomes. Nuclear envelope breaks down." },
    { cellWidth: 1.0, nucleiOp: 0, cState: 2, label: "Metaphase", desc: "Chromosomes line up along the equatorial plate. Spindle fibers attach." },
    { cellWidth: 1.2, nucleiOp: 0, cState: 3, label: "Anaphase", desc: "Sister chromatids are pulled apart to opposite poles by spindle fibers." },
    { cellWidth: 1.6, nucleiOp: 1, cState: 4, label: "Telophase & Cytokinesis", desc: "Nuclear envelopes reform. Cell pinches and splits into two identical daughter cells." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { cxScale, nuOp, stateAnim } = useSpring({
    cxScale: config.cellWidth,
    nuOp: config.nucleiOp,
    stateAnim: config.cState,
    config: { tension: 60, friction: 15 }
  });

  const numChromosomes = 4;
  const grpRef = useRef();

  useFrame((state, delta) => {
     if (grpRef.current) {
         // Subtle breathing idle animation
         grpRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -10, -5]} intensity={0.5} color="#ffffff" />

      <group ref={grpRef}>
         
         {/* CELL MEMBRANE (Squishing via scaleX) */}
         <animated.mesh scale-x={cxScale}>
            {/* The pinch effect during step 4 can be simulated via scaling + secondary negative shape, 
                but using a transparent elongated sphere gives the general cell shape. */}
            <sphereGeometry args={[3, 32, 32]} />
            <meshPhysicalMaterial color="#c084fc" transparent opacity={0.15} wireframe={false} roughness={0.1} transmission={0.9} />
         </animated.mesh>
         
         {/* Wireframe outline to show boundary better */}
         <animated.mesh scale-x={cxScale}>
            <sphereGeometry args={[3.05, 16, 16]} />
            <meshBasicMaterial color="#c084fc" transparent opacity={0.1} wireframe />
         </animated.mesh>

         {/* NUCLEUS (or two nuclei in step 4) */}
         <animated.group opacity={nuOp} transparent visible={nuOp.to(v => v > 0.05)}>
            {/* Center Nucleus (Step 0) */}
            <animated.mesh position={[0,0,0]} scale={stateAnim.to(s => s < 2 ? 1 : 0)}>
               <sphereGeometry args={[1.5, 32, 32]} />
               <meshPhysicalMaterial color="#ff4d6d" transparent opacity={0.5} transmission={0.9} />
            </animated.mesh>

            {/* Two new Nuclei (Step 4) */}
            <animated.mesh position-x={-2.2} scale={stateAnim.to(s => s >= 3.5 ? 1 : 0)}>
               <sphereGeometry args={[1.2, 32, 32]} />
               <meshPhysicalMaterial color="#ff4d6d" transparent opacity={0.5} transmission={0.9} />
            </animated.mesh>
            <animated.mesh position-x={2.2} scale={stateAnim.to(s => s >= 3.5 ? 1 : 0)}>
               <sphereGeometry args={[1.2, 32, 32]} />
               <meshPhysicalMaterial color="#ff4d6d" transparent opacity={0.5} transmission={0.9} />
            </animated.mesh>
         </animated.group>

         {/* CHROMOSOMES & SPINDLES */}
         <animated.group visible={stateAnim.to(s => s > 0.5)}>
            {[...Array(numChromosomes)].map((_, i) => {
               const offset = (i - 1.5) * 0.8; // Z-axis alignment

               // Step 1: Randomish positions
               const p1 = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), offset);
               // Step 2: Equatorial plate (y=0, x=0, z aligned)
               const p2 = new THREE.Vector3(0, 0, offset);
               // Step 3/4: Separated (x moves to left/right poles)
               const p3Left = new THREE.Vector3(-2.2, 0, offset);
               const p3Right = new THREE.Vector3(2.2, 0, offset);

               return (
                  <group key={`ch-${i}`}>
                     
                     {/* Left Chromatid */}
                     <animated.group position={stateAnim.to(s => {
                         if(s < 2) return p1.clone().lerp(p2, s-1);
                         if(s < 3) return p2;
                         return p2.clone().lerp(p3Left, s-3);
                     })}
                     rotation-z={stateAnim.to(s => s >= 3 ? -Math.PI/4 : 0)}>
                        <mesh rotation={[0,0,Math.PI/6]}>
                           <cylinderGeometry args={[0.08, 0.08, 1]} />
                           <meshStandardMaterial color="#f43f5e" />
                        </mesh>
                     </animated.group>

                     {/* Right Chromatid */}
                     <animated.group position={stateAnim.to(s => {
                         if(s < 2) return p1.clone().lerp(p2, s-1);
                         if(s < 3) return p2;
                         return p2.clone().lerp(p3Right, s-3);
                     })}
                     rotation-z={stateAnim.to(s => s >= 3 ? Math.PI/4 : 0)}>
                        <mesh rotation={[0,0,-Math.PI/6]}>
                           <cylinderGeometry args={[0.08, 0.08, 1]} />
                           <meshStandardMaterial color="#f43f5e" />
                        </mesh>
                     </animated.group>

                     {/* Spindle Fibers (visible steps 2 & 3) */}
                     {config.cState >= 2 && config.cState < 4 && (
                        <animated.group opacity={stateAnim.to(s => s >= 2 && s < 4 ? 1 : 0)} transparent>
                           <Line points={[[-3, 0, 0], config.cState === 2 ? p2 : p3Left]} color="#e0eaff" transparent opacity={0.5} lineWidth={1} />
                           <Line points={[[3, 0, 0], config.cState === 2 ? p2 : p3Right]} color="#e0eaff" transparent opacity={0.5} lineWidth={1} />
                        </animated.group>
                     )}
                  </group>
               )
            })}
         </animated.group>

         {/* Centrosomes (Poles) */}
         <animated.group visible={stateAnim.to(s => s > 1)}>
            <Sphere args={[0.15, 16, 16]} position={[-2.8, 0, 0]}><meshStandardMaterial color="#facc15" /></Sphere>
            <Sphere args={[0.15, 16, 16]} position={[2.8, 0, 0]}><meshStandardMaterial color="#facc15" /></Sphere>
         </animated.group>
      </group>

      {/* UI Overlay */}
      <Html position={[0, -4.5, 0]} center>
         <div style={{
           background: 'rgba(6,8,15,0.9)', border: '1px solid #c084fc', borderRadius: '8px',
           padding: '10px 16px', color: '#e0eaff', fontFamily: 'Space Mono, monospace',
           fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'center'
         }}>
           <div style={{ color: '#c084fc', fontWeight: 700, marginBottom: '4px' }}>
             {config.label}
           </div>
           <div style={{ color: '#4a5a7a', fontSize: '10px', whiteSpace: 'normal', maxWidth: '300px' }}>{config.description}</div>
         </div>
      </Html>

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
}

const Line = ({ points, color, opacity, lineWidth }) => {
   const lineGeom = new THREE.BufferGeometry().setFromPoints(Array.isArray(points[0]) ? points.map(p => new THREE.Vector3(...p)) : points);
   return (
      <line geometry={lineGeom}>
         <lineBasicMaterial color={color} transparent opacity={opacity} linewidth={lineWidth} />
      </line>
   )
}
