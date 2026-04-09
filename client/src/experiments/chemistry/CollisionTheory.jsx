import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function CollisionTheory({ currentStep = 0, isPlaying = false, controlValues = {} }) {

  const stepConfigs = [
    { reactMode: false, activeEnergy: false, label: "Reactants Floating", desc: "Reacting molecules A (red) and B (blue) moving randomly." },
    { reactMode: false, activeEnergy: true, label: "Kinetic Energy Increased", desc: "Temperature slider affects the velocity (Energy) of molecules." },
    { reactMode: 'bounce', activeEnergy: true, label: "Ineffective Collisions", desc: "Molecules collide but don't react if energy < Activation Energy." },
    { reactMode: 'react', activeEnergy: true, label: "Effective Collisions", desc: "When E > Ea, collisions break bonds and form products." },
    { reactMode: 'react', activeEnergy: true, label: "Product Formation", desc: "Green product spheres emerge as reaction completes over time." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  // Read temperature scalar from generic sliders if available, default to 1
  const tempScalar = (config.activeEnergy && controlValues.temperature) ? controlValues.temperature : (config.activeEnergy ? 2 : 0.5);
  const Ea = 1.5; // Activation energy threshold (velocity based)

  const bounds = 4;
  const numA = 15;
  const numB = 15;

  const [products, setProducts] = useState(0);

  // Initialize molecule physics data
  // Using React refs to manually update massive positions without state triggering to maintain 60FPS
  const molsRef = useRef(
    [...Array(numA + numB)].map((_, i) => ({
       type: i < numA ? 'A' : 'B',
       active: true,
       pos: new THREE.Vector3((Math.random()-0.5)*bounds*2, (Math.random()-0.5)*bounds*2, (Math.random()-0.5)*bounds*2),
       vel: new THREE.Vector3((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2),
       radius: 0.4
    }))
  );

  const meshesRef = useRef([]);

  useFrame((state, delta) => {
     if (isPlaying) {
         let newProducts = 0;
         const mols = molsRef.current;

         for (let i = 0; i < mols.length; i++) {
             const m = mols[i];
             if (!m.active) continue;

             // Move
             m.pos.add(m.vel.clone().multiplyScalar(delta * 2 * tempScalar));

             // Bounce walls
             if (m.pos.x > bounds) { m.pos.x = bounds; m.vel.x *= -1; }
             if (m.pos.x < -bounds) { m.pos.x = -bounds; m.vel.x *= -1; }
             if (m.pos.y > bounds) { m.pos.y = bounds; m.vel.y *= -1; }
             if (m.pos.y < -bounds) { m.pos.y = -bounds; m.vel.y *= -1; }
             if (m.pos.z > bounds) { m.pos.z = bounds; m.vel.z *= -1; }
             if (m.pos.z < -bounds) { m.pos.z = -bounds; m.vel.z *= -1; }

             // Check collisions
             for (let j = i + 1; j < mols.length; j++) {
                 const m2 = mols[j];
                 if (!m2.active) continue;

                 const dist = m.pos.distanceTo(m2.pos);
                 if (dist < m.radius + m2.radius) {
                    // Collision!
                    // Resolve simple elastic bounce
                    const normal = m2.pos.clone().sub(m.pos).normalize();
                    const relativeVelocity = m.vel.clone().sub(m2.vel);
                    const speed = relativeVelocity.dot(normal);
                    
                    if (speed > 0) {
                        m.vel.sub(normal.clone().multiplyScalar(speed));
                        m2.vel.add(normal.clone().multiplyScalar(speed));

                        // Check if reaction occurs
                        if (config.reactMode === 'react' && m.type !== m2.type && m.type !== 'P' && m2.type !== 'P') {
                            const combinedEnergy = (m.vel.length() + m2.vel.length()) * tempScalar;
                            if (combinedEnergy > Ea) {
                                // React!
                                m.type = 'P'; // Product C
                                m.radius = 0.6;
                                m2.active = false; // Destroy B, A becomes AB
                                newProducts++;
                            }
                        }
                    }
                 }
             }

             // Apply to mesh
             if (meshesRef.current[i]) {
                meshesRef.current[i].position.copy(m.pos);
                // Update color based on type
                meshesRef.current[i].material.color.set(m.type === 'A' ? '#ff4d4d' : (m.type === 'B' ? '#00e5ff' : '#22c55e'));
                meshesRef.current[i].scale.setScalar(m.type === 'P' ? 1.5 : 1.0);
                meshesRef.current[i].visible = m.active;
             }
         }

         if (newProducts > 0 && config.currentStep >= 3) {
             setProducts(p => p + newProducts);
         }
     } else if (config.currentStep === 0) {
         // Reset
         if (products > 0) {
             setProducts(0);
             molsRef.current.forEach((m, i) => {
                m.type = i < numA ? 'A' : 'B';
                m.active = true;
                m.radius = 0.4;
             });
         }
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />

      {/* Container Box Wireframe */}
      <Box args={[bounds*2 + 1, bounds*2 + 1, bounds*2 + 1]}>
         <meshBasicMaterial color="#334155" wireframe transparent opacity={0.2} />
      </Box>

      <group>
         {molsRef.current.map((_, i) => (
            <mesh key={`m-${i}`} ref={el => meshesRef.current[i] = el}>
               <sphereGeometry args={[0.4, 16, 16]} />
               <meshStandardMaterial metalness={0.2} roughness={0.3} />
            </mesh>
         ))}
      </group>

      {/* Data Overlay */}
      <Html position={[bounds + 1, bounds, 0]} center>
         <div style={{ background: '#0d1117', border: '1px solid #1e2a3a', padding: '16px', borderRadius: '8px', color: '#fff', width: '220px' }}>
            <div style={{ color: '#00e5ff', fontWeight: 'bold', borderBottom: '1px solid #334', paddingBottom: '8px', marginBottom: '8px' }}>Reaction Metrics</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
               <span style={{ color: '#8899bb' }}>Temperature:</span>
               <span style={{ color: tempScalar > 2 ? '#ff4d6d' : '#22c55e' }}>{Math.round(tempScalar * 300)} K</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
               <span style={{ color: '#8899bb' }}>Activation Energy (Ea):</span>
               <span style={{ color: '#facc15' }}>1.5 eV</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #334' }}>
               <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Products Formed:</span>
               <span style={{ color: '#22c55e', fontWeight: 'bold' }}>{products}</span>
            </div>
         </div>
      </Html>

      {/* UI Overlay */}
      <Html position={[0, -bounds - 1, 0]} center>
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
