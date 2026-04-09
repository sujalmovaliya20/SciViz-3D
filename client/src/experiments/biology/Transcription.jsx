import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube, Cylinder, Html, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function Transcription({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { polX: -6, forkOpen: 0, rnaLen: 0, rnaOut: 0, label: "DNA in Nucleus", desc: "A segment of DNA double helix." },
    { polX: -4, forkOpen: 0, rnaLen: 0, rnaOut: 0, label: "RNA Polymerase Binds", desc: "Enzyme binds to the promoter region to start transcription." },
    { polX: -2, forkOpen: 1, rnaLen: 0.1, rnaOut: 0, label: "Initiation & Unwinding", desc: "Polymerase unwinds DNA locally, creating a transcription bubble." },
    { polX: 2, forkOpen: 1, rnaLen: 0.8, rnaOut: 0, label: "Elongation", desc: "mRNA strand grows 5'→3' using the template strand (U replaces T)." },
    { polX: 5, forkOpen: 0, rnaLen: 1, rnaOut: 1, label: "Termination & Processing", desc: "mRNA detaches, DNA rewinds. mRNA exits nucleus via nuclear pore." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { pX, openVal, rLen, rOut } = useSpring({
      pX: config.polX,
      openVal: config.forkOpen,
      rLen: config.rnaLen,
      rOut: config.rnaOut,
      config: { tension: 60, friction: 15 }
  });

  const numBPs = 30;
  const dnaBases = useMemo(() => {
     const bs = [];
     for(let i=0; i<numBPs; i++) {
        const x = (i / (numBPs-1)) * 16 - 8;
        bs.push({ id: i, x });
     }
     return bs;
  }, []);

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      
      {/* NUCLEUS BACKGROUND */}
      <mesh position={[0, 0, -4]}>
         <planeGeometry args={[25, 10]} />
         <meshBasicMaterial color="#4c1d95" transparent opacity={0.3} />
         <Html position={[-6, 4, 0]} center><div style={{color:'#c4b5fd', fontSize:'14px', fontWeight:'bold'}}>Inside Nucleus</div></Html>
      </mesh>

      {/* NUCLEAR PORE (Step 4) */}
      <animated.group position={[0, -5, 0]} scale={rOut} visible={rOut.to(v => v>0)}>
          <mesh rotation={[Math.PI/2, 0, 0]}>
             <torusGeometry args={[1.5, 0.4, 16, 32]} />
             <meshStandardMaterial color="#c4b5fd" />
             <Html position={[2.5,0,0]} center><div style={{color:'#c4b5fd', fontSize:'12px'}}>Nuclear Pore</div></Html>
          </mesh>
      </animated.group>

      {/* DNA HELIX */}
      <group>
         {dnaBases.map((b) => {
            // Unwinding logic: if x is close to pX, open up!
            return (
               <animated.group key={`base-${b.id}`} position-x={b.x} 
                  position-y={openVal.to(ov => Math.abs(b.x - pX.get()) < 2 ? ov*1 : 0)}>
                  {/* Top Strand (Coding) */}
                  <animated.mesh position-y={openVal.to(ov => {
                     const distance = Math.abs(b.x - pX.get());
                     const bulge = Math.max(0, 1.5 - distance);
                     return bulge * ov;
                  })}>
                     <sphereGeometry args={[0.2, 8, 8]} />
                     <meshStandardMaterial color="#3b82f6" />
                     <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[0.08,0.08,0.8]} /><meshStandardMaterial color="#94a3b8"/></mesh>
                  </animated.mesh>
                  
                  {/* Bottom Strand (Template) */}
                  <animated.mesh position-y={openVal.to(ov => {
                     const distance = Math.abs(b.x - pX.get());
                     const bulge = Math.max(0, 1.5 - distance);
                     return -bulge * ov;
                  })}>
                     <sphereGeometry args={[0.2, 8, 8]} />
                     <meshStandardMaterial color="#ef4444" />
                     <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.08,0.08,0.8]} /><meshStandardMaterial color="#94a3b8"/></mesh>
                  </animated.mesh>
               </animated.group>
            )
         })}
      </group>

      {/* RNA POLYMERASE */}
      <animated.group position-x={pX} position-z={0.5}>
          <mesh>
             <sphereGeometry args={[1.8, 32, 32]} />
             <meshStandardMaterial color="#f59e0b" transparent opacity={0.6} />
             <Html position={[0, 2.5, 0]} center><div style={{color:'#fcd34d', fontWeight:'bold', fontSize:'12px', background:'#000', padding:'2px', borderRadius:'4px'}}>RNA Polymerase</div></Html>
          </mesh>
      </animated.group>

      {/* mRNA STRAND */}
      <animated.group visible={rLen.to(r => r > 0)}>
         {/* During synthesis, trails out of polymerase */}
         {/* If step 4 (rOut=1), it detaches and moves down through the pore */}
         <animated.group 
            position-y={rOut.to(ro => ro * -8)} // moves down completely
         >
             <animated.mesh position-x={pX.to(px => px - 2)} position-y={-1.5} rotation={[0,0,Math.PI/2]} scale-y={rLen.to(l => l*6)}>
                <cylinderGeometry args={[0.15, 0.15, 1]} />
                <meshStandardMaterial color="#f97316" />
             </animated.mesh>
             <animated.mesh position-x={pX.to(px => px - 2 - rLen.get()*3)}>
                <Html center><div style={{ color: '#fed7aa', fontWeight:'bold', fontSize:'12px', marginTop:'-10px' }}>mRNA (5')</div></Html>
             </animated.mesh>
         </animated.group>
      </animated.group>

      {/* UI Overlay */}
      <Html position={[0, -6, 0]} center>
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
