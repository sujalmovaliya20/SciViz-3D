import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Html, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// Helper to draw a unit cell lattice quickly.
// scale = geometry size
const UnitCell = ({ type, position, atomColor = "#475569" }) => {
   const s = 1.5; // half-size of the cell box
   const corners = [
     [s,s,s],[s,s,-s],[s,-s,s],[s,-s,-s],
     [-s,s,s],[-s,s,-s],[-s,-s,s],[-s,-s,-s]
   ];
   
   const faces = [
     [s,0,0],[-s,0,0],[0,s,0],[0,-s,0],[0,0,s],[0,0,-s]
   ];

   const atoms = [];
   const bonds = [];
   
   // Corners are always present
   corners.forEach(c => atoms.push(c));
   
   if (type === 'BCC') {
      atoms.push([0,0,0]); 
      // Add diagonal bonds from corners to center
      corners.forEach(c => {
         bonds.push({ p1: c, p2: [0,0,0] });
      });
   }
   else if (type === 'FCC') {
      faces.forEach(f => atoms.push(f));
      // Add bonds across faces
      // Just some representative bonds for clarity
      faces.forEach(f => {
         // bond to nearest corners
         corners.forEach(c => {
            // distance check
            const d = Math.sqrt(Math.pow(c[0]-f[0], 2) + Math.pow(c[1]-f[1], 2) + Math.pow(c[2]-f[2], 2));
            if (Math.abs(d - 2.12) < 0.1) {
               bonds.push({ p1: c, p2: f });
            }
         });
      });
   }
   else { // Simple Cubic
      // Just bond the edges
      corners.forEach(c1 => {
         corners.forEach(c2 => {
            const d = Math.sqrt(Math.pow(c2[0]-c1[0], 2) + Math.pow(c2[1]-c1[1], 2) + Math.pow(c2[2]-c1[2], 2));
            if (Math.abs(d - 3.0) < 0.1) {
               // Only add one way to avoid dupes (rough)
               if (c1[0]<=c2[0] && c1[1]<=c2[1] && c1[2]<=c2[2]) bonds.push({ p1: c1, p2: c2 });
            }
         });
      });
   }

   const groupRef = React.useRef();
   useFrame((state, delta) => {
      if(groupRef.current) groupRef.current.rotation.y += delta * 0.2;
   });

   return (
      <group position={position}>
         <group ref={groupRef}>
            {/* Outline Box */}
            <Box args={[s*2, s*2, s*2]}>
               <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
            </Box>
            
            {/* Atoms */}
            {atoms.map((pos, i) => (
               <Sphere key={`a-${i}`} args={[0.5, 32, 32]} position={pos}>
                  <meshStandardMaterial color={atomColor} metalness={0.7} roughness={0.2} />
               </Sphere>
            ))}

            {/* Bonds */}
            {bonds.map((b, i) => {
               const p1 = new THREE.Vector3(...b.p1);
               const p2 = new THREE.Vector3(...b.p2);
               const dist = p1.distanceTo(p2);
               const mid = p1.clone().lerp(p2, 0.5);
               const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), p2.clone().sub(p1).normalize());
               return (
                  <mesh key={`b-${i}`} position={mid} quaternion={quat}>
                     <cylinderGeometry args={[0.05, 0.05, dist]} />
                     <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
                  </mesh>
               );
            })}
         </group>
      </group>
   );
};

export default function CrystalStructures({ currentStep = 0 }) {

  const configs = [
    { scaleSC: 1, scaleBCC: 1, scaleFCC: 1, desc: "Comparing the three primary cubic crystal lattices." },
    { scaleSC: 1.5, scaleBCC: 0.5, scaleFCC: 0.5, desc: "Simple Cubic (Polonium). Coord #: 6. Packing: 52%." },
    { scaleSC: 0.5, scaleBCC: 1.5, scaleFCC: 0.5, desc: "Body-Centered Cubic (Iron). Coord #: 8. Packing: 68%." },
    { scaleSC: 0.5, scaleBCC: 0.5, scaleFCC: 1.5, desc: "Face-Centered Cubic (Copper). Coord #: 12. Packing: 74%." }
  ];

  const config = configs[Math.min(currentStep, configs.length - 1)];

  const { sSc, sBcc, sFcc } = useSpring({
      sSc: config.scaleSC, sBcc: config.scaleBCC, sFcc: config.scaleFCC,
      config: { tension: 80, friction: 15 }
  });

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[0, 10, 10]} intensity={1.5} color="#ffffff" />

      {/* Simple Cubic */}
      <animated.group scale={sSc}>
         <UnitCell type="SC" position={[-8, 0, 0]} atomColor="#ff4d4d" />
         <Html position={[-8, -3, 0]} center>
            <div style={{ textAlign: 'center', fontFamily: 'Space Mono, monospace' }}>
               <div style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Simple Cubic (SC)</div>
               <div style={{ color: '#8899bb', fontSize: '10px' }}>Atoms: 1 total (8 x 1/8)</div>
               <div style={{ color: '#8899bb', fontSize: '10px' }}>CN: 6 | APF: 52%</div>
            </div>
         </Html>
      </animated.group>

      {/* BCC */}
      <animated.group scale={sBcc}>
         <UnitCell type="BCC" position={[0, 0, 0]} atomColor="#00e5ff" />
         <Html position={[0, -3, 0]} center>
            <div style={{ textAlign: 'center', fontFamily: 'Space Mono, monospace' }}>
               <div style={{ color: '#00e5ff', fontWeight: 'bold' }}>Body-Centered (BCC)</div>
               <div style={{ color: '#8899bb', fontSize: '10px' }}>Atoms: 2 total</div>
               <div style={{ color: '#8899bb', fontSize: '10px' }}>CN: 8 | APF: 68%</div>
            </div>
         </Html>
      </animated.group>

      {/* FCC */}
      <animated.group scale={sFcc}>
         <UnitCell type="FCC" position={[8, 0, 0]} atomColor="#22c55e" />
         <Html position={[8, -3, 0]} center>
            <div style={{ textAlign: 'center', fontFamily: 'Space Mono, monospace' }}>
               <div style={{ color: '#22c55e', fontWeight: 'bold' }}>Face-Centered (FCC)</div>
               <div style={{ color: '#8899bb', fontSize: '10px' }}>Atoms: 4 total</div>
               <div style={{ color: '#8899bb', fontSize: '10px' }}>CN: 12 | APF: 74%</div>
            </div>
         </Html>
      </animated.group>

      {/* UI Overlay */}
      <Html position={[0, 4, 0]} center>
        <div style={{
          background: 'rgba(6,8,15,0.9)', border: '1px solid #1e2a3a', borderRadius: '8px',
          padding: '10px 16px', color: '#e0eaff', fontFamily: 'Space Mono, monospace',
          fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'center'
        }}>
          <div style={{ color: '#00e5ff', fontWeight: 700, marginBottom: '4px' }}>
            Unit Cells compared
          </div>
          <div style={{ color: '#4a5a7a' }}>{config.desc}</div>
        </div>
      </Html>
      
      <gridHelper args={[30, 30, 0x1e2a3a, 0x111820]} position={[0, -5, 0]} />
    </group>
  );
}
