import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Extrude, Cylinder, Html, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function Photosynthesis({ currentStep = 0, isPlaying = false }) {

  const stepConfigs = [
    { sunOp: 0, co2Op: 0, h2oOp: 0, prodOp: 0, label: "Leaf Cross-Section", desc: "Mesophyll cells containing chloroplasts sit between epidermal layers." },
    { sunOp: 1, co2Op: 0, h2oOp: 0, prodOp: 0, label: "Light Absorption", desc: "Sunlight (photons) enters leaf, absorbed by chlorophyll in chloroplasts." },
    { sunOp: 1, co2Op: 1, h2oOp: 0, prodOp: 0, label: "CO₂ Intake", desc: "Carbon Dioxide enters through stomata on the underside of the leaf." },
    { sunOp: 1, co2Op: 1, h2oOp: 1, prodOp: 0, label: "H₂O Intake", desc: "Water is drawn up from roots via xylem into the mesophyll." },
    { sunOp: 1, co2Op: 1, h2oOp: 1, prodOp: 1, label: "Photosynthesis", desc: "6CO₂ + 6H₂O + Light → C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen exits stomata)." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { sun, co2, h2o, prod } = useSpring({
    sun: config.sunOp,
    co2: config.co2Op,
    h2o: config.h2oOp,
    prod: config.prodOp,
    config: { tension: 60, friction: 15 }
  });

  // Basic leaf cross section shape
  const leafShape = useMemo(() => {
     const s = new THREE.Shape();
     s.moveTo(-4, 2);
     s.lineTo(4, 2);
     s.curveTo(4.5, 1, 4.5, -1, 4, -2);
     s.lineTo(-4, -2);
     s.curveTo(-4.5, -1, -4.5, 1, -4, 2);
     return s;
  }, []);

  const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };

  // Particles
  const particlesRef = useRef([]);

  useFrame((state, delta) => {
     if (isPlaying) {
         particlesRef.current.forEach(p => {
            if(!p) return;
            const t = p.userData.type;
            
            if (t === 'sun') {
               p.position.y -= delta * 4;
               if (p.position.y < 0) p.position.y = 5;
            } else if (t === 'co2') {
               p.position.y += delta * 2;
               if (p.position.y > 0) p.position.y = -4;
            } else if (t === 'h2o') {
               p.position.x += delta * 2;
               if (p.position.x > 0) p.position.x = -4;
            } else if (t === 'o2') {
               p.position.y -= delta * 2;
               if (p.position.y < -4) p.position.y = 0;
            }
         });
     }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 8]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[0, 5, 0]} intensity={1} color="#facc15" />

      {/* Cross Section Cutaway */}
      <group>
         {/* Upper Epidermis */}
         <Box args={[8, 0.4, 1.2]} position={[0, 1.8, 0.5]}>
            <meshStandardMaterial color="#86efac" transparent opacity={0.6} />
         </Box>
         <Html position={[0, 2.5, 0]} center><div style={{ color:'#86efac', fontSize:'10px' }}>Upper Epidermis</div></Html>
         
         {/* Palisade Mesophyll */}
         <group position={[0, 0.5, 0.5]}>
            {[...Array(6)].map((_,i) => (
                <Cylinder key={`pal-${i}`} args={[0.4, 0.4, 1.5]} position={[-3.5 + i*1.4, 0, 0]} rotation={[0,0,0]}>
                   <meshStandardMaterial color="#22c55e" roughness={0.8} />
                   {/* Chloroplasts */}
                   {[...Array(4)].map((_,j) => (
                      <Sphere key={`chloro-${j}`} args={[0.1, 8, 8]} position={[(Math.random()-0.5)*0.5, (Math.random()-0.5)*1, (Math.random()-0.5)*0.5]}>
                         <meshStandardMaterial color="#166534" />
                      </Sphere>
                   ))}
                </Cylinder>
            ))}
         </group>
         <Html position={[4.5, 0.5, 0]} center><div style={{ color:'#22c55e', fontSize:'10px' }}>Palisade Mesophyll<br/>(Rich in Chloroplasts)</div></Html>

         {/* Spongy Mesophyll */}
         <group position={[0, -1, 0.5]}>
            {[...Array(10)].map((_,i) => (
                <Sphere key={`spongy-${i}`} args={[0.3, 16, 16]} position={[-3.5 + Math.random()*7, (Math.random()-0.5)*1, (Math.random()-0.5)*0.5]}>
                   <meshStandardMaterial color="#4ade80" transparent opacity={0.8} />
                </Sphere>
            ))}
         </group>

         {/* Lower Epidermis & Stoma */}
         <Box args={[3.2, 0.4, 1.2]} position={[-2.4, -2, 0.5]}>
            <meshStandardMaterial color="#86efac" transparent opacity={0.6} />
         </Box>
         <Box args={[3.2, 0.4, 1.2]} position={[2.4, -2, 0.5]}>
            <meshStandardMaterial color="#86efac" transparent opacity={0.6} />
         </Box>

         {/* Guard Cells (Stoma) */}
         <Sphere args={[0.3, 16, 16]} position={[-0.4, -2, 0.5]} scale={[1, 0.5, 1]}><meshStandardMaterial color="#15803d" /></Sphere>
         <Sphere args={[0.3, 16, 16]} position={[0.4, -2, 0.5]} scale={[1, 0.5, 1]}><meshStandardMaterial color="#15803d" /></Sphere>
         <Html position={[0, -2.5, 0]} center><div style={{ color:'#15803d', fontSize:'10px' }}>Stomata (Guard Cells)</div></Html>
         
         {/* Vein (Xylem/Phloem) */}
         <Cylinder args={[0.6, 0.6, 1.2]} position={[-3, -0.2, 0.5]} rotation={[Math.PI/2, 0, 0]}>
             <meshStandardMaterial color="#cbd5e1" transparent opacity={0.5} />
         </Cylinder>
      </group>

      {/* Sun Rays */}
      <animated.group opacity={sun} transparent>
         {[...Array(8)].map((_,i) => (
             <mesh key={`sun-${i}`} position={[-3 + Math.random()*6, 4 + Math.random(), 0.5]} ref={el => {if(el) {el.userData.type='sun'; particlesRef.current.push(el);}}}>
                <cylinderGeometry args={[0.02, 0.02, 1]} />
                <animated.meshBasicMaterial color="#facc15" transparent opacity={sun} />
             </mesh>
         ))}
      </animated.group>

      {/* CO2 Entering */}
      <animated.group opacity={co2} transparent>
         {[...Array(5)].map((_,i) => (
             <mesh key={`co2-${i}`} position={[(Math.random()-0.5)*0.5, -4 + i*0.8, 0.5]} ref={el => {if(el) {el.userData.type='co2'; particlesRef.current.push(el);}}}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <animated.meshStandardMaterial color="#94a3b8" transparent opacity={co2} />
             </mesh>
         ))}
      </animated.group>

      {/* H2O Entering */}
      <animated.group opacity={h2o} transparent>
         {[...Array(5)].map((_,i) => (
             <mesh key={`h2o-${i}`} position={[-5 + i*0.8, -0.2 + (Math.random()-0.5)*0.2, 0.5]} ref={el => {if(el) {el.userData.type='h2o'; particlesRef.current.push(el);}}}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <animated.meshStandardMaterial color="#38bdf8" transparent opacity={h2o} />
             </mesh>
         ))}
      </animated.group>

      {/* Glucose + O2 Exiting */}
      <animated.group opacity={prod} transparent visible={prod.to(v => v>0)}>
         {/* Glucose stored inside */}
         <mesh position={[1, 0.5, 0.5]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.4} />
            <Html position={[0, 0.6, 0]} center><div style={{ color:'#fbbf24', fontSize:'10px', background:'#000', padding:'2px', borderRadius:'4px' }}>Glucose</div></Html>
         </mesh>

         {/* O2 Exiting stoma */}
         {[...Array(5)].map((_,i) => (
             <mesh key={`o2-${i}`} position={[(Math.random()-0.5)*0.5, -0.5 - i*0.8, 0.5]} ref={el => {if(el) {el.userData.type='o2'; particlesRef.current.push(el);}}}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <animated.meshStandardMaterial color="#ff4d6d" transparent opacity={prod} />
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
           <div style={{ color: '#22c55e', fontWeight: 700, marginBottom: '4px' }}>
             {config.label}
           </div>
           <div style={{ color: '#4a5a7a', fontSize: '10px', whiteSpace: 'normal', maxWidth: '300px' }}>{config.description}</div>
         </div>
      </Html>

      {config.currentStep === 4 && (
        <Html position={[0, 4, 0]} center>
           <div style={{ background: '#000', padding: '8px 12px', border: '1px solid #22c55e', borderRadius: '4px', color: '#86efac', fontFamily: 'monospace' }}>
              6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
           </div>
        </Html>
      )}

      <gridHelper args={[20, 20, 0x1e2a3a, 0x111820]} position={[0, -3.5, 0]} />
    </group>
  );
}
