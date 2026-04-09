import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function ElectrolysisWater({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { iFlow: 0, showMolecules: 0, splitActive: 0, gasLevel: 0, label: "Electrolysis of Water", desc: "Two electrodes in water, connected to a battery. No current flowing." },
    { iFlow: 1, showMolecules: 1, splitActive: 0, gasLevel: 0, label: "Current Active & Molecules", desc: "Water is composed of H₂O molecules." },
    { iFlow: 1, showMolecules: 0, splitActive: 1, gasLevel: 0, label: "Splitting Water", desc: "H₂O splits into H⁺ (moves to Cathode) and OH⁻/O²⁻ (moves to Anode)." },
    { iFlow: 1, showMolecules: 0, splitActive: 1, gasLevel: 1, label: "Gas Formation", desc: "Bubbles of Hydrogen (cathode) and Oxygen (anode) rise." },
    { iFlow: 1, showMolecules: 0, splitActive: 1, gasLevel: 2, label: "2:1 Gas Ratio", desc: "Over time, Hydrogen volume is exactly 2x Oxygen volume (H₂O)." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { opaMolecules, opaBubbles, iVol, hGasY, oGasY } = useSpring({
    opaMolecules: config.showMolecules,
    opaBubbles: config.splitActive,
    iVol: config.iFlow,
    hGasY: config.gasLevel > 0 ? (config.gasLevel === 2 ? 3.0 : 1.5) : 0, // Hydrogen gets 2x volume
    oGasY: config.gasLevel > 0 ? (config.gasLevel === 2 ? 1.5 : 0.75) : 0, // Oxygen gets 1x volume
    config: { tension: 60, friction: 15 }
  });

  const hBubbleCount = 80; // 2x bubbles
  const oBubbleCount = 40; // 1x bubbles
  const hBubblesRef = useRef();
  const oBubblesRef = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random starting data for bubbles
  const bubbleData = useMemo(() => {
    const hData = [];
    const oData = [];
    for(let i=0; i<hBubbleCount; i++) hData.push({ y: Math.random() * 4, speed: 1 + Math.random(), xOff: (Math.random()-0.5)*0.6, zOff: (Math.random()-0.5)*0.6 });
    for(let i=0; i<oBubbleCount; i++) oData.push({ y: Math.random() * 4, speed: 1 + Math.random(), xOff: (Math.random()-0.5)*0.6, zOff: (Math.random()-0.5)*0.6 });
    return { hData, oData };
  }, []);

  useFrame((state, delta) => {
    if (isPlaying && config.splitActive) {
       // Animate H bubbles (Cathode is left, x=-2)
       if (hBubblesRef.current) {
          bubbleData.hData.forEach((d, i) => {
             d.y += d.speed * delta * 2;
             if (d.y > 4) d.y = 0; // reset at bottom of electrode
             dummy.position.set(-2 + d.xOff, -1 + d.y, d.zOff);
             dummy.scale.setScalar(0.5 + Math.random()*0.5);
             dummy.updateMatrix();
             hBubblesRef.current.setMatrixAt(i, dummy.matrix);
          });
          hBubblesRef.current.instanceMatrix.needsUpdate = true;
       }
       // Animate O bubbles (Anode is right, x=2)
       if (oBubblesRef.current) {
          bubbleData.oData.forEach((d, i) => {
             d.y += d.speed * delta * 2;
             if (d.y > 4) d.y = 0; // reset
             dummy.position.set(2 + d.xOff, -1 + d.y, d.zOff);
             dummy.scale.setScalar(0.7 + Math.random()*0.5); // oxygen slightly larger bubbles roughly
             dummy.updateMatrix();
             oBubblesRef.current.setMatrixAt(i, dummy.matrix);
          });
          oBubblesRef.current.instanceMatrix.needsUpdate = true;
       }
    }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* Main Glass Beaker */}
      <Box args={[8, 6, 4]} position={[0, 0, 0]}>
         <meshPhysicalMaterial transmission={0.9} roughness={0.1} color="#cceeff" transparent opacity={0.3} ior={1.33} />
      </Box>
      <Box args={[7.8, 5.8, 3.8]} position={[0, -0.1, 0]}>
         <meshPhysicalMaterial transmission={0.9} roughness={0.2} color="#0055ff" transparent opacity={0.3} />
      </Box>

      {/* Electrodes (Cathode Left -, Anode Right +) */}
      <Cylinder args={[0.4, 0.4, 4]} position={[-2, -1, 0]}>
         <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 4]} position={[2, -1, 0]}>
         <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </Cylinder>

      {/* Test Tubes collecting Gas */}
      {/* Cathode Tube (Left) */}
      <Cylinder args={[0.8, 0.8, 5]} position={[-2, 2.5, 0]} transparent opacity={0.4}>
         <meshPhysicalMaterial transmission={0.9} color="#fff" transparent opacity={0.2} />
      </Cylinder>
      <Html position={[-3, 4.5, 0]} center>
         <div style={{ color: '#00e5ff', fontWeight: 'bold' }}>Cathode (-)<br/>H₂ (2 volumes)</div>
      </Html>

      {/* Anode Tube (Right) */}
      <Cylinder args={[0.8, 0.8, 5]} position={[2, 2.5, 0]} transparent opacity={0.4}>
         <meshPhysicalMaterial transmission={0.9} color="#fff" transparent opacity={0.2} />
      </Cylinder>
      <Html position={[3, 4.5, 0]} center>
         <div style={{ color: '#ff4d6d', fontWeight: 'bold' }}>Anode (+)<br/>O₂ (1 volume)</div>
      </Html>

      {/* Gas Levels (Displacing water in test tubes) */}
      {/* Visualized as semi-transparent white fills pushing down from top */}
      <animated.group scale-y={hGasY} position={[-2, 5, 0]}>
         <Cylinder args={[0.78, 0.78, 1]} position={[0, -0.5, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
         </Cylinder>
      </animated.group>
      <animated.group scale-y={oGasY} position={[2, 5, 0]}>
         <Cylinder args={[0.78, 0.78, 1]} position={[0, -0.5, 0]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
         </Cylinder>
      </animated.group>

      {/* Molecule representations (Step 1) */}
      <animated.group opacity={opaMolecules} transparent position={[0, -1, 2]}>
         {[-1, 0, 1].map((x) => (
             <group key={`h2o-${x}`} position={[x*2, Math.sin(x)*0.5, 0]}>
                {/* O (red) */}
                <mesh><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color="#ff4d6d" /></mesh>
                {/* H (white) */}
                <mesh position={[-0.3, 0.3, 0]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color="#fff" /></mesh>
                <mesh position={[0.3, 0.3, 0]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color="#fff" /></mesh>
             </group>
         ))}
      </animated.group>

      {/* Bubble Instanced Meshes (Step 2+) */}
      <animated.group opacity={opaBubbles} transparent>
         {/* Hydrogen Bubbles */}
         <instancedMesh ref={hBubblesRef} args={[null, null, hBubbleCount]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#e0eaff" transparent opacity={0.8} />
         </instancedMesh>
         {/* Oxygen Bubbles */}
         <instancedMesh ref={oBubblesRef} args={[null, null, oBubbleCount]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#e0eaff" transparent opacity={0.8} />
         </instancedMesh>
      </animated.group>

      {/* Battery and Wires */}
      <Box args={[2, 1, 1]} position={[0, 4, -3]}>
         <meshStandardMaterial color="#22c55e" />
         <Html position={[0, 0, 0.6]} center><div style={{ color: '#fff' }}>Battery 9V</div></Html>
      </Box>
      <Cylinder args={[0.05, 0.05, 4]} position={[-2, 1, -1.5]} rotation={[-Math.PI/4, 0, 0]}>
         <meshStandardMaterial color="#2d3748" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 4]} position={[2, 1, -1.5]} rotation={[-Math.PI/4, 0, 0]}>
         <meshStandardMaterial color="#2d3748" />
      </Cylinder>

      {/* UI Overlay */}
      <Html position={[0, -4, 0]} center>
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

      {/* Equation Overlay */}
      {config.splitActive === 1 && (
        <Html position={[0, -2, 4]} center>
           <div style={{ background: '#000', padding: '8px', border: '1px solid #ff4d6d', borderRadius: '4px', color: '#ff4d6d', fontFamily: 'monospace' }}>
              2H₂O(l) → 2H₂(g) + O₂(g)
           </div>
        </Html>
      )}

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
}
