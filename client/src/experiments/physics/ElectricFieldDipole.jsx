import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function ElectricFieldDipole({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { showPosLines: false, showFullField: false, showEquip: false, showTest: false, label: "Electric Dipole", desc: "Two equal and opposite charges separated by a distance." },
    { showPosLines: true, showFullField: false, showEquip: false, showTest: false, label: "Positive Field", desc: "Electric field lines point radially OUTWARD from the positive charge." },
    { showPosLines: false, showFullField: true, showEquip: false, showTest: false, label: "Dipole Field Lines", desc: "Field lines originate at +, curve through space, and terminate at -." },
    { showPosLines: false, showFullField: true, showEquip: true, showTest: false, label: "Equipotential Surfaces", desc: "Dashed lines where V is constant. Perpendicular to E-field lines." },
    { showPosLines: false, showFullField: true, showEquip: true, showTest: true, label: "Test Charge Animation", desc: "A positive test charge accelerates along the E-field lines toward the - charge." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { opPosLines, opFullLines, opEquip, opTest } = useSpring({
    opPosLines: config.showPosLines ? 1 : 0,
    opFullLines: config.showFullField ? 1 : 0,
    opEquip: config.showEquip ? 1 : 0,
    opTest: config.showTest ? 1 : 0,
    config: { tension: 80, friction: 15 }
  });

  const qDist = 3;
  const posQ = new THREE.Vector3(-qDist, 0, 0); // Positive Left
  const negQ = new THREE.Vector3(qDist, 0, 0); // Negative Right

  // Radial outward lines (partial field for Step 1)
  const posRadialLines = useMemo(() => {
    const lines = [];
    for(let i=0; i<16; i++) {
        const theta = (i/16) * Math.PI * 2;
        const pEnd = new THREE.Vector3(posQ.x + Math.cos(theta)*4, posQ.y + Math.sin(theta)*4, 0);
        lines.push({ start: posQ, end: pEnd, theta });
    }
    return lines;
  }, []);

  // Dipole curved field lines (Step 2 and onwards)
  // Drawn using simple dipole equation paths: r = c * sin^2(theta)
  const dipoleLines = useMemo(() => {
    const lines = [];
    // We'll generate lines for a few constants c
    const cValues = [2.0, 3.5, 6.0, 10.0, 20.0]; 
    cValues.forEach((c) => {
        // Upper loop
        const pointsUpper = [];
        const pointsLower = [];
        for(let theta = 0.05; theta < Math.PI - 0.05; theta += 0.05) {
            const r = c * Math.pow(Math.sin(theta), 2);
            // Translate origin to middle of dipole (0,0) with poles on +/- qDist
            // Actually the standard formula is for a point dipole. For discrete charges, we use parametric Euler integration
            // Let's do Euler integration of E field vectors.
            // E = kQ/r1^2 r1_hat - kQ/r2^2 r2_hat
        }
    });

    // Instead of analytical, let's trace discrete field lines using Euler integration
    const traceLine = (startX, startY, dir) => {
        const pts = [];
        let curr = new THREE.Vector3(startX, startY, 0);
        const maxSteps = 200;
        const dt = 0.1 * dir;
        pts.push(curr.clone());
        for(let i=0; i<maxSteps; i++) {
            const r1 = new THREE.Vector3().subVectors(curr, posQ);
            const r2 = new THREE.Vector3().subVectors(curr, negQ);
            const d1 = Math.max(0.1, r1.length());
            const d2 = Math.max(0.1, r2.length());
            
            // E field
            const E1 = r1.normalize().multiplyScalar(1 / (d1*d1));
            const E2 = r2.normalize().multiplyScalar(-1 / (d2*d2)); // negative charge
            const E = new THREE.Vector3().addVectors(E1, E2);
            
            // Normalize E so step size is constant visually
            if(E.lengthSq() > 0) E.normalize();
            
            curr.add(E.multiplyScalar(dt));
            pts.push(curr.clone());

            // Stop if too close to charges
            if(curr.distanceTo(negQ) < 0.3 || curr.distanceTo(posQ) < 0.3) break;
            if(curr.length() > 15) break; 
        }
        return pts;
    };

    // Trace from sphere around positive charge
    for(let i=0; i<16; i++) {
        const angle = (i/16) * Math.PI * 2;
        const d = 0.5;
        const startX = posQ.x + Math.cos(angle)*d;
        const startY = posQ.y + Math.sin(angle)*d;
        const pts = traceLine(startX, startY, 1);
        if(pts.length > 5) lines.push(pts);
    }
    return lines;
  }, []);

  // Equipotential surfaces (Circles roughly)
  const equipotentials = [
    { pos: [-3, 0, 0], r: 1 }, { pos: [-3, 0, 0], r: 2 }, { pos: [-3, 0, 0], r: 3 },
    { pos: [3, 0, 0], r: 1 }, { pos: [3, 0, 0], r: 2 }, { pos: [3, 0, 0], r: 3 },
  ];

  // Test Charge Animation Path
  const testChargePath = dipoleLines[3]; // pick a nice mid curve
  const testRef = useRef();

  useFrame((state, delta) => {
     if(isPlaying && config.showTest && testRef.current && testChargePath) {
         let t = testRef.current.userData.t || 0;
         t += delta * 20; // steps index
         if(t >= testChargePath.length - 1) t = 0;
         testRef.current.userData.t = t;
         
         const idx = Math.floor(t);
         testRef.current.position.copy(testChargePath[idx]);
     } else if (testRef.current && testChargePath) {
         testRef.current.position.copy(testChargePath[0]);
         testRef.current.userData.t = 0;
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />

      {/* Positive Charge */}
      <group position={posQ}>
        <Sphere args={[0.4, 32, 32]}>
           <meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={0.5} />
        </Sphere>
        <pointLight color="#ff4d6d" intensity={2} distance={10} />
        <Html position={[0, -0.8, 0]} center><div style={{ color: '#ff4d6d', fontWeight:'bold' }}>+Q</div></Html>
      </group>

      {/* Negative Charge */}
      <group position={negQ}>
        <Sphere args={[0.4, 32, 32]}>
           <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.5} />
        </Sphere>
        <pointLight color="#00e5ff" intensity={2} distance={10} />
        <Html position={[0, -0.8, 0]} center><div style={{ color: '#00e5ff', fontWeight:'bold' }}>-Q</div></Html>
      </group>

      {/* Partial Field Lines (Step 1) */}
      <animated.group opacity={opPosLines} transparent>
        {posRadialLines.map((l, i) => (
           <group key={`rad-${i}`}>
               <Line points={[l.start, l.end]} color="#ff4d6d" transparent opacity={0.6} lineWidth={2} />
               <mesh position={[(l.start.x + l.end.x)/2, (l.start.y + l.end.y)/2, 0]} rotation={[0, 0, l.theta - Math.PI/2]}>
                   <coneGeometry args={[0.1, 0.3, 8]} />
                   <animated.meshBasicMaterial color="#ff4d6d" transparent opacity={opPosLines} />
               </mesh>
           </group>
        ))}
      </animated.group>

      {/* Full Dipole Field Lines */}
      <animated.group opacity={opFullLines} transparent>
         {dipoleLines.map((pts, i) => {
             // Arrow in middle
             const midIdx = Math.floor(pts.length / 2);
             const p1 = pts[midIdx];
             const p2 = pts[midIdx+1] || p1;
             const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

             return (
               <group key={`dip-${i}`}>
                 <Line points={pts} color="#e0eaff" transparent opacity={0.3} lineWidth={2} />
                 {pts.length > 10 && (
                   <mesh position={p1.clone()} rotation={[0, 0, angle - Math.PI/2]}>
                     <coneGeometry args={[0.1, 0.3, 8]} />
                     <animated.meshBasicMaterial color="#e0eaff" transparent opacity={opFullLines} />
                   </mesh>
                 )}
               </group>
             )
         })}
      </animated.group>

      {/* Equipotential Lines */}
      <animated.group opacity={opEquip} transparent>
         {equipotentials.map((eq, i) => (
            <group key={`eq-${i}`} position={eq.pos}>
              <Line 
                points={new THREE.EllipseCurve(0, 0, eq.r, eq.r, 0, 2*Math.PI, false, 0).getPoints(50)} 
                color="#22c55e" 
                transparent opacity={0.5} 
                dashed 
                dashSize={0.2} 
                gapSize={0.2} 
                lineWidth={2} 
              />
            </group>
         ))}
      </animated.group>

      {/* Test Charge */}
      <animated.group ref={testRef} opacity={opTest} transparent>
        <Sphere args={[0.15, 16, 16]}>
          <animated.meshBasicMaterial color="#ffff00" transparent opacity={opTest} />
        </Sphere>
        <pointLight color="#ffff00" intensity={1} distance={2} />
        <Html position={[0, -0.4, 0]} center><div style={{ color: '#ffff00', fontSize: '10px' }}>+q</div></Html>
      </animated.group>

      {/* UI Overlay */}
      <Html position={[0, 4.5, 0]} center>
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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -6, 0]} />
    </group>
  );
}
