import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html, Sphere, Tube, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

class VesselCurve extends THREE.Curve {
   constructor(start, end, bend) {
      super();
      this.start = start;
      this.end = end;
      this.bend = bend;
   }
   getPoint(t) {
      const p = new THREE.Vector3().copy(this.start).lerp(this.end, t);
      p.add(this.bend.clone().multiplyScalar(Math.sin(t * Math.PI)));
      return p;
   }
}

export default function HeartCirculation({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { flow: 0, sRA:1, sRV:1, sLA:1, sLV:1, label: "Heart Anatomy", desc: "4 Chambers: Right Atrium & Ventricle. Left Atrium & Ventricle." },
    { flow: 1, sRA:1.2, sRV:1, sLA:1, sLV:1, label: "Deoxygenated Return", desc: "Deoxygenated blood (blue) enters RIGHT ATRIUM from Vena Cava." },
    { flow: 2, sRA:1, sRV:1.2, sLA:1, sLV:1, label: "Pulmonary Circuit", desc: "RIGHT VENTRICLE pumps blood to lungs to pick up Oxygen." },
    { flow: 3, sRA:1, sRV:1, sLA:1.2, sLV:1, label: "Oxygenated Return", desc: "Oxygenated blood (red) returns to LEFT ATRIUM from Lungs." },
    { flow: 4, sRA:1, sRV:1, sLA:1, sLV:1.2, label: "Systemic Circuit", desc: "LEFT VENTRICLE pumps O2-rich blood to the entire body via Aorta." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { scRA, scRV, scLA, scLV } = useSpring({
      scRA: config.sRA,
      scRV: config.sRV,
      scLA: config.sLA,
      scLV: config.sLV,
      config: { tension: 80, friction: 10 }
  });

  const heartGroupRef = useRef();
  useFrame((state, delta) => {
      // Idle heartbeat
      if (heartGroupRef.current) {
          const beat = Math.sin(state.clock.elapsedTime * 6) > 0.8 ? 1.05 : 1;
          heartGroupRef.current.scale.setScalar(beat);
      }
  });

  const venaCava = new VesselCurve(new THREE.Vector3(-1,-3,0), new THREE.Vector3(-1, 0.5, 0), new THREE.Vector3(-0.5,0,0));
  const pulmArtery = new VesselCurve(new THREE.Vector3(-0.5,-1,0), new THREE.Vector3(-4, 2, 0), new THREE.Vector3(-1,1,0));
  const pulmVein = new VesselCurve(new THREE.Vector3(4,2,0), new THREE.Vector3(1, 0.5, 0), new THREE.Vector3(1,1,0));
  const aorta = new VesselCurve(new THREE.Vector3(0.5,-1,0), new THREE.Vector3(0, 4, 0), new THREE.Vector3(-1,2,0));

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* LUNGS REPS */}
      <group position={[-4, 2, -1]}>
         <Box args={[2, 3, 1]}><meshStandardMaterial color="#fbcfe8" transparent opacity={0.6} /></Box>
         <Html position={[0, 2, 0]} center><div style={{color:'#fbcfe8', fontSize:'10px'}}>Right Lung</div></Html>
      </group>
      <group position={[4, 2, -1]}>
         <Box args={[2, 3, 1]}><meshStandardMaterial color="#fbcfe8" transparent opacity={0.6} /></Box>
         <Html position={[0, 2, 0]} center><div style={{color:'#fbcfe8', fontSize:'10px'}}>Left Lung</div></Html>
      </group>

      <group ref={heartGroupRef}>
         
         {/* RIGHT ATRIUM (Viewer's Left, Blue) */}
         <animated.group scale={scRA} position={[-1, 1, 0]}>
            <Box args={[1.5, 1.5, 1.5]}>
               <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.3} />
            </Box>
            <Html position={[-1.5, 0, 0]} center>
               <div style={{color:'#60a5fa', fontWeight:'bold', fontSize:'12px'}}>Right Atrium</div>
            </Html>
         </animated.group>

         {/* RIGHT VENTRICLE */}
         <animated.group scale={scRV} position={[-1, -1, 0]}>
            <Box args={[1.6, 2, 1.6]}>
               <meshStandardMaterial color="#2563eb" metalness={0.1} roughness={0.3} />
            </Box>
            <Html position={[-1.5, -1, 0]} center>
               <div style={{color:'#60a5fa', fontWeight:'bold', fontSize:'12px'}}>Right Ventricle</div>
            </Html>
         </animated.group>

         {/* LEFT ATRIUM (Viewer's Right, Red) */}
         <animated.group scale={scLA} position={[1, 1, 0]}>
            <Box args={[1.5, 1.5, 1.5]}>
               <meshStandardMaterial color="#ef4444" metalness={0.1} roughness={0.3} />
            </Box>
            <Html position={[1.5, 0, 0]} center>
               <div style={{color:'#f87171', fontWeight:'bold', fontSize:'12px'}}>Left Atrium</div>
            </Html>
         </animated.group>

         {/* LEFT VENTRICLE (Thicker walls) */}
         <animated.group scale={scLV} position={[1, -1, 0]}>
            <Box args={[1.8, 2.2, 1.8]}>
               <meshStandardMaterial color="#dc2626" metalness={0.1} roughness={0.3} />
            </Box>
            <Html position={[1.5, -1, 0]} center>
               <div style={{color:'#f87171', fontWeight:'bold', fontSize:'12px'}}>Left Ventricle</div>
               <div style={{color:'#f87171', fontSize:'8px'}}>(Thick Muscle Wall)</div>
            </Html>
         </animated.group>

         {/* VALVES */}
         {/* Tricuspid */}
         <mesh position={[-1, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#fff" />
         </mesh>
         {/* Mitral */}
         <mesh position={[1, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#fff" />
         </mesh>
      </group>

      {/* MAJOR VESSELS */}
      {/* Vena Cava (Blue body -> RA) */}
      <Tube args={[venaCava, 16, 0.3, 8, false]}>
         <meshStandardMaterial color="#3b82f6" />
      </Tube>
      {/* Pulmonary Artery (RV -> Lungs Blue) */}
      <Tube args={[pulmArtery, 16, 0.3, 8, false]}>
         <meshStandardMaterial color="#3b82f6" />
      </Tube>
      {/* Pulmonary Vein (Lungs -> LA Red) */}
      <Tube args={[pulmVein, 16, 0.3, 8, false]}>
         <meshStandardMaterial color="#ef4444" />
      </Tube>
      {/* Aorta (LV -> Body Red) */}
      <Tube args={[aorta, 16, 0.4, 8, false]}>
         <meshStandardMaterial color="#ef4444" />
      </Tube>

      {/* INSTRUCTIONAL PARTICLES BASED ON STEP */}
      {config.flow > 0 && isPlaying && (
         <group>
            {config.flow === 1 && (
               <Sphere args={[0.2]} position={[-1, -2, 0]}><meshBasicMaterial color="#38bdf8" /></Sphere>
            )}
            {config.flow === 2 && (
               <Sphere args={[0.2]} position={[-3, 1, 0]}><meshBasicMaterial color="#38bdf8" /></Sphere>
            )}
            {config.flow === 3 && (
               <Sphere args={[0.2]} position={[3, 1.5, 0]}><meshBasicMaterial color="#fca5a5" /></Sphere>
            )}
            {config.flow === 4 && (
               <Sphere args={[0.2]} position={[-0.5, 3, 0]}><meshBasicMaterial color="#fca5a5" /></Sphere>
            )}
         </group>
      )}

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

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -4, 0]} />
    </group>
  );
}
