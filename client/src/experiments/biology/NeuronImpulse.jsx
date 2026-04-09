import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Torus, Tube } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class AxonCurve extends THREE.Curve {
  getPoint(t) {
    const x = t * 10 - 5; // Long horizontal
    // make it vaguely wavy
    const y = Math.sin(t * Math.PI * 4) * 0.2;
    return new THREE.Vector3(x, y, 0);
  }
}

class BranchCurve extends THREE.Curve {
  constructor(start, end, bend) {
    super();
    this.start = start;
    this.end = end;
    this.bend = bend;
  }
  getPoint(t) {
    const p = new THREE.Vector3().copy(this.start).lerp(this.end, t);
    // add bend
    p.add(this.bend.clone().multiplyScalar(Math.sin(t * Math.PI)));
    return p;
  }
}

export default function NeuronImpulse({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { apVis: 0, termReach: 0, relOp: 0, label: "Resting Neuron", desc: "A motor neuron at rest. Soma (cell body), dendrites, and a myelinated axon." },
    { apVis: 0.1, termReach: 0, relOp: 0, label: "Stimulus Arrival", desc: "A stimulus reaches the dendrites, triggering a graded potential." },
    { apVis: 1, termReach: 0, relOp: 0, label: "Action Potential travels", desc: "Depolarization wave travels down the axon rapidly, jumping between Nodes of Ranvier." },
    { apVis: 1, termReach: 1, relOp: 0, label: "Reaches Axon Terminal", desc: "The impulse arrives at the synaptic terminals at the end." },
    { apVis: 1, termReach: 1, relOp: 1, label: "Neurotransmitter Release", desc: "Synaptic vesicles fuse with membrane, releasing chemicals into synapse." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { apOp, relScale } = useSpring({
    apOp: config.apVis,
    relScale: config.relOp,
    config: { tension: 60, friction: 15 }
  });

  const axonPath = new AxonCurve();
  const apRef = useRef();
  const apPos = useRef(0);

  const vesiclesRef = useRef([]);

  useFrame((state, delta) => {
     if (isPlaying) {
         if (config.apVis === 1 && config.termReach === 0) {
             apPos.current += delta * 0.5; // speed
             if (apPos.current > 1) apPos.current = 1;

             if (apRef.current) {
                 const t = apPos.current;
                 const pt = axonPath.getPoint(t);
                 apRef.current.position.copy(pt);
                 // rotate to follow path
                 const tangent = axonPath.getTangent(t);
                 const up = new THREE.Vector3(0,1,0);
                 apRef.current.quaternion.setFromUnitVectors(up, tangent);
             }
         }
         
         if (config.relOp === 1) {
             // Animate little dots spraying out of the terminal right
             vesiclesRef.current.forEach((v, i) => {
                 if (!v) return;
                 let x = v.userData.x || 0;
                 x += delta * (1 + Math.random());
                 if (x > 2) x = 0; // reset
                 v.userData.x = x;
                 const baseY = v.userData.y;
                 const baseZ = v.userData.z;
                 v.position.set(5.2 + x, baseY + (Math.random()-0.5)*0.2, baseZ + (Math.random()-0.5)*0.2);
             });
         }
     } else if (config.currentStep < 2) {
         apPos.current = 0;
         if (apRef.current) {
             const pt = axonPath.getPoint(0);
             apRef.current.position.copy(pt);
         }
     }
  });

  const dendritePaths = [
      new BranchCurve(new THREE.Vector3(-5,0,0), new THREE.Vector3(-6,2,0), new THREE.Vector3(-0.5,1,0)),
      new BranchCurve(new THREE.Vector3(-5,0,0), new THREE.Vector3(-7,1,1), new THREE.Vector3(-0.5,0.5,0.5)),
      new BranchCurve(new THREE.Vector3(-5,0,0), new THREE.Vector3(-7,-1,-1), new THREE.Vector3(0,-0.5,-0.5)),
      new BranchCurve(new THREE.Vector3(-5,0,0), new THREE.Vector3(-6,-2,0), new THREE.Vector3(0.5,-1,0)),
      new BranchCurve(new THREE.Vector3(-5,0,0), new THREE.Vector3(-6,0,2), new THREE.Vector3(0,0,1))
  ];

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* SOMA (Cell Body) */}
      <group position={[-5, 0, 0]}>
         <Sphere args={[0.8, 32, 32]}>
            <meshStandardMaterial color="#64748b" metalness={0.1} />
         </Sphere>
         {/* Nucleus */}
         <Sphere args={[0.3, 16, 16]} position={[0,0,0.4]}>
            <meshStandardMaterial color="#3b82f6" />
         </Sphere>
         <Html position={[-1, 1.5, 0]} center><div style={{ color: '#94a3b8', fontSize: '10px' }}>Soma & Nucleus</div></Html>
      </group>

      {/* DENDRITES */}
      {dendritePaths.map((path, i) => (
         <group key={`dend-${i}`}>
            <Tube args={[path, 16, 0.08, 8, false]}>
               <meshStandardMaterial color="#64748b" />
            </Tube>
            {/* Stimulus flash step 1 */}
            {config.currentStep === 1 && (
               <mesh position={path.getPoint(0.8)}>
                  <sphereGeometry args={[0.2, 8, 8]} />
                  <meshBasicMaterial color="#facc15" />
               </mesh>
            )}
         </group>
      ))}
      <Html position={[-6.5, 2.5, 0]} center><div style={{ color: '#94a3b8', fontSize: '10px' }}>Dendrites (Receive)</div></Html>

      {/* AXON */}
      <Tube args={[axonPath, 64, 0.08, 8, false]}>
         <meshStandardMaterial color="#64748b" />
      </Tube>

      {/* MYELIN SHEATH (Schwann Cells) */}
      {[...Array(6)].map((_, i) => {
          const t = 0.15 + (i * 0.12);
          const pt = axonPath.getPoint(t);
          const tangent = axonPath.getTangent(t);
          const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), tangent);
          return (
             <mesh key={`myelin-${i}`} position={pt} quaternion={quat}>
                 {/* Long elongated torus/tube */}
                 <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
                 <meshStandardMaterial color="#f8fafc" roughness={0.6} />
             </mesh>
          )
      })}
      <Html position={[0, 1.5, 0]} center><div style={{ color: '#f8fafc', fontSize: '10px' }}>Myelin Sheath</div></Html>
      <Html position={[0.6, -1.5, 0]} center><div style={{ color: '#cbd5e1', fontSize: '10px' }}>Node of Ranvier</div></Html>

      {/* AXON TERMINALS */}
      <group position={[5, 0, 0]}>
         <Tube args={[new BranchCurve(new THREE.Vector3(0,0,0), new THREE.Vector3(0.5,0.5,0), new THREE.Vector3(0.2,0.2,0)), 8, 0.05, 8, false]}><meshStandardMaterial color="#64748b" /></Tube>
         <Tube args={[new BranchCurve(new THREE.Vector3(0,0,0), new THREE.Vector3(0.6,0,0.5), new THREE.Vector3(0.3,0,0.2)), 8, 0.05, 8, false]}><meshStandardMaterial color="#64748b" /></Tube>
         <Tube args={[new BranchCurve(new THREE.Vector3(0,0,0), new THREE.Vector3(0.5,-0.5,-0.2), new THREE.Vector3(0.1,-0.2,-0.1)), 8, 0.05, 8, false]}><meshStandardMaterial color="#64748b" /></Tube>
         
         <Sphere args={[0.15, 16, 16]} position={[0.5, 0.5, 0]}><meshStandardMaterial color="#64748b" /></Sphere>
         <Sphere args={[0.15, 16, 16]} position={[0.6, 0, 0.5]}><meshStandardMaterial color="#64748b" /></Sphere>
         <Sphere args={[0.15, 16, 16]} position={[0.5, -0.5, -0.2]}><meshStandardMaterial color="#64748b" /></Sphere>
         
         <Html position={[1.5, 1, 0]} center><div style={{ color: '#94a3b8', fontSize: '10px', whiteSpace:'nowrap' }}>Axon Terminals (Transmit)</div></Html>
      </group>

      {/* ACTION POTENTIAL GLOW */}
      <animated.mesh ref={apRef} opacity={apOp} transparent scale={1.5} visible={apOp.to(v => v>0)}>
         <cylinderGeometry args={[0.3, 0.3, 0.4]} />
         <meshBasicMaterial color="#ff4d6d" transparent opacity={0.8} />
         <Html position={[0,0.8,0]} center><div style={{ color: '#ff4d6d', fontSize: '10px', fontWeight:'bold' }}>Action Potential (+40mV)</div></Html>
      </animated.mesh>

      {/* NEUROTRANSMITTER PARTICLES */}
      <animated.group scale={relScale} visible={relScale.to(v => v>0)}>
         {[...Array(15)].map((_, i) => (
             <mesh key={`nt-${i}`} ref={el => {
                 if(el) {
                    vesiclesRef.current[i] = el;
                    if(!el.userData.y) {
                        // Distribute them roughly by the terminals
                        const bIdx = i % 3;
                        if (bIdx===0) { el.userData.y = 0.5; el.userData.z = 0; }
                        else if (bIdx===1) { el.userData.y = 0; el.userData.z = 0.5; }
                        else { el.userData.y = -0.5; el.userData.z = -0.2; }
                    }
                 }
             }}>
                 <sphereGeometry args={[0.05, 8, 8]} />
                 <meshBasicMaterial color="#00e5ff" />
             </mesh>
         ))}
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
}
