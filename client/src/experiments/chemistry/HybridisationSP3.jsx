import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// An Sp3 orbital lobe primitive (asymmetric balloon) using points
const sp3Points = [];
for (let i = 0; i <= 20; i++) {
  const t = i / 20;
  // A shape that bulges primarily on positive y side
  const r = Math.sin(t * Math.PI) * (1 - t * 0.5) * 1.5; 
  const y = t * 4 - 0.5; // Offset slightly below zero for the minor lobe
  sp3Points.push(new THREE.Vector2(r, y));
}
const sp3Geometry = new THREE.LatheGeometry(sp3Points, 32);

export default function HybridisationSP3({ currentStep = 0 }) {

  const stepConfigs = [
    { showUn: 1, showHy: 0, showH: 0, showSp2: 0, showSp: 0, label: "Atomic Orbitals (Carbon)", desc: "Carbon's valence shell: one 2s orbital and three 2p orbitals (unhybridized)." },
    { showUn: 0, showHy: 1, showH: 0, showSp2: 0, showSp: 0, label: "sp³ Hybridization", desc: "The s and 3p orbitals mix to form 4 equivalent sp³ hybrid orbitals (Tetrahedral)." },
    { showUn: 0, showHy: 1, showH: 1, showSp2: 0, showSp: 0, label: "Methane (CH₄) Formation", desc: "Four Hydrogen 1s orbitals overlap with the sp³ orbitals forming sigma bonds." },
    { showUn: 0, showHy: 0, showH: 0, showSp2: 1, showSp: 0, label: "sp² Hybridization (Comparison)", desc: "Trigonal planar geometry (120°). 1 unhybridized p-orbital remains." },
    { showUn: 0, showHy: 0, showH: 0, showSp2: 0, showSp: 1, label: "sp Hybridization (Comparison)", desc: "Linear geometry (180°). 2 unhybridized p-orbitals remain." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { opUn, opHy, scaleH, opSp2, opSp } = useSpring({
    opUn: config.showUn,
    opHy: config.showHy,
    scaleH: config.showH,
    opSp2: config.showSp2,
    opSp: config.showSp,
    config: { tension: 60, friction: 15 }
  });

  const grpRef = useRef();
  useFrame((state, delta) => {
     if(grpRef.current) {
        grpRef.current.rotation.y += delta * 0.3;
        grpRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-5, -10, -5]} intensity={0.5} color="#ffffff" />
      
      <group ref={grpRef}>
         {/* Central Carbon */}
         <Sphere args={[0.5, 32, 32]}>
            <meshStandardMaterial color="#475569" metalness={0.2} />
         </Sphere>

         {/* UNHYBRIDIZED ORBITALS */}
         <animated.group scale={opUn} opacity={opUn} transparent>
            {/* 2s Orbital (Sphere) */}
            <Sphere args={[1.5, 32, 32]} position={[0,0,0]}>
               <meshPhysicalMaterial color="#ff4d6d" transparent opacity={0.3} transmission={0.9} roughness={0.1} />
            </Sphere>
            {/* 2p Orbitals (Dumbbells) */}
            {/* Px */}
            <mesh position={[1.5,0,0]} rotation={[0,0,-Math.PI/2]}>
               <capsuleGeometry args={[0.6, 2, 16, 16]} />
               <meshPhysicalMaterial color="#00e5ff" transparent opacity={0.4} transmission={0.9} />
            </mesh>
            {/* Py */}
            <mesh position={[0,1.5,0]} rotation={[0,0,0]}>
               <capsuleGeometry args={[0.6, 2, 16, 16]} />
               <meshPhysicalMaterial color="#22c55e" transparent opacity={0.4} transmission={0.9} />
            </mesh>
            {/* Pz */}
            <mesh position={[0,0,1.5]} rotation={[Math.PI/2,0,0]}>
               <capsuleGeometry args={[0.6, 2, 16, 16]} />
               <meshPhysicalMaterial color="#facc15" transparent opacity={0.4} transmission={0.9} />
            </mesh>
         </animated.group>

         {/* SP3 HYBRIDIZED */}
         <animated.group scale={opHy} opacity={opHy} transparent>
            {[
              [0, 1.91, 0], // roughly tetrahedral angles from center
              [0, -0.63, 1.79],
              [-1.55, -0.63, -0.89],
              [1.55, -0.63, -0.89]
            ].map((dir, i) => {
               const v = new THREE.Vector3(...dir).normalize();
               const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), v);
               return (
                  <group key={`sp3-${i}`}>
                     <mesh quaternion={quat}>
                        <primitive object={sp3Geometry} />
                        <animated.meshPhysicalMaterial color="#c084fc" transparent opacity={opHy.to(o => o*0.6)} transmission={0.9} roughness={0} />
                     </mesh>
                     {/* Hydrogen Bonds (1s overlap) */}
                     <animated.mesh position={v.clone().multiplyScalar(4)} scale={scaleH}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial color="#fff" />
                     </animated.mesh>
                  </group>
               );
            })}
         </animated.group>

         {/* SP2 HYBRIDIZED (Trigonal Planar + 1 p) */}
         <animated.group scale={opSp2} opacity={opSp2} transparent>
            {/* 3 sp2 orbitals */}
            {[ [0,1,0], [Math.sin(2*Math.PI/3), Math.cos(2*Math.PI/3), 0], [Math.sin(4*Math.PI/3), Math.cos(4*Math.PI/3), 0] ].map((dir, i) => {
               const v = new THREE.Vector3(...dir).normalize();
               const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), v);
               return (
                  <mesh key={`sp2-${i}`} quaternion={quat}>
                     <primitive object={sp3Geometry} />
                     <animated.meshPhysicalMaterial color="#facc15" transparent opacity={opSp2.to(o=>o*0.6)} transmission={0.9} />
                  </mesh>
               )
            })}
            {/* 1 unhybridized p orbital (vertical Z axis) */}
            <mesh rotation={[Math.PI/2,0,0]}>
               <capsuleGeometry args={[0.6, 4, 16, 16]} />
               <animated.meshPhysicalMaterial color="#00e5ff" transparent opacity={opSp2.to(o=>o*0.4)} transmission={0.9} />
            </mesh>
         </animated.group>

         {/* SP HYBRIDIZED (Linear + 2 p) */}
         <animated.group scale={opSp} opacity={opSp} transparent>
            {/* 2 sp orbitals */}
            {[ [-1,0,0], [1,0,0] ].map((dir, i) => {
               const v = new THREE.Vector3(...dir).normalize();
               const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), v);
               return (
                  <mesh key={`sp-${i}`} quaternion={quat}>
                     <primitive object={sp3Geometry} />
                     <animated.meshPhysicalMaterial color="#ff4d4d" transparent opacity={opSp.to(o=>o*0.6)} transmission={0.9} />
                  </mesh>
               )
            })}
            {/* 2 unhybridized p orbitals (Y and Z axes) */}
            <mesh rotation={[0,0,0]}>
               <capsuleGeometry args={[0.6, 4, 16, 16]} />
               <animated.meshPhysicalMaterial color="#00e5ff" transparent opacity={opSp.to(o=>o*0.4)} transmission={0.9} />
            </mesh>
            <mesh rotation={[Math.PI/2,0,0]}>
               <capsuleGeometry args={[0.6, 4, 16, 16]} />
               <animated.meshPhysicalMaterial color="#22c55e" transparent opacity={opSp.to(o=>o*0.4)} transmission={0.9} />
            </mesh>
         </animated.group>
      </group>

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
