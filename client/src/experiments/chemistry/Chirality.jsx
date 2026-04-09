import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// Tetrahedral molecule builder
const Molecule = ({ type = 'chiral', opacity = 1 }) => {
   // Center Carbon
   // 4 Substituents: 
   // Chiral: Red, Blue, Green, Yellow
   // Achiral: Red, Blue, Blue, Blue
   const colors = type === 'chiral' 
       ? ['#ff4d6d', '#00e5ff', '#22c55e', '#facc15']
       : ['#ff4d6d', '#00e5ff', '#00e5ff', '#00e5ff']; // Example: CH3X
   
   const positions = [
       [0, 1.5, 0],
       [0, -0.5, 1.414],
       [1.22, -0.5, -0.707],
       [-1.22, -0.5, -0.707]
   ];

   return (
       <group>
           <Sphere args={[0.5, 32, 32]}><meshStandardMaterial color="#475569" transparent opacity={opacity} /></Sphere>
           {positions.map((p, i) => {
               const pos = new THREE.Vector3(...p);
               const up = new THREE.Vector3(0,1,0);
               const quat = new THREE.Quaternion().setFromUnitVectors(up, pos.clone().normalize());
               const len = pos.length();
               return (
                   <group key={i}>
                       <mesh position={pos.clone().multiplyScalar(0.5)} quaternion={quat}>
                           <cylinderGeometry args={[0.1, 0.1, len]} />
                           <meshStandardMaterial color="#cbd5e1" transparent opacity={opacity} />
                       </mesh>
                       <Sphere args={[0.4, 32, 32]} position={pos}>
                           <meshStandardMaterial color={colors[i]} transparent opacity={opacity} />
                       </Sphere>
                   </group>
               );
           })}
       </group>
   );
};

export default function Chirality({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { type: 'chiral', showMirror: 0, showImage: 0, superimpose: 0, label: "Chiral Molecule", desc: "A Carbon atom bonded to 4 DIFFERENT groups." },
    { type: 'chiral', showMirror: 1, showImage: 0, superimpose: 0, label: "Mirror Plane", desc: "A plane of reflection is established." },
    { type: 'chiral', showMirror: 1, showImage: 1, superimpose: 0, label: "Enantiomer (Mirror Image)", desc: "Its mirror image is formed. They are a pair of Enantiomers." },
    { type: 'chiral', showMirror: 1, showImage: 1, superimpose: 1, label: "Non-Superimposable", desc: "No matter how you rotate it, the mirror image CANNOT perfectly overlap the original!" },
    { type: 'achiral', showMirror: 1, showImage: 1, superimpose: 1, label: "Achiral Comparison", desc: "If we change to 3 identical groups, it IS superimposable. It has a plane of symmetry." },
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { opMirror, scaleImage, supMerge } = useSpring({
      opMirror: config.showMirror,
      scaleImage: config.showImage,
      supMerge: config.superimpose,
      config: { tension: 60, friction: 15 }
  });

  const origRef = useRef();
  const mirrorRef = useRef();

  useFrame((state, delta) => {
     // Slow rotation to show 3D nature
     if (origRef.current && config.superimpose === 0) {
         origRef.current.rotation.y += delta * 0.5;
         if (mirrorRef.current) mirrorRef.current.rotation.y += delta * 0.5;
     } else if (config.superimpose === 1 && origRef.current) {
         // Stop rotation and explicitly align them to try to superimpose
         origRef.current.rotation.y = THREE.MathUtils.lerp(origRef.current.rotation.y, 0, 0.1);
         if (mirrorRef.current) {
            // A chiral molecule mirror image requires a 180 flip to match top/bottom, but then sides mismatch!
            mirrorRef.current.rotation.y = THREE.MathUtils.lerp(mirrorRef.current.rotation.y, Math.PI, 0.1);
         }
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      
      {/* Original Molecule */}
      <animated.group position-x={supMerge.to(s => -4 + s*4)} ref={origRef}>
         <Molecule type={config.type} />
      </animated.group>

      {/* Mirror Plane */}
      <animated.mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]} scale={opMirror}>
         <planeGeometry args={[8, 8]} />
         <animated.meshPhysicalMaterial color="#00e5ff" transparent opacity={opMirror.to(o => o*0.2)} side={THREE.DoubleSide} roughness={0} metalness={0.1} transmission={0.9} />
         <Html position={[0, 4.5, 0]} center><div style={{ color: '#00e5ff', fontSize: '12px' }}>Mirror Plane</div></Html>
      </animated.mesh>

      {/* Mirror Image */}
      <animated.group scale={scaleImage} position-x={supMerge.to(s => 4 - s*4)} ref={mirrorRef}>
         {/* We flip the local scale X to literally mirror it geometrically */}
         <group scale-x={-1}>
            <Molecule type={config.type} opacity={0.6} /> {/* Slightly ghosted so we can see overlap */}
         </group>
      </animated.group>

      {/* Cross mark if they don't superimpose */}
      {config.currentStep === 3 && (
         <Html position={[0, 3, 0]} center>
            <div style={{ color: '#ff4d6d', fontSize: '24px', fontWeight: 'bold', background: 'rgba(0,0,0,0.8)', padding: '8px 16px', borderRadius: '8px', border: '2px solid #ff4d6d' }}>
               ❌ MISMATCH!
               <div style={{ fontSize: '10px', marginTop: '4px' }}>Colors don't align</div>
            </div>
         </Html>
      )}

      {/* Check mark if they DO superimpose */}
      {config.currentStep === 4 && (
         <Html position={[0, 3, 0]} center>
            <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold', background: 'rgba(0,0,0,0.8)', padding: '8px 16px', borderRadius: '8px', border: '2px solid #22c55e' }}>
               ✅ PERFECT MATCH!
               <div style={{ fontSize: '10px', marginTop: '4px' }}>Achiral Superimposable</div>
            </div>
         </Html>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3, 0]} />
    </group>
  );
}
