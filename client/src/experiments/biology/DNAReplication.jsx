import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube, Cylinder, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class StraightStrand extends THREE.Curve {
   constructor(xOff) {
      super();
      this.xOff = xOff;
   }
   getPoint(t) {
      return new THREE.Vector3(this.xOff, t*16 - 8, 0);
   }
}

export default function DNAReplication({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { forkY: 8, helScale: 0, newBaseOp: 0, forkOp: 0, label: "Double Helix (Unwound for clarity)", desc: "DNA prior to replication. 5' to 3' and 3' to 5' strands are bonded." },
    { forkY: 8, helScale: 1, newBaseOp: 0, forkOp: 0, label: "Helicase Binds", desc: "DNA Helicase enzyme begins at the Origin of Replication." },
    { forkY: 0, helScale: 1, newBaseOp: 0, forkOp: 1, label: "Replication Fork Forms", desc: "Helicase unzips the hydrogen bonds, creating a replication fork." },
    { forkY: 0, helScale: 1, newBaseOp: 1, forkOp: 1, label: "DNA Polymerase Synthesizes", desc: "Polymerase adds matching nucleotides (A-T, G-C) to the leading strand continuously." },
    { forkY: -8, helScale: 0, newBaseOp: 1, forkOp: 1, label: "Semi-Conservative Result", desc: "Two identical DNA molecules! Each contains one old strand and one new strand." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { fY, hScale, bOp, fOp } = useSpring({
      fY: config.forkY,
      hScale: config.helScale,
      bOp: config.newBaseOp,
      fOp: config.forkOp,
      config: { tension: 40, friction: 14 }
  });

  const numBPs = 20;

  // We are going to build the strands explicitly without curve mapping due to the dynamic fork split
  // For each base, if its Y > fY (unzipped), it moves outward X.
  
  const bases = useMemo(() => {
     const bs = [];
     for(let i=0; i<numBPs; i++) {
        const y = (i / (numBPs-1)) * 16 - 8;
        const isAT = Math.random() > 0.5;
        bs.push({ id: i, y, isAT });
     }
     return bs;
  }, []);

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      
      {/* Old Strands */}
      <group>
         {bases.map(b => (
            <group key={`old-${b.id}`}>
               
               {/* Left Old Strand (Blue) */}
               <animated.group position-x={fY.to(yVal => b.y > yVal ? -2 : -1.5)} position-y={b.y}>
                  <mesh>
                     <sphereGeometry args={[0.2, 8, 8]} />
                     <meshStandardMaterial color="#3b82f6" />
                  </mesh>
                  {/* Base projecting right */}
                  <mesh position={[0.75, 0, 0]} rotation={[0,0,Math.PI/2]}>
                     <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                     <meshStandardMaterial color={b.isAT ? "#facc15" : "#22c55e"} />
                  </mesh>

                  {/* New Strand (Left side complementary) - Appears on Step 3/4 */}
                  <animated.group opacity={bOp} transparent visible={bOp.to(v=>v>0.1)}>
                     <animated.mesh position-x={fY.to(yV => b.y > yV ? 1.5 : 0)} scale={fY.to(yV => b.y > yV ? 1 : 0.01)}>
                         <sphereGeometry args={[0.2, 8, 8]} />
                         <meshStandardMaterial color="#4ade80" /> {/* New backbone is green */}
                     </animated.mesh>
                     <animated.mesh position-x={fY.to(yV => b.y > yV ? 0.75 : 0)} scale={fY.to(yV => b.y > yV ? 1 : 0.01)} rotation={[0,0,Math.PI/2]}>
                         <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                         <meshStandardMaterial color={b.isAT ? "#fb923c" : "#60a5fa"} />
                     </animated.mesh>
                  </animated.group>
               </animated.group>

               {/* Right Old Strand (Red) */}
               <animated.group position-x={fY.to(yVal => b.y > yVal ? 2 : 1.5)} position-y={b.y}>
                  <mesh>
                     <sphereGeometry args={[0.2, 8, 8]} />
                     <meshStandardMaterial color="#ef4444" />
                  </mesh>
                  {/* Base projecting left */}
                  <mesh position={[-0.75, 0, 0]} rotation={[0,0,Math.PI/2]}>
                     <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                     <meshStandardMaterial color={b.isAT ? "#fb923c" : "#60a5fa"} />
                  </mesh>

                  {/* New Strand (Right side complementary) */}
                  <animated.group opacity={bOp} transparent visible={bOp.to(v=>v>0.1)}>
                     <animated.mesh position-x={fY.to(yV => b.y > yV ? -1.5 : 0)} scale={fY.to(yV => b.y > yV ? 1 : 0.01)}>
                         <sphereGeometry args={[0.2, 8, 8]} />
                         <meshStandardMaterial color="#fcd34d" /> {/* Different new backbone */}
                     </animated.mesh>
                     <animated.mesh position-x={fY.to(yV => b.y > yV ? -0.75 : 0)} scale={fY.to(yV => b.y > yV ? 1 : 0.01)} rotation={[0,0,Math.PI/2]}>
                         <cylinderGeometry args={[0.1, 0.1, 1.5]} />
                         <meshStandardMaterial color={b.isAT ? "#facc15" : "#22c55e"} />
                     </animated.mesh>
                  </animated.group>
               </animated.group>

            </group>
         ))}
      </group>

      {/* Backbone Lines (Drawing vertical cylinders between points is tedious, so we omit for clarity, spheres work fine) */}
      
      {/* Helicase Enzyme */}
      <animated.mesh position-y={fY} scale={hScale}>
         <sphereGeometry args={[0.8, 32, 32]} />
         <meshStandardMaterial color="#f97316" transparent opacity={0.8} />
         <Html position={[1.5, 0, 0]} center>
            <div style={{ color: '#f97316', fontWeight:'bold', fontSize:'12px', background:'#000', padding:'2px', borderRadius:'4px' }}>Helicase</div>
         </Html>
      </animated.mesh>

      {/* DNA Polymerase placeholder (just floating near the fork if unzipping) */}
      {config.currentStep === 3 && (
         <animated.mesh position-y={fY.to(y => y + 2)} position-x={-2}>
            <boxGeometry args={[1, 1.5, 1]} />
            <meshStandardMaterial color="#8b5cf6" />
            <Html position={[-1, 1, 0]} center>
               <div style={{ color: '#c4b5fd', fontWeight:'bold', fontSize:'10px' }}>DNA Polymerase</div>
            </Html>
         </animated.mesh>
      )}

      {/* UI Overlay */}
      <Html position={[0, -5, 0]} center>
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
