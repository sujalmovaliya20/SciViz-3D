import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class SynapseTerminal extends THREE.Curve {
  getPoint(t) {
    // A bulb shape curve for the pre-synaptic membrane. Lathe it.
    const y = -Math.cos(t * Math.PI) * 2;
    const r = Math.sin(t * Math.PI) * 3;
    return new THREE.Vector2(r, y);
  }
}

export default function Synapse({ currentStep = 0, isPlaying = false }) {
  const stepConfigs = [
    { apVis: 0, caVis: 0, vesY: 2, relNt: 0, bindNt: 0, label: "Synapse at Rest", desc: "Synaptic Cleft separates Pre-synaptic terminal and Post-synaptic dendrite." },
    { apVis: 1, caVis: 0, vesY: 2, relNt: 0, bindNt: 0, label: "Action Potential Arrives", desc: "Depolarization wave reaches the axon terminal." },
    { apVis: 1, caVis: 1, vesY: 2, relNt: 0, bindNt: 0, label: "Ca²⁺ Influx", desc: "Voltage-gated Calcium channels open. Ca²⁺ rushes in." },
    { apVis: 1, caVis: 1, vesY: -0.5, relNt: 1, bindNt: 0, label: "Vesicle Fusion", desc: "Ca²⁺ causes synaptic vesicles to fuse with membrane, releasing neurotransmitters." },
    { apVis: 0, caVis: 0, vesY: -0.5, relNt: 1, bindNt: 1, label: "Receptor Binding", desc: "Neurotransmitters bind to ligand-gated receptors, passing the signal on." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { apOp, caOp, vY, rNt, bNt } = useSpring({
      apOp: config.apVis,
      caOp: config.caVis,
      vY: Math.max(-0.5, config.vesY),
      rNt: config.relNt,
      bNt: config.bindNt,
      config: { tension: 60, friction: 15 }
  });

  const termShape = new THREE.LatheGeometry(
      [...Array(20)].map((_,i) => {
         const t=i/19; 
         // Bulb shape, top open
         const r = Math.sin(t*Math.PI*0.8)*4; 
         const y = Math.cos(t*Math.PI*0.8)*-3 + 3; 
         return new THREE.Vector2(r,y);
      }), 
  32);

  const ptsRefs = useRef([]);

  useFrame((state, delta) => {
     if(isPlaying && config.relNt === 1 && config.bindNt === 0) {
         // Float down to cleft
         ptsRefs.current.forEach(p => {
             if(p) {
                p.position.y -= delta * 2;
                if (p.position.y < -3.5) p.position.y = -3.5; // floor at dendrite
             }
         });
     } else if (config.bindNt === 1) {
         // Snap to receptors
         ptsRefs.current.forEach((p, i) => {
             if(p) {
                p.position.y = THREE.MathUtils.lerp(p.position.y, -4.5, 0.1); 
                p.position.x = THREE.MathUtils.lerp(p.position.x, (i%5)*1.5 - 3, 0.1); 
             }
         });
     } else {
         // Reset positions near membrane origin
         ptsRefs.current.forEach((p, i) => {
             if(p) {
                p.position.y = -0.6;
             }
         });
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* PRE-SYNAPTIC TERMINAL */}
      <group position={[0, 1, 0]}>
         <mesh geometry={termShape}>
            <meshStandardMaterial color="#94a3b8" transparent opacity={0.3} side={THREE.DoubleSide} />
         </mesh>
         
         {/* Action Potential Glow */}
         <animated.mesh geometry={termShape} visible={apOp.to(v => v>0)}>
            <animated.meshBasicMaterial color="#ff4d6d" transparent opacity={apOp.to(o=>o*0.4)} side={THREE.DoubleSide} />
         </animated.mesh>

         {/* Synaptic Vesicles */}
         {[...Array(5)].map((_,i) => (
             <animated.group key={`ves-${i}`} position-x={-2 + i} position-y={vY} position-z={(Math.random()-0.5)*1}>
                 {/* Invisible boundary unless NOT fused */}
                 <animated.mesh visible={vY.to(y => y > -0.4)}>
                     <sphereGeometry args={[0.5, 16, 16]} />
                     <meshPhysicalMaterial color="#38bdf8" transparent opacity={0.5} roughness={0.1} transmission={0.9} />
                 </animated.mesh>
             </animated.group>
         ))}

         {/* Calcium Channels */}
         <mesh position={[-3.5, 0, 0]} rotation={[0,0,Math.PI/4]}><cylinderGeometry args={[0.2,0.2,1]}/><meshStandardMaterial color="#facc15" /></mesh>
         <mesh position={[3.5, 0, 0]} rotation={[0,0,-Math.PI/4]}><cylinderGeometry args={[0.2,0.2,1]}/><meshStandardMaterial color="#facc15" /></mesh>

         {/* Ca2+ Ions entering */}
         <animated.group opacity={caOp} transparent visible={caOp.to(v => v>0)}>
             {[...Array(6)].map((_,i) => (
                 <mesh key={`ca-${i}`} position={[i%2===0 ? -3 : 3, 0.5 - (i%3)*0.5, 0]}>
                    <sphereGeometry args={[0.15, 8, 8]} />
                    <meshBasicMaterial color="#facc15" />
                 </mesh>
             ))}
         </animated.group>
      </group>

      <Html position={[0, 3, 0]} center><div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: 'bold' }}>Pre-Synaptic Terminal</div></Html>
      <Html position={[0, -2, 0]} center><div style={{ color: '#93c5fd', fontSize: '10px' }}>Synaptic Cleft</div></Html>

      {/* NEUROTRANSMITTER PARTICLES */}
      <animated.group opacity={rNt} transparent visible={rNt.to(v => v>0)}>
         {[...Array(20)].map((_,i) => (
             <mesh key={`nt-${i}`} ref={el => ptsRefs.current[i] = el} position={[(Math.random()-0.5)*4, 0.5, (Math.random()-0.5)*2]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#22c55e" />
             </mesh>
         ))}
      </animated.group>

      {/* POST-SYNAPTIC MEMBRANE */}
      <group position={[0, -5, 0]}>
         <Box args={[12, 2, 4]}>
            <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.8} />
         </Box>
         <Html position={[0, -1.5, 0]} center><div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: 'bold' }}>Post-Synaptic Dendrite</div></Html>

         {/* Receptors */}
         {[...Array(5)].map((_,i) => (
             <mesh key={`rec-${i}`} position={[-3 + i*1.5, 1, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.5]} />
                <meshStandardMaterial color="#f43f5e" />
             </mesh>
         ))}
      </group>

      {/* Target signal propagation based on step 4 */}
      <animated.mesh position={[0, -6, 0]} visible={bNt.to(b => b>0)} scale={bNt.to(b=>1)}>
          <boxGeometry args={[12.5, 2.5, 4.5]} />
          <animated.meshBasicMaterial color="#facc15" transparent opacity={bNt.to(b=>b*0.4)} />
          <Html position={[0, -3, 0]} center><div style={{ color: '#facc15', fontSize: '12px', fontWeight:'bold' }}>Signal Depolarizing next neuron!</div></Html>
      </animated.mesh>

      {/* UI Overlay */}
      <Html position={[0, 6, 0]} center>
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
