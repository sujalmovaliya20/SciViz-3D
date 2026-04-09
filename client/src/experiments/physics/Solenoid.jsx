import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Tube, Html, Cone, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class HelixCurve extends THREE.Curve {
  constructor(turns = 10, radius = 2, length = 8) {
    super();
    this.turns = turns;
    this.radius = radius;
    this.length = length;
  }

  getPoint(t) {
    const x = (t - 0.5) * this.length;
    const angle = t * Math.PI * 2 * this.turns;
    const y = Math.cos(angle) * this.radius;
    const z = Math.sin(angle) * this.radius;
    return new THREE.Vector3(x, y, z);
  }
}

export default function Solenoid({ currentStep = 0, isPlaying = false, controlValues = {} }) {

  const stepConfigs = [
    { iFlow: 0, fieldIn: 0, fieldOut: 0, ironScale: 0, label: "Solenoid Coil", desc: "A helical coil of copper wire. 10 tightly wound turns." },
    { iFlow: 1, fieldIn: 0, fieldOut: 0, ironScale: 0, label: "Current Injected", desc: "Electrons traverse the helical path, creating stacked magnetic fields." },
    { iFlow: 1, fieldIn: 1, fieldOut: 0, ironScale: 0, label: "Uniform Internal Field", desc: "Inside the coil, the field lines are dense, parallel, and uniform." },
    { iFlow: 1, fieldIn: 1, fieldOut: 1, ironScale: 0, label: "Fringe Field", desc: "Outside, field lines spread out and emulate a bar magnet." },
    { iFlow: 1, fieldIn: 1, fieldOut: 1, ironScale: 1, label: "Iron Core Insertion", desc: "Soft iron core magnifies the field strength massively (μ = μ₀ × μr)." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  // Can inject custom slider value for Iron Core if present in controlValues
  const useCoreOverride = controlValues.addCore !== undefined ? controlValues.addCore : false;
  const targetIron = useCoreOverride ? 1 : config.ironScale;

  const { iOpa, fInOp, fOutOp, coreY } = useSpring({
    iOpa: config.iFlow,
    fInOp: config.fieldIn,
    fOutOp: config.fieldOut,
    coreY: targetIron ? 0 : 15, // Falls into place from above
    config: { tension: 60, friction: 15 }
  });

  const helixPath = useMemo(() => new HelixCurve(10, 2, 8), []);
  const elRefs = useRef([]);

  useFrame((state, delta) => {
    if (isPlaying && config.iFlow) {
      elRefs.current.forEach((el, index) => {
        if (!el) return;
        el.userData.t = (el.userData.t || (index / 30)) + delta * 0.05;
        if (el.userData.t > 1) el.userData.t -= 1;
        const pos = helixPath.getPoint(el.userData.t);
        el.position.copy(pos);
      });
    }
  });

  // Calculate internal parallel lines
  const internalLines = useMemo(() => {
     const lines = [];
     for(let r = 0; r <= 1; r += 0.5) {
       for(let theta = 0; theta < Math.PI*2; theta += Math.PI/2) {
          const y = Math.cos(theta) * r;
          const z = Math.sin(theta) * r;
          lines.push({ p1: [-4.5, y, z], p2: [4.5, y, z] });
       }
     }
     return lines;
  }, []);

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* The Coil */}
      <Tube args={[helixPath, 200, 0.1, 16, false]}>
        <meshStandardMaterial color="#b87333" metalness={0.8} />
      </Tube>

      {/* Electrons */}
      <group>
        {[...Array(30)].map((_, i) => (
          <mesh key={`el-${i}`} ref={el => elRefs.current[i] = el}>
             <sphereGeometry args={[0.15, 8, 8]} />
             <animated.meshBasicMaterial color="#ffff00" transparent opacity={iOpa} />
          </mesh>
        ))}
      </group>

      {/* Internal Parallel Field Lines */}
      <animated.group opacity={fInOp} transparent>
         {internalLines.map((l, i) => (
             <group key={`ilin-${i}`}>
               <Line points={[l.p1, l.p2]} color="#00e5ff" lineWidth={3} transparent opacity={0.6} />
               {/* Vector arrows */}
               <mesh position={[(l.p1[0] + l.p2[0])/2, l.p1[1], l.p1[2]]} rotation={[0, 0, -Math.PI/2]}>
                 <coneGeometry args={[0.08, 0.3]} />
                 <animated.meshBasicMaterial color="#00e5ff" transparent opacity={fInOp} />
               </mesh>
             </group>
         ))}
      </animated.group>

      {/* External Fringe Fields (Curved paths emulating bar magnet) */}
      <animated.group opacity={fOutOp} transparent>
         {/* Top arch */}
         <Line 
            points={new THREE.EllipseCurve(0, 2.5, 4.5, 2, 0, Math.PI, false, 0).getPoints(50).map(p => [p.x, p.y, 0])} 
            color="#ff4d6d" lineWidth={2} transparent opacity={0.3} 
         />
         <mesh position={[0, 4.5, 0]} rotation={[0, 0, Math.PI/2]}>
             <coneGeometry args={[0.1, 0.4]} />
             <animated.meshBasicMaterial color="#ff4d6d" transparent opacity={fOutOp} />
         </mesh>

         {/* Bottom arch */}
         <Line 
            points={new THREE.EllipseCurve(0, -2.5, 4.5, 2, 0, Math.PI, true, 0).getPoints(50).map(p => [p.x, p.y, 0])} 
            color="#ff4d6d" lineWidth={2} transparent opacity={0.3} 
         />
         <mesh position={[0, -4.5, 0]} rotation={[0, 0, Math.PI/2]}>
             <coneGeometry args={[0.1, 0.4]} />
             <animated.meshBasicMaterial color="#ff4d6d" transparent opacity={fOutOp} />
         </mesh>
      </animated.group>

      {/* Iron Core Insertion */}
      <animated.group position-y={coreY}>
         <Cylinder args={[1.8, 1.8, 10, 32]} rotation={[0, 0, Math.PI/2]}>
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.3} transparent opacity={0.9} />
         </Cylinder>
         <Html position={[0, 0, 2]} center>
            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>Soft Iron Core (μr ≈ 1000)</div>
         </Html>
      </animated.group>

      {/* Equation Overlay */}
      {config.fieldIn === 1 && (
        <Html position={[0, 5.5, 0]} center>
          <div style={{
            background: 'rgba(6,8,15,0.9)', border: '1px solid #ff4d6d', borderRadius: '8px',
            padding: '12px', color: '#ff4d6d', fontFamily: 'Space Mono, monospace', fontSize: '14px'
          }}>
            <div style={{ color: '#fff' }}>Solenoid Field</div>
            <div style={{ fontSize: '16px' }}>B_in = μ₀ n I</div>
            <animated.div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px' }}>
               {coreY.to(y => y < 1 ? 'Multiplier Active: B_new = B_in × μr' : '')}
            </animated.div>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
}
