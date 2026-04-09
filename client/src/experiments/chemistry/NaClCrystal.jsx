import React, { useMemo } from 'react';
import { Box, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

export default function NaClCrystal({ currentStep = 0 }) {

  const stepConfigs = [
    { growSize: 1, showWireframe: false, explodeForce: 0, label: "Ion Pair", desc: "A single NaCl pair. Sodium (Na⁺) is small, Chloride (Cl⁻) is large." },
    { growSize: 3, showWireframe: false, explodeForce: 0, label: "Crystal Growth", desc: "Ions attract each other, forming a 3D alternating pattern." },
    { growSize: 5, showWireframe: false, explodeForce: 0, label: "Full Lattice", desc: "A 5x5x5 Face-Centered Cubic (FCC) lattice structure." },
    { growSize: 5, showWireframe: true, explodeForce: 0, label: "Unit Cell", desc: "The repeating unit is highlighted. Coordination number is 6:6." },
    { growSize: 5, showWireframe: false, explodeForce: 1.5, label: "Exploded View", desc: "Lattice expanded to view internal alternating structure clearly." }
  ];

  const config = stepConfigs[Math.min(currentStep, stepConfigs.length - 1)];

  const { explodeMult, wFrameOp, growDist } = useSpring({
    explodeMult: config.explodeForce,
    wFrameOp: config.showWireframe ? 1 : 0,
    growDist: config.growSize,
    config: { tension: 60, friction: 14 }
  });

  const gridSize = 5;
  const spacing = 1.2;
  const offset = (gridSize - 1) * spacing / 2;

  // Generate lattice data
  const gridData = useMemo(() => {
    const data = [];
    for(let x=0; x<gridSize; x++) {
      for(let y=0; y<gridSize; y++) {
        for(let z=0; z<gridSize; z++) {
          const type = (x + y + z) % 2 === 0 ? 'Na' : 'Cl';
          // Distance from center (2,2,2) roughly helps sequence growth map
          const dist = Math.max(Math.abs(x-2), Math.abs(y-2), Math.abs(z-2)) * 2 + 1;
          data.push({ x, y, z, type, dist });
        }
      }
    }
    return data;
  }, []);

  return (
    <group>
      <ambientLight intensity={1.5} color="#1a2a4a" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

      {/* Grid Iteration */}
      <group>
        {gridData.map((ion, i) => {
          
          // Using animated position for exploded view
          // And animated scale for growth transition
          const px = ion.x * spacing - offset;
          const py = ion.y * spacing - offset;
          const pz = ion.z * spacing - offset;

          // Origin distance vector for explosion
          const v = new THREE.Vector3(px, py, pz).normalize();
          
          return (
            <animated.mesh 
              key={`ion-${i}`}
              position-x={explodeMult.to(m => px + v.x * m)}
              position-y={explodeMult.to(m => py + v.y * m)}
              position-z={explodeMult.to(m => pz + v.z * m)}
              scale={growDist.to(g => ion.dist <= g ? 1 : 0)}
            >
               <sphereGeometry args={[ion.type === 'Na' ? 0.3 : 0.45, 16, 16]} />
               <meshStandardMaterial 
                 color={ion.type === 'Na' ? '#00e5ff' : '#22c55e'} 
                 metalness={0.2} 
                 roughness={0.4} 
               />
               {ion.dist <= 1 && config.explodeForce > 0 && (
                  <Html position={[0,0.6,0]} center>
                     <div style={{ color: ion.type === 'Na' ? '#00e5ff' : '#22c55e', fontSize:'10px', background:'#000', padding:'2px', borderRadius:'4px' }}>
                       {ion.type}⁺/⁻
                     </div>
                  </Html>
               )}
            </animated.mesh>
          )
        })}
      </group>

      {/* Unit Cell Wireframe */}
      <animated.group opacity={wFrameOp} transparent>
         <Box args={[spacing * 2, spacing * 2, spacing * 2]} position={[-spacing/2, -spacing/2, -spacing/2]}>
             <meshBasicMaterial color="#ff4d6d" wireframe transparent opacity={0.8} />
         </Box>
         <Html position={[0, spacing*1.5, 0]} center>
            <div style={{ color: '#ff4d6d', fontWeight:'bold', background:'rgba(0,0,0,0.5)', padding:'4px' }}>FCC Unit Cell</div>
         </Html>
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

      {/* Legend */}
      <Html position={[-4, 4, 0]} center>
         <div style={{ background: '#0d1117', padding: '12px', borderRadius: '8px', border: '1px solid #1e2a3a' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
               <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:'#00e5ff' }} />
               <span style={{ color:'#e0eaff', fontSize:'12px' }}>Na⁺ (Sodium, 95 pm)</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
               <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:'#22c55e' }} />
               <span style={{ color:'#e0eaff', fontSize:'12px' }}>Cl⁻ (Chloride, 181 pm)</span>
            </div>
         </div>
      </Html>

    </group>
  );
}
