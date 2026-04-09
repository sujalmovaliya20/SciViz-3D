import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function BenzeneResonance({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { type: 1, showRes: 0, showCloud: 0, label: "Kekulé Structure 1", desc: "Alternating single and double bonds." },
    { type: 2, showRes: 0, showCloud: 0, label: "Kekulé Structure 2", desc: "Double bonds shifted to adjacent positions." },
    { type: 3, showRes: 0, showCloud: 0, label: "Rapid Oscillation", desc: "Historically thought to rapidly flip between two states." },
    { type: 1, showRes: 1, showCloud: 0, label: "Resonance Hybrid", desc: "Actual structure: a smeared average of both Kekulé forms (represented as a circle)." },
    { type: 1, showRes: 1, showCloud: 1, label: "Delocalized π Cloud", desc: "Electrons are delocalized in continuous rings above and below the carbon plane." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  // For oscillation
  const kekuleRef = useRef({ state: 1, timer: 0 });

  const { opHyb, opCloud } = useSpring({
      opHyb: config.showRes, 
      opCloud: config.showCloud,
      config: { tension: 60, friction: 15 }
  });

  const R = 2.5; // Hexagon radius
  const carbons = [];
  for(let i=0; i<6; i++) {
     const angle = (i/6) * Math.PI * 2;
     carbons.push(new THREE.Vector3(Math.cos(angle)*R, Math.sin(angle)*R, 0));
  }

  const molRef = useRef();
  useFrame((state, delta) => {
     if(molRef.current) {
        molRef.current.rotation.x = Math.PI / 3;
        molRef.current.rotation.z += delta * 0.2;
     }

     if (isPlaying && config.type === 3) {
        kekuleRef.current.timer += delta;
        if(kekuleRef.current.timer > 0.1) { // 100ms flicker
           kekuleRef.current.state = kekuleRef.current.state === 1 ? 2 : 1;
           kekuleRef.current.timer = 0;
        }
     } else {
        kekuleRef.current.state = config.type === 2 ? 2 : 1;
     }
  });

  // Calculate bonds
  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      <group ref={molRef}>
          {/* Carbon Atoms */}
          {carbons.map((pos, i) => (
             <group key={`c-${i}`}>
                 <Sphere args={[0.5, 32, 32]} position={pos}>
                    <meshStandardMaterial color="#334155" metalness={0.4} />
                 </Sphere>
                 {/* H atom branching out */}
                 <group position={pos.clone().multiplyScalar(1.5)}>
                    <Sphere args={[0.25, 16, 16]}>
                       <meshStandardMaterial color="#f8fafc" />
                    </Sphere>
                 </group>
                 {/* C-H Bond */}
                 <mesh position={pos.clone().multiplyScalar(1.25)} rotation={[0,0, (i/6)*Math.PI*2 + Math.PI/2]}>
                    <cylinderGeometry args={[0.08, 0.08, R*0.5]} />
                    <meshStandardMaterial color="#94a3b8" />
                 </mesh>
             </group>
          ))}

          {/* C-C Frame (Sigma Bonds - Always there) */}
          {carbons.map((p1, i) => {
             const p2 = carbons[(i+1)%6];
             const mid = p1.clone().lerp(p2, 0.5);
             const dist = p1.distanceTo(p2);
             const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
             
             // Animated double bond rendering based on kekuleRef state
             return (
                <group key={`bond-${i}`}>
                    {/* Sigma bond */}
                    <mesh position={mid} rotation={[0,0,angle+Math.PI/2]}>
                        <cylinderGeometry args={[0.1, 0.1, dist]} />
                        <meshStandardMaterial color="#94a3b8" />
                    </mesh>

                    {/* Pi bond (Double bond overlay) */}
                    <animated.mesh 
                       position={mid.clone().add(new THREE.Vector3(Math.cos(angle+Math.PI/2)*0.25, Math.sin(angle+Math.PI/2)*0.25, 0))} 
                       rotation={[0,0,angle+Math.PI/2]}
                       visible={opHyb.to(v => v < 0.5)} // Hide kekule bonds when hybrid shows
                    >
                       <cylinderGeometry args={[0.08, 0.08, dist*0.8]} />
                       <meshStandardMaterial color="#38bdf8" />
                       <Html position={[0,0,0]}>
                         <div style={{ display: 'none' }} className={`k-bond k-${i%2===0 ? 1 : 2}`} />
                       </Html>
                    </animated.mesh>
                </group>
             );
          })}

          {/* We'll use a useFrame hack to toggle visibility of Kekule bonds based on state */}
          <animated.group>
              <Html>
                 <style dangerouslySetInnerHTML={{__html: `
                    .k-bond { display: block !important; width: 0; height: 0; overflow: hidden; }
                    .k-1 { opacity: ${config.type===3 ? 1 : config.type===1 ? 1 : 0}; }
                    .k-2 { opacity: ${config.type===3 ? 0 : config.type===2 ? 1 : 0}; }
                 `}} />
              </Html>
          </animated.group>

          {/* Resonance Hybrid Circle */}
          <animated.mesh rotation={[0,0,0]} scale={opHyb}>
             <torusGeometry args={[R*0.75, 0.1, 16, 64]} />
             <animated.meshStandardMaterial color="#38bdf8" transparent opacity={opHyb} />
          </animated.mesh>

          {/* Pi Cloud Torus (Above and Below) */}
          <animated.group scale-z={opCloud} transparent>
             <mesh position={[0,0,1]}>
                <torusGeometry args={[R, 0.6, 32, 64]} />
                <animated.meshPhysicalMaterial color="#c084fc" transparent opacity={opCloud.to(o=>o*0.4)} transmission={0.9} roughness={0.2} />
             </mesh>
             <mesh position={[0,0,-1]}>
                <torusGeometry args={[R, 0.6, 32, 64]} />
                <animated.meshPhysicalMaterial color="#c084fc" transparent opacity={opCloud.to(o=>o*0.4)} transmission={0.9} roughness={0.2} />
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
